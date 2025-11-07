// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { eventType, data } = await req.json();
    console.log('Triggering webhooks for event:', eventType);

    // Récupérer tous les webhooks actifs pour cet événement
    const { data: webhooks, error: webhooksError } = await supabase
      .from('gdpr_webhooks')
      .select('*')
      .eq('event_type', eventType)
      .eq('is_active', true);

    if (webhooksError) throw webhooksError;

    if (!webhooks || webhooks.length === 0) {
      return new Response(
        JSON.stringify({ success: true, triggered: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = [];

    // Déclencher tous les webhooks en parallèle
    for (const webhook of webhooks) {
      try {
        const payload = {
          event: eventType,
          timestamp: new Date().toISOString(),
          data,
          webhook_id: webhook.id,
        };

        const webhookResponse = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': await generateSignature(webhook.secret, payload),
            'X-Event-Type': eventType,
          },
          body: JSON.stringify(payload),
        });

        const success = webhookResponse.ok;
        const statusCode = webhookResponse.status;

        // Logger le résultat
        await supabase.from('webhook_logs').insert({
          webhook_id: webhook.id,
          event_type: eventType,
          payload,
          status_code: statusCode,
          success,
          response_body: success ? null : await webhookResponse.text(),
        });

        // Mettre à jour le compteur
        await supabase
          .from('gdpr_webhooks')
          .update({
            last_triggered_at: new Date().toISOString(),
            trigger_count: webhook.trigger_count + 1,
          })
          .eq('id', webhook.id);

        results.push({ webhook_id: webhook.id, success, statusCode });
      } catch (error: any) {
        console.error(`Webhook ${webhook.id} failed:`, error);
        
        await supabase.from('webhook_logs').insert({
          webhook_id: webhook.id,
          event_type: eventType,
          payload: data,
          success: false,
          error_message: error.message,
        });

        results.push({ webhook_id: webhook.id, success: false, error: error.message });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        triggered: webhooks.length,
        results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in trigger-webhooks:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur inconnue' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function generateSignature(secret: string, payload: any): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(payload) + secret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
