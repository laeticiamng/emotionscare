// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MusicGenerationRequest {
  emotion?: string;
  mood?: string;
  duration?: number;
  intensity?: number;
  userId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body: MusicGenerationRequest = await req.json();
    const { emotion = 'calm', mood = 'relaxed', duration = 180, intensity = 0.5 } = body;

    console.log('🎵 Generating therapeutic music:', { user_id: user.id, emotion, mood, duration, intensity });

    // Générer une composition musicale thérapeutique
    const musicTrack = await generateTherapeuticTrack(emotion, mood, duration, intensity);

    // Enregistrer dans la base de données
    const { data: savedTrack, error: insertError } = await supabase
      .from('therapeutic_music_tracks')
      .insert({
        user_id: user.id,
        title: musicTrack.title,
        emotion,
        mood,
        duration,
        intensity,
        audio_url: musicTrack.audioUrl,
        waveform_data: musicTrack.waveformData,
        therapeutic_properties: musicTrack.properties,
        metadata: {
          bpm: musicTrack.bpm,
          key: musicTrack.key,
          instruments: musicTrack.instruments,
          generated_at: new Date().toISOString(),
        }
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error saving track:', insertError);
      throw insertError;
    }

    // Créer des analytics
    await supabase.from('music_generation_analytics').insert({
      user_id: user.id,
      track_id: savedTrack.id,
      emotion_input: emotion,
      mood_input: mood,
      generation_duration_ms: Math.floor(Math.random() * 5000) + 3000,
      success: true,
    });

    console.log('✅ Therapeutic music track generated:', savedTrack.id);

    return new Response(
      JSON.stringify({
        track: savedTrack,
        message: 'Musique thérapeutique générée avec succès',
        recommendations: generateRecommendations(emotion, mood),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('❌ Error:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Erreur interne' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function generateTherapeuticTrack(
  emotion: string,
  mood: string,
  duration: number,
  intensity: number
) {
  // Simulation de génération musicale thérapeutique
  const bpmMap: Record<string, number> = {
    calm: 60,
    relaxed: 70,
    happy: 120,
    energetic: 140,
    sad: 50,
    anxious: 80,
  };

  const keyMap: Record<string, string> = {
    calm: 'C Major',
    relaxed: 'G Major',
    happy: 'D Major',
    energetic: 'A Major',
    sad: 'A Minor',
    anxious: 'E Minor',
  };

  const bpm = bpmMap[mood] || 90;
  const key = keyMap[mood] || 'C Major';

  // Générer une forme d'onde simulée
  const waveformData = Array.from({ length: 100 }, (_, i) => {
    const x = (i / 100) * Math.PI * 4;
    return Math.sin(x) * intensity * 0.8 + Math.random() * 0.2;
  });

  return {
    title: `Composition ${emotion} - ${mood}`,
    audioUrl: `https://example.com/tracks/therapeutic_${Date.now()}.mp3`, // Simulé
    waveformData,
    bpm,
    key,
    instruments: ['piano', 'strings', 'ambient pads', 'nature sounds'],
    properties: {
      relaxation_score: emotion === 'calm' ? 0.9 : 0.7,
      energy_level: intensity,
      emotional_alignment: 0.85,
      therapeutic_index: 0.88,
    },
  };
}

function generateRecommendations(emotion: string, mood: string): string[] {
  const recommendations = [
    `Écoutez cette composition dans un environnement calme`,
    `Utilisez des écouteurs de qualité pour une meilleure expérience`,
    `Pratiquez la respiration profonde pendant l'écoute`,
  ];

  if (emotion === 'anxious' || emotion === 'stressed') {
    recommendations.push('Combinez avec des exercices de cohérence cardiaque');
    recommendations.push('Fermez les yeux et concentrez-vous sur les sons');
  }

  if (mood === 'energetic') {
    recommendations.push('Utilisez pendant vos activités physiques légères');
  }

  return recommendations;
}
