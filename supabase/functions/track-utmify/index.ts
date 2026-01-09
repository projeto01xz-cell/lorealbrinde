import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Utmify Pixel ID (same as used in index.html)
const PIXEL_ID = "696119dd7b2c89894cd5fa85";
const UTMIFY_EVENTS_URL = "https://tracking.utmify.com.br/tracking/v1/events";

interface TrackingRequest {
  orderId: string;
  status: "pending" | "approved" | "refunded";
  customer: {
    name: string;
    email: string;
    phone: string;
    document: string;
    ip?: string;
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
  leadId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: TrackingRequest = await req.json();

    console.log("Tracking sale to Utmify:", {
      orderId: data.orderId,
      status: data.status,
      totalAmount: data.totalAmount,
    });

    // Determine event type based on status
    let eventType: string;
    if (data.status === "approved") {
      eventType = "Purchase";
    } else if (data.status === "pending") {
      eventType = "InitiateCheckout";
    } else if (data.status === "refunded") {
      eventType = "Refund";
    } else {
      eventType = "Purchase";
    }

    // Build payload for Utmify Pixel Events API
    const payload = {
      type: eventType,
      lead: {
        pixelId: PIXEL_ID,
        _id: data.leadId || null,
        metaPixelIds: ["826039799862526"],
        tikTokPixelIds: [],
        geolocation: {
          country: "BR",
          city: "",
          state: "",
          zipcode: "",
        },
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        ip: data.customer.ip || "177.0.0.1",
        parameters: "",
        icTextMatch: null,
        icCSSMatch: null,
        icURLMatch: null,
        leadTextMatch: null,
        addToCartTextMatch: null,
        ipConfiguration: "IPV6_OR_IPV4",
      },
      event: {
        sourceUrl: "https://loreal-paris-campanha.lovable.app/checkout",
        pageTitle: "Checkout",
        value: data.totalAmount,
        currency: "BRL",
        content_ids: data.products.map((_, i) => `product_${i + 1}`),
        content_type: "product",
        contents: data.products.map((p, i) => ({
          id: `product_${i + 1}`,
          quantity: p.quantity,
          item_price: p.price,
        })),
        num_items: data.products.reduce((sum, p) => sum + p.quantity, 0),
        order_id: data.orderId,
      },
      tikTokPageInfo: null,
    };

    console.log("Sending to Utmify Events API:", JSON.stringify(payload, null, 2));

    const response = await fetch(UTMIFY_EVENTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log("Utmify Events response:", response.status, responseText);

    if (!response.ok) {
      console.error("Utmify Events API error:", responseText);
      return new Response(
        JSON.stringify({ error: responseText || "Failed to track sale" }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { raw: responseText };
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
