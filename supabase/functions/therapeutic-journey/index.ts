// @ts-nocheck
/**
 * therapeutic-journey - Parcours thérapeutiques personnalisés
 *
 * 🔒 SÉCURISÉ: Auth user + Rate limit 10/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    route: 'therapeutic-journey',
    userId: user.id,
    limit: 10,
    windowMs: 60_000,
    description: 'Therapeutic journey with AI',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    const authHeader = req.headers.get('Authorization');

    const { action, emotion, intensity, duration, journeyId } = await req.json();

    console.log('Therapeutic journey request:', { action, emotion, intensity, duration, journeyId, userId: user.id });

    // Action: Generate personalized journey
    if (action === 'generate') {
      if (!lovableApiKey) {
        throw new Error('LOVABLE_API_KEY not configured');
      }

      const systemPrompt = `Tu es un thérapeute expert en thérapies émotionnelles intégratives.
Tu crées des parcours thérapeutiques personnalisés basés sur:
- L'émotion cible (${emotion})
- L'intensité émotionnelle (${intensity}/10)
- La durée souhaitée (${duration} minutes)

Génère un parcours thérapeutique structuré avec:
1. Un titre évocateur
2. Une introduction thérapeutique
3. 4-6 segments progressifs avec:
   - Titre du segment
   - Type de technique (respiration, méditation, visualisation, recadrage cognitif, etc.)
   - Durée (en minutes)
   - Instructions guidées détaillées
   - Bénéfices attendus
4. Recommandations post-session
5. Exercices de consolidation

Format JSON uniquement.`;

      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { 
              role: 'user', 
              content: `Crée un parcours thérapeutique pour: ${emotion} (intensité ${intensity}/10, durée ${duration}min)` 
            }
          ],
          temperature: 0.8,
          max_tokens: 2000
        }),
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error('AI API error:', aiResponse.status, errorText);
        throw new Error(`AI generation failed: ${aiResponse.status}`);
      }

      const aiData = await aiResponse.json();
      const generatedContent = aiData.choices[0].message.content;

      let journeyData;
      try {
        // Extract JSON from potential markdown code blocks
        const jsonMatch = generatedContent.match(/```json\n?([\s\S]*?)\n?```/) || 
                         generatedContent.match(/\{[\s\S]*\}/);
        journeyData = JSON.parse(jsonMatch ? jsonMatch[1] || jsonMatch[0] : generatedContent);
      } catch (e) {
        console.error('JSON parse error:', e, 'Content:', generatedContent);
        // Fallback structure
        journeyData = {
          title: `Parcours ${emotion}`,
          introduction: generatedContent.substring(0, 500),
          segments: [],
          recommendations: ['Pratiquer régulièrement', 'Noter vos progrès']
        };
      }

      // Save journey to database
      const insertResponse = await fetch(`${supabaseUrl}/rest/v1/therapeutic_journeys`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'apikey': supabaseKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          user_id: user.id,
          emotion: emotion,
          intensity: intensity,
          duration_minutes: duration,
          content: journeyData,
          status: 'ready'
        })
      });

      if (!insertResponse.ok) {
        const errorText = await insertResponse.text();
        console.error('Database error:', errorText);
        throw new Error('Failed to save journey');
      }

      const [journey] = await insertResponse.json();

      console.log('Journey created successfully:', journey.id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          journey: journey,
          message: 'Parcours thérapeutique généré avec succès'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Action: Start journey session
    if (action === 'start') {
      const sessionResponse = await fetch(`${supabaseUrl}/rest/v1/therapeutic_sessions`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'apikey': supabaseKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          user_id: user.id,
          journey_id: journeyId,
          started_at: new Date().toISOString(),
          status: 'in_progress'
        })
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to start session');
      }

      const [session] = await sessionResponse.json();

      return new Response(
        JSON.stringify({ success: true, session }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Action: Complete journey session
    if (action === 'complete') {
      const { sessionId, completionData } = await req.json();

      const updateResponse = await fetch(
        `${supabaseUrl}/rest/v1/therapeutic_sessions?id=eq.${sessionId}&user_id=eq.${user.id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': authHeader,
            'apikey': supabaseKey,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            completed_at: new Date().toISOString(),
            status: 'completed',
            completion_data: completionData
          })
        }
      );

      if (!updateResponse.ok) {
        throw new Error('Failed to complete session');
      }

      const [session] = await updateResponse.json();

      return new Response(
        JSON.stringify({ success: true, session }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Action: Get user's journeys
    if (action === 'list') {
      const listResponse = await fetch(
        `${supabaseUrl}/rest/v1/therapeutic_journeys?user_id=eq.${user.id}&order=created_at.desc&limit=20`,
        {
          headers: {
            'Authorization': authHeader,
            'apikey': supabaseKey
          }
        }
      );

      if (!listResponse.ok) {
        throw new Error('Failed to load journeys');
      }

      const journeys = await listResponse.json();

      return new Response(
        JSON.stringify({ success: true, journeys }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Invalid action');

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in therapeutic-journey function:', errorMessage);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
