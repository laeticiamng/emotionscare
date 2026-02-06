import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface CoachSuggestions {
  techniques: string[];
  resources: Array<{ type: string; title: string; description: string }>;
  followUpQuestions: string[];
  emotion?: string;
}

export interface SendCoachMessageOptions {
  threadId?: string;
  message: string;
  mode?: 'b2c' | 'b2b';
  locale?: 'fr' | 'en';
  userHash?: string;
  flexHint?: 'souple' | 'transition' | 'rigide';
  personality?: string;
  conversationHistory?: Array<{ role: string; content: string }>;
  signal?: AbortSignal;
  onChunk?: (chunk: string) => void;
  onThread?: (threadId: string) => void;
  onDisclaimers?: (items: string[]) => void;
  onSuggestions?: (suggestions: CoachSuggestions) => void;
}

export interface CoachApiResponse {
  threadId: string;
  text: string;
  disclaimers: string[];
  suggestions?: CoachSuggestions;
}

export async function sendMessage(options: SendCoachMessageOptions): Promise<CoachApiResponse> {
  // Build the payload for the edge function
  const payload = {
    message: options.message,
    conversationHistory: options.conversationHistory ?? [],
    userEmotion: 'neutral',
    coachPersonality: options.personality ?? 'empathetic',
    context: options.mode === 'b2b' ? 'Mode professionnel B2B' : '',
    threadId: options.threadId,
    flexHint: options.flexHint,
  };

  // Use supabase.functions.invoke which handles auth automatically
  const { data: json, error } = await supabase.functions.invoke('ai-coach', {
    body: payload,
  });

  if (error) {
    logger.error('[coachApi] Request failed:', error, 'COACH');
    throw new Error(`coach_failed: ${error.message}`);
  }

  const threadId = typeof json?.thread_id === 'string' ? json.thread_id : options.threadId ?? `thread-${Date.now()}`;
  const text = String(json?.response ?? json?.messages?.[0]?.content ?? '');
  const disclaimers = Array.isArray(json?.disclaimers)
    ? json.disclaimers.filter((item: unknown): item is string => typeof item === 'string')
    : [];

  // Parse suggestions from response
  const suggestions: CoachSuggestions = {
    techniques: Array.isArray(json?.techniques) ? json.techniques : [],
    resources: Array.isArray(json?.resources) ? json.resources : [],
    followUpQuestions: Array.isArray(json?.followUpQuestions) ? json.followUpQuestions : [],
    emotion: json?.emotion,
  };

  if (text && options.onChunk) {
    options.onChunk(text);
  }
  if (threadId && options.onThread) {
    options.onThread(threadId);
  }
  if (disclaimers.length && options.onDisclaimers) {
    options.onDisclaimers(disclaimers);
  }
  if (suggestions.techniques.length || suggestions.resources.length || suggestions.followUpQuestions.length) {
    options.onSuggestions?.(suggestions);
  }

  return { threadId, text, disclaimers, suggestions };
}
