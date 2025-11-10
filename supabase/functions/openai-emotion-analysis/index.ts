// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from 'https://deno.land/x/openai@v4.28.0/mod.ts';
import { authenticateRequest } from '../_shared/auth-middleware.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';
import { validateRequest, createErrorResponse, EmotionAnalysisSchema } from '../_shared/validation.ts';
import { getCorsHeaders, handleCors } from '../_shared/cors.ts';

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // 🔒 SÉCURITÉ: Authentification obligatoire
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200 || !authResult.user) {
      console.warn('[openai-emotion-analysis] Unauthorized access attempt');
      return createErrorResponse(authResult.error || 'Authentication required', authResult.status, corsHeaders);
    }

    // 🛡️ SÉCURITÉ: Rate limiting strict (10 req/min par utilisateur)
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'openai-emotion-analysis',
      userId: authResult.user.id,
      limit: 10,
      windowMs: 60_000,
      description: 'OpenAI emotion analysis - GPT-4 API calls'
    });

    if (!rateLimit.allowed) {
      console.warn('[openai-emotion-analysis] Rate limit exceeded', { userId: authResult.user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`
      });
    }

    // ✅ VALIDATION: Validation Zod des entrées
    const validation = await validateRequest(req, EmotionAnalysisSchema);
    if (!validation.success) {
      return createErrorResponse(validation.error, validation.status, corsHeaders);
    }

    const { type, data, model } = validation.data;
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });

    let analysisResult;
    
    switch (type) {
      case 'text':
        analysisResult = await analyzeTextWithOpenAI(openai, data.text, model);
        break;
      case 'image':
        analysisResult = await analyzeImageWithOpenAI(openai, data.imageUrl, model);
        break;
      case 'conversation':
        analysisResult = await analyzeConversationWithOpenAI(openai, data.messages, model);
        break;
      default:
        throw new Error(`Unsupported analysis type: ${type}`);
    }

    // Transform OpenAI response to EmotionsCare format
    const emotionResult = transformOpenAIResponse(analysisResult, type);

    return new Response(
      JSON.stringify(emotionResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ OpenAI Analysis Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function analyzeTextWithOpenAI(openai: OpenAI, text: string, model: string) {
  const systemPrompt = `Vous êtes un expert en analyse émotionnelle pour EmotionsCare. 
Analysez le texte fourni et identifiez les émotions présentes avec leur intensité et confidence.

Répondez au format JSON suivant:
{
  "emotions": [
    {"emotion": "nom_emotion", "confidence": 0.0-1.0, "intensity": 0.0-1.0}
  ],
  "dominantEmotion": "emotion_principale",
  "overallMood": "positive|negative|neutral|calm",
  "confidence": 0.0-1.0,
  "insights": ["insight1", "insight2"],
  "recommendations": ["recommendation1", "recommendation2"]
}

Émotions possibles: joy, happiness, sadness, anger, fear, anxiety, calm, excitement, love, gratitude, frustration, surprise, disgust, contempt, neutral`;

  const response = await openai.chat.completions.create({
    model: model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Analysez ce texte: "${text}"` }
    ],
    temperature: 0.3,
    max_tokens: 800
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}

async function analyzeImageWithOpenAI(openai: OpenAI, imageUrl: string, model: string) {
  const systemPrompt = `Vous êtes un expert en analyse émotionnelle visuelle pour EmotionsCare.
Analysez l'image fournie et identifiez les émotions exprimées par les visages et le contexte visuel.

Répondez au format JSON suivant:
{
  "emotions": [
    {"emotion": "nom_emotion", "confidence": 0.0-1.0, "intensity": 0.0-1.0}
  ],
  "dominantEmotion": "emotion_principale",
  "overallMood": "positive|negative|neutral|calm",
  "confidence": 0.0-1.0,
  "insights": ["insight1", "insight2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "visualContext": "description du contexte visuel"
}`;

  const response = await openai.chat.completions.create({
    model: model,
    messages: [
      { role: 'system', content: systemPrompt },
      { 
        role: 'user', 
        content: [
          { type: 'text', text: 'Analysez les émotions dans cette image:' },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      }
    ],
    temperature: 0.3,
    max_tokens: 800
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}

async function analyzeConversationWithOpenAI(openai: OpenAI, messages: any[], model: string) {
  const systemPrompt = `Vous êtes un expert en analyse émotionnelle conversationnelle pour EmotionsCare.
Analysez cette conversation et identifiez l'évolution émotionnelle et l'état émotionnel global.

Répondez au format JSON suivant:
{
  "emotions": [
    {"emotion": "nom_emotion", "confidence": 0.0-1.0, "intensity": 0.0-1.0}
  ],
  "dominantEmotion": "emotion_principale",
  "overallMood": "positive|negative|neutral|calm",
  "confidence": 0.0-1.0,
  "insights": ["insight1", "insight2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "emotionalEvolution": "description de l'évolution émotionnelle"
}`;

  const conversationText = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');

  const response = await openai.chat.completions.create({
    model: model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Analysez cette conversation:\n\n${conversationText}` }
    ],
    temperature: 0.3,
    max_tokens: 800
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}

function transformOpenAIResponse(openaiResponse: any, type: string) {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    source: `openai_${type}`,
    emotions: openaiResponse.emotions || [],
    dominantEmotion: openaiResponse.dominantEmotion || 'neutral',
    confidence: openaiResponse.confidence || 0.5,
    overallMood: openaiResponse.overallMood || 'neutral',
    recommendations: openaiResponse.recommendations || [],
    insights: openaiResponse.insights || [],
    metadata: {
      analysis_type: type,
      model_used: 'openai_gpt4',
      generated_at: new Date().toISOString(),
      ...openaiResponse
    }
  };
}