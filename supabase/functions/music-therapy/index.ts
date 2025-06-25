
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { authorizeRole } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user', 'b2b_admin', 'admin']);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { mood, duration = 300, genre = 'ambient', intensity = 50 } = await req.json();
    const musicApiKey = Deno.env.get('MUSIC_API_KEY');

    if (!musicApiKey) {
      // Simulation de génération musicale
      const mockTherapy = {
        sessionId: `therapy_${Date.now()}`,
        tracks: [
          {
            id: 1,
            title: `Thérapie ${mood} - Piste 1`,
            duration: duration / 3,
            audioUrl: `/audio/therapy-${mood}-1.mp3`,
            waveform: Array.from({length: 100}, () => Math.random() * 100)
          },
          {
            id: 2,
            title: `Thérapie ${mood} - Piste 2`,
            duration: duration / 3,
            audioUrl: `/audio/therapy-${mood}-2.mp3`,
            waveform: Array.from({length: 100}, () => Math.random() * 100)
          },
          {
            id: 3,
            title: `Thérapie ${mood} - Piste 3`,
            duration: duration / 3,
            audioUrl: `/audio/therapy-${mood}-3.mp3`,
            waveform: Array.from({length: 100}, () => Math.random() * 100)
          }
        ],
        settings: {
          mood,
          genre,
          intensity,
          crossfade: true,
          adaptiveVolume: true
        },
        benefits: [
          "Réduction du stress",
          "Amélioration de l'humeur",
          "Relaxation profonde"
        ]
      };

      return new Response(JSON.stringify({
        success: true,
        therapy: mockTherapy,
        source: 'simulation'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Ici vous intégreriez la vraie API MusicGen
    const therapy = {
      sessionId: `therapy_${Date.now()}`,
      tracks: [
        {
          id: 1,
          title: `Thérapie personnalisée`,
          duration: duration,
          audioUrl: `/audio/generated-therapy-${Date.now()}.mp3`,
          waveform: Array.from({length: 100}, () => Math.random() * 100)
        }
      ],
      settings: { mood, genre, intensity, crossfade: true, adaptiveVolume: true },
      benefits: ["Bien-être personnalisé", "Harmonie émotionnelle"]
    };

    return new Response(JSON.stringify({
      success: true,
      therapy,
      source: 'musicgen'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in music-therapy function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
