
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt, emotion, duration = 30 } = await req.json()
    const MUSIC_API_KEY = Deno.env.get('MUSIC_API_KEY')

    if (!MUSIC_API_KEY) {
      // Retourner une piste simulée si pas de clé API
      const tracks = [
        'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
        'https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3',
        'https://assets.mixkit.co/music/preview/mixkit-synthwave-retrowave-509.mp3'
      ]
      
      return new Response(
        JSON.stringify({
          id: `gen-${Date.now()}`,
          title: `Musique générée: ${emotion}`,
          artist: 'AI Composer',
          duration: duration,
          audioUrl: tracks[Math.floor(Math.random() * tracks.length)],
          coverUrl: `https://source.unsplash.com/300x300/?music,${emotion}`,
          genre: emotion === 'calm' ? 'Ambient' : 'Electronic'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // En production, appel à MusicGen ou autre service
    // const response = await fetch('https://api.musicgen.com/generate', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${MUSIC_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     prompt: prompt,
    //     duration: duration
    //   }),
    // })

    // const data = await response.json()
    
    return new Response(
      JSON.stringify({
        message: 'Music generation not yet implemented in production'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
