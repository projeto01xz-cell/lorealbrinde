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
  const results: Record<string, unknown> = {};
  
  // Test 1: Check balance
  const balanceRes = await fetch(`https://api.sharkpayments.com.br/api/public/v1/balance?api_token=${apiToken}`, {
    headers: { "Accept": "application/json" },
  });
  results.balance = await balanceRes.json();
  
  // Test 2: Check bank accounts
  const bankRes = await fetch(`https://api.sharkpayments.com.br/api/public/v1/bank-accounts`, {
    headers: { 
      "Accept": "application/json",
      "Authorization": `Bearer ${apiToken}`,
    },
  });
  results.bankAccounts = await bankRes.json();

  // Test 3: Check installments
  const installRes = await fetch(`https://api.sharkpayments.com.br/api/public/v1/installments?api_token=${apiToken}&amount=36900&interest_type=simple`, {
    headers: { "Accept": "application/json" },
  });
  results.installments = await installRes.json();

  console.log("Results:", JSON.stringify(results, null, 2));
  
  return new Response(JSON.stringify(results, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
