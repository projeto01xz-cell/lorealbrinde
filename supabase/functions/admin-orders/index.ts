import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-password",
};

const ADMIN_PASSWORD = "loreal2024admin"; // Simple password protection

// Utmify Pixel ID (same as used in index.html)
const PIXEL_ID = "696119dd7b2c89894cd5fa85";
const UTMIFY_EVENTS_URL = "https://tracking.utmify.com.br/tracking/v1/events";

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // Parse body for password (works with both GET and POST)
    let body: Record<string, unknown> = {};
    try {
      const text = await req.text();
      if (text) {
        body = JSON.parse(text);
      }
    } catch {
      // Ignore parse errors for GET requests
    }

    // Check admin password from body or header
    const passwordFromBody = body.password as string | undefined;
    const passwordFromHeader = req.headers.get("x-admin-password");
    const providedPassword = passwordFromBody || passwordFromHeader;

    console.log("Auth attempt - password provided:", !!providedPassword);

    if (providedPassword !== ADMIN_PASSWORD) {
      console.log("Auth failed - invalid password");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Auth successful");

    // List orders (default)
    if (!action || action === "list" || req.method === "GET") {
      console.log("Fetching all orders...");
      const { data: orders, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Found ${orders?.length || 0} orders`);

      return new Response(
        JSON.stringify({ orders }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Resend to UTMify
    if (action === "resend-utmify" && req.method === "POST") {
      const orderId = body.orderId as string;
      
      if (!orderId) {
        return new Response(
          JSON.stringify({ error: "Missing orderId" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      console.log(`Resending order ${orderId} to UTMify...`);

      // Fetch the order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (orderError || !order) {
        console.error("Order not found:", orderError);
        return new Response(
          JSON.stringify({ error: "Order not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Determine event type for UTMify
      let eventType = "Purchase";
      if (order.status === "pending") {
        eventType = "InitiateCheckout";
      } else if (order.status === "refunded") {
        eventType = "Refund";
      }

      const utmifyPayload = {
        type: eventType,
        lead: {
          pixelId: PIXEL_ID,
          _id: (order as any).utmify_lead_id || null,
          metaPixelIds: ["826039799862526"],
          tikTokPixelIds: [],
          geolocation: {
            country: "BR",
            city: (order as any).address_city || "",
            state: (order as any).address_state || "",
            zipcode: (order as any).address_cep?.replace(/\D/g, "") || "",
          },
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          ip: (order as any).client_ip || "177.0.0.1",
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
          pageTitle: `Admin Resend - ${order.status}`,
          value: Number(order.total_amount),
          currency: "BRL",
          content_ids: (order.products as Array<{ name: string }> || []).map((_, i) => `product_${i + 1}`),
          content_type: "product",
          contents: (order.products as Array<{ price: number; quantity: number }> || []).map((p, i) => ({
            id: `product_${i + 1}`,
            quantity: p.quantity || 1,
            item_price: p.price || 0,
          })),
          num_items: (order.products as Array<{ quantity: number }> || []).reduce((sum, p) => sum + (p.quantity || 1), 0),
          order_id: order.external_id,
        },
        tikTokPageInfo: null,
      };

      console.log("Sending to UTMify Events API:", JSON.stringify(utmifyPayload, null, 2));

      const utmifyResponse = await fetch(UTMIFY_EVENTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(utmifyPayload),
      });

      const responseText = await utmifyResponse.text();
      console.log("UTMify response:", utmifyResponse.status, responseText);

      if (!utmifyResponse.ok) {
        return new Response(
          JSON.stringify({ error: `UTMify error: ${responseText}` }),
          { status: utmifyResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "Order sent to UTMify", response: responseText }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("Admin orders error:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
