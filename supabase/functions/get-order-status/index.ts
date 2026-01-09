import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const externalId = body.externalId;

    if (!externalId || typeof externalId !== 'string') {
      return new Response(
        JSON.stringify({ error: "Missing or invalid externalId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate externalId format
    if (externalId.length > 100 || !/^[a-zA-Z0-9_-]+$/.test(externalId)) {
      return new Response(
        JSON.stringify({ error: "Invalid externalId format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Fetching order status for:", externalId.substring(0, 8) + "***");

    const { data, error } = await supabase
      .from("orders")
      .select("status, customer_name, customer_email, customer_document, customer_phone")
      .eq("external_id", externalId)
      .single();

    if (error) {
      console.error("Error fetching order:", error);
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Retornar dados do cliente para uso no upsell
    return new Response(
      JSON.stringify({ 
        status: data.status,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        customerDocument: data.customer_document,
        customerPhone: data.customer_phone,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
