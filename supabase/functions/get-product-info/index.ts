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

  // Test 1: With postback_url and all fields
  const payload1 = {
    amount: 36900,
    offer_hash: offerHash,
    payment_method: "pix",
    customer: {
      name: "Teste Silva",
      email: "teste@teste.com",
      phone_number: "11999999999",
      document: "52998224725",
      document_type: "cpf",
      street_name: "Rua Teste",
      number: "123",
      complement: "",
      neighborhood: "Centro",
      city: "Sao Paulo",
      state: "SP",
      zip_code: "01001000",
    },
    cart: [
      {
        product_hash: productHash,
        title: "primeira venda",
        cover: null,
        price: 36900,
        quantity: 1,
        operation_type: 1,
        tangible: false,
      }
    ],
    installments: 1,
    expire_in_days: 1,
    transaction_origin: "api",
    postback_url: "https://pmsaearbupcinwukoeeh.supabase.co/functions/v1/sharkpay-webhook",
  };

  const res1 = await fetch(`https://api.sharkpayments.com.br/api/public/v1/transactions?api_token=${apiToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(payload1),
  });
  results.test1_all_fields = { status: res1.status, body: await res1.text() };

  // Test 2: phone with country code
  const payload2 = {
    ...payload1,
    customer: {
      ...payload1.customer,
      phone_number: "+5511999999999",
    },
  };
  delete (payload2 as Record<string, unknown>).postback_url;

  const res2 = await fetch(`https://api.sharkpayments.com.br/api/public/v1/transactions?api_token=${apiToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(payload2),
  });
  results.test2_phone_country = { status: res2.status, body: await res2.text() };

  // Test 3: Try "boleto" payment method to see if pix is the issue
  const payload3 = {
    ...payload1,
    payment_method: "boleto",
  };

  const res3 = await fetch(`https://api.sharkpayments.com.br/api/public/v1/transactions?api_token=${apiToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(payload3),
  });
  results.test3_boleto = { status: res3.status, body: await res3.text() };

  console.log("Results:", JSON.stringify(results, null, 2));

  return new Response(JSON.stringify(results, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
