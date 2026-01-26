// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  emotion_tags: string[];
  bpm: number;
  energy_level: number;
  url: string;
}

const MUSIC_LIBRARY: MusicTrack[] = [
  // Calme et relaxation
  { id: '1', title: 'Océan Paisible', artist: 'Nature Sounds', duration: 300, emotion_tags: ['calme', 'paix', 'sérénité'], bpm: 60, energy_level: 2, url: '/music/ocean.mp3' },
  { id: '2', title: 'Méditation Douce', artist: 'Wellness Studio', duration: 420, emotion_tags: ['calme', 'méditation'], bpm: 55, energy_level: 1, url: '/music/meditation.mp3' },
  
  // Joie et énergie
  { id: '3', title: 'Sunshine Morning', artist: 'Happy Vibes', duration: 240, emotion_tags: ['joie', 'énergie', 'positif'], bpm: 120, energy_level: 8, url: '/music/sunshine.mp3' },
  { id: '4', title: 'Célébration', artist: 'Uplifting Beats', duration: 210, emotion_tags: ['joie', 'célébration'], bpm: 128, energy_level: 9, url: '/music/celebration.mp3' },
  
  // Tristesse et réconfort
  { id: '5', title: 'Pluie Douce', artist: 'Ambient Dreams', duration: 360, emotion_tags: ['tristesse', 'réconfort', 'mélancolie'], bpm: 70, energy_level: 3, url: '/music/rain.mp3' },
  { id: '6', title: 'Embrace', artist: 'Healing Harmonies', duration: 300, emotion_tags: ['tristesse', 'réconfort'], bpm: 65, energy_level: 3, url: '/music/embrace.mp3' },
  
  // Stress et apaisement
  { id: '7', title: 'Forêt Zen', artist: 'Nature Therapy', duration: 480, emotion_tags: ['stress', 'anxiété', 'apaisement'], bpm: 58, energy_level: 2, url: '/music/forest.mp3' },
  { id: '8', title: 'Respiration', artist: 'Calm Collective', duration: 360, emotion_tags: ['stress', 'apaisement'], bpm: 60, energy_level: 2, url: '/music/breathing.mp3' },
  
  // Colère et libération
  { id: '9', title: 'Release', artist: 'Catharsis Music', duration: 270, emotion_tags: ['colère', 'libération'], bpm: 100, energy_level: 7, url: '/music/release.mp3' },
  { id: '10', title: 'Transformation', artist: 'Energy Flow', duration: 300, emotion_tags: ['colère', 'transformation'], bpm: 95, energy_level: 6, url: '/music/transformation.mp3' },
  
  // Focus et concentration
  { id: '11', title: 'Deep Focus', artist: 'Study Vibes', duration: 600, emotion_tags: ['focus', 'concentration'], bpm: 75, energy_level: 5, url: '/music/focus.mp3' },
  { id: '12', title: 'Flow State', artist: 'Productivity Sounds', duration: 480, emotion_tags: ['focus', 'productivité'], bpm: 80, energy_level: 5, url: '/music/flow.mp3' },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    // Parse body for POST requests
    let body: any = {};
    if (req.method === 'POST') {
      body = await req.json();
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    const action = body.action;

    // Health check (no auth required)
    if (action === 'health-check') {
      return new Response(JSON.stringify({ 
        success: true, 
        status: 'ok',
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Action: create-playlist - Créer une playlist thérapeutique
    if (action === 'create-playlist') {
      const { emotions, duration, playlist_type } = body;
      const emotionList = emotions || ['calm'];
      
      // Filtrer les tracks par émotions
      let tracks = MUSIC_LIBRARY.filter(track => 
        emotionList.some((e: string) => track.emotion_tags.includes(e.toLowerCase()))
      );
      
      if (tracks.length === 0) {
        tracks = MUSIC_LIBRARY.slice(0, 5);
      }

      // Calculer la durée totale
      const targetDuration = (duration || 30) * 60;
      let totalDuration = 0;
      const selectedTracks: MusicTrack[] = [];
      
      for (const track of tracks) {
        if (totalDuration < targetDuration) {
          selectedTracks.push(track);
          totalDuration += track.duration;
        }
      }

      return new Response(JSON.stringify({
        success: true,
        tracks: selectedTracks,
        title: `Playlist ${emotionList.join(', ')}`,
        description: `Playlist ${playlist_type || 'therapeutic'} générée`,
        total_duration: totalDuration
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Action: transition - Transition émotionnelle
    if (action === 'transition') {
 const { current_emotion, target_emotion } = body;
      
      // Trouver des tracks pour la transition
      const currentTracks = MUSIC_LIBRARY.filter(t => 
        t.emotion_tags.some(tag => tag.includes(current_emotion?.toLowerCase() || 'calm'))
      );
      const targetTracks = MUSIC_LIBRARY.filter(t => 
        t.emotion_tags.some(tag => tag.includes(target_emotion?.toLowerCase() || 'calm'))
      );

      const transitionTracks = [...currentTracks.slice(0, 2), ...targetTracks.slice(0, 3)];

      return new Response(JSON.stringify({
        success: true,
        tracks: transitionTracks,
        transition_tracks: transitionTracks,
        total_duration: transitionTracks.reduce((sum, t) => sum + t.duration, 0),
        transition_steps: [
          `Démarrage avec ${current_emotion || 'neutre'}`,
          'Transition progressive',
          `Arrivée vers ${target_emotion || 'calme'}`
        ]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Action: adapt-session - Adapter une session de musicothérapie
    if (action === 'adapt-session') {
 const { analysis } = body;
      
      // Analyser le parcours émotionnel
      const dominantEmotion = analysis?.currentEmotion || 'calm';
      
      // Recommander des tracks adaptées
      const adaptedTracks = MUSIC_LIBRARY.filter(t => 
        t.emotion_tags.some(tag => tag.includes(dominantEmotion.toLowerCase()))
      ).slice(0, 5);

      return new Response(JSON.stringify({
        success: true,
        adaptedPlaylist: adaptedTracks,
        adaptationReason: `Adaptation basée sur l'émotion ${dominantEmotion}`,
        recommendations: [
          'Continuer avec cette musique apaisante',
          'Ajuster le volume selon votre confort'
        ]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Action: generate-report - Générer un rapport de session
    if (action === 'generate-report') {
 const { sessionId } = body;
      
      return new Response(JSON.stringify({
        success: true,
        report: {
          sessionId,
          summary: 'Session de musicothérapie complétée avec succès',
          emotionalProgress: 'Amélioration notable de l\'état émotionnel',
          effectiveness: 0.8,
          duration: 30,
          tracksPlayed: 5
        },
        recommendations: [
          'Continuez les sessions régulières',
          'Essayez la respiration guidée',
          'Variez les genres musicaux'
        ]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Auth required for other endpoints
    if (!user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /recommendations?emotion=joie&intensity=7
    if (req.method === 'GET' && path === 'recommendations') {
      const emotion = url.searchParams.get('emotion') || 'calme';
      const intensity = parseInt(url.searchParams.get('intensity') || '5');

      let recommendations = MUSIC_LIBRARY.filter(track => 
        track.emotion_tags.includes(emotion.toLowerCase())
      );

      if (recommendations.length === 0) {
        recommendations = MUSIC_LIBRARY.filter(track => {
          if (emotion === 'joie' || emotion === 'bonheur' || emotion === 'happy') {
            return track.energy_level >= 7;
          } else if (emotion === 'tristesse' || emotion === 'mélancolie' || emotion === 'sad') {
            return track.energy_level <= 4;
          } else if (emotion === 'calme' || emotion === 'sérénité' || emotion === 'calm') {
            return track.energy_level <= 3;
          } else if (emotion === 'stress' || emotion === 'anxiété' || emotion === 'anxious') {
            return track.emotion_tags.includes('apaisement');
          }
          return true;
        });
      }

      recommendations.sort((a, b) => {
        const targetEnergy = Math.round(intensity / 10 * 10);
        return Math.abs(a.energy_level - targetEnergy) - Math.abs(b.energy_level - targetEnergy);
      });

      recommendations = recommendations.slice(0, 10);

      return new Response(
        JSON.stringify({ recommendations, emotion, intensity }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /playlists
    if (req.method === 'GET' && path === 'playlists') {
      const { data: playlists, error } = await supabaseClient
        .from('music_playlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({ playlists }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /playlists - Créer une playlist
    if (req.method === 'POST' && path === 'playlists') {
      const { name, description, track_ids } = body;

      const { data: playlist, error } = await supabaseClient
        .from('music_playlists')
        .insert({
          user_id: user.id,
          name,
          description,
          track_ids: track_ids || [],
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ playlist }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /listening-session
    if (req.method === 'POST' && path === 'listening-session') {
      const { track_id, duration_seconds, emotion_before, emotion_after } = body;

      const { data: session, error } = await supabaseClient
        .from('music_listening_sessions')
        .insert({
          user_id: user.id,
          track_id,
          duration_seconds,
          emotion_before,
          emotion_after,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ session }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /stats
    if (req.method === 'GET' && path === 'stats') {
      const { data: sessions, error } = await supabaseClient
        .from('music_listening_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const totalSessions = sessions.length;
      const totalMinutes = Math.round(
        sessions.reduce((sum: number, s: any) => sum + (s.duration_seconds || 0), 0) / 60
      );

      const emotionCounts: Record<string, number> = {};
      sessions.forEach((s: any) => {
        if (s.emotion_before) {
          emotionCounts[s.emotion_before] = (emotionCounts[s.emotion_before] || 0) + 1;
        }
      });

      const topEmotions = Object.entries(emotionCounts)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([emotion, count]) => ({ emotion, count }));

      const improvementSessions = sessions.filter((s: any) => s.emotion_before && s.emotion_after);
      const averageImprovement = improvementSessions.length > 0
        ? improvementSessions.reduce((sum: number, s: any) => {
            const before = s.emotion_before === 'tristesse' ? 2 : s.emotion_before === 'stress' ? 3 : 5;
            const after = s.emotion_after === 'calme' ? 7 : s.emotion_after === 'joie' ? 9 : 6;
            return sum + (after - before);
          }, 0) / improvementSessions.length
        : 0;

      return new Response(
        JSON.stringify({
          totalSessions,
          totalMinutes,
          topEmotions,
          averageImprovement: Math.round(averageImprovement * 10) / 10,
          recentSessions: sessions.slice(0, 10),
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ error: 'Route non trouvée' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Erreur:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
