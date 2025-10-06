// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    
    console.log('🎵 Emotion music callback received:', {
      stage: payload.stage,
      hasStream: !!payload.streamUrl,
      hasFinal: !!payload.downloadUrl,
      taskId: payload.taskId
    });

    // Extraire le taskId depuis l'URL ou le payload
    const url = new URL(req.url);
    const taskId = url.searchParams.get('taskId') || payload.taskId;

    if (!taskId) {
      console.error('❌ No taskId in callback');
      return new Response(
        JSON.stringify({ error: 'taskId required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    // Importer le client Supabase
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.39.7');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Déterminer le type de callback
    let callbackType = 'unknown';
    if (payload.stage === 'text') {
      callbackType = 'text';
    } else if (payload.stage === 'first' || payload.streamUrl) {
      callbackType = 'first';
    } else if (payload.stage === 'complete' || payload.downloadUrl) {
      callbackType = 'complete';
    }

    // Stocker le callback en DB
    const callbackRecord = {
      task_id: taskId,
      callback_type: callbackType,
      status: 'success',
      metadata: {
        stage: payload.stage,
        stream_url: payload.streamUrl || null,
        audio_url: payload.downloadUrl || null,
        duration: payload.duration || null,
        title: payload.title || null,
        style: payload.style || null,
        received_at: new Date().toISOString()
      }
    };

    const { error: dbError } = await supabase
      .from('suno_callbacks')
      .insert(callbackRecord);

    if (dbError) {
      console.error('❌ Database error:', dbError);
    } else {
      console.log('✅ Callback stored:', callbackType);
    }

    return new Response(
      JSON.stringify({ ok: true, received: true, callbackType }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Callback error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
