// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mapping émotionnel simple
const EMOTION_MAPPING = {
  valence: {
    high: { style: 'uplifting, cheerful, positive', mood: 'happy' },
    low: { style: 'melancholic, emotional, soft', mood: 'sad' }
  },
  arousal: {
    high: { energy: 'energetic, dynamic', intensity: 0.8 },
    low: { energy: 'calm, peaceful', intensity: 0.3 }
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1) Authentifier l'utilisateur
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const anonClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } }
    );

    const { data: authData, error: authError } = await anonClient.auth.getUser();
    if (authError || !authData?.user) {
      console.error('Authentication failed:', authError);
      throw new Error('Unauthorized');
    }

    const userId = authData.user.id;
    console.log('🎵 Generating emotion music for user:', userId);

    const { emotionState, userContext } = await req.json();
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const SUNO_API_KEY = Deno.env.get('SUNO_API_KEY');
    
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }
    
    if (!SUNO_API_KEY) {
      throw new Error('SUNO_API_KEY not configured');
    }

    console.log('🎵 Génération musique émotionnelle:', emotionState);

    // Étape 1: Analyser l'émotion avec OpenAI
    const systemPrompt = `Tu es un expert en musicothérapie qui analyse l'état émotionnel et recommande des paramètres musicaux optimaux.
Réponds UNIQUEMENT avec un objet JSON contenant:
{
  "musicStyle": "style musical détaillé",
  "title": "titre évocateur",
  "prompt": "description de l'ambiance",
  "instrumental": true/false,
  "model": "V4",
  "intensity": nombre entre 0 et 1
}`;

    const userPrompt = `État émotionnel: valence=${emotionState.valence}, arousal=${emotionState.arousal}, émotion=${emotionState.dominantEmotion || 'non spécifiée'}
Contexte: ${userContext?.userInput || 'Besoin de musique adaptée'}

Recommande les meilleurs paramètres musicaux pour apaiser et accompagner cette personne.`;

    console.log('📝 Appel OpenAI pour orchestration...');
    
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text();
      console.error('❌ OpenAI error:', error);
      throw new Error(`OpenAI error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    const musicParams = JSON.parse(openaiData.choices[0].message.content);
    
    console.log('✅ Paramètres musicaux générés:', musicParams);

    // Étape 2: Générer la musique avec Suno (V3_5 = plus rapide ~30-40s preview)
    console.log('🎵 Appel Suno API pour génération...');
    
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    // Suno envoie task_id dans le POST body (pas de placeholder requis dans URL)
    const callBackUrl = `${SUPABASE_URL}/functions/v1/emotion-music-callback`;
    
    console.log('📍 Callback URL configured:', callBackUrl);
    
    const sunoResponse = await fetch('https://api.sunoapi.org/api/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUNO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customMode: false,
        instrumental: musicParams.instrumental !== false,
        model: 'V3_5', // V3_5 plus rapide que V4/V4_5 (~30-40s preview au lieu de >4min)
        prompt: musicParams.prompt || 'calming therapeutic music',
        style: musicParams.musicStyle || 'ambient, peaceful',
        title: musicParams.title || 'Therapeutic Music',
        callBackUrl: callBackUrl
      }),
    });

    if (!sunoResponse.ok) {
      const error = await sunoResponse.text();
      console.error('❌ Suno error:', error);
      throw new Error(`Suno error: ${sunoResponse.status}`);
    }

    const sunoData = await sunoResponse.json();
    console.log('✅ Suno response:', sunoData);

    if (sunoData.code !== 200 || !sunoData.data?.taskId) {
      throw new Error(sunoData.msg || 'Failed to start generation');
    }

    const sunoTaskId = sunoData.data.taskId;
    console.log('🎵 Generation started with taskId:', sunoTaskId);

    // Étape 3: Créer le mapping user ↔ taskId dans emotion_generations
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: genError } = await adminClient
      .from('emotion_generations')
      .upsert({
        task_id: sunoTaskId,
        user_id: userId,
        prompt: musicParams.prompt,
        status: 'creating',
        metadata: {
          emotion_state: emotionState,
          style: musicParams.musicStyle,
          model: 'V3_5'
        }
      });

    if (genError) {
      console.error('⚠️ Failed to create emotion_generation:', genError);
      // Non-bloquant, on continue
    } else {
      console.log('✅ Created emotion_generation mapping for:', sunoTaskId);
    }

    // Retourner le sunoTaskId (le vrai taskId de Suno)
    return new Response(
      JSON.stringify({
        taskId: sunoTaskId,
        musicParams,
        emotionBadge: getEmotionBadge(emotionState),
        estimatedDuration: 120
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        hint: error.message.includes('not configured') 
          ? 'Veuillez configurer les clés API dans Supabase Edge Functions secrets'
          : undefined
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function getEmotionBadge(emotionState: any): string {
  const { valence, arousal } = emotionState;
  
  if (valence > 0.6 && arousal < 0.4) {
    return "État serein et apaisé";
  } else if (valence > 0.6 && arousal > 0.6) {
    return "Énergie positive et dynamique";
  } else if (valence < 0.4 && arousal < 0.4) {
    return "Calme intérieur recherché";
  } else if (valence < 0.4 && arousal > 0.6) {
    return "Moment de tension détecté";
  } else {
    return "Équilibre émotionnel stable";
  }
}
