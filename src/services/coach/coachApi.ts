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

const END_TOKEN = '[END]';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://yaincoxihiqdksxgrsrk.supabase.co';
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/ai-coach-response`;

function buildPayload(options: SendCoachMessageOptions) {
  return {
    thread_id: options.threadId,
    message: options.message,
    mode: options.mode ?? 'b2c',
    locale: options.locale ?? 'fr',
    user_hash: options.userHash,
    flex_hint: options.flexHint,
    coachPersonality: options.personality ?? 'empathetic',
    conversationHistory: options.conversationHistory ?? [],
    userEmotion: 'neutral',
  };
}

export async function sendMessage(options: SendCoachMessageOptions): Promise<CoachApiResponse> {
  const payload = buildPayload(options);
  const body = JSON.stringify(payload);

  // Use fetch directly for better control and error handling

  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU';
  
  const response = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${anonKey}`,
      'apikey': anonKey,
    },
    body,
    signal: options.signal,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    console.error('[coachApi] Request failed:', response.status, errorText);
    throw new Error(`coach_failed_${response.status}`);
  }

  const json = await response.json();
  const threadId = typeof json?.thread_id === 'string' ? json.thread_id : options.threadId ?? 'new';
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
