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
  const productHash = Deno.env.get("SHARKPAY_PRODUCT_HASH");
  
  const results: Record<string, unknown> = {};

  // Test 1: PIX with the R$5 offer
  const res1 = await fetch(`https://api.sharkpayments.com.br/api/public/v1/transactions?api_token=${apiToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      amount: 500,
      offer_hash: "66gx6d3zrv_jxjdzucn9l",
      payment_method: "pix",
      customer: { name: "Teste Silva", email: "teste@teste.com", phone_number: "11999999999", document: "52998224725" },
      cart: [{ product_hash: productHash, title: "primeira venda", price: 500, quantity: 1, operation_type: 1, tangible: false }],
      installments: 1,
    }),
  });
  results.test1_pix_500 = { status: res1.status, body: await res1.text() };

  // Test 2: PIX with default R$20 offer 
  const res2 = await fetch(`https://api.sharkpayments.com.br/api/public/v1/transactions?api_token=${apiToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      amount: 2000,
      offer_hash: "66gx6d3zrv",
      payment_method: "pix",
      customer: { name: "Teste Silva", email: "teste@teste.com", phone_number: "11999999999", document: "52998224725" },
      cart: [{ product_hash: productHash, title: "primeira venda", price: 2000, quantity: 1, operation_type: 1, tangible: false }],
      installments: 1,
    }),
  });
  results.test2_pix_2000 = { status: res2.status, body: await res2.text() };

  console.log("Results:", JSON.stringify(results, null, 2));
  return new Response(JSON.stringify(results, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
