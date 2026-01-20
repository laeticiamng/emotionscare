import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Liste blanche des origines autorisées
const ALLOWED_ORIGINS = [
  'https://emotionscare.com',
  'https://www.emotionscare.com',
  'https://app.emotionscare.com',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080',
];

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

// Stripe API wrapper without external dependency
async function createStripeCheckout(
  stripeKey: string,
  email: string,
  userId: string,
  origin: string,
  customerId?: string
): Promise<{ url: string | null; sessionId: string }> {
  const baseUrl = 'https://api.stripe.com/v1';
  
  // Create checkout session
  const sessionParams = new URLSearchParams();
  if (customerId) {
    sessionParams.append('customer', customerId);
  } else {
    sessionParams.append('customer_email', email);
  }
  sessionParams.append('mode', 'subscription');
  sessionParams.append('success_url', `${origin}/app/premium?success=true`);
  sessionParams.append('cancel_url', `${origin}/app/premium?cancelled=true`);
  sessionParams.append('line_items[0][price_data][currency]', 'eur');
  sessionParams.append('line_items[0][price_data][product_data][name]', 'EmotionsCare Premium');
  sessionParams.append('line_items[0][price_data][product_data][description]', 'Accès aux fonctionnalités Premium : Musique thérapeutique, Coach IA, VR Premium');
  sessionParams.append('line_items[0][price_data][unit_amount]', '999');
  sessionParams.append('line_items[0][price_data][recurring][interval]', 'month');
  sessionParams.append('line_items[0][quantity]', '1');
  sessionParams.append('metadata[user_id]', userId);
  sessionParams.append('metadata[user_email]', email);

  const response = await fetch(`${baseUrl}/checkout/sessions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${stripeKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: sessionParams.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Stripe API error: ${response.status} - ${errorText}`);
  }

  const session = await response.json();
  return { url: session.url, sessionId: session.id };
}

async function findStripeCustomer(stripeKey: string, email: string): Promise<string | undefined> {
  const response = await fetch(`https://api.stripe.com/v1/customers?email=${encodeURIComponent(email)}&limit=1`, {
    headers: {
      'Authorization': `Bearer ${stripeKey}`,
    },
  });

  if (!response.ok) return undefined;
  
  const data = await response.json();
  return data.data?.[0]?.id;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Check if customer already exists
    const customerId = await findStripeCustomer(stripeKey, user.email);
    if (customerId) {
      logStep("Existing customer found", { customerId });
    } else {
      logStep("No existing customer found, will create new one");
    }

    // Valider l'origine
    const requestOrigin = req.headers.get("origin");
    const origin = requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)
      ? requestOrigin
      : ALLOWED_ORIGINS[0];
    logStep("Origin validated", { requestOrigin, usedOrigin: origin });
    
    const { url, sessionId } = await createStripeCheckout(
      stripeKey,
      user.email,
      user.id,
      origin,
      customerId
    );

    logStep("Checkout session created", { sessionId, url });

    return new Response(JSON.stringify({ url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
