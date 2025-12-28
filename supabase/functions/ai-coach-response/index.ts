import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { authenticateRequest } from '../_shared/auth-middleware.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';
import { validateRequest, createErrorResponse, AICoachRequestSchema } from '../_shared/validation.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CoachResponse {
  response: string;
  emotion: string;
  techniques: string[];
  resources: Array<{type: string, title: string, description: string}>;
  followUpQuestions: string[];
}

const PERSONALITIES: Record<string, { style: string; approach: string }> = {
  empathetic: {
    style: "empathique et bienveillant",
    approach: "écoute active, validation des émotions, soutien inconditionnel"
  },
  analytical: {
    style: "analytique et structuré", 
    approach: "analyse des problèmes, solutions logiques, approche méthodique"
  },
  motivational: {
    style: "motivant et énergisant",
    approach: "encouragement, défis positifs, focus sur les objectifs"
  },
  zen: {
    style: "centré sur la pleine conscience",
    approach: "présence à l'instant, respiration, acceptation"
  },
  energetic: {
    style: "dynamique et enthousiaste",
    approach: "énergie positive, action immédiate, motivation intense"
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // 🔒 SÉCURITÉ: Authentification obligatoire
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200 || !authResult.user) {
      console.warn('[ai-coach-response] Unauthorized access attempt');
      return createErrorResponse(authResult.error || 'Authentication required', authResult.status, corsHeaders);
    }

    // 🛡️ SÉCURITÉ: Rate limiting strict (5 req/min - coaching est plus coûteux)
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'ai-coach-response',
      userId: authResult.user.id,
      limit: 5,
      windowMs: 60_000,
      description: 'AI Coach responses - Lovable AI calls'
    });

    if (!rateLimit.allowed) {
      console.warn('[ai-coach-response] Rate limit exceeded', { userId: authResult.user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes coach. Réessayez dans ${rateLimit.retryAfterSeconds}s.`
      });
    }

    // ✅ VALIDATION: Validation Zod des entrées
    const validation = await validateRequest(req, AICoachRequestSchema);
    if (!validation.success) {
      return createErrorResponse(validation.error, validation.status, corsHeaders);
    }

    const { 
      message, 
      conversationHistory = [], 
      userEmotion = 'neutral',
      coachPersonality = 'empathetic',
      context = ''
    } = validation.data as {
      message: string;
      conversationHistory?: Array<{role: string, content: string}>;
      userEmotion?: string;
      coachPersonality?: string;
      context?: string;
    };

    console.log('🧠 Coach IA - Génération de réponse:', { 
      userEmotion, 
      coachPersonality, 
      messageLength: message.length 
    });

    // Use Lovable AI Gateway
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const personality = PERSONALITIES[coachPersonality] || PERSONALITIES.empathetic;

    // Build conversation history context
    const historyContext = conversationHistory.length > 0 
      ? `Historique récent:\n${conversationHistory.slice(-6).map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}\n\n`
      : '';

    const systemPrompt = `Tu es un expert coach en bien-être mental EmotionsCare avec une formation en psychologie positive.
Tu es ${personality.style}. Ton approche: ${personality.approach}.

RÈGLES IMPORTANTES:
- Réponds avec empathie et pragmatisme
- Pas de diagnostic ni de prescription
- Oriente vers un professionnel si besoin
- Garde tes réponses concises (2-3 phrases max)
- Suggère des ressources de l'app: respiration (/app/breath), journal (/app/journal), musique (/app/music)

Tu dois répondre en JSON valide avec cette structure exacte:
{
  "response": "Ta réponse empathique ici",
  "emotion": "supportive|encouraging|calm|energizing",
  "techniques": ["technique 1", "technique 2", "technique 3"],
  "resources": [{"type": "méditation|exercice|musique|respiration", "title": "Titre", "description": "Description"}],
  "followUpQuestions": ["Question 1?", "Question 2?"]
}`;

    const userPrompt = `${historyContext}Message de l'utilisateur: "${message}"
Émotion détectée: ${userEmotion}
${context ? `Contexte: ${context}` : ''}

Génère ta réponse JSON:`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
        temperature: 0.7,
        max_tokens: 1200
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('❌ Lovable AI error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Rate limits exceeded, please try again later." 
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ 
          error: "Payment required, please add funds to your Lovable AI workspace." 
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error('AI gateway error');
    }

    const aiResult = await aiResponse.json();
    const rawContent = aiResult.choices?.[0]?.message?.content || '';
    
    let coachResponse: CoachResponse;

    try {
      // Try to parse JSON from response
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        coachResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.warn('⚠️ Erreur parsing JSON, utilisation fallback:', parseError);
      coachResponse = {
        response: rawContent.trim() || "Je suis là pour t'écouter et t'accompagner. Comment puis-je t'aider?",
        emotion: "supportive",
        techniques: [
          "Prends trois respirations profondes",
          "Pose tes pieds au sol et ressens l'ancrage",
          "Nomme 3 choses que tu vois autour de toi"
        ],
        resources: [
          {
            type: "respiration",
            title: "Respiration guidée",
            description: "Une courte pratique pour retrouver le calme"
          },
          {
            type: "méditation",
            title: "Moment de calme",
            description: "5 minutes pour te reconnecter"
          }
        ],
        followUpQuestions: [
          "Comment te sens-tu maintenant?",
          "Y a-t-il quelque chose de spécifique qui te préoccupe?"
        ]
      };
    }

    // Validation et enrichissement de la réponse
    coachResponse.response = coachResponse.response || "Je suis là pour t'écouter et t'accompagner.";
    coachResponse.emotion = coachResponse.emotion || "supportive";
    coachResponse.techniques = Array.isArray(coachResponse.techniques) 
      ? coachResponse.techniques.slice(0, 3)
      : ["Prends une pause", "Respire profondément", "Sois bienveillant avec toi-même"];
    
    coachResponse.resources = Array.isArray(coachResponse.resources)
      ? coachResponse.resources.slice(0, 2)
      : [{
          type: "respiration",
          title: "Moment de calme", 
          description: "Une pause pour te reconnecter"
        }];

    coachResponse.followUpQuestions = Array.isArray(coachResponse.followUpQuestions)
      ? coachResponse.followUpQuestions.slice(0, 2)
      : ["Comment puis-je mieux t'accompagner?"];

    console.log('✅ Réponse coach générée:', { 
      emotion: coachResponse.emotion,
      techniquesCount: coachResponse.techniques.length 
    });

    return new Response(JSON.stringify(coachResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Erreur coach IA:', error);
    
    // Réponse de fallback empathique
    const fallbackResponse: CoachResponse = {
      response: "Je rencontre un petit problème technique, mais je suis toujours là pour toi. Comment puis-je t'aider autrement?",
      emotion: "supportive",
      techniques: [
        "Prends un moment pour respirer calmement",
        "Accorde-toi de la bienveillance",
        "Rappelle-toi que tu n'es pas seul(e)"
      ],
      resources: [
        {
          type: "respiration",
          title: "Technique 4-7-8",
          description: "Inspire 4s, retiens 7s, expire 8s pour t'apaiser"
        },
        {
          type: "ancrage",
          title: "Exercice d'ancrage",
          description: "Connecte-toi au moment présent par tes 5 sens"
        }
      ],
      followUpQuestions: [
        "Que ressens-tu maintenant?",
        "Y a-t-il quelque chose que je peux faire pour toi?"
      ]
    };
    
    return new Response(JSON.stringify(fallbackResponse), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
