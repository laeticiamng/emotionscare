import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fonction pour traiter l'audio base64 par chunks
function processBase64Chunks(base64String: string, chunkSize = 32768) {
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

interface AnalysisRequest {
  audioData: string;
  userId: string;
  analysisType: 'emotion' | 'stress' | 'mood' | 'full';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { audioData, userId, analysisType = 'full' }: AnalysisRequest = await req.json();
    
    console.log('🎤 Analyse vocale émotionnelle demandée:', { userId, analysisType });

    if (!audioData) {
      throw new Error('Données audio manquantes');
    }

    // Traitement de l'audio par chunks pour éviter les problèmes de mémoire
    const binaryAudio = processBase64Chunks(audioData);
    console.log('📊 Audio traité, taille:', binaryAudio.length, 'bytes');

    // Transcription avec OpenAI Whisper
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY non configurée');
    }

    const formData = new FormData();
    const blob = new Blob([binaryAudio], { type: 'audio/webm' });
    formData.append('file', blob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'fr');

    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!transcriptionResponse.ok) {
      throw new Error(`Erreur transcription: ${await transcriptionResponse.text()}`);
    }

    const transcriptionData = await transcriptionResponse.json();
    const transcription = transcriptionData.text;
    console.log('📝 Transcription:', transcription);

    // Analyse émotionnelle avec Hume AI
    const HUME_API_KEY = Deno.env.get('HUME_API_KEY');
    let humeAnalysis = null;
    
    if (HUME_API_KEY) {
      try {
        const humeFormData = new FormData();
        humeFormData.append('file', blob, 'audio.webm');
        humeFormData.append('models', 'speech');

        const humeResponse = await fetch('https://api.hume.ai/v0/batch/jobs', {
          method: 'POST',
          headers: {
            'X-Hume-Api-Key': HUME_API_KEY,
          },
          body: humeFormData,
        });

        if (humeResponse.ok) {
          humeAnalysis = await humeResponse.json();
          console.log('🎯 Analyse Hume AI initiée:', humeAnalysis.job_id);
        }
      } catch (humeError) {
        console.warn('⚠️ Erreur Hume AI:', humeError.message);
      }
    }

    // Analyse émotionnelle textuelle avec OpenAI
    const emotionAnalysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Tu es un psychologue spécialisé dans l'analyse émotionnelle. Analyse le texte suivant et fournis:
1. Les émotions principales détectées (joie, tristesse, colère, peur, surprise, dégoût, neutre)
2. Le niveau de stress (1-10)
3. Le ton général (positif, négatif, neutre)
4. Des recommandations thérapeutiques appropriées
5. Un score de bien-être global (1-100)

Réponds en JSON avec cette structure:
{
  "emotions": {"joie": 0.2, "tristesse": 0.1, ...},
  "stress_level": 3,
  "tone": "positif",
  "wellness_score": 75,
  "recommendations": ["recommandation1", "recommandation2"],
  "summary": "résumé de l'analyse"
}`
          },
          {
            role: 'user',
            content: `Analyse cette transcription vocale: "${transcription}"`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      }),
    });

    if (!emotionAnalysisResponse.ok) {
      throw new Error(`Erreur analyse émotionnelle: ${await emotionAnalysisResponse.text()}`);
    }

    const emotionData = await emotionAnalysisResponse.json();
    let emotionAnalysis;
    
    try {
      emotionAnalysis = JSON.parse(emotionData.choices[0].message.content);
    } catch (parseError) {
      console.warn('⚠️ Erreur parsing JSON, utilisation du texte brut');
      emotionAnalysis = {
        summary: emotionData.choices[0].message.content,
        emotions: { neutre: 0.5 },
        stress_level: 5,
        tone: 'neutre',
        wellness_score: 50,
        recommendations: ['Continuer le suivi émotionnel régulier']
      };
    }

    console.log('🧠 Analyse émotionnelle complétée:', emotionAnalysis);

    // Enregistrement dans la base de données
    const analysisRecord = {
      user_id: userId,
      transcription,
      emotion_analysis: emotionAnalysis,
      hume_job_id: humeAnalysis?.job_id || null,
      analysis_type: analysisType,
      audio_duration: Math.floor(binaryAudio.length / 16000), // estimation basée sur 16kHz
      created_at: new Date().toISOString()
    };

    const { data: emotionRecord, error: emotionError } = await supabase
      .from('emotions')
      .insert({
        user_id: userId,
        text: transcription,
        ai_feedback: emotionAnalysis.summary,
        score: emotionAnalysis.wellness_score,
        emojis: Object.keys(emotionAnalysis.emotions || {}).slice(0, 3).join('😊😢😠'),
        date: new Date().toISOString()
      })
      .select()
      .single();

    if (emotionError) {
      console.error('❌ Erreur insertion emotion:', emotionError);
      throw emotionError;
    }

    console.log('✅ Analyse vocale sauvegardée:', emotionRecord.id);

    return new Response(JSON.stringify({
      success: true,
      analysis: {
        id: emotionRecord.id,
        transcription,
        emotions: emotionAnalysis.emotions,
        stress_level: emotionAnalysis.stress_level,
        tone: emotionAnalysis.tone,
        wellness_score: emotionAnalysis.wellness_score,
        recommendations: emotionAnalysis.recommendations,
        summary: emotionAnalysis.summary,
        hume_job_id: humeAnalysis?.job_id
      },
      message: 'Analyse vocale émotionnelle complétée avec succès'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Erreur dans voice-analysis:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Erreur lors de l\'analyse vocale émotionnelle'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});