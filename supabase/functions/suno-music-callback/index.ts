// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Idempotence tracking
const processedCallbacks = new Set<string>();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { data } = await req.json();
    
    if (!data?.task_id) {
      console.error('❌ Missing task_id in callback');
      return new Response('Bad Request', { status: 400, headers: corsHeaders });
    }

    // Idempotence check
    if (processedCallbacks.has(data.task_id)) {
      console.log('⏭️ Callback already processed:', data.task_id);
      return new Response('OK', { status: 200, headers: corsHeaders });
    }

    console.log('🎵 Suno callback received:', {
      taskId: data.task_id,
      type: data.callbackType,
      status: data.status
    });

    // Marquer comme traité
    processedCallbacks.add(data.task_id);

    // Types de callbacks:
    // - "text": transcription du texte (si applicable)
    // - "first": premier stream disponible
    // - "complete": génération terminée, audio_url disponible
    // - "error": erreur de génération

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Stocker les métadonnées minimales (pas l'audio brut)
    const callbackData = {
      task_id: data.task_id,
      callback_type: data.callbackType,
      status: data.status,
      metadata: {
        title: data.title,
        style: data.style,
        model: data.model,
        duration: data.duration,
        has_stream: !!data.stream_url,
        has_audio: !!data.audio_url,
      },
      created_at: new Date().toISOString()
    };

    // Note: Selon RGPD, on ne stocke PAS l'audio brut par défaut
    // Les URLs audio doivent être téléchargées rapidement car elles peuvent expirer

    const { error: dbError } = await supabase
      .from('suno_callbacks')
      .insert(callbackData);

    if (dbError) {
      console.error('❌ Database error:', dbError);
    } else {
      console.log('✅ Callback stored');
    }

    // Répondre rapidement (< 15s requis par Suno)
    return new Response('OK', { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error('❌ Error processing callback:', error);
    return new Response('Internal Server Error', { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});
