import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-password",
};

const ADMIN_PASSWORD = "loreal2024admin"; // Simple password protection

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

      const utmifyToken = Deno.env.get("UTMIFY_TOKEN")?.trim();
      
      if (!utmifyToken) {
        return new Response(
          JSON.stringify({ error: "UTMIFY_TOKEN not configured" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Log token format for debugging (first/last 4 chars only)
      console.log("UTMify token format check:", {
        length: utmifyToken.length,
        startsWithBearer: utmifyToken.toLowerCase().startsWith("bearer"),
        preview: `${utmifyToken.substring(0, 4)}...${utmifyToken.substring(utmifyToken.length - 4)}`
      });

      // Determine status for UTMify
      let utmifyStatus = "pending";
      if (order.status === "paid") {
        utmifyStatus = "approved";
      } else if (order.status === "refunded") {
        utmifyStatus = "refunded";
      }

      const utmifyPayload = {
        orderId: order.external_id,
        platform: "website",
        paymentMethod: "pix",
        status: utmifyStatus,
        createdAt: order.created_at,
        approvedDate: order.paid_at || (utmifyStatus === "approved" ? new Date().toISOString() : null),
        refundedAt: utmifyStatus === "refunded" ? new Date().toISOString() : null,
        customer: {
          name: order.customer_name,
          email: order.customer_email,
          phone: order.customer_phone?.replace(/\D/g, ""),
          document: order.customer_document?.replace(/\D/g, ""),
          country: "BR",
        },
        products: order.products || [],
        trackingParameters: order.utm_params || {},
        commission: {
          totalPrice: Number(order.total_amount),
          gatewayFee: 0,
          integrationFee: 0,
          totalCommission: Number(order.total_amount),
        },
        isTest: false,
      };

      console.log("Sending to UTMify:", JSON.stringify(utmifyPayload, null, 2));

      const utmifyResponse = await fetch("https://api.utmify.com.br/api/v1/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // UTMify expects the token directly (no "Bearer ")
          "Authorization": utmifyToken,
          // keep compatibility in case UTMify also reads x-api-token
          "x-api-token": utmifyToken,
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
