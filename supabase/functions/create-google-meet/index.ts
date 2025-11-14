// Edge function pour créer une réunion Google Meet
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3'

interface GoogleMeetRequest {
  summary: string
  start: string
  end: string
  description?: string
}

serve(async (req) => {
  try {
    // Vérifier l'authentification
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Créer client Supabase pour vérifier l'utilisateur
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

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
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error creating Google Meet:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
