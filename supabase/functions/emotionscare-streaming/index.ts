// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ALLOWED_ORIGINS = [
  'https://emotionscare.com',
  'https://www.emotionscare.com',
  'https://emotions-care.lovable.app',
  'http://localhost:5173',
];

function getCorsHeaders(req) {
  const origin = req.headers.get('origin') ?? '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: getCorsHeaders(req) })
  }

  try {
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const action = pathParts[1]
    
    switch (action) {
      case 'stream': {
        // GET /stream/:songId - Proxy streaming sécurisé
        const songId = pathParts[2]
        if (!songId) {
          return new Response('Song ID required', { status: 400, headers: getCorsHeaders(req) })
        }

        // Récupérer les infos de la chanson
        const { data: song, error } = await supabase
          .from('emotionscare_songs')
          .select('suno_audio_id, title')
          .eq('id', songId)
          .single()

        if (error || !song) {
          return new Response('Song not found', { status: 404, headers: getCorsHeaders(req) })
        }

        // Pour l'instant, on retourne une URL de streaming mock
        // Dans la vraie implémentation, on ferait un proxy vers Suno
        const mockAudioUrl = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
        
        return new Response(null, {
          status: 302,
          headers: {
            ...getCorsHeaders(req),
            'Location': mockAudioUrl,
            'Content-Disposition': 'inline',
            'Cache-Control': 'private, max-age=300'
          }
        })
      }

      case 'create': {
        // POST /create - Créer une chanson depuis un taskId Suno
        if (req.method !== 'POST') {
          return new Response('Method not allowed', { status: 405, headers: getCorsHeaders(req) })
        }

        const { taskId } = await req.json()
        if (!taskId) {
          return new Response('Task ID required', { status: 400, headers: getCorsHeaders(req) })
        }

        // Mock: créer une chanson directement
        // Dans la vraie implémentation, on vérifierait le statut Suno d'abord
        const { data: newSong, error } = await supabase
          .from('emotionscare_songs')
          .insert({
            suno_audio_id: taskId,
            title: `Chanson EmotionsCare ${Date.now()}`,
            meta: {
              duration: 180,
              image_url: `https://picsum.photos/300/300?random=${Date.now()}`,
              model: 'emotionscare-v1'
            },
            lyrics: [
              { time: 0, text: "🎵 Bienvenue dans EmotionsCare" },
              { time: 10, text: "Votre bien-être en musique" },
              { time: 20, text: "Relaxez-vous et profitez" }
            ]
          })
          .select()
          .single()

        if (error) {
          console.error('Erreur création chanson:', error)
          return new Response('Failed to create song', { status: 500, headers: getCorsHeaders(req) })
        }

        return new Response(JSON.stringify(newSong), {
          headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' }
        })
      }

      case 'library': {
        // GET /library - Récupérer la bibliothèque utilisateur
        if (req.method === 'GET') {
          const authHeader = req.headers.get('Authorization')
          if (!authHeader) {
            return new Response('Authorization required', { status: 401, headers: getCorsHeaders(req) })
          }

          const { data: { user }, error: authError } = await supabase.auth.getUser(
            authHeader.replace('Bearer ', '')
          )

          if (authError || !user) {
            return new Response('Unauthorized', { status: 401, headers: getCorsHeaders(req) })
          }

          const { data: library, error } = await supabase
            .from('emotionscare_user_songs')
            .select(`
              created_at,
              emotionscare_songs (
                id,
                title,
                suno_audio_id,
                meta,
                lyrics,
                created_at
              )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

          if (error) {
            return new Response('Failed to fetch library', { status: 500, headers: getCorsHeaders(req) })
          }

          return new Response(JSON.stringify(library), {
            headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' }
          })
        }

        // POST /library - Ajouter à la bibliothèque
        if (req.method === 'POST') {
          const authHeader = req.headers.get('Authorization')
          if (!authHeader) {
            return new Response('Authorization required', { status: 401, headers: getCorsHeaders(req) })
          }

          const { data: { user }, error: authError } = await supabase.auth.getUser(
            authHeader.replace('Bearer ', '')
          )

          if (authError || !user) {
            return new Response('Unauthorized', { status: 401, headers: getCorsHeaders(req) })
          }

          const { songId } = await req.json()
          if (!songId) {
            return new Response('Song ID required', { status: 400, headers: getCorsHeaders(req) })
          }

          const { error } = await supabase
            .from('emotionscare_user_songs')
            .upsert({
              user_id: user.id,
              song_id: songId
            })

          if (error) {
            return new Response('Failed to add to library', { status: 500, headers: getCorsHeaders(req) })
          }

          return new Response('OK', { headers: getCorsHeaders(req) })
        }

        return new Response('Method not allowed', { status: 405, headers: getCorsHeaders(req) })
      }

      case 'like': {
        // POST /like/:songId - Toggle like
        if (req.method !== 'POST') {
          return new Response('Method not allowed', { status: 405, headers: getCorsHeaders(req) })
        }

        const songId = pathParts[2]
        if (!songId) {
          return new Response('Song ID required', { status: 400, headers: getCorsHeaders(req) })
        }

        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
          return new Response('Authorization required', { status: 401, headers: getCorsHeaders(req) })
        }

        const { data: { user }, error: authError } = await supabase.auth.getUser(
          authHeader.replace('Bearer ', '')
        )

        if (authError || !user) {
          return new Response('Unauthorized', { status: 401, headers: getCorsHeaders(req) })
        }

        // Check if already liked
        const { data: existing } = await supabase
          .from('emotionscare_song_likes')
          .select('id')
          .eq('user_id', user.id)
          .eq('song_id', songId)
          .single()

        if (existing) {
          // Unlike
          await supabase
            .from('emotionscare_song_likes')
            .delete()
            .eq('user_id', user.id)
            .eq('song_id', songId)
          
          return new Response(JSON.stringify({ liked: false }), {
            headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' }
          })
        } else {
          // Like
          await supabase
            .from('emotionscare_song_likes')
            .insert({
              user_id: user.id,
              song_id: songId
            })
          
          return new Response(JSON.stringify({ liked: true }), {
            headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' }
          })
        }
      }

      default:
        return new Response('Not found', { status: 404, headers: getCorsHeaders(req) })
    }
  } catch (error) {
    console.error('Error in emotionscare-streaming:', error)
    return new Response('Internal server error', { status: 500, headers: getCorsHeaders(req) })
  }
})
