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

    const { input, model } = await req.json()

    if (!input || typeof input !== 'string') {
      throw new Error('Input text is required')
    }

    if (input.length > 8000) {
      throw new Error('Input text too long (max 8000 characters)')
    }

    console.log('Creating embedding for text length:', input.length)

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    })

    const response = await openai.embeddings.create({
      model: model || 'text-embedding-3-small',
      input: input.trim(),
    })

    console.log('Embedding created, dimensions:', response.data[0].embedding.length)

    const result = {
      embedding: response.data[0].embedding,
      usage: response.usage ? {
        prompt_tokens: response.usage.prompt_tokens,
        total_tokens: response.usage.total_tokens
      } : undefined
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in openai-embeddings function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Embedding generation failed',
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})