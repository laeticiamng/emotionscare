
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    let analysisData;
    const contentType = req.headers.get('content-type');

    if (contentType?.includes('multipart/form-data')) {
      // Audio analysis
      const formData = await req.formData();
      const audioFile = formData.get('audio') as File;
      const method = formData.get('method') as string;

      if (!audioFile) {
        throw new Error('No audio file provided');
      }

      // Convert audio to text using OpenAI Whisper
      const whisperFormData = new FormData();
      whisperFormData.append('file', audioFile);
      whisperFormData.append('model', 'whisper-1');

      const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: whisperFormData,
      });

      const whisperData = await whisperResponse.json();
      const transcribedText = whisperData.text;

      analysisData = { text: transcribedText, method: 'audio' };
    } else {
      // Text analysis
      analysisData = await req.json();
    }

    // Analyze emotion using OpenAI GPT
    const emotionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Tu es un psychologue expert en analyse émotionnelle. Analyse le texte suivant et retourne une réponse JSON avec:
            - score: nombre entre 0-100 (bien-être émotionnel)
            - primaryEmotion: émotion principale (joie, tristesse, colère, peur, surprise, dégoût, neutre)
            - secondaryEmotions: array d'émotions secondaires
            - stressLevel: 'low', 'medium', ou 'high'
            - aiFeedback: analyse détaillée et bienveillante (2-3 phrases)
            - recommendations: array de 2-3 recommandations concrètes
            - immediateActions: array de 2 actions immédiates
            Réponds uniquement en JSON valide, en français.`
          },
          {
            role: 'user',
            content: `Analyse ce texte: "${analysisData.text}"`
          }
        ],
        temperature: 0.7,
      }),
    });

    const emotionData = await emotionResponse.json();
    const analysis = JSON.parse(emotionData.choices[0].message.content);

    // Add metadata
    const result = {
      ...analysis,
      timestamp: new Date(),
      method: analysisData.method || 'text',
      rawData: {
        text: analysisData.text
      }
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Emotion analysis error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erreur lors de l\'analyse émotionnelle',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
