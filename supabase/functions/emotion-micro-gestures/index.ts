import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emotion, valence, arousal, context, recentEmotions } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Construire le contexte émotionnel
    const emotionContext = recentEmotions && recentEmotions.length > 0
      ? `Émotions récentes : ${recentEmotions.join(', ')}`
      : '';

    const systemPrompt = `Tu es un coach en bien-être émotionnel spécialisé dans les micro-interventions corporelles.
Ton rôle est de suggérer 3-4 micro-gestes simples, concrets et immédiatement applicables pour accompagner l'état émotionnel de l'utilisateur.

Les micro-gestes doivent être:
- Courts (1-2 minutes maximum)
- Sans matériel nécessaire
- Applicables n'importe où (bureau, maison, transports)
- Centrés sur le corps et la respiration
- Formulés avec bienveillance et simplicité

Évite les clichés et reste créatif. Adapte-toi au niveau d'énergie (arousal) et à la valence émotionnelle.`;

    const userPrompt = `Émotion actuelle : ${emotion}
Valence (humeur) : ${valence}/100
Arousal (énergie) : ${arousal}/100
${emotionContext}
${context ? `Contexte : ${context}` : ''}

Suggère 3-4 micro-gestes adaptés à cet état émotionnel.`;

    // Appel à Lovable AI avec structured outputs
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_micro_gestures",
              description: "Retourne 3-4 micro-gestes adaptés à l'état émotionnel",
              parameters: {
                type: "object",
                properties: {
                  gestures: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        icon: { 
                          type: "string",
                          description: "Un emoji représentant le geste (1 seul emoji)"
                        },
                        label: { 
                          type: "string",
                          description: "Titre court du geste (max 6 mots)"
                        },
                        description: { 
                          type: "string",
                          description: "Description détaillée du geste (20-40 mots)"
                        },
                        duration: { 
                          type: "string",
                          description: "Durée estimée (ex: '30 secondes', '2 minutes')"
                        }
                      },
                      required: ["icon", "label", "description", "duration"],
                      additionalProperties: false
                    },
                    minItems: 3,
                    maxItems: 4
                  },
                  summary: {
                    type: "string",
                    description: "Un message court et bienveillant pour contextualiser les suggestions (15-25 mots)"
                  }
                },
                required: ["gestures", "summary"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "suggest_micro_gestures" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit dépassée, réessayez dans quelques instants" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits insuffisants, veuillez recharger votre compte" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Erreur AI gateway");
    }

    const data = await response.json();
    
    // Extraire les tool calls
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("Aucune suggestion générée");
    }

    const suggestions = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify(suggestions),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );

  } catch (error) {
    console.error("Error in emotion-micro-gestures:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Erreur inconnue" 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});
