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

  if (req.method === "OPTIONS") {
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
    route: 'ml-recommendations',
    userId: user.id,
    limit: 10,
    windowMs: 60_000,
    description: 'ML recommendations API',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      error: 'Too many requests',
      retryAfter: rateLimit.retryAfter,
    });
  }

  try {
    const { 
      action, 
      userHistory, 
      currentEmotion, 
      timeOfDay,
      userId 
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "train_and_predict") {
      systemPrompt = `Tu es un expert en machine learning spécialisé dans l'analyse émotionnelle et la recommandation musicale thérapeutique.
Analyse l'historique complet de l'utilisateur pour:
1. Identifier les patterns émotionnels (cycles, triggers, moments critiques)
2. Prédire les états émotionnels futurs basés sur les patterns
3. Recommander les sessions musicales optimales avec timing précis
4. Suggérer les paramètres Suno idéaux (BPM, style, mood, intensity) basés sur les succès passés

Retourne une analyse structurée et exploitable.`;

      userPrompt = `Historique utilisateur: ${JSON.stringify(userHistory, null, 2)}
Émotion actuelle: ${currentEmotion}
Heure: ${timeOfDay}

Analyse cet historique et fournis:
1. Patterns émotionnels détectés (cycles, tendances)
2. Prédiction des 7 prochains jours (probabilités états émotionnels)
3. Recommandations proactives (quand faire quelle session)
4. Paramètres Suno optimaux pour chaque état émotionnel prédit`;

    } else if (action === "optimize_suno_params") {
      systemPrompt = `Tu es un expert en optimisation de paramètres musicaux Suno basé sur l'analyse de patterns de succès.
Analyse les sessions passées et leurs résultats pour déterminer les meilleurs paramètres.`;

      userPrompt = `Sessions passées: ${JSON.stringify(userHistory, null, 2)}
Émotion cible: ${currentEmotion}

Détermine les paramètres Suno optimaux (BPM, style, tags, intensity, mood) qui ont le mieux fonctionné pour cette émotion.`;

    } else if (action === "proactive_suggestions") {
      systemPrompt = `Tu es un coach de bien-être émotionnel qui suggère proactivement des sessions musicales optimales.
Basé sur l'historique et l'heure actuelle, suggère les meilleures actions.`;

      userPrompt = `Historique: ${JSON.stringify(userHistory, null, 2)}
Heure actuelle: ${timeOfDay}
Émotion: ${currentEmotion}

Suggère 3-5 actions proactives avec timing précis (ex: "Dans 2h, faire une session calme de 15min").`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error("AI Gateway request failed");
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "";

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: aiResponse,
        action,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("ML Recommendations error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        success: false 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
