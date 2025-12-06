// @ts-nocheck
/**
 * OpenAI Helper - Wrapper pour appels OpenAI
 *
 * Fonctions réutilisables pour :
 * - Coach IA (génération de réponses)
 * - Analyse émotionnelle
 * - Génération de contenu
 *
 * @version 1.0.0
 * @created 2025-11-14
 */

export interface CoachResponse {
  response: string;
  emotion: string;
  techniques: string[];
  resources: Array<{
    type: string;
    title: string;
    description: string;
  }>;
  followUpQuestions: string[];
}

export interface EmotionAnalysis {
  primary: string;
  secondary?: string;
  confidence: number;
  scores: Record<string, number>;
  insights?: string[];
}

/**
 * Génère une réponse de coach IA via OpenAI
 */
export async function generateCoachResponse(params: {
  message: string;
  conversationHistory?: Array<{ role: string; content: string }>;
  userEmotion?: string;
  coachPersonality?: 'empathetic' | 'analytical' | 'motivational' | 'mindful';
  context?: string;
}): Promise<CoachResponse> {
  const openAIKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const {
    message,
    conversationHistory = [],
    userEmotion = 'neutral',
    coachPersonality = 'empathetic',
    context = '',
  } = params;

  // Personnalités de coach
  const personalities = {
    empathetic: {
      style: 'empathique et bienveillant',
      approach: 'écoute active, validation des émotions, soutien inconditionnel',
    },
    analytical: {
      style: 'analytique et structuré',
      approach: 'analyse des problèmes, solutions logiques, approche méthodique',
    },
    motivational: {
      style: 'motivant et énergisant',
      approach: 'encouragement, défis positifs, focus sur les objectifs',
    },
    mindful: {
      style: 'centré sur la pleine conscience',
      approach: 'présence à l\'instant, respiration, acceptation',
    },
  };

  const personality = personalities[coachPersonality] || personalities.empathetic;

  // Construction de l'historique
  const historyContext = conversationHistory.length > 0
    ? `Historique récent:\n${conversationHistory
        .slice(-6)
        .map((msg: any) => `${msg.role}: ${msg.content}`)
        .join('\n')}\n\n`
    : '';

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
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
          content: `Tu es un expert coach en bien-être mental avec une formation en psychologie positive. Réponds uniquement en JSON valide français.`,
        },
        {
          role: 'user',
          content: coachPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1200,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ OpenAI API error:', error);
    throw new Error('Failed to generate coach response');
  }

  const result = await response.json();
  let coachResponse: CoachResponse;

  try {
    coachResponse = JSON.parse(result.choices[0].message.content);
  } catch (parseError) {
    console.warn('⚠️ JSON parsing error, using fallback');
    coachResponse = {
      response: result.choices[0].message.content || 'Je vous écoute et je suis là pour vous accompagner.',
      emotion: 'supportive',
      techniques: [
        'Prenez trois respirations profondes',
        'Posez vos pieds au sol et ressentez l\'ancrage',
        'Nommez 3 choses que vous voyez autour de vous',
      ],
      resources: [
        {
          type: 'méditation',
          title: 'Méditation de 5 minutes',
          description: 'Une courte pratique pour retrouver le calme intérieur',
        },
        {
          type: 'exercice',
          title: 'Étirements apaisants',
          description: 'Quelques mouvements doux pour détendre le corps',
        },
      ],
      followUpQuestions: [
        'Comment vous sentez-vous en ce moment?',
        'Y a-t-il quelque chose de spécifique qui vous préoccupe?',
      ],
    };
  }

  // Validation et enrichissement
  coachResponse.response = coachResponse.response || 'Je suis là pour vous écouter et vous accompagner.';
  coachResponse.emotion = coachResponse.emotion || 'supportive';
  coachResponse.techniques = Array.isArray(coachResponse.techniques)
    ? coachResponse.techniques.slice(0, 3)
    : ['Prenez une pause', 'Respirez profondément', 'Soyez bienveillant avec vous-même'];

  coachResponse.resources = Array.isArray(coachResponse.resources)
    ? coachResponse.resources.slice(0, 2)
    : [
        {
          type: 'méditation',
          title: 'Moment de calme',
          description: 'Une pause pour vous reconnecter',
        },
      ];

  coachResponse.followUpQuestions = Array.isArray(coachResponse.followUpQuestions)
    ? coachResponse.followUpQuestions.slice(0, 2)
    : ['Comment puis-je mieux vous accompagner?'];

  return coachResponse;
}

/**
 * Analyse une émotion via OpenAI
 */
export async function analyzeEmotion(params: {
  text: string;
  type?: 'text' | 'conversation';
}): Promise<EmotionAnalysis> {
  const openAIKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const { text, type = 'text' } = params;

  const systemPrompt = `Vous êtes un expert en analyse émotionnelle pour EmotionsCare.
Analysez le texte fourni et identifiez les émotions présentes avec leur intensité et confidence.

Répondez au format JSON suivant:
{
  "primary": "nom_emotion",
  "secondary": "nom_emotion_secondaire",
  "confidence": 0.0-1.0,
  "scores": {
    "emotion1": 0.0-1.0,
    "emotion2": 0.0-1.0
  },
  "insights": ["insight1", "insight2"]
}

Émotions possibles: joy, happiness, sadness, anger, fear, anxiety, calm, excitement, love, gratitude, frustration, surprise, disgust, contempt, neutral`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analysez ce texte: "${text}"` },
      ],
      temperature: 0.3,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze emotion');
  }

  const result = await response.json();
  const analysis = JSON.parse(result.choices[0].message.content);

  return {
    primary: analysis.primary || 'neutral',
    secondary: analysis.secondary,
    confidence: analysis.confidence || 0.7,
    scores: analysis.scores || { [analysis.primary]: analysis.confidence || 0.7 },
    insights: analysis.insights || [],
  };
}

/**
 * Fallback response en cas d'erreur OpenAI
 */
export function getFallbackCoachResponse(): CoachResponse {
  return {
    response: 'Je rencontre un petit problème technique, mais je suis toujours là pour vous. Comment puis-je vous aider autrement?',
    emotion: 'supportive',
    techniques: [
      'Prenez un moment pour respirer calmement',
      'Accordez-vous de la bienveillance',
      'Rappelez-vous que vous n\'êtes pas seul(e)',
    ],
    resources: [
      {
        type: 'respiration',
        title: 'Technique 4-7-8',
        description: 'Inspirez 4s, retenez 7s, expirez 8s pour vous apaiser',
      },
      {
        type: 'ancrage',
        title: 'Exercice d\'ancrage',
        description: 'Connectez-vous au moment présent par vos 5 sens',
      },
    ],
    followUpQuestions: [
      'Que ressentez-vous maintenant?',
      'Y a-t-il quelque chose que je peux faire pour vous?',
    ],
  };
}
