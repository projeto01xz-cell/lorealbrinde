import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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
    const nitroApiKey = Deno.env.get("NITROPAY_API_KEY");
    if (!nitroApiKey) {
      console.error("Missing NITROPAY_API_KEY");
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

    // NitroPay expects amount in reais (not centavos)
    const amountInReais = amount / 100;

    console.log("Creating PIX payment via NitroPay:", {
      amount: amountInReais,
      customerEmail: customer.email.substring(0, 3) + "***",
      itemsCount: items.length,
    });

    // Build webhook URL
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const postbackUrl = `${supabaseUrl}/functions/v1/nitropay-webhook`;

    // Build NitroPay payload
    const payload: Record<string, unknown> = {
      amount: amountInReais,
      payment_method: "pix",
      description: items.map(i => i.title).join(", ").substring(0, 200),
      items: items.map(item => ({
        title: item.title,
        unitPrice: item.unitPrice, // centavos
        quantity: item.quantity,
        tangible: false,
      })),
      customer: {
        name: customer.name,
        email: customer.email,
        document: customer.document,
        phone: customer.phone,
      },
      metadata: {
        address_street: customer.streetName || "",
        address_number: customer.number || "",
        address_complement: customer.complement || "",
        address_neighborhood: customer.neighborhood || "",
        address_city: customer.city || "",
        address_state: customer.state || "",
        address_cep: customer.zipCode || "",
      },
      postbackUrl,
    };

    // Add tracking if present
    if (tracking) {
      payload.tracking = tracking;
    }

    console.log("NitroPay payload:", JSON.stringify(payload, null, 2));

    const response = await fetch("https://api.nitropagamento.app", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${nitroApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("NitroPay API error - Status:", response.status, "Response:", JSON.stringify(data, null, 2));
      return new Response(
        JSON.stringify({
          error: data.message || "Unable to create payment. Please try again.",
          code: "PAYMENT_GATEWAY_ERROR",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("NitroPay payment created:", JSON.stringify(data, null, 2));

    const txData = data.data;

    // Map NitroPay response to our standard format
    const responseData = {
      id: txData.id || txData.external_ref,
      status: txData.status === "pendente" ? "pending" : txData.status,
      amount: amount,
      paymentMethod: "pix",
      pix: {
        payload: txData.pix_code || "",
        qrCodeBase64: txData.pix_qr_code || "",
        expiresAt: txData.expires_at || "",
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
