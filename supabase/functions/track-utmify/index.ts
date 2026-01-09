import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TrackingRequest {
  orderId: string;
  status: "pending" | "approved" | "refunded";
  customer: {
    name: string;
    email: string;
    phone: string;
    document: string;
  };
  products: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  paymentMethod: string;
  totalAmount: number;
  utmParams?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
    src?: string;
    sck?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const utmifyToken = Deno.env.get("UTMIFY_TOKEN");

    if (!utmifyToken) {
      console.error("Missing UTMIFY_TOKEN");
      return new Response(
        JSON.stringify({ error: "Tracking service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data: TrackingRequest = await req.json();

    console.log("Tracking sale to Utmify:", {
      orderId: data.orderId,
      status: data.status,
      totalAmount: data.totalAmount,
    });

    // Formato do payload para Utmify API
    const payload = {
      orderId: data.orderId,
      platform: "website",
      paymentMethod: data.paymentMethod,
      status: data.status,
      createdAt: new Date().toISOString(),
      approvedDate: data.status === "approved" ? new Date().toISOString() : null,
      refundedAt: data.status === "refunded" ? new Date().toISOString() : null,
      customer: {
        name: data.customer.name,
        email: data.customer.email,
        phone: data.customer.phone.replace(/\D/g, ""),
        document: data.customer.document.replace(/\D/g, ""),
        country: "BR",
      },
      products: data.products.map((p) => ({
        name: p.name,
        price: p.price,
        quantity: p.quantity,
        sku: null,
      })),
      trackingParameters: {
        src: data.utmParams?.src || null,
        sck: data.utmParams?.sck || null,
        utm_source: data.utmParams?.utm_source || null,
        utm_medium: data.utmParams?.utm_medium || null,
        utm_campaign: data.utmParams?.utm_campaign || null,
        utm_content: data.utmParams?.utm_content || null,
        utm_term: data.utmParams?.utm_term || null,
      },
      commission: {
        totalPrice: data.totalAmount,
        gatewayFee: 0,
        integrationFee: 0,
        totalCommission: data.totalAmount,
      },
      isTest: false,
    };

    console.log("Sending to Utmify API...");

    const response = await fetch("https://api.utmify.com.br/api/v1/sales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${utmifyToken}`,
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Utmify API error:", responseData);
      return new Response(
        JSON.stringify({ error: responseData.message || "Failed to track sale" }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Sale tracked successfully:", responseData);

    return new Response(
      JSON.stringify({ success: true, data: responseData }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("Error tracking sale:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
