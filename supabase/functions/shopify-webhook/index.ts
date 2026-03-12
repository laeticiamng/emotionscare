/**
 * Shopify Webhook Handler - EmotionsCare Store
 * Gère l'activation automatique des modules après achat
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALLOWED_ORIGINS = [
  'https://emotionscare.com',
  'https://www.emotionscare.com',
  'https://emotions-care.lovable.app',
  'http://localhost:5173',
];

function getCorsHeaders(req) {
  const origin = req.headers.get('origin') ?? '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

interface ShopifyOrder {
  id: number;
  order_number: number;
  customer: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  line_items: Array<{
    id: number;
    product_id: number;
    variant_id: number;
    title: string;
    variant_title: string;
    price: string;
    quantity: number;
    sku: string;
  }>;
  total_price: string;
  currency: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  try {
    // Parse le webhook Shopify
    const order: ShopifyOrder = await req.json();
    
    console.log('📦 Shopify Order Received:', {
      orderId: order.id,
      customer: order.customer.email,
      items: order.line_items.length
    });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Trouver l'utilisateur EmotionsCare par email via l'API REST
    const userResponse = await fetch(
      `${supabaseUrl}/rest/v1/profiles?email=eq.${encodeURIComponent(order.customer.email)}&select=id,user_id`,
      {
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const users = await userResponse.json();
    const userId = users && users.length > 0 ? users[0].user_id : null;

    if (!userId) {
      console.warn('⚠️ User not found in EmotionsCare:', order.customer.email);
    }

    // Traiter chaque produit acheté
    for (const item of order.line_items) {
      const productHandle = item.sku?.toLowerCase() || item.title.toLowerCase().replace(/\s+/g, '-');
      
      console.log('🔍 Processing item:', {
        productHandle,
        title: item.title,
        sku: item.sku
      });

      // Enregistrer l'achat
      const purchaseResponse = await fetch(
        `${supabaseUrl}/rest/v1/shopify_purchases`,
        {
          method: 'POST',
          headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            user_id: userId,
            order_id: `${order.id}-${item.id}`,
            shopify_product_id: String(item.product_id),
            product_handle: productHandle,
            product_title: item.title,
            variant_id: String(item.variant_id),
            variant_title: item.variant_title,
            price_amount: parseFloat(item.price),
            currency_code: order.currency,
            quantity: item.quantity,
            activated_at: userId ? new Date().toISOString() : null
          })
        }
      );

      if (!purchaseResponse.ok) {
        console.error('❌ Error recording purchase:', await purchaseResponse.text());
        continue;
      }

      const purchase = (await purchaseResponse.json())[0];

      // Si utilisateur connecté, activer le module
      if (userId && purchase) {
        // Récupérer le mapping du produit
        const mappingResponse = await fetch(
          `${supabaseUrl}/rest/v1/product_module_mapping?product_handle=eq.${encodeURIComponent(productHandle)}`,
          {
            headers: {
              'apikey': supabaseServiceKey,
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const mappings = await mappingResponse.json();
        const mapping = mappings && mappings.length > 0 ? mappings[0] : null;

        if (mapping) {
          console.log('✅ Activating module:', mapping.module_name);
          
          // Activer le module pour l'utilisateur
          const activationResponse = await fetch(
            `${supabaseUrl}/rest/v1/user_activated_modules`,
            {
              method: 'POST',
              headers: {
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
              },
              body: JSON.stringify({
                user_id: userId,
                module_name: mapping.module_name,
                module_path: mapping.module_path,
                activated_via: 'purchase',
                purchase_id: purchase.id
              })
            }
          );

          if (!activationResponse.ok) {
            console.error('❌ Error activating module:', await activationResponse.text());
          } else {
            console.log('🎉 Module activated successfully!');
          }
        } else {
          console.warn('⚠️ No module mapping found for:', productHandle);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Order processed successfully',
        userId: userId || 'guest'
      }),
      {
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
