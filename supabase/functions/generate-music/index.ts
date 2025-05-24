
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, emotion, duration = 60 } = await req.json();

    // Simulation de la génération de musique
    // En production, vous intégreriez une vraie API de génération musicale
    const musicResponse = {
      title: `Musique ${emotion || 'personnalisée'} - ${prompt.slice(0, 30)}...`,
      audioUrl: `/audio/generated-${Date.now()}.mp3`,
      duration: duration,
      emotion: emotion,
      description: prompt,
      generated_at: new Date().toISOString()
    };

    // Simuler un délai de génération
    await new Promise(resolve => setTimeout(resolve, 2000));

    return new Response(
      JSON.stringify(musicResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-music function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
