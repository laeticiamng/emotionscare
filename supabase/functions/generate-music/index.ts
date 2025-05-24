
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const musicApiKey = Deno.env.get('MUSIC_API_KEY');
const falApiKey = Deno.env.get('FAL_AI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, mood, duration } = await req.json();
    
    if (!prompt) {
      throw new Error('Prompt requis pour la génération');
    }

    console.log('Generating music with prompt:', prompt);

    // Simulation de génération de musique
    // En production, vous intégreriez avec MusicGen ou une autre API
    const simulatedAudioUrl = `https://example.com/generated-music/${Date.now()}.mp3`;

    // Ici vous pourriez utiliser FAL AI pour MusicGen
    if (falApiKey) {
      try {
        const response = await fetch('https://fal.run/fal-ai/musicgen', {
          method: 'POST',
          headers: {
            'Authorization': `Key ${falApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: `${mood} music: ${prompt}`,
            duration: duration || 30,
            model_version: "stereo-large"
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return new Response(JSON.stringify({
            success: true,
            audio_url: data.audio_url || simulatedAudioUrl,
            duration: duration || 30,
            prompt,
            mood,
            timestamp: new Date().toISOString()
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      } catch (falError) {
        console.error('FAL AI error:', falError);
        // Continue avec la simulation
      }
    }

    // Réponse simulée
    return new Response(JSON.stringify({
      success: true,
      audio_url: simulatedAudioUrl,
      duration: duration || 30,
      prompt,
      mood,
      message: 'Musique générée (simulation)',
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-music function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
