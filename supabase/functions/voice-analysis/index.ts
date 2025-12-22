// @ts-nocheck  
// Note: ESM imports don't provide TypeScript types in Deno
// Migrated to Lovable AI Gateway

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { audio, text } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Si on a du texte, on analyse directement
    if (text) {
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'system',
              content: 'Tu es un assistant qui analyse la voix et retourne le texte transcrit avec le niveau de confiance.'
            },
            {
              role: 'user',
              content: `Analyse ce texte vocal et identifie les émotions: "${text}"`
            }
          ],
          tools: [
            {
              type: 'function',
              function: {
                name: 'voice_analysis_result',
                description: 'Retourne le résultat de l\'analyse vocale',
                parameters: {
                  type: 'object',
                  properties: {
                    text: { type: 'string', description: 'Texte transcrit ou analysé' },
                    confidence: { type: 'number', minimum: 0, maximum: 1, description: 'Niveau de confiance' },
                    emotions: {
                      type: 'object',
                      description: 'Émotions détectées avec leurs scores',
                      additionalProperties: { type: 'number' }
                    }
                  },
                  required: ['text', 'confidence'],
                  additionalProperties: false
                }
              }
            }
          ],
          tool_choice: { type: 'function', function: { name: 'voice_analysis_result' } }
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: 'Payment required' }), {
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        throw new Error(`AI gateway error: ${response.status}`);
      }

      const data = await response.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      
      if (toolCall) {
        const result = JSON.parse(toolCall.function.arguments);
        return new Response(
          JSON.stringify(result),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ text, confidence: 0.85 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Pour l'audio sans texte, retourner un placeholder
    if (audio) {
      return new Response(
        JSON.stringify({ 
          text: "Enregistrement vocal reçu. L'analyse audio nécessite un service de transcription.",
          confidence: 0.5,
          note: "Transcription audio non disponible sans OpenAI Whisper"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('No audio or text data provided');

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[voice-analysis] Error:', errorMessage)
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
