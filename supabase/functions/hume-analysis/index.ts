
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
    const { text, type } = await req.json()
    const HUME_API_KEY = Deno.env.get('HUME_API_KEY')

    if (!HUME_API_KEY) {
      // Retourner une analyse simulée si pas de clé API
      const emotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'calm']
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
      
      return new Response(
        JSON.stringify({
          emotion: randomEmotion,
          intensity: Math.random() * 0.8 + 0.2,
          score: Math.floor(Math.random() * 50 + 50)
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // En production, appel à l'API Hume AI
    const response = await fetch('https://api.hume.ai/v0/batch/jobs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUME_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        models: {
          language: {
            granularity: type === 'text' ? 'sentence' : 'conversation'
          }
        },
        text: [text]
      }),
    })

    const data = await response.json()
    
    return new Response(
      JSON.stringify(data),
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
