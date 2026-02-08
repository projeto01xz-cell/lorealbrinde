import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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

// Input validation helper
const validatePaymentRequest = (data: unknown): { valid: boolean; error?: string; data?: PaymentRequest } => {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: "Invalid request body" };
  }

  const req = data as Record<string, unknown>;
  
  // Validate amount
  if (typeof req.amount !== 'number' || req.amount <= 0 || req.amount > 1000000) {
    return { valid: false, error: "Invalid amount: must be between 1 and 1000000 cents" };
  }

  // Validate customer
  const customer = req.customer as Record<string, unknown>;
  if (!customer || typeof customer !== 'object') {
    return { valid: false, error: "Customer data is required" };
  }

  if (typeof customer.name !== 'string' || customer.name.trim().length < 2 || customer.name.length > 200) {
    return { valid: false, error: "Customer name must be between 2 and 200 characters" };
  }

  if (typeof customer.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    return { valid: false, error: "Invalid customer email" };
  }

  if (typeof customer.document !== 'string') {
    return { valid: false, error: "Customer document is required" };
  }
  const cleanDoc = customer.document.replace(/\D/g, '');
  if (cleanDoc.length !== 11 && cleanDoc.length !== 14) {
    return { valid: false, error: "Customer document must be a valid CPF (11 digits) or CNPJ (14 digits)" };
  }

  if (typeof customer.phone !== 'string') {
    return { valid: false, error: "Customer phone is required" };
  }
  const cleanPhone = customer.phone.replace(/\D/g, '');
  if (cleanPhone.length < 10 || cleanPhone.length > 11) {
    return { valid: false, error: "Customer phone must be 10 or 11 digits" };
  }

  // Validate items
  if (!Array.isArray(req.items) || req.items.length === 0 || req.items.length > 100) {
    return { valid: false, error: "Items must be an array with 1-100 items" };
  }

  for (const item of req.items) {
    const i = item as Record<string, unknown>;
    if (typeof i.title !== 'string' || i.title.length === 0 || i.title.length > 200) {
      return { valid: false, error: "Each item must have a title (1-200 chars)" };
    }
    if (typeof i.quantity !== 'number' || i.quantity < 1 || i.quantity > 1000) {
      return { valid: false, error: "Each item must have a valid quantity (1-1000)" };
    }
    if (typeof i.unitPrice !== 'number' || !Number.isFinite(i.unitPrice) || i.unitPrice < 1) {
      return { valid: false, error: `Each item must have a valid unitPrice (got: ${i.unitPrice})` };
    }
  }

  return {
    valid: true,
    data: {
      amount: req.amount as number,
      customer: {
        name: (customer.name as string).trim().substring(0, 200),
        email: (customer.email as string).trim().toLowerCase().substring(0, 255),
        document: cleanDoc,
        phone: cleanPhone,
      },
      items: (req.items as Array<{ title: string; quantity: number; unitPrice: number }>).map(i => ({
        title: i.title.substring(0, 200),
        quantity: Math.min(Math.floor(i.quantity), 1000),
        unitPrice: Math.floor(i.unitPrice),
      })),
      expiresInMinutes: typeof req.expiresInMinutes === 'number' ? Math.min(Math.max(req.expiresInMinutes, 5), 60) : 30,
    }
  };
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiToken = Deno.env.get("SHARKPAY_API_TOKEN");
    const offerHash = Deno.env.get("SHARKPAY_OFFER_HASH");
    const productHash = Deno.env.get("SHARKPAY_PRODUCT_HASH");

    if (!apiToken) {
      console.error("Missing SHARKPAY_API_TOKEN");
      return new Response(
        JSON.stringify({ error: "Payment processing unavailable. Please try again later.", code: "PAYMENT_CONFIG_ERROR" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!offerHash || !productHash) {
      console.error("Missing SHARKPAY_OFFER_HASH or SHARKPAY_PRODUCT_HASH");
      return new Response(
        JSON.stringify({ error: "Payment configuration incomplete. Please contact support.", code: "PAYMENT_CONFIG_ERROR" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const rawBody = await req.json();
    const validation = validatePaymentRequest(rawBody);
    
    if (!validation.valid || !validation.data) {
      console.error("Validation error:", validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { amount, customer, items } = validation.data;

    console.log("Creating PIX payment via SharkPayments:", { amount, customerEmail: customer.email.substring(0, 3) + "***", itemsCount: items.length });

    // SharkPayments API payload
    const payload = {
      offer_hash: offerHash,
      name: customer.name,
      email: customer.email,
      phone_number: customer.phone,
      doc: customer.document,
      products_cart: items.map((item, index) => ({
        product_hash: productHash,
        title: `teste ${index + 1}`, // Masked for privacy as per existing GoatPay behavior
        quantity: item.quantity,
        price_in_cents: item.unitPrice,
      })),
      payment_method: "pix",
    };

    console.log("Sending request to SharkPayments API...");

    const response = await fetch(`https://api.sharkpayments.com.br/api/public/v1/transactions?api_token=${apiToken}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("SharkPayments API error:", data);
      return new Response(
        JSON.stringify({ error: "Unable to create payment. Please try again.", code: "PAYMENT_GATEWAY_ERROR", details: data }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("PIX payment created successfully via SharkPayments:", { id: data.id || data.transaction_id, status: data.status });

    // Map SharkPayments response to our standard format
    return new Response(
      JSON.stringify({
        id: data.id || data.transaction_id || data.external_id,
        status: data.status || "pending",
        pix: {
          payload: data.pix_code || data.pix?.payload || data.pix?.qr_code || data.qr_code,
          qrCodeUrl: data.pix_qrcode_url || data.pix?.qr_code_url || data.qrcode_url,
          expiresAt: data.pix_expires_at || data.pix?.expires_at || data.expires_at,
        },
        amount: data.amount || amount,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error creating payment:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again.", code: "INTERNAL_ERROR" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
