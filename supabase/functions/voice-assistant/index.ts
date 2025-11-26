// @ts-nocheck

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

serve(async (req) => {
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  if (!corsResult.allowed) {
    return rejectCors(corsResult);
  }

  const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user', 'b2b_admin', 'admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'voice-assistant',
    userId: user.id,
    limit: 15,
    windowMs: 60_000,
    description: 'Voice assistant API (OpenAI)',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      error: 'Too many requests',
      retryAfter: rateLimit.retryAfter,
    });
  }

  try {

    const { audioData, command, context = {} } = await req.json();
    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Transcription de l'audio en texte
    let transcript = '';
    if (audioData) {
      const formData = new FormData();
      const audioBlob = new Blob([Uint8Array.from(atob(audioData), c => c.charCodeAt(0))], { type: 'audio/webm' });
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-1');

      const transcriptResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openaiKey}`,
        },
        body: formData,
      });

      if (!transcriptResponse.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const transcriptData = await transcriptResponse.json();
      transcript = transcriptData.text;
    } else if (command) {
      transcript = command;
    }

    if (!transcript) {
      throw new Error('No audio or command provided');
    }

    // Analyse de l'intention avec OpenAI
    const intentMessages = [
      {
        role: 'system',
        content: `Tu es un assistant vocal pour EmotionsCare. Analyse la commande et détermine l'action à effectuer. Réponds en JSON: { "action": "navigate|emotion_scan|music_play|journal_create|breathing_exercise|help", "parameters": {...}, "response": "réponse vocale" }`
      },
      {
        role: 'user',
        content: `Commande: "${transcript}". Contexte: ${JSON.stringify(context)}`
      }
    ];

    const intentResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: intentMessages,
        max_tokens: 300,
        temperature: 0.3,
      }),
    });

    if (!intentResponse.ok) {
      throw new Error('Failed to analyze intent');
    }

    const intentData = await intentResponse.json();
    const assistantResponse = intentData.choices?.[0]?.message?.content || '';

    let result;
    try {
      result = JSON.parse(assistantResponse);
    } catch {
      // Fallback si le parsing JSON échoue
      result = {
        action: 'help',
        parameters: {},
        response: "Je n'ai pas bien compris votre demande. Pouvez-vous reformuler ?"
      };
    }

    // Génération de la réponse vocale
    const ttsResponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: 'nova',
        input: result.response,
      }),
    });

    if (!ttsResponse.ok) {
      throw new Error('Failed to generate speech');
    }

    const audioBuffer = await ttsResponse.arrayBuffer();
    const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

    return new Response(JSON.stringify({
      success: true,
      transcript,
      action: result.action,
      parameters: result.parameters,
      response: result.response,
      audioResponse: audioBase64
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in voice-assistant function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
