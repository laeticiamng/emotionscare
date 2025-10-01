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

    const formData = await req.formData()
    const audioFile = formData.get('audio') as File
    
    if (!audioFile) {
      throw new Error('Audio file is required')
    }

    console.log('Transcribing audio file:', audioFile.name, 'Size:', audioFile.size)

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    })

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "fr", // French by default, can be made configurable
      response_format: "json",
      temperature: 0.0, // More deterministic for transcription
    })

    console.log('Transcription completed:', transcription.text?.substring(0, 100) + '...')

    const response = {
      text: transcription.text,
      language: transcription.language || 'fr'
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Transcription failed';
    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error('Error in openai-transcribe function:', errorMessage, errorDetails);
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