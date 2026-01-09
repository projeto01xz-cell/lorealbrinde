import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  amount: number; // em centavos
  customer: {
    name: string;
    email: string;
    document: string; // CPF
    phone: string;
  };
  items: Array<{
    title: string;
    quantity: number;
    unitPrice: number; // em centavos
  }>;
  expiresInMinutes?: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const publicKey = Deno.env.get("GOATPAY_PUBLIC_KEY");
    const secretKey = Deno.env.get("GOATPAY_SECRET_KEY");

    if (!publicKey || !secretKey) {
      console.error("Missing GoatPay API keys");
      return new Response(
        JSON.stringify({ error: "Payment service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { amount, customer, items, expiresInMinutes = 30 }: PaymentRequest = await req.json();

    console.log("Creating PIX payment:", { amount, customer: { ...customer, document: "***" }, items });

    // Criar credenciais Basic Auth
    const credentials = btoa(`${publicKey}:${secretKey}`);

    const payload = {
      amount,
      paymentMethod: "pix",
      customer: {
        name: customer.name,
        email: customer.email,
        document: customer.document.replace(/\D/g, ""),
        phone: customer.phone.replace(/\D/g, ""),
      },
      items: items.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unitPrice,
      })),
      pix: {
        expires_in: expiresInMinutes * 60, // converter para segundos
      },
    };

    console.log("Sending request to GoatPay API...");

    const response = await fetch("https://api.goatpay.pro/v1/transactions", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("GoatPay API error:", data);
      return new Response(
        JSON.stringify({ error: data.message || "Payment creation failed" }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("PIX payment created successfully:", { id: data.id, status: data.status });

    return new Response(
      JSON.stringify({
        id: data.id,
        status: data.status,
        pix: {
          payload: data.pix?.payload || data.pix?.qr_code,
          qrCodeUrl: data.pix?.qr_code_url || data.pix?.qrcode_url,
          expiresAt: data.pix?.expires_at,
        },
        amount: data.amount,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("Error creating PIX payment:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
