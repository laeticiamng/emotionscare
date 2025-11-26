// Edge function pour créer une réunion Google Meet
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3'

interface GoogleMeetRequest {
  summary: string
  start: string
  end: string
  description?: string
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
    route: 'create-google-meet',
    userId: user.id,
    limit: 10,
    windowMs: 60_000,
    description: 'Google Meet creation',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      error: 'Too many requests',
      retryAfter: rateLimit.retryAfter,
    });
  }

  try {

    // Récupérer les paramètres
    const params: GoogleMeetRequest = await req.json()

    // Récupérer les credentials Google depuis les secrets
    const googleClientId = Deno.env.get('GOOGLE_CLIENT_ID')
    const googleClientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET')
    const googleRefreshToken = Deno.env.get('GOOGLE_REFRESH_TOKEN')

    if (!googleClientId || !googleClientSecret || !googleRefreshToken) {
      return new Response(JSON.stringify({ error: 'Google credentials not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Obtenir un access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: googleClientId,
        client_secret: googleClientSecret,
        refresh_token: googleRefreshToken,
        grant_type: 'refresh_token'
      })
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to get Google access token')
    }

    const { access_token } = await tokenResponse.json()

    // Créer l'événement Google Calendar avec Meet
    const eventResponse = await fetch(`${GOOGLE_CALENDAR_API}/calendars/primary/events?conferenceDataVersion=1`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        summary: params.summary,
        description: params.description,
        start: {
          dateTime: params.start,
          timeZone: 'UTC'
        },
        end: {
          dateTime: params.end,
          timeZone: 'UTC'
        },
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet'
            }
          }
        },
        attendees: [],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 30 }
          ]
        }
      })
    })

    if (!eventResponse.ok) {
      const errorData = await eventResponse.text()
      console.error('Google Calendar API error:', errorData)
      throw new Error(`Google Calendar API error: ${eventResponse.status}`)
    }

    const event = await eventResponse.json()

    return new Response(JSON.stringify(event), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error creating Google Meet:', error)
    const err = error as Error;
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
