import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface CardData {
  number: string;
  holderName: string;
  expMonth: number;
  expYear: number;
  cvv: string;
}

interface PaymentRequest {
  amount: number; // em centavos
  paymentMethod: "pix" | "credit_card";
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
    operationType?: number; // 1- venda principal / 2- orderbump / 3- upsell
  }>;
  card?: CardData;
  installments?: number;
  tracking?: {
    src?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
  };
}

// Input validation helper
const validatePaymentRequest = (data: unknown): { valid: boolean; error?: string; data?: PaymentRequest } => {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: "Invalid request body" };
  }

  const req = data as Record<string, unknown>;
  
  // Validate amount
  if (typeof req.amount !== 'number' || req.amount <= 0 || req.amount > 100000000) {
    return { valid: false, error: "Invalid amount: must be between 1 and 100000000 cents" };
  }

  // Validate payment method
  const validMethods = ["pix", "credit_card"];
  if (!req.paymentMethod || !validMethods.includes(req.paymentMethod as string)) {
    return { valid: false, error: "Invalid payment method: must be 'pix' or 'credit_card'" };
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
    if (typeof i.unitPrice !== 'number' || !Number.isFinite(i.unitPrice) || i.unitPrice < 0) {
      return { valid: false, error: `Each item must have a valid unitPrice (got: ${i.unitPrice})` };
    }
  }

  // Validate card if credit_card payment
  if (req.paymentMethod === "credit_card") {
    const card = req.card as Record<string, unknown>;
    if (!card || typeof card !== 'object') {
      return { valid: false, error: "Card data is required for credit card payment" };
    }

    if (typeof card.number !== 'string' || card.number.replace(/\D/g, '').length < 13) {
      return { valid: false, error: "Invalid card number" };
    }
    if (typeof card.holderName !== 'string' || card.holderName.trim().length < 2) {
      return { valid: false, error: "Card holder name is required" };
    }
    if (typeof card.expMonth !== 'number' || card.expMonth < 1 || card.expMonth > 12) {
      return { valid: false, error: "Invalid expiration month" };
    }
    if (typeof card.expYear !== 'number' || card.expYear < 2024 || card.expYear > 2050) {
      return { valid: false, error: "Invalid expiration year" };
    }
    if (typeof card.cvv !== 'string' || card.cvv.length < 3 || card.cvv.length > 4) {
      return { valid: false, error: "Invalid CVV" };
    }
  }

  // Build validated data
  const validatedCustomer: PaymentRequest["customer"] = {
    name: (customer.name as string).trim().substring(0, 200),
    email: (customer.email as string).trim().toLowerCase().substring(0, 255),
    document: cleanDoc,
    phone: cleanPhone,
  };

  // Add address fields if present
  if (typeof customer.streetName === 'string') validatedCustomer.streetName = customer.streetName.substring(0, 200);
  if (typeof customer.number === 'string') validatedCustomer.number = customer.number.substring(0, 20);
  if (typeof customer.complement === 'string') validatedCustomer.complement = customer.complement.substring(0, 100);
  if (typeof customer.neighborhood === 'string') validatedCustomer.neighborhood = customer.neighborhood.substring(0, 100);
  if (typeof customer.city === 'string') validatedCustomer.city = customer.city.substring(0, 100);
  if (typeof customer.state === 'string') validatedCustomer.state = customer.state.substring(0, 2);
  if (typeof customer.zipCode === 'string') validatedCustomer.zipCode = customer.zipCode.replace(/\D/g, '').substring(0, 8);

  const result: PaymentRequest = {
    amount: req.amount as number,
    paymentMethod: req.paymentMethod as "pix" | "credit_card",
    customer: validatedCustomer,
    items: (req.items as Array<{ title: string; quantity: number; unitPrice: number; operationType?: number }>).map(i => ({
      title: i.title.substring(0, 200),
      quantity: Math.min(Math.floor(i.quantity), 1000),
      unitPrice: Math.floor(i.unitPrice),
      operationType: i.operationType || 1,
    })),
  };

  // Add card if credit_card
  if (req.paymentMethod === "credit_card") {
    const card = req.card as Record<string, unknown>;
    result.card = {
      number: (card.number as string).replace(/\D/g, ''),
      holderName: (card.holderName as string).trim(),
      expMonth: card.expMonth as number,
      expYear: card.expYear as number,
      cvv: (card.cvv as string).replace(/\D/g, ''),
    };
    result.installments = typeof req.installments === 'number' ? Math.min(Math.max(req.installments, 1), 12) : 1;
  }

  // Add tracking if present
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

    const { amount, paymentMethod, customer, items, card, installments, tracking } = validation.data;

    console.log("Creating payment via SharkPayments:", { 
      amount, 
      paymentMethod,
      customerEmail: customer.email.substring(0, 3) + "***", 
      itemsCount: items.length 
    });

    // Fetch product info to get product_id and offer_id
    let productId: number | undefined;
    let offerId: number | undefined;
    try {
      const productRes = await fetch(
        `https://api.sharkpayments.com.br/api/public/v1/products/${productHash}?api_token=${apiToken}`,
        { headers: { "Accept": "application/json" } }
      );
      const productData = await productRes.json();
      console.log("Product data:", JSON.stringify(productData));
      
      // Response can be { data: {...} } or direct object
      const product = productData?.data || productData;
      if (product?.hash) {
        productId = product.id;
        // Find matching offer
        const matchingOffer = product.offers?.find(
          (o: { hash: string }) => o.hash === offerHash
        );
        if (matchingOffer) {
          offerId = matchingOffer.offerId;
          console.log("Found offer_id:", offerId);
        }
      }
    } catch (e) {
      console.warn("Could not fetch product info:", e);
    }

    // Build SharkPayments API payload with correct structure
    const payload: Record<string, unknown> = {
      amount,
      offer_hash: offerHash,
      payment_method: paymentMethod === "pix" ? 3 : 1, // 1=cartão, 2=boleto, 3=PIX
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
      cart: items.map((item, index) => {
        const cartItem: Record<string, unknown> = {
          product_hash: productHash,
          title: item.title || `Produto ${index + 1}`,
          cover: null,
          price: item.unitPrice,
          quantity: item.quantity,
          operation_type: item.operationType || 1,
          tangible: false,
        };
        if (productId) cartItem.product_id = productId;
        if (offerId) cartItem.offer_id = offerId;
        return cartItem;
      }),
      installments: installments || 1,
      expire_in_days: 1,
      transaction_origin: "api",
    };

    // Add card data for credit_card payments
    if (paymentMethod === "credit_card" && card) {
      payload.card = {
        number: card.number,
        holder_name: card.holderName,
        exp_month: card.expMonth,
        exp_year: card.expYear,
        cvv: card.cvv,
      };
    }

    // Add tracking data
    if (tracking) {
      payload.tracking = tracking;
    }

    console.log("Full payload to SharkPayments:", JSON.stringify(payload, null, 2));

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
      console.error("SharkPayments API error - Status:", response.status, "Full response:", JSON.stringify(data, null, 2));
      return new Response(
        JSON.stringify({ 
          error: data.message || "Unable to create payment. Please try again.", 
          code: "PAYMENT_GATEWAY_ERROR", 
          details: data 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("FULL SharkPayments response:", JSON.stringify(data, null, 2));
    console.log("Payment created successfully via SharkPayments:", { 
      id: data.hash || data.id || data.transaction_id, 
      status: data.status 
    });

    // Map SharkPayments response to our standard format
    const responseData: Record<string, unknown> = {
      id: data.hash || data.id || data.transaction_id || data.external_id,
      status: data.status || "pending",
      amount: data.amount || amount,
      paymentMethod,
    };

    // Add PIX data if applicable
    if (paymentMethod === "pix") {
      responseData.pix = {
        payload: data.pix_code || data.pix?.payload || data.pix?.qr_code || data.qr_code || data.pix_qrcode,
        qrCodeUrl: data.pix_qrcode_url || data.pix?.qr_code_url || data.qrcode_url,
        expiresAt: data.pix_expires_at || data.pix?.expires_at || data.expires_at,
      };
    }

    // Add card data if applicable
    if (paymentMethod === "credit_card") {
      responseData.card = {
        lastDigits: card?.number.slice(-4),
        brand: data.card_brand || data.brand,
      };
    }

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
