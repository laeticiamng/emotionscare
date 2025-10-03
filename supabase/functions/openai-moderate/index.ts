import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import OpenAI from "https://esm.sh/openai@4.20.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured')
    }

    const { input } = await req.json()

    if (!input || typeof input !== 'string') {
      throw new Error('Input text is required for moderation')
    }

    console.log('Moderating content length:', input.length)

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    })

    const moderation = await openai.moderations.create({
      input: input,
    })

    const result = moderation.results[0]

    console.log('Moderation completed, flagged:', result.flagged)

    const response = {
      flagged: result.flagged,
      categories: result.categories,
      category_scores: result.category_scores
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Moderation check failed';
    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error('Error in openai-moderate function:', errorMessage, errorDetails);
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorDetails
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})