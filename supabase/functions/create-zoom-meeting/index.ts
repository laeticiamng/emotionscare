// Edge function pour créer une réunion Zoom
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

const ZOOM_API_BASE = 'https://api.zoom.us/v2'

interface ZoomMeetingRequest {
  topic: string
  start_time: string
  duration: number
  timezone: string
}

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
    route: 'create-zoom-meeting',
    userId: user.id,
    limit: 10,
    windowMs: 60_000,
    description: 'Zoom meeting creation API',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      error: 'Too many requests',
      retryAfter: rateLimit.retryAfter,
    });
  }

  try {
    // Récupérer les paramètres
    const params: ZoomMeetingRequest = await req.json()

    // Récupérer les credentials Zoom depuis les secrets
    const zoomAccountId = Deno.env.get('ZOOM_ACCOUNT_ID')
    const zoomClientId = Deno.env.get('ZOOM_CLIENT_ID')
    const zoomClientSecret = Deno.env.get('ZOOM_CLIENT_SECRET')

    if (!zoomAccountId || !zoomClientId || !zoomClientSecret) {
      return new Response(JSON.stringify({ error: 'Zoom credentials not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Obtenir un access token OAuth (Server-to-Server OAuth)
    const tokenResponse = await fetch(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${zoomAccountId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${zoomClientId}:${zoomClientSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to get Zoom access token')
    }

    const { access_token } = await tokenResponse.json()

    // Créer la réunion Zoom
    const meetingResponse = await fetch(`${ZOOM_API_BASE}/users/me/meetings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        topic: params.topic,
        type: 2, // Scheduled meeting
        start_time: params.start_time,
        duration: params.duration,
        timezone: params.timezone,
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          watermark: false,
          use_pmi: false,
          approval_type: 2, // No registration required
          audio: 'both',
          auto_recording: 'cloud',
          waiting_room: true
        }
      })
    })

    if (!meetingResponse.ok) {
      const errorData = await meetingResponse.text()
      console.error('Zoom API error:', errorData)
      throw new Error(`Zoom API error: ${meetingResponse.status}`)
    }

    const meeting = await meetingResponse.json()

    return new Response(JSON.stringify(meeting), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error creating Zoom meeting:', error)
    const err = error as Error;
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
