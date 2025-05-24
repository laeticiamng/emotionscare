
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emotion, mood } = await req.json();
    const musicApiKey = Deno.env.get('MUSIC_API_KEY');

    // Mapper les émotions vers des styles musicaux
    const emotionToStyle = {
      'joie': 'upbeat, happy, energetic',
      'tristesse': 'melancholic, slow, ambient',
      'colère': 'intense, rock, powerful',
      'peur': 'dark, atmospheric, suspenseful',
      'surprise': 'dynamic, unexpected, varied',
      'neutre': 'calm, peaceful, relaxing'
    };

    const style = emotionToStyle[emotion] || 'calm, peaceful';
    const prompt = `Create a ${style} instrumental music track for emotional well-being`;

    // Simulation de génération musicale
    // En production, on utiliserait une vraie API comme MusicGen
    const generatedTrack = {
      id: `track_${Date.now()}`,
      title: `Musique pour ${emotion}`,
      audioUrl: `https://example.com/generated/${Date.now()}.mp3`,
      duration: 120 + Math.floor(Math.random() * 180), // 2-5 minutes
      emotion,
      mood
    };

    return new Response(JSON.stringify(generatedTrack), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-music:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
