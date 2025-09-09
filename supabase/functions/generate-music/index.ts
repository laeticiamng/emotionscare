
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { emotion, mood } = await req.json()
    const sunoApiKey = Deno.env.get('SUNO_API_KEY');
    
    if (!sunoApiKey) {
      throw new Error('SUNO_API_KEY not configured');
    }

    // Créer un prompt spécifique à l'émotion
    const emotionPrompts = {
      calm: 'Musique ambient douce et apaisante, sons de la nature, fréquences relaxantes',
      happy: 'Mélodie joyeuse et énergique, rythme positif, instruments lumineux',
      sad: 'Musique mélancolique et contemplative, piano doux, cordes émotionnelles',
      anxious: 'Sons apaisants anti-stress, battements binauraux, musique méditative',
      focused: 'Musique de concentration, ambient minimal, rythmes réguliers',
      energetic: 'Musique motivante et dynamique, rythmes énergiques, mélodies stimulantes',
      default: 'Musique thérapeutique équilibrée et harmonieuse'
    };

    const prompt = emotionPrompts[emotion?.toLowerCase()] || emotionPrompts.default;
    const fullPrompt = mood ? `${prompt}, ambiance ${mood}` : prompt;

    console.log('🎵 Génération musique pour:', { emotion, mood, prompt: fullPrompt });

    const response = await fetch('https://api.suno.ai/v1/songs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sunoApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        make_instrumental: true,
        wait_audio: true,
        style: 'therapeutic ambient'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Suno API error:', response.status, errorText);
      throw new Error(`Suno API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Musique générée:', result);
    
    const track = {
      id: result.id || crypto.randomUUID(),
      title: result.title || `Musique thérapeutique - ${emotion}`,
      artist: 'Suno AI',
      url: result.audio_url || result.url,
      audioUrl: result.audio_url || result.url,
      duration: result.duration || 120,
      emotion: emotion || 'calm',
      mood: mood || 'relaxed',
      coverUrl: result.image_url,
      isGenerated: true,
      generatedAt: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(track),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error in generate-music:', error)
    
    // Fallback en cas d'erreur
    const fallbackTrack = {
      id: crypto.randomUUID(),
      title: `Musique thérapeutique - ${emotion || 'Calm'}`,
      artist: 'EmotionsCare',
      audioUrl: '/sounds/ambient-calm.mp3',
      duration: 180,
      emotion: emotion || 'calm',
      mood: mood || 'relaxed',
      isGenerated: false,
      note: 'Mode fallback activé'
    };
    
    return new Response(
      JSON.stringify(fallbackTrack),
      {
        status: 200, // Retourner 200 avec fallback plutôt qu'une erreur
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
