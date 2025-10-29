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

    const systemPrompt = `Tu es un expert en régulation émotionnelle et en micro-interventions corporelles.
Ton rôle est de suggérer 3-4 micro-gestes SPÉCIFIQUEMENT ADAPTÉS à l'émotion détectée parmi les 46 émotions possibles.

RÈGLES STRICTES :
1. Chaque émotion nécessite des micro-gestes DIFFÉRENTS et CIBLÉS
2. Les gestes doivent correspondre au quadrant valence/arousal de l'émotion
3. Sois PRÉCIS : ne propose pas les mêmes gestes pour "joie" et "anxiété"
4. Adapte l'intensité des gestes au niveau d'arousal

CARACTÉRISTIQUES DES MICRO-GESTES :
- Durée : 30 secondes à 2 minutes max
- Sans matériel requis
- Applicables partout (bureau, maison, transports)
- Basés sur : respiration, mouvement, ancrage sensoriel, attention
- Ton bienveillant et encourageant

GUIDE PAR TYPE D'ÉMOTION :

**Émotions positives haute énergie** (joie, excitation, enthousiasme, extase) :
→ Gestes pour CANALISER et ANCRER l'énergie positive
→ Ex: étirements dynamiques, ancrage des pieds au sol, respiration rythmée

**Émotions positives basse énergie** (calme, sérénité, contentement, satisfaction) :
→ Gestes pour SAVOURER et PROLONGER le bien-être
→ Ex: auto-massage lent, respiration abdominale, gratitude corporelle

**Émotions négatives haute énergie** (colère, anxiété, stress, peur, frustration) :
→ Gestes pour LIBÉRER et APAISER la tension
→ Ex: expiration forte, relâchement musculaire progressif, tapotements

**Émotions négatives basse énergie** (tristesse, fatigue, mélancolie, torpeur) :
→ Gestes pour RÉACTIVER et RÉCONFORTER en douceur
→ Ex: micro-mouvements doux, stimulation sensorielle légère, respiration revitalisante

**Émotions complexes** (confusion, surprise, nostalgie, désir) :
→ Gestes pour CLARIFIER et RÉGULER l'ambivalence
→ Ex: scan corporel, gestes d'auto-apaisement, ancrage au moment présent

IMPORTANT : Propose des gestes VRAIMENT DIFFÉRENTS selon l'émotion détectée. Une personne en "colère" ne doit PAS recevoir les mêmes suggestions qu'une personne en "tristesse".`;

    const userPrompt = `ANALYSE ÉMOTIONNELLE :
━━━━━━━━━━━━━━━━━━━━━━
Émotion principale : ${emotion} ${emotionContext ? `(historique: ${emotionContext})` : ''}
Valence (positif/négatif) : ${valence}/100
Arousal (calme/énergique) : ${arousal}/100
${context ? `Contexte d'usage : ${context}` : ''}

MISSION : Génère 3-4 micro-gestes SPÉCIFIQUEMENT ADAPTÉS à "${emotion}".
Les gestes doivent être UNIQUES à cette émotion et correspondre à son quadrant valence/arousal.

Exemples de différenciation attendue :
- Pour "anxiété" → techniques de relâchement de tension musculaire
- Pour "tristesse" → micro-mouvements doux de réactivation
- Pour "joie" → ancrage pour savourer le moment
- Pour "colère" → libération contrôlée de l'énergie

Génère maintenant des suggestions PRÉCISES et CIBLÉES pour "${emotion}".`;

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
