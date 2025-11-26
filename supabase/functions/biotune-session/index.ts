// @ts-nocheck
/**
 * biotune-session - Sessions de biofeedback personnalisées via IA
 *
 * 🔒 SÉCURISÉ: Auth + Rate limit 15/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { authenticateRequest } from '../_shared/auth-middleware.ts';
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

  try {
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200 || !authResult.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: authResult.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'biotune-session',
      userId: authResult.user.id,
      limit: 15,
      windowMs: 60_000,
      description: 'Biotune session generation',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    const { emotion, biometric_data, session_type } = await req.json();
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const systemPrompt = `Tu es un expert en biofeedback et optimisation des performances au travail.
    Génère une session personnalisée basée sur:
    - Émotion actuelle: ${emotion}
    - Type de session: ${session_type || 'relaxation'}
    ${biometric_data ? `- Données biométriques: ${JSON.stringify(biometric_data)}` : ''}
    
    Retourne un JSON avec:
    - session_title: titre de la session
    - duration: durée en minutes
    - phases: array des phases avec title, duration, instructions
    - breathing_pattern: pattern de respiration
    - visualization: exercice de visualisation
    - biofeedback_targets: objectifs biométriques
    - success_metrics: métriques de réussite`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Crée une session ${session_type} pour gérer ${emotion}` }
        ],
        temperature: 0.4,
        max_tokens: 800
      }),
    });

    const data = await response.json();
    const sessionText = data.choices[0].message.content;
    
    // Extraire le JSON
    const jsonMatch = sessionText.match(/```json\s*([\s\S]*?)\s*```/) || 
                     sessionText.match(/{[\s\S]*?}/);
    
    let session;
    if (jsonMatch) {
      try {
        session = JSON.parse(jsonMatch[0].replace(/```json|```/g, ''));
      } catch (parseError) {
        session = {
          session_title: `Session ${session_type} - ${emotion}`,
          duration: 10,
          phases: [
            {
              title: "Préparation",
              duration: 2,
              instructions: "Installez-vous confortablement et fermez les yeux"
            },
            {
              title: "Respiration consciente",
              duration: 5,
              instructions: "Respirez lentement et profondément"
            },
            {
              title: "Retour au calme",
              duration: 3,
              instructions: "Revenez progressivement à un état d'éveil"
            }
          ],
          breathing_pattern: "4-4-4-4 (inspiration-rétention-expiration-pause)",
          biofeedback_targets: {
            heart_rate_variability: "Améliorer la cohérence cardiaque",
            stress_level: "Réduire de 20%"
          }
        };
      }
    }

    // Générer un ID unique pour la session
    const sessionId = crypto.randomUUID();

    return new Response(JSON.stringify({
      success: true,
      session_id: sessionId,
      session,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in biotune-session:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});