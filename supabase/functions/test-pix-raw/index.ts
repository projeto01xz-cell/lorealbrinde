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

  // Payload exatamente como a documentação da API (incluindo product_id, offer_id e installments)
  const payload = {
    amount: 15000,
    offer_hash: "v3mkew0tf5",
    payment_method: "pix",
    customer: {
      name: "João Silva",
      email: "joao@email.com",
      phone_number: "21999999999",
      document: "09115751031",
      street_name: "Rua das Flores",
      number: "123",
      complement: "Apt 45",
      neighborhood: "Centro",
      city: "Rio de Janeiro",
      state: "RJ",
      zip_code: "20040020",
    },
    cart: [
      {
        product_hash: "7mgz8xz40f",
        title: "Produto Teste",
        cover: null,
        price: 15000,
        quantity: 1,
        operation_type: 1,
        tangible: false,
      },
    ],
    installments: 1,
    expire_in_days: 1,
    transaction_origin: "api",
  };

  console.log("Sending raw test payload:", JSON.stringify(payload, null, 2));

  // Try the documented endpoint
  const url = `https://api.sharkpayments.com.br/api/public/v1/transactions?api_token=${apiToken}`;
  console.log("URL:", url);
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  console.log("Response status:", response.status);
  console.log("Response body:", JSON.stringify(data, null, 2));

  return new Response(JSON.stringify({ status: response.status, data }, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
