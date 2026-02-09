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
  const offerHash = Deno.env.get("SHARKPAY_OFFER_HASH");
  const productHash = Deno.env.get("SHARKPAY_PRODUCT_HASH");
  
  const results: Record<string, unknown> = {};

  // Test 1: tangible true instead of false
  const base = {
    amount: 36900,
    offer_hash: offerHash,
    payment_method: "pix",
    customer: {
      name: "Teste Silva",
      email: "teste@teste.com",
      phone_number: "11999999999",
      document: "11144477735",
    },
    installments: 1,
  };

  const res1 = await fetch(`https://api.sharkpayments.com.br/api/public/v1/transactions?api_token=${apiToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      ...base,
      cart: [{ product_hash: productHash, title: "primeira venda", price: 36900, quantity: 1, operation_type: 1, tangible: true }],
    }),
  });
  results.test1_tangible_true = { status: res1.status, body: await res1.text() };

  // Test 2: Without tangible and operation_type 
  const res2 = await fetch(`https://api.sharkpayments.com.br/api/public/v1/transactions?api_token=${apiToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      ...base,
      cart: [{ product_hash: productHash, title: "primeira venda", price: 36900, quantity: 1 }],
    }),
  });
  results.test2_minimal_cart = { status: res2.status, body: await res2.text() };

  // Test 3: Without installments
  const res3 = await fetch(`https://api.sharkpayments.com.br/api/public/v1/transactions?api_token=${apiToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      amount: 36900,
      offer_hash: offerHash,
      payment_method: "pix",
      customer: { name: "Teste Silva", email: "teste@teste.com", phone_number: "11999999999", document: "11144477735" },
      cart: [{ product_hash: productHash, title: "primeira venda", price: 36900, quantity: 1 }],
    }),
  });
  results.test3_no_installments = { status: res3.status, body: await res3.text() };

  // Test 4: With product_hash as offer_hash in offer_hash field (both same)
  const res4 = await fetch(`https://api.sharkpayments.com.br/api/public/v1/transactions?api_token=${apiToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      amount: 2000,
      offer_hash: productHash,
      payment_method: "pix",
      customer: { name: "Teste Silva", email: "teste@teste.com", phone_number: "11999999999", document: "11144477735" },
      cart: [{ product_hash: productHash, title: "primeira venda", price: 2000, quantity: 1 }],
    }),
  });
  results.test4_default_offer_2000 = { status: res4.status, body: await res4.text() };

  // Test 5: R$5 minimum with offer
  const res5 = await fetch(`https://api.sharkpayments.com.br/api/public/v1/transactions?api_token=${apiToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      amount: 500,
      offer_hash: offerHash,
      payment_method: "pix",
      customer: { name: "Teste Silva", email: "teste@teste.com", phone_number: "11999999999", document: "11144477735" },
      cart: [{ product_hash: productHash, title: "primeira venda", price: 500, quantity: 1 }],
    }),
  });
  results.test5_500_cents = { status: res5.status, body: await res5.text() };

  console.log("Results:", JSON.stringify(results, null, 2));
  return new Response(JSON.stringify(results, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
