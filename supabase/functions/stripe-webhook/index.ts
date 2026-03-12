// @ts-nocheck
/**
 * Stripe Webhook Handler
 * Handles Stripe events: checkout completion, subscription lifecycle, and invoice payments.
 * Updates both `subscribers` table and `user_roles` for premium access control.
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const ALLOWED_ORIGINS = [
  "https://emotionscare.com",
  "https://www.emotionscare.com",
  "https://emotions-care.lovable.app",
  "http://localhost:5173",
];

function getCorsHeaders(origin: string | null) {
  const allowed = ALLOWED_ORIGINS.includes(origin ?? "") ? origin! : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

// Product ID to plan tier mapping (must match create-checkout and check-subscription)
const PRODUCTS: Record<string, string> = {
  "prod_TslvzqesvBi9fL": "pro",
  "prod_TslvIwwBhG1EHZ": "business",
};

/**
 * Resolve Supabase user_id from a Stripe customer ID.
 * Strategy:
 *   1. Look up `subscribers` table by stripe_customer_id
 *   2. Fall back to customer email -> auth.users lookup
 */
async function resolveUserId(
  stripe: Stripe,
  supabase: ReturnType<typeof createClient>,
  customerId: string
): Promise<{ userId: string | null; email: string | null }> {
  // 1. Try subscribers table first (fast, indexed)
  const { data: subscriber } = await supabase
    .from("subscribers")
    .select("user_id, email")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (subscriber?.user_id) {
    return { userId: subscriber.user_id, email: subscriber.email };
  }

  // 2. Fall back: get email from Stripe, look up auth user
  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
  if (customer.deleted || !customer.email) {
    return { userId: null, email: null };
  }

  const { data: authData } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1,
  });

  // listUsers doesn't support email filter, so use getUserByEmail workaround
  // Actually, we can search by email via the admin API
  const { data: userByEmail } = await supabase
    .rpc("get_user_id_by_email", { _email: customer.email })
    .maybeSingle();

  // If RPC doesn't exist, fall back to scanning (less efficient but reliable)
  if (userByEmail?.id) {
    return { userId: userByEmail.id, email: customer.email };
  }

  // Final fallback: look up in subscribers table by email
  const { data: subByEmail } = await supabase
    .from("subscribers")
    .select("user_id")
    .eq("email", customer.email)
    .maybeSingle();

  if (subByEmail?.user_id) {
    return { userId: subByEmail.user_id, email: customer.email };
  }

  // Last resort: scan auth users (existing pattern, works for small user bases)
  const { data: users } = await supabase.auth.admin.listUsers();
  if (users?.users) {
    const user = users.users.find((u) => u.email === customer.email);
    if (user) {
      return { userId: user.id, email: customer.email };
    }
  }

  return { userId: null, email: customer.email };
}

/**
 * Determine plan tier from a Stripe subscription object.
 */
function getPlanFromSubscription(subscription: Stripe.Subscription): string {
  const productId = subscription.items.data[0]?.price?.product as string;
  return PRODUCTS[productId] || "pro";
}

/**
 * Upsert the subscribers table with current subscription state.
 */
async function upsertSubscriber(
  supabase: ReturnType<typeof createClient>,
  params: {
    userId: string;
    email: string | null;
    stripeCustomerId: string;
    subscribed: boolean;
    subscriptionTier: string | null;
    subscriptionEnd: string | null;
  }
) {
  const { error } = await supabase
    .from("subscribers")
    .upsert(
      {
        user_id: params.userId,
        email: params.email,
        stripe_customer_id: params.stripeCustomerId,
        subscribed: params.subscribed,
        subscription_tier: params.subscriptionTier,
        subscription_end: params.subscriptionEnd,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) {
    logStep("ERROR: Failed to upsert subscriber", { userId: params.userId, error: error.message });
  } else {
    logStep("Subscriber record upserted", { userId: params.userId, subscribed: params.subscribed, tier: params.subscriptionTier });
  }
  return error;
}

/**
 * Assign or remove the premium role in user_roles.
 */
async function syncPremiumRole(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  shouldHavePremium: boolean
) {
  if (shouldHavePremium) {
    const { error } = await supabase
      .from("user_roles")
      .upsert(
        { user_id: userId, role: "premium" },
        { onConflict: "user_id,role" }
      );
    if (error) {
      logStep("ERROR: Failed to assign premium role", { userId, error: error.message });
    } else {
      logStep("Premium role assigned", { userId });
    }
  } else {
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", "premium");
    if (error) {
      logStep("ERROR: Failed to remove premium role", { userId, error: error.message });
    } else {
      logStep("Premium role removed", { userId });
    }
  }
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get("origin"));

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received", { method: req.method });

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeKey || !webhookSecret || !supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing required environment variables");
    }

    // -- Verify webhook signature --
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      logStep("ERROR: No stripe-signature header");
      return new Response(JSON.stringify({ error: "Missing stripe-signature header" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.text();
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      logStep("Signature verified", { type: event.type, id: event.id });
    } catch (err) {
      logStep("ERROR: Signature verification failed", { error: err.message });
      return new Response(JSON.stringify({ error: "Webhook signature verification failed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // -- Route events --
    switch (event.type) {
      // ============================================================
      // CHECKOUT COMPLETED - activate subscription after payment
      // ============================================================
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Checkout completed", {
          sessionId: session.id,
          customerId: session.customer,
          mode: session.mode,
        });

        if (session.mode !== "subscription") {
          logStep("Skipping non-subscription checkout", { mode: session.mode });
          break;
        }

        const userId = session.metadata?.user_id;
        if (!userId) {
          logStep("WARNING: No user_id in session metadata", { sessionId: session.id });
          break;
        }

        const plan = session.metadata?.plan || "pro";
        const customerId = session.customer as string;

        // Retrieve the subscription to get period end
        let subscriptionEnd: string | null = null;
        if (session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string);
          subscriptionEnd = new Date(sub.current_period_end * 1000).toISOString();
        }

        // Update subscribers table
        await upsertSubscriber(supabase, {
          userId,
          email: session.customer_email || session.customer_details?.email || null,
          stripeCustomerId: customerId,
          subscribed: true,
          subscriptionTier: plan,
          subscriptionEnd,
        });

        // Assign premium role
        await syncPremiumRole(supabase, userId, true);

        logStep("Checkout fully processed", { userId, plan });
        break;
      }

      // ============================================================
      // SUBSCRIPTION UPDATED - sync status changes (upgrade/downgrade/pause)
      // ============================================================
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        logStep("Subscription updated", {
          subscriptionId: subscription.id,
          status: subscription.status,
          customerId,
        });

        const { userId, email } = await resolveUserId(stripe, supabase, customerId);
        if (!userId) {
          logStep("WARNING: Could not resolve user for customer", { customerId });
          break;
        }

        const isActive = ["active", "trialing"].includes(subscription.status);
        const plan = getPlanFromSubscription(subscription);
        const subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();

        await upsertSubscriber(supabase, {
          userId,
          email,
          stripeCustomerId: customerId,
          subscribed: isActive,
          subscriptionTier: isActive ? plan : null,
          subscriptionEnd: isActive ? subscriptionEnd : null,
        });

        await syncPremiumRole(supabase, userId, isActive);

        logStep("Subscription update processed", { userId, status: subscription.status, plan: isActive ? plan : "free" });
        break;
      }

      // ============================================================
      // SUBSCRIPTION DELETED - handle cancellation
      // ============================================================
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        logStep("Subscription deleted", {
          subscriptionId: subscription.id,
          customerId,
        });

        const { userId, email } = await resolveUserId(stripe, supabase, customerId);
        if (!userId) {
          logStep("WARNING: Could not resolve user for customer", { customerId });
          break;
        }

        // Deactivate subscription
        await upsertSubscriber(supabase, {
          userId,
          email,
          stripeCustomerId: customerId,
          subscribed: false,
          subscriptionTier: null,
          subscriptionEnd: null,
        });

        // Remove premium role
        await syncPremiumRole(supabase, userId, false);

        logStep("Subscription cancellation processed", { userId });
        break;
      }

      // ============================================================
      // INVOICE PAID - record successful recurring payment
      // ============================================================
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        logStep("Invoice paid", {
          invoiceId: invoice.id,
          customerId,
          amountPaid: invoice.amount_paid,
          billingReason: invoice.billing_reason,
        });

        // Only process subscription invoices
        if (!invoice.subscription) {
          logStep("Skipping non-subscription invoice");
          break;
        }

        const { userId, email } = await resolveUserId(stripe, supabase, customerId);
        if (!userId) {
          logStep("WARNING: Could not resolve user for customer", { customerId });
          break;
        }

        // Retrieve fresh subscription data to get updated period end
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
        const plan = getPlanFromSubscription(subscription);
        const subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();

        // Refresh subscriber record with new period
        await upsertSubscriber(supabase, {
          userId,
          email,
          stripeCustomerId: customerId,
          subscribed: true,
          subscriptionTier: plan,
          subscriptionEnd,
        });

        // Ensure premium role is active
        await syncPremiumRole(supabase, userId, true);

        logStep("Invoice payment processed", { userId, plan, subscriptionEnd });
        break;
      }

      // ============================================================
      // INVOICE PAYMENT FAILED - handle failed recurring payment
      // ============================================================
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        logStep("Invoice payment failed", {
          invoiceId: invoice.id,
          customerId,
          attemptCount: invoice.attempt_count,
          nextAttempt: invoice.next_payment_attempt,
        });

        if (!invoice.subscription) {
          logStep("Skipping non-subscription invoice");
          break;
        }

        const { userId, email } = await resolveUserId(stripe, supabase, customerId);
        if (!userId) {
          logStep("WARNING: Could not resolve user for customer", { customerId });
          break;
        }

        // On final attempt failure (Stripe typically retries 3-4 times), the subscription
        // will eventually be canceled and we'll get customer.subscription.deleted.
        // For now, log the failure. We don't revoke access on first failure to avoid
        // punishing users for transient payment issues.
        logStep("Payment failure recorded", {
          userId,
          attemptCount: invoice.attempt_count,
          nextAttempt: invoice.next_payment_attempt
            ? new Date(invoice.next_payment_attempt * 1000).toISOString()
            : "none (final attempt)",
        });

        // If there's no next payment attempt, this is the final failure.
        // Stripe will cancel the subscription automatically, triggering
        // customer.subscription.deleted. We can optionally mark the user as
        // having a payment issue for UI purposes.
        if (!invoice.next_payment_attempt) {
          logStep("Final payment attempt failed - subscription will be canceled by Stripe", { userId });
        }

        break;
      }

      default:
        logStep("Unhandled event type (ignored)", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in webhook handler", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
