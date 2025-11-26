/**
 * adaptive-music - Musique adaptative selon émotions
 *
 * 🔒 SÉCURISÉ: Auth + Rate limit 30/min + CORS restrictif
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

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
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  if (!corsResult.allowed) {
    return rejectCors(corsResult);
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

    if (!user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'adaptive-music',
      userId: user.id,
      limit: 30,
      windowMs: 60_000,
      description: 'Adaptive music API',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // GET /recommendations?emotion=joie&intensity=7
    if (req.method === 'GET' && path === 'recommendations') {
      const emotion = url.searchParams.get('emotion') || 'calme';
      const intensity = parseInt(url.searchParams.get('intensity') || '5');

      // Filtrer par émotion
      let recommendations = MUSIC_LIBRARY.filter(track => 
        track.emotion_tags.includes(emotion.toLowerCase())
      );

      // Si pas de correspondance exacte, prendre des tracks similaires
      if (recommendations.length === 0) {
        recommendations = MUSIC_LIBRARY.filter(track => {
          if (emotion === 'joie' || emotion === 'bonheur') {
            return track.energy_level >= 7;
          } else if (emotion === 'tristesse' || emotion === 'mélancolie') {
            return track.energy_level <= 4;
          } else if (emotion === 'calme' || emotion === 'sérénité') {
            return track.energy_level <= 3;
          } else if (emotion === 'stress' || emotion === 'anxiété') {
            return track.emotion_tags.includes('apaisement');
          }
          return true;
        });
      }

      // Trier par niveau d'énergie selon l'intensité
      recommendations.sort((a, b) => {
        const targetEnergy = Math.round(intensity / 10 * 10);
        return Math.abs(a.energy_level - targetEnergy) - Math.abs(b.energy_level - targetEnergy);
      });

      // Limiter à 10 recommandations
      recommendations = recommendations.slice(0, 10);

      return new Response(
        JSON.stringify({ 
          recommendations,
          emotion,
          intensity 
        }),
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
      const { name, description, track_ids } = await req.json();

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

    // POST /listening-session - Enregistrer une session d'écoute
    if (req.method === 'POST' && path === 'listening-session') {
      const { track_id, duration_seconds, emotion_before, emotion_after } = await req.json();

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

    // GET /stats - Statistiques d'écoute
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

      // Émotions les plus fréquentes
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

      // Amélioration émotionnelle moyenne
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
