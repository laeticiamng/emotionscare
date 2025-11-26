// @ts-nocheck
/**
 * story-synth - Génération d'histoires interactives
 *
 * 🔒 SÉCURISÉ: Auth user + Rate limit 20/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

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

  const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user', 'b2b_admin', 'admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'story-synth',
    userId: user.id,
    limit: 20,
    windowMs: 60_000,
    description: 'Story synthesis',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    if (path === '/story/start' && req.method === 'POST') {
      const { genre, language = 'fr', intensity = 'epic' } = await req.json();
      
      const sessionId = `story_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      const coverUrl = `https://picsum.photos/400/600?random=${sessionId}`;
      const sseUrl = `/story/stream/${sessionId}`;

      return new Response(JSON.stringify({
        session_id: sessionId,
        cover_url: coverUrl,
        sse_url: sseUrl
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (path.startsWith('/story/stream/') && req.method === 'GET') {
      const sessionId = path.split('/')[3];
      
      const headers = {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      };

      const stream = new ReadableStream({
        start(controller) {
          // Send initial chapter
          const chapterData = {
            type: 'chapter',
            payload: {
              id: 'ch1',
              text: 'Dans les confins de l\'espace, votre vaisseau dérive silencieusement vers une station mystérieuse. Les écrans clignotent faiblement, et vous sentez que quelque chose d\'extraordinaire vous attend...',
              art_url: `https://picsum.photos/600/400?random=ch1_${sessionId}`
            }
          };
          
          controller.enqueue(`data: ${JSON.stringify(chapterData)}\n\n`);

          // Send choices after 2 seconds
          setTimeout(() => {
            const choicesData = {
              type: 'choices',
              payload: {
                items: [
                  { id: 'ch1_courage', label: 'Avancer courageusement vers la station' },
                  { id: 'ch1_analyze', label: 'Analyser les signaux avant de bouger' },
                  { id: 'ch1_retreat', label: 'Faire demi-tour prudemment' }
                ]
              }
            };
            controller.enqueue(`data: ${JSON.stringify(choicesData)}\n\n`);
          }, 2000);

          // Send music
          setTimeout(() => {
            const musicData = {
              type: 'music',
              payload: {
                track_url: 'https://www.soundjay.com/misc/sounds/beep-07a.wav'
              }
            };
            controller.enqueue(`data: ${JSON.stringify(musicData)}\n\n`);
          }, 3000);
        }
      });

      return new Response(stream, { headers });
    }

    if (path === '/story/choice' && req.method === 'POST') {
      const { session_id, choice_id } = await req.json();
      
      // Here we would process the choice and trigger next chapter
      console.log('Choice made:', { session_id, choice_id });
      
      return new Response(JSON.stringify({ ack: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (path === '/story/export' && req.method === 'POST') {
      const { session_id, format = 'mp3', include_artwork = true } = await req.json();
      
      const downloadUrl = `https://example.com/exports/${session_id}.${format}`;
      const transcriptUrl = `https://example.com/transcripts/${session_id}.json`;
      
      return new Response(JSON.stringify({
        download_url: downloadUrl,
        transcript_url: transcriptUrl
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });

  } catch (error) {
    console.error('Error in story-synth function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});