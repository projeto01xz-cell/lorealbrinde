import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const apiToken = Deno.env.get("SHARKPAY_API_TOKEN");
  
  // List products
  const res = await fetch(`https://api.sharkpayments.com.br/api/public/v1/products?api_token=${apiToken}`, {
    headers: { "Accept": "application/json" },
  });
  const data = await res.json();
  console.log("Products response:", JSON.stringify(data, null, 2));
  
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
