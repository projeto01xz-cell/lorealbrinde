import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SHARKPAY_API_URL = "https://api.sharkpayments.com.br/api/public/v1";

interface PaymentRequest {
  amount: number; // em centavos
  paymentMethod: "pix";
  customer: {
    name: string;
    email: string;
    document: string;
    phone: string;
    streetName?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  items: Array<{
    title: string;
    quantity: number;
    unitPrice: number;
    operationType?: number;
  }>;
  tracking?: {
    src?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
  };
}

const validatePaymentRequest = (data: unknown): { valid: boolean; error?: string; data?: PaymentRequest } => {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: "Invalid request body" };
  }

  const req = data as Record<string, unknown>;

  if (typeof req.amount !== 'number' || req.amount <= 0 || req.amount > 100000000) {
    return { valid: false, error: "Invalid amount" };
  }

  if (req.paymentMethod !== "pix") {
    return { valid: false, error: "Only PIX payment is supported" };
  }

  const customer = req.customer as Record<string, unknown>;
  if (!customer || typeof customer !== 'object') {
    return { valid: false, error: "Customer data is required" };
  }

  if (typeof customer.name !== 'string' || customer.name.trim().length < 2) {
    return { valid: false, error: "Customer name is required" };
  }
  if (typeof customer.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    return { valid: false, error: "Invalid customer email" };
  }
  if (typeof customer.document !== 'string') {
    return { valid: false, error: "Customer document is required" };
  }
  const cleanDoc = customer.document.replace(/\D/g, '');
  if (cleanDoc.length !== 11 && cleanDoc.length !== 14) {
    return { valid: false, error: "Invalid CPF/CNPJ" };
  }
  if (typeof customer.phone !== 'string') {
    return { valid: false, error: "Customer phone is required" };
  }
  const cleanPhone = customer.phone.replace(/\D/g, '');
  if (cleanPhone.length < 10 || cleanPhone.length > 11) {
    return { valid: false, error: "Invalid phone number" };
  }

  if (!Array.isArray(req.items) || req.items.length === 0) {
    return { valid: false, error: "Items are required" };
  }

  const validatedCustomer: PaymentRequest["customer"] = {
    name: (customer.name as string).trim().substring(0, 200),
    email: (customer.email as string).trim().toLowerCase().substring(0, 255),
    document: cleanDoc,
    phone: cleanPhone,
  };

  if (typeof customer.streetName === 'string') validatedCustomer.streetName = customer.streetName.substring(0, 200);
  if (typeof customer.number === 'string') validatedCustomer.number = customer.number.substring(0, 20);
  if (typeof customer.complement === 'string') validatedCustomer.complement = customer.complement.substring(0, 100);
  if (typeof customer.neighborhood === 'string') validatedCustomer.neighborhood = customer.neighborhood.substring(0, 100);
  if (typeof customer.city === 'string') validatedCustomer.city = customer.city.substring(0, 100);
  if (typeof customer.state === 'string') validatedCustomer.state = customer.state.substring(0, 2);
  if (typeof customer.zipCode === 'string') validatedCustomer.zipCode = customer.zipCode.replace(/\D/g, '').substring(0, 8);

  const result: PaymentRequest = {
    amount: req.amount as number,
    paymentMethod: "pix",
    customer: validatedCustomer,
    items: (req.items as Array<{ title: string; quantity: number; unitPrice: number; operationType?: number }>).map(i => ({
      title: (i.title || "Produto").substring(0, 200),
      quantity: Math.min(Math.floor(i.quantity || 1), 1000),
      unitPrice: Math.floor(i.unitPrice || 0),
      operationType: i.operationType || 1,
    })),
  };

  if (req.tracking && typeof req.tracking === 'object') {
    const t = req.tracking as Record<string, unknown>;
    result.tracking = {
      src: typeof t.src === 'string' ? t.src.substring(0, 200) : '',
      utm_source: typeof t.utm_source === 'string' ? t.utm_source.substring(0, 200) : '',
      utm_medium: typeof t.utm_medium === 'string' ? t.utm_medium.substring(0, 200) : '',
      utm_campaign: typeof t.utm_campaign === 'string' ? t.utm_campaign.substring(0, 200) : '',
      utm_term: typeof t.utm_term === 'string' ? t.utm_term.substring(0, 200) : '',
      utm_content: typeof t.utm_content === 'string' ? t.utm_content.substring(0, 200) : '',
    };
  }

  return { valid: true, data: result };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiToken = Deno.env.get("SHARKPAY_API_TOKEN");
    const offerHash = Deno.env.get("SHARKPAY_OFFER_HASH");
    const productHash = Deno.env.get("SHARKPAY_PRODUCT_HASH");
    
    if (!apiToken || !offerHash || !productHash) {
      console.error("Missing SHARKPAY_API_TOKEN, SHARKPAY_OFFER_HASH, or SHARKPAY_PRODUCT_HASH");
      return new Response(
        JSON.stringify({ error: "Payment processing unavailable. Please try again later.", code: "PAYMENT_CONFIG_ERROR" }),
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

    const { amount, customer, items, tracking } = validation.data;

    console.log("Creating PIX payment via SharkPayments:", {
      amount,
      customerEmail: customer.email.substring(0, 3) + "***",
      itemsCount: items.length,
    });

    // Build webhook URL
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const postbackUrl = `${supabaseUrl}/functions/v1/sharkpay-webhook`;

    // Build SharkPayments cart from items
    const cart = items.map((item, index) => ({
      product_hash: productHash,
      title: item.title,
      cover: null,
      price: item.unitPrice,
      quantity: item.quantity,
      operation_type: item.operationType || (index === 0 ? 1 : 2),
      tangible: false,
    }));

    // Build SharkPayments payload following their API spec
    const payload: Record<string, unknown> = {
      amount,
      offer_hash: offerHash,
      payment_method: "pix",
      customer: {
        name: customer.name,
        email: customer.email,
        phone_number: customer.phone,
        document: customer.document,
        street_name: customer.streetName || "",
        number: customer.number || "sn",
        complement: customer.complement || "",
        neighborhood: customer.neighborhood || "",
        city: customer.city || "",
        state: customer.state || "",
        zip_code: customer.zipCode || "",
      },
      cart,
      installments: 1,
      expire_in_days: 1,
      transaction_origin: "api",
      postback_url: postbackUrl,
    };

    // Add tracking/UTM if present
    if (tracking) {
      payload.tracking = {
        src: tracking.src || "",
        utm_source: tracking.utm_source || "",
        utm_medium: tracking.utm_medium || "",
        utm_campaign: tracking.utm_campaign || "",
        utm_term: tracking.utm_term || "",
        utm_content: tracking.utm_content || "",
      };
    }

    console.log("SharkPayments payload:", JSON.stringify(payload, null, 2));

    const response = await fetch(
      `${SHARKPAY_API_URL}/transactions?api_token=${apiToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("SharkPayments API error - Status:", response.status, "Response:", JSON.stringify(data, null, 2));
      return new Response(
        JSON.stringify({
          error: data.message || data.error || "Unable to create payment. Please try again.",
          code: "PAYMENT_GATEWAY_ERROR",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("SharkPayments payment created:", JSON.stringify(data, null, 2));

    // SharkPayments response - extract transaction data
    // The response may have data directly or nested in a data property
    const txData = data.data || data;

    // Map SharkPayments response to our standard format
    const responseData = {
      id: txData.hash || txData.id || txData.external_ref || `SP-${Date.now()}`,
      status: txData.status === "waiting_payment" || txData.status === "pending" ? "pending" : txData.status,
      amount: amount,
      paymentMethod: "pix",
      pix: {
        payload: txData.pix_code || txData.pix?.code || txData.pix?.payload || "",
        qrCodeBase64: txData.pix_qr_code || txData.pix?.qr_code || txData.pix?.qr_code_base64 || "",
        expiresAt: txData.expires_at || txData.pix?.expires_at || "",
      },
    };

    return new Response(
      JSON.stringify(responseData),
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
