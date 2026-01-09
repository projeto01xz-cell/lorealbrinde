import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Utmify Pixel ID (same as used in index.html)
const PIXEL_ID = "696119dd7b2c89894cd5fa85";
const UTMIFY_EVENTS_URL = "https://tracking.utmify.com.br/tracking/v1/events";

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

    // Se foi pago, enviar tracking de aprovação para Utmify via Events API
    if (orderStatus === "paid" && data) {
      try {
        const utmifyPayload = {
          type: "Purchase",
          lead: {
            pixelId: PIXEL_ID,
            _id: (data as any).utmify_lead_id || null,
            metaPixelIds: ["826039799862526"],
            tikTokPixelIds: [],
            geolocation: {
              country: "BR",
              city: (data as any).address_city || "",
              state: (data as any).address_state || "",
              zipcode: (data as any).address_cep?.replace(/\D/g, "") || "",
            },
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            ip: (data as any).client_ip || "177.0.0.1",
            parameters: "",
            icTextMatch: null,
            icCSSMatch: null,
            icURLMatch: null,
            leadTextMatch: null,
            addToCartTextMatch: null,
            ipConfiguration: "IPV6_OR_IPV4",
          },
          event: {
            sourceUrl: "https://loreal-paris-campanha.lovable.app/checkout",
            pageTitle: "Payment Approved",
            value: Number(data.total_amount),
            currency: "BRL",
            content_ids: (data.products as Array<{ name: string }> || []).map((_, i) => `product_${i + 1}`),
            content_type: "product",
            contents: (data.products as Array<{ price: number; quantity: number }> || []).map((p, i) => ({
              id: `product_${i + 1}`,
              quantity: p.quantity || 1,
              item_price: p.price || 0,
            })),
            num_items: (data.products as Array<{ quantity: number }> || []).reduce((sum, p) => sum + (p.quantity || 1), 0),
            order_id: data.external_id,
          },
          tikTokPageInfo: null,
        };

        console.log("Sending Purchase event to Utmify:", JSON.stringify(utmifyPayload, null, 2));

        const utmifyResponse = await fetch(UTMIFY_EVENTS_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(utmifyPayload),
        });

        console.log("Utmify approval tracking response:", await utmifyResponse.text());
      } catch (utmifyError) {
        console.error("Error sending to Utmify:", utmifyError);
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
