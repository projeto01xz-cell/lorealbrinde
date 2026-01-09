import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Validate webhook payload
const validateWebhookPayload = (data: unknown): { valid: boolean; error?: string; id?: string; status?: string; event?: string } => {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: "Invalid payload" };
  }

  const payload = data as Record<string, unknown>;
  
  // ID is required
  if (!payload.id || (typeof payload.id !== 'string' && typeof payload.id !== 'number')) {
    return { valid: false, error: "Missing or invalid transaction ID" };
  }

  const id = String(payload.id);
  
  // Validate ID format (prevent injection)
  if (id.length > 100 || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    return { valid: false, error: "Invalid transaction ID format" };
  }

  // Validate status if present
  const validStatuses = ['pending', 'paid', 'approved', 'refunded', 'cancelled', 'expired', 'processing'];
  const status = typeof payload.status === 'string' && validStatuses.includes(payload.status) 
    ? payload.status 
    : undefined;

  // Validate event if present
  const validEvents = ['payment.approved', 'payment.refunded', 'payment.cancelled', 'payment.created'];
  const event = typeof payload.event === 'string' && validEvents.includes(payload.event)
    ? payload.event
    : undefined;

  return { valid: true, id, status, event };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let payload: unknown;
    try {
      payload = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("GoatPay webhook received");

    const validation = validateWebhookPayload(payload);
    
    if (!validation.valid) {
      console.error("Webhook validation error:", validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { id, status, event } = validation;

    // Mapear status da GoatPay para nosso status
    let orderStatus = "pending";
    if (status === "paid" || status === "approved" || event === "payment.approved") {
      orderStatus = "paid";
    } else if (status === "refunded" || event === "payment.refunded") {
      orderStatus = "refunded";
    } else if (status === "cancelled" || status === "expired" || event === "payment.cancelled") {
      orderStatus = "cancelled";
    }

    console.log(`Updating order ${id} to status: ${orderStatus}`);

    // Atualizar o pedido no banco
    const updateData: Record<string, unknown> = {
      status: orderStatus,
      updated_at: new Date().toISOString(),
    };

    if (orderStatus === "paid") {
      updateData.paid_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("external_id", id!)
      .select()
      .single();

    if (error) {
      console.error("Error updating order:", error);
      // Mesmo com erro, retornamos 200 para a GoatPay não reenviar
      return new Response(
        JSON.stringify({ received: true, error: error.message }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Order updated successfully:", data);

    // Se foi pago, enviar tracking de aprovação para Utmify
    if (orderStatus === "paid" && data) {
      const utmifyToken = Deno.env.get("UTMIFY_TOKEN")?.trim();
      
      if (utmifyToken) {
        try {
          const utmifyPayload = {
            orderId: data.external_id,
            platform: "website",
            paymentMethod: "pix",
            status: "approved",
            createdAt: data.created_at,
            approvedDate: new Date().toISOString(),
            customer: {
              name: data.customer_name,
              email: data.customer_email,
              phone: data.customer_phone?.replace(/\D/g, ""),
              document: data.customer_document?.replace(/\D/g, ""),
              country: "BR",
            },
            products: data.products || [],
            trackingParameters: data.utm_params || {},
            commission: {
              totalPrice: Number(data.total_amount),
              gatewayFee: 0,
              integrationFee: 0,
              totalCommission: Number(data.total_amount),
            },
            isTest: false,
          };

          const utmifyResponse = await fetch("https://api.utmify.com.br/api/v1/sales", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // UTMify expects the token directly (no "Bearer ")
              "Authorization": utmifyToken,
              "x-api-token": utmifyToken,
            },
            body: JSON.stringify(utmifyPayload),
          });

          console.log("Utmify approval tracking response:", await utmifyResponse.text());
        } catch (utmifyError) {
          console.error("Error sending to Utmify:", utmifyError);
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, order: data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
