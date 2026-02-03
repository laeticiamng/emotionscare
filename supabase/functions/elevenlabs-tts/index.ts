// @ts-nocheck
/**
 * ElevenLabs Text-to-Speech Edge Function
 * Voix ultra-réalistes pour le coach émotionnel et les méditations guidées
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TTSRequest {
  text: string;
  voice_id?: string;
  model_id?: string;
  voice_settings?: {
    stability?: number;
    similarity_boost?: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}

// Voix optimisées pour le bien-être émotionnel
const WELLNESS_VOICES = {
  // Voix calmes et apaisantes
  calm_female: 'EXAVITQu4vr4xnSDxMaL', // Sarah - Douce et rassurante
  calm_male: 'VR6AewLTigWG4xSOukaG', // Arnold - Profond et apaisant
  
  // Voix énergiques pour la motivation
  energetic_female: 'jBpfuIE2acCO8z3wKNLl', // Gigi - Dynamique
  energetic_male: 'TxGEqnHWrfWFTfGW9XjX', // Josh - Motivant
  
  // Voix neutres pour les instructions
  neutral_female: 'MF3mGyEYCl7XYWbV9V6O', // Emily - Claire
  neutral_male: 'yoZ06aMxZJJ28mfd3POQ', // Sam - Professionnel
  
  // Voix spéciales thérapeutiques
  meditation: 'pNInz6obpgDQGcFmaJgB', // Adam - Méditation profonde
  breathing: 'ErXwobaYiN019PkySvjV', // Antoni - Exercices de respiration
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY is not configured');
    }

    const { text, voice_id, model_id, voice_settings }: TTSRequest = await req.json();

    if (!text || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Limite de 5000 caractères par requête
    if (text.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Text exceeds 5000 character limit' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const selectedVoice = voice_id || WELLNESS_VOICES.calm_female;
    const selectedModel = model_id || 'eleven_multilingual_v2'; // Meilleur pour le français

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: selectedModel,
          voice_settings: voice_settings || {
            stability: 0.75, // Voix stable pour le bien-être
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    
    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('ElevenLabs TTS error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
