/**
 * journal-voice - Entrée de journal vocale avec analyse émotionnelle
 *
 * 🔒 SÉCURISÉ: Auth + Rate limit 10/min + CORS restrictif
 */

// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { authenticateRequest, logUnauthorizedAccess } from '../_shared/auth-middleware.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // 1. CORS check
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  // Vérification CORS stricte
  if (!corsResult.allowed) {
    console.warn('[journal-voice] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  try {
    // 2. 🔒 Authentification obligatoire
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200 || !authResult.user) {
      await logUnauthorizedAccess(req, authResult.error || 'Authentication failed');
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: authResult.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. 🛡️ Rate limiting (création de journal = action coûteuse)
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'journal-voice',
      userId: authResult.user.id,
      limit: 10,
      windowMs: 60_000,
      description: 'Voice journal entry creation',
    });

    if (!rateLimit.allowed) {
      console.warn('[journal-voice] Rate limit exceeded', { userId: authResult.user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop d'entrées vocales. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    console.log(`[journal-voice] Processing for user: ${authResult.user.id}`);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get form data
    const formData = await req.formData();
    const audioFile = formData.get('file') as File;
    const lang = formData.get('lang') as string || 'fr';

    if (!audioFile) {
      return new Response(
        JSON.stringify({ error: 'Audio file required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Convert audio to text using OpenAI Whisper
    const openaiFormData = new FormData();
    openaiFormData.append('file', audioFile);
    openaiFormData.append('model', 'whisper-1');
    openaiFormData.append('language', lang);

    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: openaiFormData,
    });

    if (!transcriptionResponse.ok) {
      throw new Error('Transcription failed');
    }

    const transcription = await transcriptionResponse.json();
    const transcript = transcription.text;

    // Create journal entry with pending status
    const { data: entry, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: authResult.user.id,
        mode: 'voice',
        transcript,
        status: 'processing'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Start async sentiment analysis
    const sentimentPrompt = `Analyze the emotional tone of this journal entry and provide:
1. A mood classification: "clear" (lucid/positive), "mixed" (neutral/ambiguous), or "pressured" (stressed/negative)
2. A brief, empathetic summary in French (max 2 sentences)
3. A personalized suggestion for a wellness activity

Text: "${transcript}"

Respond in this exact JSON format:
{
  "mood_bucket": "clear|mixed|pressured",
  "summary": "Empathetic summary in French",
  "suggestion": "Specific wellness suggestion"
}`;

    const sentimentResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: sentimentPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (sentimentResponse.ok) {
      const sentimentResult = await sentimentResponse.json();
      const analysis = JSON.parse(sentimentResult.choices[0].message.content);

      // Update entry with analysis
      await supabase
        .from('journal_entries')
        .update({
          mood_bucket: analysis.mood_bucket,
          summary: analysis.summary,
          suggestion: analysis.suggestion,
          status: 'completed'
        })
        .eq('id', entry.id);
    } else {
      // Mark as completed even if sentiment analysis failed
      await supabase
        .from('journal_entries')
        .update({
          mood_bucket: 'mixed',
          summary: 'Votre note vocale a été bien enregistrée.',
          status: 'completed'
        })
        .eq('id', entry.id);
    }

    return new Response(
      JSON.stringify({ entry_id: entry.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in journal-voice:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    );
  }
});