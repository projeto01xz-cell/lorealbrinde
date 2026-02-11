import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SHARKPAY_API_URL = "https://api.sharkpayments.com.br/api/public/v1";

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
  card?: {
    number: string;
    holderName: string;
    expMonth: number;
    expYear: number;
    cvv: string;
  };
  installments?: number;
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

  if (req.paymentMethod !== "pix" && req.paymentMethod !== "credit_card") {
    return { valid: false, error: "Invalid payment method. Use 'pix' or 'credit_card'" };
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

  // Validate card data for credit_card payments
  if (req.paymentMethod === "credit_card") {
    const card = req.card as Record<string, unknown> | undefined;
    if (!card || typeof card !== 'object') {
      return { valid: false, error: "Card data is required for credit card payments" };
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
    if (typeof card.expYear !== 'number' || card.expYear < 24) {
      return { valid: false, error: "Invalid expiration year" };
    }
    if (typeof card.cvv !== 'string' || card.cvv.length < 3 || card.cvv.length > 4) {
      return { valid: false, error: "Invalid CVV" };
    }
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
    paymentMethod: req.paymentMethod as "pix" | "credit_card",
    customer: validatedCustomer,
    installments: typeof req.installments === 'number' ? Math.min(Math.max(Math.floor(req.installments), 1), 12) : 1,
    items: (req.items as Array<{ title: string; quantity: number; unitPrice: number; operationType?: number }>).map(i => ({
      title: (i.title || "Produto").substring(0, 200),
      quantity: Math.min(Math.floor(i.quantity || 1), 1000),
      unitPrice: Math.floor(i.unitPrice || 0),
      operationType: i.operationType || 1,
    })),
  };

  // Add card data if credit_card
  if (req.paymentMethod === "credit_card" && req.card) {
    const card = req.card as Record<string, unknown>;
    result.card = {
      number: (card.number as string).replace(/\D/g, ''),
      holderName: (card.holderName as string).trim(),
      expMonth: card.expMonth as number,
      expYear: card.expYear as number,
      cvv: (card.cvv as string).replace(/\D/g, ''),
    };
  }

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

    const { amount, paymentMethod, customer, card, installments, items, tracking } = validation.data;

    console.log(`Creating ${paymentMethod} payment via SharkPayments:`, {
      amount,
      paymentMethod,
      installments,
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
      payment_method: paymentMethod === "credit_card" ? "credit_card" : "pix",
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
      installments: installments || 1,
      expire_in_days: 1,
      transaction_origin: "api",
      postback_url: postbackUrl,
    };

    // Add card data for credit card payments
    if (paymentMethod === "credit_card" && card) {
      payload.card = {
        number: card.number,
        holder_name: card.holderName,
        exp_month: card.expMonth,
        exp_year: card.expYear,
        cvv: card.cvv,
      };
    }

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

    // SharkPayments returns data at root level
    const txData = data.data || data;

    // Save order to database
    try {
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      if (supabaseUrl && supabaseServiceKey) {
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
        const externalId = String(txData.id || txData.hash || `SP-${Date.now()}`);
        const orderStatus = paymentMethod === "credit_card" 
          ? (txData.payment_status === "paid" || txData.payment_status === "approved" ? "paid" : "pending")
          : "pending";

        const { error: insertError } = await supabaseAdmin.from("orders").insert({
          external_id: externalId,
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone,
          customer_document: customer.document,
          total_amount: amount / 100,
          status: orderStatus,
          pix_payload: txData.pix?.pix_qr_code || txData.pix?.pix_url || null,
          shipping_option: items.length > 1 ? items[items.length - 1]?.title : null,
          shipping_price: null,
          address_cep: customer.zipCode || null,
          address_street: customer.streetName || null,
          address_number: customer.number || null,
          address_complement: customer.complement || null,
          address_neighborhood: customer.neighborhood || null,
          address_city: customer.city || null,
          address_state: customer.state || null,
          products: JSON.parse(JSON.stringify(items)),
          utm_params: tracking ? JSON.parse(JSON.stringify(tracking)) : null,
        });

        if (insertError) {
          console.error("Error saving order to database:", insertError);
        } else {
          console.log("Order saved to database with external_id:", externalId);
        }
      }
    } catch (dbError) {
      console.error("Database save error:", dbError);
    }


    // Build response based on payment method
    if (paymentMethod === "credit_card") {
      // Credit card: payment may be approved immediately or pending
      const responseData = {
        id: txData.hash || txData.id || `SP-${Date.now()}`,
        status: txData.payment_status === "paid" || txData.payment_status === "approved" ? "paid" : "pending",
        amount: amount,
        paymentMethod: "credit_card",
      };

      return new Response(
        JSON.stringify(responseData),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // PIX: return pix payload for QR code generation
      const responseData = {
        id: txData.hash || txData.id || `SP-${Date.now()}`,
        status: txData.payment_status === "waiting_payment" || txData.payment_status === "pending" ? "pending" : txData.payment_status,
        amount: amount,
        paymentMethod: "pix",
        pix: {
          payload: txData.pix?.pix_qr_code || txData.pix?.pix_url || "",
          qrCodeBase64: txData.pix?.qr_code_base64 || "",
          expiresAt: txData.expires_at || "",
        },
      };

      return new Response(
        JSON.stringify(responseData),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error: unknown) {
    console.error("Error creating payment:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again.", code: "INTERNAL_ERROR" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
