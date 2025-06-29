
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { emotion, mood } = await req.json()

    // Mock response structure - original implementation
    const mockTrack = {
      id: crypto.randomUUID(),
      title: `Generated Music for ${emotion}`,
      artist: 'AI Composer',
      audioUrl: '/sounds/ambient-calm.mp3', // Fallback audio
      duration: 180,
      emotion: emotion || 'calm',
      mood: mood || 'relaxed'
    }

    return new Response(
      JSON.stringify(mockTrack),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error in generate-music:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
