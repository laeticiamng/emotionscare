// @ts-nocheck

// Configuration for OpenAI API models

export type AIModule = 
  | 'chat'
  | 'emotion-analysis'
  | 'content-moderation'
  | 'journal-assistant'
  | 'security'
  | 'journal'
  | 'coach'
  | 'buddy'
  | 'scan'
  | 'premium-support'
  | 'help-center';

export interface OpenAIModelParams {
  model: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream: boolean;
  cacheEnabled: boolean;
  cacheTTL?: number; // Cache time-to-live in seconds
}

export const AI_MODEL_CONFIG: Record<AIModule, OpenAIModelParams> = {
  'chat': {
    model: 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    cacheEnabled: false
  },
  'emotion-analysis': {
    model: 'gpt-4o-mini',
    temperature: 0.2, 
    max_tokens: 800,
    top_p: 1,
    stream: false,
    cacheEnabled: true,
    cacheTTL: 3600 // 1 hour
  },
  'content-moderation': {
    model: 'text-moderation-latest',
    temperature: 0,
    max_tokens: 200,
    top_p: 1,
    stream: false,
    cacheEnabled: true,
    cacheTTL: 300 // 5 minutes
  },
  'journal-assistant': {
    model: 'gpt-4o-mini',
    temperature: 0.5,
    max_tokens: 1500,
    top_p: 1,
    stream: false,
    cacheEnabled: false
  },
  'security': {
    model: 'gpt-4o-mini',
    temperature: 0.1, 
    max_tokens: 500,
    top_p: 1,
    stream: false,
    cacheEnabled: false
  },
  'journal': {
    model: 'gpt-4o-mini',
    temperature: 0.5,
    max_tokens: 1500,
    top_p: 1,
    stream: false,
    cacheEnabled: false
  },
  'coach': {
    model: 'gpt-4o-mini',
    temperature: 0.6,
    max_tokens: 1200,
    top_p: 1,
    stream: true,
    cacheEnabled: false
  },
  'buddy': {
    model: 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 800,
    top_p: 1,
    stream: false,
    cacheEnabled: true,
    cacheTTL: 1800 // 30 minutes
  },
  'scan': {
    model: 'gpt-4o-mini',
    temperature: 0.3,
    max_tokens: 600,
    top_p: 1,
    stream: false,
    cacheEnabled: true,
    cacheTTL: 3600 // 1 hour
  },
  'premium-support': {
    model: 'gpt-4o',
    temperature: 0.5,
    max_tokens: 1500,
    top_p: 1,
    frequency_penalty: 0.1,
    presence_penalty: 0.1,
    stream: true,
    cacheEnabled: false
  },
  'help-center': {
    model: 'gpt-4o-mini',
    temperature: 0.3,
    max_tokens: 1200,
    top_p: 1,
    stream: false,
    cacheEnabled: true,
    cacheTTL: 3600 * 24 // 24 hours
  }
};

// Prompt templates for various modules
export const PROMPT_TEMPLATES = {
  EMOTION_ANALYSIS: 
    `Analyze the emotional content of the following text, identifying primary emotions, intensity, and potential triggers. 
    Provide a supportive response that acknowledges the emotions and offers constructive perspective.`,
  
  JOURNAL_ASSISTANT:
    `You are a supportive journal assistant. Review this journal entry and provide thoughtful insights about the emotional patterns,
    offer gentle perspective if needed, and suggest reflective questions that might help the user gain deeper understanding.
    Be empathetic, non-judgmental, and focus on emotional wellbeing.`,
  
  CONTENT_SAFETY:
    `Evaluate if the following content contains any inappropriate material according to these categories:
    hate speech, violence, self-harm, sexual content, harassment, or other harmful content.
    If detected, explain why without repeating the problematic content.`,
    
  PREMIUM_SUPPORT:
    `You are an ultra-premium customer support assistant for EmotionsCare, a mental wellness platform for healthcare professionals.
    Your responses should be empathetic, personalized, and highly professional. Detect the emotional state of the user and adapt 
    your tone accordingly. Always aim to provide comprehensive solutions while maintaining a warm, reassuring presence.
    If you cannot resolve an issue, assure the user that a human specialist will contact them promptly and collect relevant information.`
};

// Budget controls and thresholds
export const BUDGET_THRESHOLDS = {
  'gpt-4o': 100, // $100 monthly budget
  'gpt-4o-mini': 50, // $50 monthly budget
  'default': 200 // Overall budget cap
};

// Fallback models for budget control
export const BUDGET_FALLBACKS = {
  'gpt-4o': 'gpt-4o-mini',
  'gpt-4-turbo': 'gpt-4o-mini',
  'default': 'gpt-4o-mini'
};
