// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const sunoApiKey = Deno.env.get('SUNO_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fonction pour attendre le résultat de la génération
async function waitForGeneration(taskId: string, maxAttempts = 60): Promise<any> {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(`https://api.sunoapi.org/api/v1/generate/record-info?taskId=${taskId}`, {
      headers: {
        'Authorization': `Bearer ${sunoApiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to check status: ${response.status}`);
    }

    const result = await response.json();
    console.log(`🔄 Tentative ${i + 1}: Status = ${result.data?.status}`);

    if (result.code === 200 && result.data?.status === 'SUCCESS' && result.data?.response?.sunoData?.length > 0) {
      return result.data.response.sunoData[0];
    }

    if (result.data?.status === 'ERROR') {
      throw new Error(result.data.errorMessage || 'Generation failed');
    }

    // Attendre 3 secondes avant le prochain essai
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  throw new Error('Generation timeout - music not ready after 3 minutes');
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emotion, mood, intensity, style, lyrics } = await req.json();

    if (!sunoApiKey) {
      throw new Error('SUNO_API_KEY not configured - please add it in Supabase Edge Function secrets');
    }

    console.log('🎵 Génération SUNO via API officielle:', { emotion, mood, intensity, style });

    // Construire le style musical basé sur l'émotion
    const emotionStyles = {
      calm: 'ambient, peaceful, meditative',
      happy: 'uplifting, cheerful, positive',
      sad: 'melancholic, emotional, soft',
      anxious: 'calming, soothing, gentle',
      focused: 'minimal, concentration, steady',
      energetic: 'upbeat, dynamic, motivating',
      relaxed: 'chill, smooth, tranquil'
    };

    const musicStyle = style || emotionStyles[emotion?.toLowerCase()] || 'therapeutic, ambient';
    const title = `${emotion || 'Therapeutic'} Music - ${mood || 'Wellness'}`;
    
    // Ajuster selon l'intensité
    const intensityDescriptors = {
      low: 'gentle and soft',
      medium: 'balanced and moderate',
      high: 'energetic and powerful'
    };
    const intensityLevel = intensity < 0.3 ? 'low' : intensity > 0.7 ? 'high' : 'medium';
    const intensityDesc = intensityDescriptors[intensityLevel];

    // Construire le prompt pour les paroles (si demandées)
    const finalPrompt = lyrics || `${intensityDesc} instrumental music`;

    console.log('📝 Paramètres finaux:', { musicStyle, title, finalPrompt, instrumental: !lyrics });

    // Étape 1: Lancer la génération
    const generateResponse = await fetch('https://api.sunoapi.org/api/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sunoApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customMode: true,
        instrumental: !lyrics,
        model: 'V4',
        prompt: finalPrompt,
        style: musicStyle,
        title: title,
      }),
    });

    if (!generateResponse.ok) {
      const errorText = await generateResponse.text();
      console.error('❌ Erreur API Suno:', errorText);
      throw new Error(`Suno API error: ${generateResponse.status} - ${errorText}`);
    }

    const generateData = await generateResponse.json();
    console.log('✅ Génération lancée:', generateData);

    if (generateData.code !== 200 || !generateData.data?.taskId) {
      throw new Error(generateData.msg || 'Failed to start generation');
    }

    const taskId = generateData.data.taskId;
    console.log('⏳ En attente de la génération, taskId:', taskId);

    // Étape 2: Attendre que la musique soit générée
    const sunoData = await waitForGeneration(taskId);
    console.log('🎉 Musique générée avec succès:', sunoData);

    // Étape 3: Transformer la réponse au format attendu
    const track = {
      id: sunoData.id || crypto.randomUUID(),
      title: sunoData.title || title,
      artist: 'Suno AI',
      url: sunoData.audioUrl,
      audioUrl: sunoData.audioUrl,
      streamUrl: sunoData.streamAudioUrl,
      duration: sunoData.duration || 180,
      emotion: emotion,
      mood: mood,
      coverUrl: sunoData.imageUrl,
      tags: musicStyle,
      taskId: taskId,
      isGenerated: true,
      generatedAt: new Date().toISOString()
    };

    return new Response(JSON.stringify(track), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Erreur SUNO:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Erreur lors de la génération musicale SUNO',
      details: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});