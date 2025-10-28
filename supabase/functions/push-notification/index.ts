// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const method = req.method;
    const body = method !== 'GET' ? await req.json() : {};

    // POST /push-notification/register - Enregistrer un token de notification
    if (method === 'POST' && body.token) {
      // Stocker le token dans la table push_subscriptions
      const { data, error } = await supabaseClient
        .from('push_subscriptions')
        .upsert({
          user_id: user.id,
          token: body.token,
          device_type: body.device_type || 'web',
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, subscription: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /push-notification/send - Envoyer une notification
    if (method === 'POST' && body.title) {
      // Récupérer les tokens de l'utilisateur
      const { data: subscriptions, error: subError } = await supabaseClient
        .from('push_subscriptions')
        .select('token')
        .eq('user_id', user.id)
        .eq('enabled', true);

      if (subError) throw subError;

      // TODO: Implémenter l'envoi via service push (FCM, APNs, etc.)
      // Pour l'instant, on retourne succès
      console.log('Sending notification to:', subscriptions?.length, 'devices');
      
      return new Response(JSON.stringify({ 
        success: true, 
        sent: subscriptions?.length || 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE /push-notification/unregister - Désactiver les notifications
    if (method === 'DELETE') {
      const { error } = await supabaseClient
        .from('push_subscriptions')
        .update({ enabled: false })
        .eq('user_id', user.id);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
