
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { requireAuth } from '../_shared/auth.ts';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  const user = await requireAuth(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  try {
    const { text, voice } = await req.json();
    if (!text) {
      throw new Error('Text is required');
    }
    // Generate speech from text using OpenAI
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: voice || 'alloy', // alloy, echo, fable, onyx, nova, or shimmer
        response_format: 'mp3',
      }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('OpenAI API error:', errorData || await response.text());
      throw new Error('Failed to generate speech from OpenAI');
    // Convert audio buffer to base64
    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );
    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        format: 'mp3'
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
  } catch (error) {
    console.error('Error in text-to-voice function:', error);
    
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error in text-to-voice function'
        status: 500,
});
