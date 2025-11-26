import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { authenticateRequest } from '../_shared/auth-middleware.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';
import { validateRequest, createErrorResponse, AICoachRequestSchema } from '../_shared/validation.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';

interface CoachRequest {
  message: string;
  conversationHistory?: Array<{role: string, content: string}>;
  userEmotion?: string;
  coachPersonality?: string;
  context?: string;
}

interface CoachResponse {
  response: string;
  emotion: string;
  techniques: string[];
  resources: Array<{type: string, title: string, description: string}>;
  followUpQuestions: string[];
}

serve(async (req) => {
  // 1. CORS check - Strict domain validation
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
    console.warn('[ai-coach-response] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  try {
    // 2. 🔒 SÉCURITÉ: Authentification obligatoire
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
      description: 'AI Coach responses - GPT-4 API calls'
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
    })

    const openAIKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIKey) {
      throw new Error('Clé OpenAI manquante')
    }

    // Personnalités de coach
    const personalities = {
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
      mindful: {
        style: "centré sur la pleine conscience",
        approach: "présence à l'instant, respiration, acceptation"
      }
    }

    const personality = personalities[coachPersonality as keyof typeof personalities] || personalities.empathetic

    // Construction de l'historique de conversation
    const historyContext = conversationHistory.length > 0 
      ? `Historique récent:\n${conversationHistory.slice(-6).map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}\n\n`
      : ''

    const coachPrompt = `
Tu es un coach en bien-être ${personality.style}. Ton approche: ${personality.approach}.

${historyContext}Message actuel de l'utilisateur: "${message}"
Émotion détectée: ${userEmotion}
${context ? `Contexte: ${context}` : ''}

Génère une réponse JSON avec:
1. response: Réponse personnalisée et empathique (2-3 phrases)
2. emotion: Ton émotion en réponse (supportive/encouraging/calm/energizing)
3. techniques: 3 techniques pratiques de bien-être adaptées
4. resources: 2 ressources (méditation/exercice/lecture/musique) avec type, titre, description
5. followUpQuestions: 2 questions pour approfondir la conversation

Sois authentique, évite le jargon, et adapte-toi à l'émotion de l'utilisateur.
`

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert coach en bien-être mental avec une formation en psychologie positive. Réponds uniquement en JSON valide français.`
          },
          {
            role: 'user',
            content: coachPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1200
      }),
    })

    if (!openAIResponse.ok) {
      const error = await openAIResponse.text()
      console.error('❌ Erreur OpenAI:', error)
      throw new Error('Échec génération coach IA')
    }

    const openAIResult = await openAIResponse.json()
    let coachResponse: CoachResponse

    try {
      coachResponse = JSON.parse(openAIResult.choices[0].message.content)
    } catch (parseError) {
      console.warn('⚠️ Erreur parsing JSON, utilisation fallback')
      coachResponse = {
        response: openAIResult.choices[0].message.content || "Je vous écoute et je suis là pour vous accompagner.",
        emotion: "supportive",
        techniques: [
          "Prenez trois respirations profondes",
          "Posez vos pieds au sol et ressentez l'ancrage",
          "Nommez 3 choses que vous voyez autour de vous"
        ],
        resources: [
          {
            type: "méditation",
            title: "Méditation de 5 minutes",
            description: "Une courte pratique pour retrouver le calme intérieur"
          },
          {
            type: "exercice",
            title: "Étirements apaisants",
            description: "Quelques mouvements doux pour détendre le corps"
          }
        ],
        followUpQuestions: [
          "Comment vous sentez-vous en ce moment?",
          "Y a-t-il quelque chose de spécifique qui vous préoccupe?"
        ]
      }
    }

    // Validation et enrichissement de la réponse
    coachResponse.response = coachResponse.response || "Je suis là pour vous écouter et vous accompagner."
    coachResponse.emotion = coachResponse.emotion || "supportive"
    coachResponse.techniques = Array.isArray(coachResponse.techniques) 
      ? coachResponse.techniques.slice(0, 3)
      : ["Prenez une pause", "Respirez profondément", "Soyez bienveillant avec vous-même"]
    
    coachResponse.resources = Array.isArray(coachResponse.resources)
      ? coachResponse.resources.slice(0, 2)
      : [{
          type: "méditation",
          title: "Moment de calme", 
          description: "Une pause pour vous reconnecter"
        }]

    coachResponse.followUpQuestions = Array.isArray(coachResponse.followUpQuestions)
      ? coachResponse.followUpQuestions.slice(0, 2)
      : ["Comment puis-je mieux vous accompagner?"]

    console.log('✅ Réponse coach générée:', { 
      emotion: coachResponse.emotion,
      techniquesCount: coachResponse.techniques.length 
    })

    return new Response(JSON.stringify(coachResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('❌ Erreur coach IA:', error)
    
    // Réponse de fallback empathique
    const fallbackResponse: CoachResponse = {
      response: "Je rencontre un petit problème technique, mais je suis toujours là pour vous. Comment puis-je vous aider autrement?",
      emotion: "supportive",
      techniques: [
        "Prenez un moment pour respirer calmement",
        "Accordez-vous de la bienveillance",
        "Rappelez-vous que vous n'êtes pas seul(e)"
      ],
      resources: [
        {
          type: "respiration",
          title: "Technique 4-7-8",
          description: "Inspirez 4s, retenez 7s, expirez 8s pour vous apaiser"
        },
        {
          type: "ancrage",
          title: "Exercice d'ancrage",
          description: "Connectez-vous au moment présent par vos 5 sens"
        }
      ],
      followUpQuestions: [
        "Que ressentez-vous maintenant?",
        "Y a-t-il quelque chose que je peux faire pour vous?"
      ]
    }
    
    return new Response(JSON.stringify(fallbackResponse), {
      status: 200, // On retourne 200 avec une réponse de fallback plutôt qu'une erreur
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})