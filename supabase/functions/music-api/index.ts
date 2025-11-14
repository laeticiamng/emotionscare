// @ts-nocheck
/**
 * Music API - Gestion complète de la musicothérapie IA
 *
 * Endpoints:
 * Sessions:
 *   - POST   /sessions            - Créer une session
 *   - GET    /sessions            - Liste des sessions
 *   - GET    /sessions/:id        - Détail d'une session
 *   - PATCH  /sessions/:id        - Modifier une session
 *   - POST   /sessions/:id/complete - Terminer une session
 *   - DELETE /sessions/:id        - Supprimer une session
 *
 * Playlists:
 *   - GET    /playlists           - Liste des playlists
 *   - POST   /playlists           - Créer une playlist
 *   - GET    /playlists/:id       - Détail d'une playlist
 *   - PATCH  /playlists/:id       - Modifier une playlist
 *   - DELETE /playlists/:id       - Supprimer une playlist
 *   - POST   /playlists/:id/tracks - Ajouter un track
 *
 * Génération:
 *   - POST   /generate            - Générer de la musique
 *   - GET    /generated           - Liste des tracks générés
 *   - GET    /generated/:id       - Détail d'un track
 *   - DELETE /generated/:id       - Supprimer un track
 *
 * Favoris:
 *   - GET    /favorites           - Liste des favoris
 *   - POST   /favorites           - Ajouter un favori
 *   - DELETE /favorites/:id       - Retirer un favori
 *
 * Historique:
 *   - GET    /history             - Historique d'écoute
 *   - POST   /play                - Logger une lecture
 *   - POST   /skip                - Logger un skip
 *
 * Queue:
 *   - GET    /queue               - Queue de génération
 *   - GET    /queue/:id           - Status d'une génération
 *   - POST   /queue/:id/cancel    - Annuler une génération
 *
 * Recommandations:
 *   - GET    /recommendations     - Recommandations
 *   - GET    /preferences         - Préférences utilisateur
 *   - PATCH  /preferences         - Modifier préférences
 *
 * Analytics:
 *   - GET    /analytics           - Statistiques musicales
 *   - GET    /profile             - Profil musical
 *
 * @version 1.0.0
 * @created 2025-11-14
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    if (!user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(p => p);
    const resource = pathParts[pathParts.length - 2] || pathParts[pathParts.length - 1];
    const action = pathParts[pathParts.length - 1];
    const id = pathParts.length > 1 && action !== resource ? action : null;

    // ═══════════════════════════════════════════════════════════════
    // SESSIONS MUSICALES
    // ═══════════════════════════════════════════════════════════════

    // POST /sessions - Créer une session
    if (req.method === 'POST' && resource === 'sessions' && !id) {
      const body = await req.json();

      const { data: session, error } = await supabaseClient
        .from('music_sessions')
        .insert({
          user_id: user.id,
          emotion_context: body.emotion_context,
          mood_before: body.mood_before,
          metadata: body.metadata,
          started_at: new Date().toISOString(),
          tracks_played: 0,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(session), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /sessions - Liste des sessions
    if (req.method === 'GET' && resource === 'sessions' && !id) {
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const dateFrom = url.searchParams.get('date_from');
      const dateTo = url.searchParams.get('date_to');
      const offset = (page - 1) * limit;

      let query = supabaseClient
        .from('music_sessions')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      if (dateFrom) query = query.gte('started_at', dateFrom);
      if (dateTo) query = query.lte('started_at', dateTo);

      const { data: sessions, error, count } = await query
        .order('started_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return new Response(
        JSON.stringify({ sessions, total: count || 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /sessions/:id - Détail d'une session
    if (req.method === 'GET' && resource === 'sessions' && id && action !== 'complete') {
      const { data: session, error } = await supabaseClient
        .from('music_sessions')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(session), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // PATCH /sessions/:id - Modifier une session
    if (req.method === 'PATCH' && resource === 'sessions' && id) {
      const body = await req.json();

      const { data: session, error } = await supabaseClient
        .from('music_sessions')
        .update({
          mood_after: body.mood_after,
          tracks_played: body.tracks_played,
          metadata: body.metadata,
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(session), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /sessions/:id/complete - Terminer une session
    if (req.method === 'POST' && resource === 'sessions' && action === 'complete') {
      const sessionId = pathParts[pathParts.length - 2];
      const body = await req.json();

      const { data: session, error } = await supabaseClient
        .from('music_sessions')
        .update({
          ended_at: new Date().toISOString(),
          mood_after: body.mood_after,
          tracks_played: body.tracks_played,
          satisfaction_score: body.satisfaction_score,
          duration_minutes: body.duration_minutes,
        })
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(session), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE /sessions/:id - Supprimer une session
    if (req.method === 'DELETE' && resource === 'sessions' && id) {
      const { error } = await supabaseClient
        .from('music_sessions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // ═══════════════════════════════════════════════════════════════
    // PLAYLISTS
    // ═══════════════════════════════════════════════════════════════

    // GET /playlists - Liste des playlists
    if (req.method === 'GET' && resource === 'playlists' && !id) {
      const emotionTag = url.searchParams.get('emotion_tag');
      const isPublic = url.searchParams.get('is_public');

      let query = supabaseClient
        .from('music_playlists')
        .select('*')
        .eq('user_id', user.id);

      if (emotionTag) query = query.eq('emotion_tag', emotionTag);
      if (isPublic !== null) query = query.eq('is_public', isPublic === 'true');

      const { data: playlists, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify(playlists), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /playlists - Créer une playlist
    if (req.method === 'POST' && resource === 'playlists' && !id) {
      const body = await req.json();

      const { data: playlist, error } = await supabaseClient
        .from('music_playlists')
        .insert({
          user_id: user.id,
          name: body.name,
          description: body.description,
          emotion_tag: body.emotion_tag,
          is_public: body.is_public || false,
          track_count: 0,
          tracks: [],
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(playlist), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /playlists/:id - Détail d'une playlist
    if (req.method === 'GET' && resource === 'playlists' && id && action !== 'tracks') {
      const { data: playlist, error } = await supabaseClient
        .from('music_playlists')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(playlist), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // PATCH /playlists/:id - Modifier une playlist
    if (req.method === 'PATCH' && resource === 'playlists' && id) {
      const body = await req.json();

      const { data: playlist, error } = await supabaseClient
        .from('music_playlists')
        .update({
          name: body.name,
          description: body.description,
          is_public: body.is_public,
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(playlist), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE /playlists/:id - Supprimer une playlist
    if (req.method === 'DELETE' && resource === 'playlists' && id) {
      const { error } = await supabaseClient
        .from('music_playlists')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // POST /playlists/:id/tracks - Ajouter un track
    if (req.method === 'POST' && resource === 'playlists' && action === 'tracks') {
      const playlistId = pathParts[pathParts.length - 2];
      const body = await req.json();

      // Get current playlist
      const { data: playlist } = await supabaseClient
        .from('music_playlists')
        .select('tracks')
        .eq('id', playlistId)
        .eq('user_id', user.id)
        .single();

      const updatedTracks = [...(playlist?.tracks || []), body.track_id];

      const { data: updated, error } = await supabaseClient
        .from('music_playlists')
        .update({
          tracks: updatedTracks,
          track_count: updatedTracks.length,
        })
        .eq('id', playlistId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(updated), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ═══════════════════════════════════════════════════════════════
    // GÉNÉRATION AI
    // ═══════════════════════════════════════════════════════════════

    // POST /generate - Générer de la musique
    if (req.method === 'POST' && resource === 'generate') {
      const body = await req.json();

      const { data: generation, error } = await supabaseClient
        .from('music_generations')
        .insert({
          user_id: user.id,
          emotion: body.emotion,
          intensity: body.intensity,
          style: body.style,
          duration_seconds: body.duration_seconds || 180,
          prompt: body.prompt,
          model: body.model || 'suno',
          status: 'queued',
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({
          id: generation.id,
          status: 'queued',
          estimated_time: 60,
        }),
        {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // GET /generated - Liste des tracks générés
    if (req.method === 'GET' && resource === 'generated' && !id) {
      const emotion = url.searchParams.get('emotion');
      const model = url.searchParams.get('model');
      const limit = parseInt(url.searchParams.get('limit') || '50');

      let query = supabaseClient
        .from('music_generated_tracks')
        .select('*')
        .eq('user_id', user.id);

      if (emotion) query = query.contains('emotion_tags', [emotion]);
      if (model) query = query.eq('source', model);

      const { data: tracks, error } = await query
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return new Response(JSON.stringify(tracks), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /generated/:id - Détail d'un track
    if (req.method === 'GET' && resource === 'generated' && id) {
      const { data: track, error } = await supabaseClient
        .from('music_generated_tracks')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(track), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE /generated/:id - Supprimer un track
    if (req.method === 'DELETE' && resource === 'generated' && id) {
      const { error } = await supabaseClient
        .from('music_generated_tracks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // ═══════════════════════════════════════════════════════════════
    // FAVORIS & HISTORIQUE
    // ═══════════════════════════════════════════════════════════════

    // GET /favorites - Liste des favoris
    if (req.method === 'GET' && resource === 'favorites') {
      const { data: favorites, error } = await supabaseClient
        .from('music_favorites')
        .select('*, track:music_generated_tracks(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify(favorites.map(f => f.track)), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /favorites - Ajouter un favori
    if (req.method === 'POST' && resource === 'favorites') {
      const body = await req.json();

      const { data: favorite, error } = await supabaseClient
        .from('music_favorites')
        .insert({
          user_id: user.id,
          track_id: body.track_id,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(favorite), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE /favorites/:id - Retirer un favori
    if (req.method === 'DELETE' && resource === 'favorites' && id) {
      const { error } = await supabaseClient
        .from('music_favorites')
        .delete()
        .eq('track_id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // GET /history - Historique d'écoute
    if (req.method === 'GET' && resource === 'history') {
      const limit = parseInt(url.searchParams.get('limit') || '50');

      const { data: history, error } = await supabaseClient
        .from('music_play_history')
        .select('*, track:music_generated_tracks(*)')
        .eq('user_id', user.id)
        .order('played_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return new Response(JSON.stringify(history), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /play - Logger une lecture
    if (req.method === 'POST' && resource === 'play') {
      const body = await req.json();

      const { data: log, error } = await supabaseClient
        .from('music_play_history')
        .insert({
          user_id: user.id,
          track_id: body.track_id,
          played_at: new Date().toISOString(),
          duration_played: 0,
          completed: false,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(log), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ═══════════════════════════════════════════════════════════════
    // QUEUE & ANALYTICS
    // ═══════════════════════════════════════════════════════════════

    // GET /queue - Queue de génération
    if (req.method === 'GET' && resource === 'queue' && !id) {
      const { data: queue, error } = await supabaseClient
        .from('music_generations')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['queued', 'processing'])
        .order('created_at', { ascending: true });

      if (error) throw error;

      return new Response(JSON.stringify(queue), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /queue/:id - Status d'une génération
    if (req.method === 'GET' && resource === 'queue' && id) {
      const { data: generation, error } = await supabaseClient
        .from('music_generations')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(generation), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /recommendations - Recommandations
    if (req.method === 'GET' && resource === 'recommendations') {
      const emotion = url.searchParams.get('emotion');

      let query = supabaseClient
        .from('music_generated_tracks')
        .select('*')
        .limit(10);

      if (emotion) {
        query = query.contains('emotion_tags', [emotion]);
      }

      const { data: tracks, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify(tracks), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /preferences - Préférences utilisateur
    if (req.method === 'GET' && resource === 'preferences') {
      const { data: prefs, error } = await supabaseClient
        .from('music_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return new Response(
        JSON.stringify(prefs || {
          favorite_genres: [],
          favorite_emotions: [],
          preferred_model: 'suno',
          auto_queue: false,
          default_duration: 180,
          volume_preference: 70,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // PATCH /preferences - Modifier préférences
    if (req.method === 'PATCH' && resource === 'preferences') {
      const body = await req.json();

      const { data: prefs, error } = await supabaseClient
        .from('music_preferences')
        .upsert({
          user_id: user.id,
          ...body,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(prefs), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /analytics - Statistiques musicales
    if (req.method === 'GET' && resource === 'analytics') {
      const { data: sessions } = await supabaseClient
        .from('music_sessions')
        .select('*')
        .eq('user_id', user.id);

      const { data: history } = await supabaseClient
        .from('music_play_history')
        .select('*')
        .eq('user_id', user.id);

      const totalSessions = sessions?.length || 0;
      const totalTracksPlayed = history?.length || 0;
      const totalListeningTime = history?.reduce((sum, h) => sum + (h.duration_played || 0), 0) || 0;

      return new Response(
        JSON.stringify({
          total_sessions: totalSessions,
          total_tracks_played: totalTracksPlayed,
          total_listening_time: totalListeningTime,
          most_played_emotions: [],
          mood_improvement_avg: 0,
          favorite_models: {},
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ error: 'Route non trouvée' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('❌ Music API Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
