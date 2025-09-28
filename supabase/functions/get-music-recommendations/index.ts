import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { supabase } from "../_shared/supa_client.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emotion } = await req.json();
    
    if (!emotion) {
      throw new Error('Emotion parameter is required');
    }

    // Récupérer les recommandations basées sur l'émotion depuis la base de données
    const { data: recommendations, error } = await supabase
      .from('music_tracks')
      .select('*')
      .eq('emotion', emotion.toLowerCase())
      .limit(10);

    if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist
      throw error;
    }

    // Si pas de données en base, retourner des recommandations par défaut
    const defaultTracks = {
      calm: [
        {
          id: 'calm_1',
          title: 'Méditation Océanique',
          artist: 'EmotionsCare Therapeutics',
          url: 'https://example.com/calm1.mp3',
          duration: 180,
          emotion: 'calm',
          genre: 'ambient'
        },
        {
          id: 'calm_2',
          title: 'Respiration Profonde',
          artist: 'Wellness Sounds',
          url: 'https://example.com/calm2.mp3',
          duration: 240,
          emotion: 'calm',
          genre: 'meditation'
        }
      ],
      happy: [
        {
          id: 'happy_1',
          title: 'Énergie Positive',
          artist: 'Joy Collective',
          url: 'https://example.com/happy1.mp3',
          duration: 200,
          emotion: 'happy',
          genre: 'upbeat'
        }
      ],
      sad: [
        {
          id: 'sad_1',
          title: 'Consolation Douce',
          artist: 'Emotional Healing',
          url: 'https://example.com/sad1.mp3',
          duration: 220,
          emotion: 'sad',
          genre: 'melancholic'
        }
      ],
      anxious: [
        {
          id: 'anxious_1',
          title: 'Anti-Stress Naturel',
          artist: 'Calm Mind Studio',
          url: 'https://example.com/anxious1.mp3',
          duration: 300,
          emotion: 'anxious',
          genre: 'therapeutic'
        }
      ],
      focused: [
        {
          id: 'focused_1',
          title: 'Concentration Pure',
          artist: 'Focus Lab',
          url: 'https://example.com/focused1.mp3',
          duration: 600,
          emotion: 'focused',
          genre: 'ambient'
        }
      ]
    };

    const tracks = recommendations && recommendations.length > 0 
      ? recommendations 
      : defaultTracks[emotion.toLowerCase()] || defaultTracks.calm;

    return new Response(JSON.stringify({
      success: true,
      tracks,
      emotion,
      count: tracks.length,
      source: recommendations && recommendations.length > 0 ? 'database' : 'default'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in get-music-recommendations function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      tracks: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});