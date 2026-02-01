// @ts-nocheck
/**
 * ROUTER AI - Super-routeur IA consolidé
 * Regroupe: ai-coach, ai-analysis, ai-moderate, openai-chat, openai-embeddings, etc.
 * 
 * Actions disponibles:
 * - coach: Chat avec Nyvée
 * - analyze: Analyse de texte/données
 * - moderate: Modération de contenu
 * - chat: Chat générique
 * - embed: Génération d'embeddings
 * - summarize: Résumé de texte
 * - translate: Traduction
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY') ?? '';
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') ?? '';
const AI_GATEWAY_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';

// Configuration des modèles
const MODELS = {
  default: 'google/gemini-2.5-flash',
  complex: 'google/gemini-2.5-pro',
  fast: 'google/gemini-2.5-flash-lite',
};

interface RouterRequest {
  action: string;
  payload: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    // Auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return errorResponse('Authorization required', 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return errorResponse('Invalid token', 401);
    }

    const body: RouterRequest = await req.json();
    const { action, payload = {} } = body;

    if (!action) {
      return errorResponse('Action is required', 400);
    }

    console.log(`[router-ai] Action: ${action}, User: ${user.id}`);

    // Router principal
    switch (action) {
      case 'coach':
        return await handleCoach(payload, user, supabase);
      
      case 'analyze':
        return await handleAnalyze(payload, user);
      
      case 'moderate':
        return await handleModerate(payload);
      
      case 'chat':
        return await handleChat(payload, user);
      
      case 'embed':
        return await handleEmbed(payload);
      
      case 'summarize':
        return await handleSummarize(payload);
      
      case 'translate':
        return await handleTranslate(payload);
      
      case 'crisis-detect':
        return await handleCrisisDetect(payload, user, supabase);
      
      case 'emotion-analyze':
        return await handleEmotionAnalyze(payload, user, supabase);

      case 'context-recommend':
        return await handleContextRecommend(payload, user, supabase);

      default:
        return errorResponse(`Unknown action: ${action}`, 400);
    }

  } catch (error) {
    console.error('[router-ai] Error:', error);
    return errorResponse(error.message ?? 'Internal error', 500);
  }
});

// ============ HANDLERS ============

async function handleCoach(payload: any, user: any, supabase: any): Promise<Response> {
  const { message, context, personality = 'empathetic' } = payload;
  
  if (!message) {
    return errorResponse('Message is required for coach', 400);
  }

  const systemPrompt = getCoachPersonality(personality);

  const response = await callAI({
    model: MODELS.complex,
    messages: [
      { role: 'system', content: systemPrompt },
      ...(context ? [{ role: 'user', content: `Contexte: ${context}` }] : []),
      { role: 'user', content: message },
    ],
    maxTokens: 1024,
  });

  if (!response.ok) {
    return handleAIError(response);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';

  // Log session
  await supabase.from('ai_coach_sessions').insert({
    user_id: user.id,
    coach_personality: personality,
    messages_count: 1,
    session_notes: message.slice(0, 200),
  }).catch(() => {});

  return successResponse({ content, personality });
}

async function handleAnalyze(payload: any, user: any): Promise<Response> {
  const { text, type = 'general' } = payload;
  
  if (!text) {
    return errorResponse('Text is required for analysis', 400);
  }

  const systemPrompt = `Tu es un analyste expert. Analyse le texte fourni et retourne un JSON structuré avec:
  - sentiment: positive/negative/neutral
  - emotions: array d'émotions détectées
  - keyPoints: points clés
  - suggestions: recommandations`;

  const response = await callAI({
    model: MODELS.default,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: text },
    ],
    maxTokens: 1024,
  });

  if (!response.ok) {
    return handleAIError(response);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';

  try {
    const analysis = JSON.parse(content);
    return successResponse({ analysis, type });
  } catch {
    return successResponse({ analysis: content, type, parsed: false });
  }
}

async function handleModerate(payload: any): Promise<Response> {
  const { text, context = 'general' } = payload;
  
  if (!text) {
    return errorResponse('Text is required for moderation', 400);
  }

  // Utiliser l'API OpenAI Moderation si disponible
  if (OPENAI_API_KEY) {
    const moderationRes = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: text, model: 'text-moderation-latest' }),
    });

    if (moderationRes.ok) {
      const modData = await moderationRes.json();
      const result = modData.results[0];
      return successResponse({
        flagged: result.flagged,
        categories: result.categories,
        safe: !result.flagged,
        context,
      });
    }
  }

  // Fallback sur Gemini
  const response = await callAI({
    model: MODELS.fast,
    messages: [
      { role: 'system', content: 'Tu es un modérateur de contenu. Analyse si le texte est approprié. Retourne JSON: { flagged: boolean, reason: string, safe: boolean }' },
      { role: 'user', content: text },
    ],
    maxTokens: 256,
  });

  if (!response.ok) {
    return handleAIError(response);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  
  try {
    const result = JSON.parse(content);
    return successResponse({ ...result, context });
  } catch {
    return successResponse({ flagged: false, safe: true, context });
  }
}

async function handleChat(payload: any, user: any): Promise<Response> {
  const { messages, maxTokens = 1000 } = payload;
  
  if (!messages || !Array.isArray(messages)) {
    return errorResponse('Messages array is required', 400);
  }

  const response = await callAI({
    model: MODELS.default,
    messages,
    maxTokens,
  });

  if (!response.ok) {
    return handleAIError(response);
  }

  const data = await response.json();
  return successResponse({ response: data.choices?.[0]?.message?.content || '' });
}

async function handleEmbed(payload: any): Promise<Response> {
  const { text, model = 'text-embedding-3-small' } = payload;
  
  if (!text) {
    return errorResponse('Text is required for embedding', 400);
  }

  if (!OPENAI_API_KEY) {
    return errorResponse('Embedding service not configured', 503);
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input: text, model }),
  });

  if (!response.ok) {
    return errorResponse('Embedding generation failed', 500);
  }

  const data = await response.json();
  return successResponse({ embedding: data.data?.[0]?.embedding });
}

async function handleSummarize(payload: any): Promise<Response> {
  const { text, maxLength = 200 } = payload;
  
  if (!text) {
    return errorResponse('Text is required for summarization', 400);
  }

  const response = await callAI({
    model: MODELS.fast,
    messages: [
      { role: 'system', content: `Résume le texte en maximum ${maxLength} mots. Sois concis et garde l'essentiel.` },
      { role: 'user', content: text },
    ],
    maxTokens: 512,
  });

  if (!response.ok) {
    return handleAIError(response);
  }

  const data = await response.json();
  return successResponse({ summary: data.choices?.[0]?.message?.content || '' });
}

async function handleTranslate(payload: any): Promise<Response> {
  const { text, targetLang = 'fr', sourceLang = 'auto' } = payload;
  
  if (!text) {
    return errorResponse('Text is required for translation', 400);
  }

  const response = await callAI({
    model: MODELS.fast,
    messages: [
      { role: 'system', content: `Traduis le texte en ${targetLang}. Ne réponds qu'avec la traduction, rien d'autre.` },
      { role: 'user', content: text },
    ],
    maxTokens: 1024,
  });

  if (!response.ok) {
    return handleAIError(response);
  }

  const data = await response.json();
  return successResponse({ translation: data.choices?.[0]?.message?.content || '', targetLang });
}

async function handleCrisisDetect(payload: any, user: any, supabase: any): Promise<Response> {
  const { text, context } = payload;
  
  if (!text) {
    return errorResponse('Text is required for crisis detection', 400);
  }

  const systemPrompt = `Tu es un détecteur de crise pour une application de bien-être mental. 
Analyse le texte pour détecter des signes de détresse. Retourne un JSON:
{
  "crisis_level": "none" | "low" | "medium" | "high" | "critical",
  "indicators": ["liste des indicateurs détectés"],
  "recommended_action": "action recommandée",
  "needs_immediate_attention": boolean
}`;

  const response = await callAI({
    model: MODELS.complex,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: text },
    ],
    maxTokens: 512,
  });

  if (!response.ok) {
    return handleAIError(response);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';

  try {
    const result = JSON.parse(content);
    
    // Log si niveau élevé
    if (result.crisis_level === 'high' || result.crisis_level === 'critical') {
      await supabase.from('crisis_alerts').insert({
        user_id: user.id,
        level: result.crisis_level,
        indicators: result.indicators,
        context: context?.slice(0, 500),
      }).catch(() => {});
    }

    return successResponse(result);
  } catch {
    return successResponse({ crisis_level: 'none', indicators: [], needs_immediate_attention: false });
  }
}

async function handleEmotionAnalyze(payload: any, user: any, supabase: any): Promise<Response> {
  const { input_type, raw_input, intensity = 5, context_tags = [] } = payload;

  const systemPrompt = `Tu es un analyste émotionnel. Analyse l'input et retourne un JSON:
{
  "detected_emotions": [{"label": "string", "intensity": 0-1, "confidence": 0-1}],
  "primary_emotion": "string",
  "valence": -1 à 1,
  "arousal": 0 à 1,
  "summary": "courte description"
}`;

  const response = await callAI({
    model: MODELS.default,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Type: ${input_type}\nTexte: ${raw_input}\nIntensité: ${intensity}/10\nContexte: ${context_tags.join(', ')}` },
    ],
    maxTokens: 512,
  });

  if (!response.ok) {
    return handleAIError(response);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';

  try {
    const analysis = JSON.parse(content);
    
    // Sauvegarder la session
    const { data: session } = await supabase
      .from('emotion_sessions')
      .insert({
        user_id: user.id,
        input_type,
        raw_input: raw_input?.slice(0, 500),
        detected_emotions: analysis.detected_emotions,
        primary_emotion: analysis.primary_emotion,
        intensity: intensity / 10,
        valence: analysis.valence,
        arousal: analysis.arousal,
        context_tags,
        ai_model_version: 'google/gemini-2.5-flash',
      })
      .select()
      .single();

    return successResponse({
      sessionId: session?.id,
      ...analysis,
    });
  } catch {
    return successResponse({
      detected_emotions: [],
      primary_emotion: 'neutral',
      valence: 0,
      arousal: 0.5,
      summary: 'Analyse non disponible',
    });
  }
}

async function handleContextRecommend(payload: any, user: any, supabase: any): Promise<Response> {
  const { 
    valence = 0.5, 
    arousal = 0.5, 
    timeOfDay = getTimeOfDay(),
    recentActivity,
    streakDays = 0 
  } = payload;

  // Récupérer le contexte utilisateur depuis la DB
  const [moodHistory, activityHistory, preferences] = await Promise.all([
    supabase
      .from('mood_entries')
      .select('valence, arousal, created_at, primary_emotion')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(7),
    supabase
      .from('activity_sessions')
      .select('activity_id, completed, rating, completed_at')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(10),
    supabase
      .from('user_preferences')
      .select('preferred_activities, notification_frequency')
      .eq('user_id', user.id)
      .single(),
  ]);

  // Construire le contexte pour l'IA
  const contextSummary = {
    currentMood: { valence, arousal },
    timeOfDay,
    moodTrend: analyzeMoodTrend(moodHistory.data || []),
    recentCompletions: (activityHistory.data || []).filter(a => a.completed).length,
    streakDays,
    preferences: preferences.data,
  };

  const systemPrompt = `Tu es un moteur de recommandation IA pour EmotionsCare. 
Analyse le contexte utilisateur et recommande les 3 meilleurs modules.

Modules disponibles:
- scan: Scanner émotionnel (pour prise de conscience)
- breath: Respiration guidée (stress, anxiété)
- music: Musicothérapie (régulation émotionnelle)
- coach: Coach IA Nyvée (support conversationnel)
- journal: Journal émotionnel (introspection)
- gamification: Défis et progression (motivation)
- vr: Expériences immersives (évasion)
- social-cocon: Communauté (soutien social)

Retourne un JSON valide:
{
  "recommendations": [
    {
      "module": "string",
      "priority": 1-3,
      "reason": "explication courte",
      "confidence": 0-1,
      "urgency": "immediate" | "suggested" | "optional"
    }
  ],
  "insight": "observation personnalisée sur l'état actuel",
  "microAction": "action rapide 30s recommandée"
}`;

  const response = await callAI({
    model: MODELS.default,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: JSON.stringify(contextSummary) },
    ],
    maxTokens: 512,
  });

  if (!response.ok) {
    // Fallback intelligent sans IA
    return successResponse(getFallbackRecommendations(valence, arousal, timeOfDay));
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';

  try {
    const result = JSON.parse(content);
    
    // Logger pour analytics
    await supabase.from('ai_recommendations').insert({
      user_id: user.id,
      recommendation_type: 'context-aware',
      content_type: 'module',
      content_id: result.recommendations?.[0]?.module || 'scan',
      reason: result.recommendations?.[0]?.reason || '',
      confidence_score: result.recommendations?.[0]?.confidence || 0.5,
      priority_level: 'high',
    }).catch(() => {});

    return successResponse({
      ...result,
      context: contextSummary,
      generatedAt: new Date().toISOString(),
    });
  } catch {
    return successResponse(getFallbackRecommendations(valence, arousal, timeOfDay));
  }
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

function analyzeMoodTrend(moodHistory: any[]): string {
  if (moodHistory.length < 2) return 'insufficient_data';
  const recentAvg = moodHistory.slice(0, 3).reduce((sum, m) => sum + (m.valence || 0), 0) / 3;
  const olderAvg = moodHistory.slice(3).reduce((sum, m) => sum + (m.valence || 0), 0) / Math.max(1, moodHistory.length - 3);
  if (recentAvg > olderAvg + 0.1) return 'improving';
  if (recentAvg < olderAvg - 0.1) return 'declining';
  return 'stable';
}

function getFallbackRecommendations(valence: number, arousal: number, timeOfDay: string) {
  const recommendations = [];

  // Logique heuristique basée sur valence/arousal
  if (valence < 0.3 && arousal > 0.6) {
    // Stress/anxiété
    recommendations.push(
      { module: 'breath', priority: 1, reason: 'Respiration pour calmer le stress', confidence: 0.85, urgency: 'immediate' },
      { module: 'music', priority: 2, reason: 'Musique apaisante', confidence: 0.75, urgency: 'suggested' },
    );
  } else if (valence < 0.3 && arousal < 0.4) {
    // Tristesse/fatigue
    recommendations.push(
      { module: 'coach', priority: 1, reason: 'Support émotionnel avec Nyvée', confidence: 0.8, urgency: 'immediate' },
      { module: 'music', priority: 2, reason: 'Musique énergisante douce', confidence: 0.7, urgency: 'suggested' },
    );
  } else if (valence > 0.6) {
    // État positif
    recommendations.push(
      { module: 'journal', priority: 1, reason: 'Capturer ce moment positif', confidence: 0.8, urgency: 'suggested' },
      { module: 'gamification', priority: 2, reason: 'Continuer sur la lancée', confidence: 0.7, urgency: 'optional' },
    );
  } else {
    // État neutre
    recommendations.push(
      { module: 'scan', priority: 1, reason: 'Explorer votre état actuel', confidence: 0.7, urgency: 'suggested' },
      { module: 'breath', priority: 2, reason: 'Micro-session de recentrage', confidence: 0.65, urgency: 'optional' },
    );
  }

  // Ajouter recommandation contextuelle basée sur l'heure
  if (timeOfDay === 'morning') {
    recommendations.push({ module: 'breath', priority: 3, reason: 'Routine matinale énergisante', confidence: 0.6, urgency: 'optional' });
  } else if (timeOfDay === 'night') {
    recommendations.push({ module: 'music', priority: 3, reason: 'Détente nocturne', confidence: 0.6, urgency: 'optional' });
  }

  return {
    recommendations: recommendations.slice(0, 3),
    insight: 'Recommandations basées sur votre état émotionnel actuel',
    microAction: valence < 0.4 ? '3 respirations profondes' : 'Sourire 10 secondes',
    fallback: true,
  };
}

// ============ HELPERS ============

function getCoachPersonality(personality: string): string {
  const personalities: Record<string, string> = {
    empathetic: `Tu es Nyvée, une coach émotionnelle bienveillante et empathique. Tu accompagnes des professionnels de santé. Réponds en français avec chaleur.`,
    analytical: `Tu es un coach analytique. Tu aides à comprendre les patterns émotionnels avec précision. Réponds en français de manière structurée.`,
    motivational: `Tu es un coach motivationnel. Tu encourages et inspires. Réponds en français avec énergie positive.`,
  };
  return personalities[personality] || personalities.empathetic;
}

async function callAI(options: {
  model: string;
  messages: any[];
  maxTokens: number;
  temperature?: number;
}): Promise<Response> {
  return fetch(AI_GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      max_tokens: options.maxTokens,
      temperature: options.temperature ?? 0.7,
    }),
  });
}

function handleAIError(response: Response): Response {
  if (response.status === 429) {
    return errorResponse('Rate limit exceeded', 429);
  }
  if (response.status === 402) {
    return errorResponse('AI credits exhausted', 402);
  }
  return errorResponse('AI service error', 503);
}

function successResponse(data: any): Response {
  return new Response(JSON.stringify({ success: true, ...data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function errorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
