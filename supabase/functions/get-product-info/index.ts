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

  // Check which payment methods are available: the offer has ["1", "3"]
  // Company has "3,1,2"
  // 1 = credit_card, 2 = pix(?), 3 = billet(?)
  // Billet worked (3), PIX fails (2 not in offer)
  
  // Test 1: Verify by checking offer details - payment_methods field
  const checkoutRes = await fetch(`https://api.sharkpayments.com.br/api/public/v1/checkout/${offerHash}?api_token=${apiToken}`, {
    headers: { "Accept": "application/json" },
  });
  const checkoutData = await checkoutRes.json();
  results.offer_payment_methods = checkoutData?.offer?.payment_methods;
  results.company_payment_methods = checkoutData?.payment_methods_available;

  // Test 2: Try the product's default offer (hash = 66gx6d3zrv, which might have PIX enabled)
  const defaultCheckoutRes = await fetch(`https://api.sharkpayments.com.br/api/public/v1/checkout/${productHash}?api_token=${apiToken}`, {
    headers: { "Accept": "application/json" },
  });
  const defaultCheckoutData = await defaultCheckoutRes.json();
  results.default_offer_payment_methods = defaultCheckoutData?.offer?.payment_methods;

  // Test 3: Try PIX with the default offer (if PIX is enabled there)
  const res3 = await fetch(`https://api.sharkpayments.com.br/api/public/v1/transactions?api_token=${apiToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      amount: 2000,
      offer_hash: productHash,
      payment_method: "pix",
      customer: { name: "Teste Silva", email: "teste@teste.com", phone_number: "11999999999", document: "52998224725" },
      cart: [{ product_hash: productHash, title: "Curso Primeira venda", price: 2000, quantity: 1, operation_type: 1, tangible: false }],
      installments: 1,
    }),
  });
  results.test3_pix_default_offer = { status: res3.status, body: await res3.text() };

  // Test 4: Check new R$5 offer
  const r5CheckoutRes = await fetch(`https://api.sharkpayments.com.br/api/public/v1/checkout/66gx6d3zrv_jxjdzucn9l?api_token=${apiToken}`, {
    headers: { "Accept": "application/json" },
  });
  const r5Data = await r5CheckoutRes.json();
  results.r5_offer_payment_methods = r5Data?.offer?.payment_methods;

  console.log("Results:", JSON.stringify(results, null, 2));
  return new Response(JSON.stringify(results, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
