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

  // Get checkout data to check acquirer/config for PIX
  const checkoutRes = await fetch(`https://api.sharkpayments.com.br/api/public/v1/checkout/${offerHash}?api_token=${apiToken}`, {
    headers: { "Accept": "application/json" },
  });
  const checkoutData = await checkoutRes.json();
  // Check for PIX-specific config
  results.acquirer_creditcard = checkoutData?.acquirer_creditcard;
  results.configs = checkoutData?.configs;
  results.receive_producer = checkoutData?.receive_producer;
  results.company_keys = checkoutData?.company ? Object.keys(checkoutData.company) : null;
  results.company_pix = checkoutData?.company?.pix_key || checkoutData?.company?.pix;
  results.company_bank = checkoutData?.company?.bank_account || checkoutData?.company?.bank;
  results.seller = checkoutData?.seller;
  
  // Dump relevant parts of company
  const company = checkoutData?.company;
  if (company) {
    results.company_relevant = {
      pix_key: company.pix_key,
      pix_key_type: company.pix_key_type,
      bank_account: company.bank_account,
      account_type: company.account_type,
      mp_access_token: company.mp_access_token ? "EXISTS" : "MISSING",
      mp_public_key: company.mp_public_key ? "EXISTS" : "MISSING",
      payment_gateway: company.payment_gateway,
      acquirer: company.acquirer,
      status: company.status,
    };
  }

  // Check the full checkout data for any pix-related keys
  const allKeys = JSON.stringify(checkoutData);
  const pixMentions = allKeys.match(/pix[^"]*"/gi);
  results.pix_related_keys = pixMentions;

  console.log("Results:", JSON.stringify(results, null, 2));
  return new Response(JSON.stringify(results, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
