import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Utmify Pixel ID
const PIXEL_ID = "696119dd7b2c89894cd5fa85";
const UTMIFY_EVENTS_URL = "https://tracking.utmify.com.br/tracking/v1/events";

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

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

    console.log("NitroPay webhook received:", JSON.stringify(payload));

    const data = payload as Record<string, unknown>;
    
    // Extract transaction ID from NitroPay webhook
    const txId = data.id || data.transaction_id;
    if (!txId || typeof txId !== 'string') {
      console.error("Missing transaction ID in webhook");
      return new Response(
        JSON.stringify({ error: "Missing transaction ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate ID format
    if (txId.length > 100 || !/^[a-zA-Z0-9_-]+$/.test(txId)) {
      return new Response(
        JSON.stringify({ error: "Invalid transaction ID format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Map NitroPay statuses to our statuses
    const nitroStatus = typeof data.status === 'string' ? data.status.toLowerCase() : '';
    let orderStatus = "pending";
    if (nitroStatus === "pago" || nitroStatus === "paid" || nitroStatus === "approved") {
      orderStatus = "paid";
    } else if (nitroStatus === "reembolsado" || nitroStatus === "refunded") {
      orderStatus = "refunded";
    } else if (nitroStatus === "cancelado" || nitroStatus === "cancelled" || nitroStatus === "expired") {
      orderStatus = "cancelled";
    }

    console.log(`Updating order ${txId} to status: ${orderStatus}`);

    const updateData: Record<string, unknown> = {
      status: orderStatus,
      updated_at: new Date().toISOString(),
    };

    if (orderStatus === "paid") {
      updateData.paid_at = new Date().toISOString();
    }

    const { data: orderData, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("external_id", txId)
      .select()
      .single();

    if (error) {
      console.error("Error updating order:", error);
      return new Response(
        JSON.stringify({ received: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Order updated successfully:", orderData);

    // If paid, send Purchase event to Utmify
    if (orderStatus === "paid" && orderData) {
      try {
        const utmifyPayload = {
          type: "Purchase",
          lead: {
            pixelId: PIXEL_ID,
            _id: (orderData as any).utmify_lead_id || null,
            metaPixelIds: ["826039799862526"],
            tikTokPixelIds: [],
            geolocation: {
              country: "BR",
              city: (orderData as any).address_city || "",
              state: (orderData as any).address_state || "",
              zipcode: (orderData as any).address_cep?.replace(/\D/g, "") || "",
            },
            userAgent: "Mozilla/5.0",
            ip: (orderData as any).client_ip || "177.0.0.1",
            parameters: "",
            icTextMatch: null,
            icCSSMatch: null,
            icURLMatch: null,
            leadTextMatch: null,
            addToCartTextMatch: null,
            ipConfiguration: "IPV6_OR_IPV4",
          },
          event: {
            sourceUrl: "https://gtsm1.lovable.app/checkout",
            pageTitle: "Payment Approved",
            value: Number(orderData.total_amount),
            currency: "BRL",
            content_ids: (orderData.products as Array<{ name: string }> || []).map((_, i) => `product_${i + 1}`),
            content_type: "product",
            contents: (orderData.products as Array<{ price: number; quantity: number }> || []).map((p, i) => ({
              id: `product_${i + 1}`,
              quantity: p.quantity || 1,
              item_price: p.price || 0,
            })),
            num_items: (orderData.products as Array<{ quantity: number }> || []).reduce((sum, p) => sum + (p.quantity || 1), 0),
            order_id: orderData.external_id,
          },
          tikTokPageInfo: null,
        };

        console.log("Sending Purchase event to Utmify");

        const utmifyResponse = await fetch(UTMIFY_EVENTS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(utmifyPayload),
        });

        console.log("Utmify response:", await utmifyResponse.text());
      } catch (utmifyError) {
        console.error("Error sending to Utmify:", utmifyError);
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({ received: false }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
