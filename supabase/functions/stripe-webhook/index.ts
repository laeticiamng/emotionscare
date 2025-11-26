/**
 * stripe-webhook - Gestion des événements Stripe
 *
 * 🔒 SÉCURISÉ: Signature Stripe + Rate limit 100/min
 * Note: Pas de CORS restrictif car Stripe doit pouvoir appeler ce webhook
 */

// @ts-nocheck
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

const logStep = (step: string, details?: any) => {
  const timestamp = new Date().toISOString();
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[${timestamp}] [stripe-webhook] ${step}${detailsStr}`);
};

Deno.serve(async (req) => {
  try {
    logStep("Webhook received");

    // 🛡️ Rate limiting pour prévenir les abus
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'stripe-webhook',
      userId: null,
      limit: 100,
      windowMs: 60_000,
      description: 'Stripe webhook events',
    });

    if (!rateLimit.allowed) {
      logStep("Rate limit exceeded");
      return buildRateLimitResponse(rateLimit, { 'Content-Type': 'application/json' });
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeKey || !webhookSecret || !supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing required environment variables");
    }

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("No stripe signature found");
    }

    const body = await req.text();
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Vérifier la signature du webhook
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      logStep("Webhook signature verified", { type: event.type });
    } catch (err) {
      logStep("ERROR: Webhook signature verification failed", { error: err.message });
      return new Response(JSON.stringify({ error: "Webhook signature verification failed" }), {
        status: 400,
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Gérer les différents types d'événements
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Checkout session completed", { 
          sessionId: session.id,
          customerEmail: session.customer_email,
          customerId: session.customer
        });

        if (session.mode === "subscription" && session.metadata?.user_id) {
          const userId = session.metadata.user_id;
          
          // Attribuer le rôle premium
          const { error } = await supabase
            .from('user_roles')
            .upsert({ 
              user_id: userId, 
              role: 'premium' 
            }, {
              onConflict: 'user_id,role'
            });

          if (error) {
            logStep("ERROR: Failed to assign premium role", { userId, error: error.message });
          } else {
            logStep("Premium role assigned", { userId });
          }
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Subscription created/updated", { 
          subscriptionId: subscription.id,
          status: subscription.status,
          customerId: subscription.customer
        });

        if (subscription.status === "active") {
          // Récupérer l'email du customer
          const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
          
          if (customer.email) {
            // Trouver l'utilisateur Supabase par email
            const { data: users, error: fetchError } = await supabase.auth.admin.listUsers();
            
            if (!fetchError && users) {
              const user = users.users.find(u => u.email === customer.email);
              
              if (user) {
                // Attribuer le rôle premium
                const { error } = await supabase
                  .from('user_roles')
                  .upsert({ 
                    user_id: user.id, 
                    role: 'premium' 
                  }, {
                    onConflict: 'user_id,role'
                  });

                if (error) {
                  logStep("ERROR: Failed to assign premium role", { userId: user.id, error: error.message });
                } else {
                  logStep("Premium role assigned", { userId: user.id, email: customer.email });
                }
              } else {
                logStep("WARNING: User not found for customer", { email: customer.email });
              }
            }
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Subscription deleted", { 
          subscriptionId: subscription.id,
          customerId: subscription.customer
        });

        // Récupérer l'email du customer
        const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
        
        if (customer.email) {
          // Trouver l'utilisateur Supabase par email
          const { data: users, error: fetchError } = await supabase.auth.admin.listUsers();
          
          if (!fetchError && users) {
            const user = users.users.find(u => u.email === customer.email);
            
            if (user) {
              // Retirer le rôle premium
              const { error } = await supabase
                .from('user_roles')
                .delete()
                .eq('user_id', user.id)
                .eq('role', 'premium');

              if (error) {
                logStep("ERROR: Failed to remove premium role", { userId: user.id, error: error.message });
              } else {
                logStep("Premium role removed", { userId: user.id, email: customer.email });
              }
            } else {
              logStep("WARNING: User not found for customer", { email: customer.email });
            }
          }
        }
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in webhook handler", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
      },
    });
  }
});
