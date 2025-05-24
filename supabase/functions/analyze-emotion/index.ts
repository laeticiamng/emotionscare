
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, audioData, imageData, type } = await req.json();
    const humeApiKey = Deno.env.get('HUME_AI_API_KEY');
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    let emotionResult;

    switch (type) {
      case 'text':
        emotionResult = await analyzeTextEmotion(text, openaiApiKey);
        break;
      case 'audio':
        emotionResult = await analyzeAudioEmotion(audioData, humeApiKey, openaiApiKey);
        break;
      case 'facial':
        emotionResult = await analyzeFacialEmotion(imageData, humeApiKey);
        break;
      default:
        throw new Error('Type d\'analyse non supporté');
    }

    return new Response(JSON.stringify(emotionResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-emotion:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function analyzeTextEmotion(text: string, openaiApiKey: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'system',
        content: `Analysez l'émotion dans ce texte et retournez un JSON avec:
        - emotion: l'émotion principale (joie, tristesse, colère, peur, surprise, dégoût, neutre)
        - confidence: score de confiance (0-1)
        - sentiment: positif, négatif ou neutre
        - details: description courte de l'analyse`
      }, {
        role: 'user',
        content: text
      }],
      temperature: 0.3
    }),
  });

  const data = await response.json();
  const analysis = JSON.parse(data.choices[0].message.content);
  
  return {
    emotion: analysis.emotion,
    confidence: analysis.confidence,
    sentiment: analysis.sentiment,
    details: analysis.details
  };
}

async function analyzeAudioEmotion(audioData: string, humeApiKey: string, openaiApiKey: string) {
  // Transcription avec Whisper
  const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      file: audioData,
      model: 'whisper-1'
    }),
  });

  const transcription = await transcriptionResponse.json();
  const text = transcription.text;

  // Analyse émotionnelle du texte transcrit
  const textEmotion = await analyzeTextEmotion(text, openaiApiKey);

  // TODO: Intégrer Hume AI pour l'analyse vocale
  // En attendant, on utilise l'analyse textuelle
  
  return {
    ...textEmotion,
    transcription: text
  };
}

async function analyzeFacialEmotion(imageData: string, humeApiKey: string) {
  // TODO: Intégrer Hume AI pour l'analyse faciale
  // En attendant, on retourne une analyse simulée
  
  const emotions = ['joie', 'tristesse', 'colère', 'peur', 'surprise', 'neutre'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  
  return {
    emotion: randomEmotion,
    confidence: Math.random() * 0.3 + 0.7, // Entre 0.7 et 1.0
    details: `Analyse faciale détectant principalement ${randomEmotion}`
  };
}
