// @ts-nocheck
import { z } from './zod.ts';

/**
 * Schémas de validation Zod centralisés pour Edge Functions
 * Utilisés pour valider les entrées utilisateur et prévenir injections/abus
 */

// ============================================
// Schémas d'authentification et rate limiting
// ============================================

export const BearerTokenSchema = z.string().regex(/^Bearer .+/, 'Invalid authorization header format');

// ============================================
// Schémas OpenAI - Analyse émotionnelle
// ============================================

export const EmotionAnalysisTextSchema = z.object({
  type: z.literal('text'),
  data: z.object({
    text: z.string().min(1, 'Text cannot be empty').max(5000, 'Text too long (max 5000 chars)')
  }),
  model: z.string().optional().default('gpt-4.1-2025-04-14')
});

export const EmotionAnalysisImageSchema = z.object({
  type: z.literal('image'),
  data: z.object({
    imageUrl: z.string().url('Invalid image URL')
  }),
  model: z.string().optional().default('gpt-4.1-2025-04-14')
});

export const EmotionAnalysisConversationSchema = z.object({
  type: z.literal('conversation'),
  data: z.object({
    messages: z.array(z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string().max(2000, 'Message too long')
    })).min(1).max(20, 'Too many messages (max 20)')
  }),
  model: z.string().optional().default('gpt-4.1-2025-04-14')
});

export const EmotionAnalysisSchema = z.discriminatedUnion('type', [
  EmotionAnalysisTextSchema,
  EmotionAnalysisImageSchema,
  EmotionAnalysisConversationSchema
]);

// ============================================
// Schémas AI Coach
// ============================================

export const AICoachRequestSchema = z.object({
  message: z.string().trim().min(1, 'Message required').max(2000, 'Message too long (max 2000 chars)'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().max(2000)
  })).max(20, 'History too long (max 20 messages)').optional().default([]),
  userEmotion: z.string().max(50).optional().default('neutral'),
  coachPersonality: z.enum(['empathetic', 'analytical', 'motivational', 'mindful', 'zen', 'energetic']).optional().default('empathetic'),
  context: z.string().max(500).optional().default('')
});

// ============================================
// Schémas OpenAI - Audio (Whisper, TTS)
// ============================================

export const TranscribeAudioSchema = z.object({
  audio: z.instanceof(File).refine(
    (file) => file.size <= 25 * 1024 * 1024, 
    'Audio file too large (max 25MB)'
  ).refine(
    (file) => ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/mp4'].includes(file.type),
    'Invalid audio format'
  )
});

export const TTSRequestSchema = z.object({
  text: z.string().min(1, 'Text required').max(4000, 'Text too long (max 4000 chars)'),
  voice: z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']).optional().default('alloy'),
  model: z.enum(['tts-1', 'tts-1-hd']).optional().default('tts-1')
});

// ============================================
// Schémas OpenAI - Embeddings
// ============================================

export const EmbeddingsRequestSchema = z.object({
  input: z.string().min(1, 'Input text required').max(8000, 'Text too long (max 8000 chars)'),
  model: z.enum(['text-embedding-3-small', 'text-embedding-3-large', 'text-embedding-ada-002'])
    .optional().default('text-embedding-3-small')
});

// ============================================
// Schémas OpenAI - Moderation
// ============================================

export const ModerationRequestSchema = z.object({
  input: z.string().min(1, 'Input text required').max(10000, 'Text too long (max 10000 chars)')
});

// ============================================
// Schémas OpenAI - Chat
// ============================================

export const ChatMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string().max(4000, 'Message content too long')
});

export const OpenAIChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1, 'At least one message required').max(50, 'Too many messages'),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().int().min(1).max(4000).optional()
});

// ============================================
// Schémas OpenAI - Structured Output
// ============================================

export const StructuredOutputRequestSchema = z.object({
  systemPrompt: z.string().min(1).max(2000, 'System prompt too long'),
  userPrompt: z.string().min(1).max(3000, 'User prompt too long'),
  schema: z.record(z.any()),
  schemaName: z.string().min(1).max(100).optional().default('Response')
});

// ============================================
// Schémas Voice Analysis (Hume/Lovable AI)
// ============================================

export const VoiceAnalysisSchema = z.object({
  audioBase64: z.string()
    .min(100, 'Audio data too short')
    .max(10 * 1024 * 1024, 'Audio data too large (max ~10MB base64)')
});

export const HumeAnalysisSchema = z.object({
  audioData: z.string().optional(),
  imageBase64: z.string().optional(),
  analysisType: z.enum(['emotion', 'multimodal', 'facial', 'voice']).optional().default('facial')
}).refine(data => data.audioData || data.imageBase64, {
  message: 'Either audioData or imageBase64 is required'
});

// ============================================
// Schémas Text Analysis (Lovable AI)
// ============================================

export const TextAnalysisSchema = z.object({
  text: z.string()
    .min(1, 'Text cannot be empty')
    .max(10000, 'Text too long (max 10000 chars)'),
  language: z.enum(['fr', 'en', 'es', 'de', 'it', 'pt']).optional().default('fr')
});

// ============================================
// Fonctions utilitaires de validation
// ============================================

/**
 * Valide et parse un body JSON avec gestion d'erreurs
 */
export async function validateRequest<T>(
  req: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: string; status: number }> {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);
    
    if (!result.success) {
      const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      console.warn('[Validation] Request validation failed:', errors);
      return {
        success: false,
        error: `Invalid input: ${errors}`,
        status: 400
      };
    }
    
    return { success: true, data: result.data };
  } catch (error) {
    console.error('[Validation] Failed to parse JSON:', error);
    return {
      success: false,
      error: 'Invalid JSON body',
      status: 400
    };
  }
}

/**
 * Valide un FormData (pour uploads de fichiers)
 */
export function validateFormData(
  formData: FormData,
  schema: z.ZodSchema
): { success: true; data: any } | { success: false; error: string; status: number } {
  try {
    const data = Object.fromEntries(formData.entries());
    const result = schema.safeParse(data);
    
    if (!result.success) {
      const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      console.warn('[Validation] FormData validation failed:', errors);
      return {
        success: false,
        error: `Invalid form data: ${errors}`,
        status: 400
      };
    }
    
    return { success: true, data: result.data };
  } catch (error) {
    console.error('[Validation] FormData validation error:', error);
    return {
      success: false,
      error: 'Invalid form data',
      status: 400
    };
  }
}

/**
 * Crée une réponse d'erreur standardisée
 */
export function createErrorResponse(
  error: string,
  status: number,
  corsHeaders: Record<string, string>
): Response {
  return new Response(
    JSON.stringify({ error }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}
