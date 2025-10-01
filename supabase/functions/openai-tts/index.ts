// @ts-nocheck - ESM imports from https://esm.sh ne supportent pas les types TypeScript natifs dans Deno
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

    const { text, voice, model } = await req.json()

    if (!text || typeof text !== 'string') {
      throw new Error('Text is required and must be a string')
    }

    if (text.length > 4000) {
      throw new Error('Text too long (max 4000 characters)')
    }

    console.log('TTS request for text length:', text.length, 'voice:', voice)

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    })

    const response = await openai.audio.speech.create({
      model: model || 'tts-1',
      voice: voice || 'alloy',
      input: text,
      response_format: 'mp3',
    })

    // Convert response to array buffer
    const arrayBuffer = await response.arrayBuffer()
    
    // Convert to base64
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    )

    console.log('TTS completed, audio size:', arrayBuffer.byteLength)

    const result = {
      audioContent: base64Audio
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'TTS generation failed';
    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error('Error in openai-tts function:', errorMessage, errorDetails);
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