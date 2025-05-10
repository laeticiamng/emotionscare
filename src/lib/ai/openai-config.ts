
// Configuration for OpenAI API models

export type AIModule = 
  | 'chat'
  | 'emotion-analysis'
  | 'content-moderation'
  | 'journal-assistant'
  | 'security';

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
    model: 'gpt-4-turbo',
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    cacheEnabled: false
  },
  'emotion-analysis': {
    model: 'gpt-4-turbo',
    temperature: 0.2, // Plus bas pour des analyses plus cohérentes
    max_tokens: 800,
    top_p: 1,
    stream: false,
    cacheEnabled: true,
    cacheTTL: 3600 // 1 heure
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
    model: 'gpt-4-turbo',
    temperature: 0.5,
    max_tokens: 1500,
    top_p: 1,
    stream: false,
    cacheEnabled: false
  },
  'security': {
    model: 'gpt-4-turbo',
    temperature: 0.1, // Très bas pour maximiser la précision
    max_tokens: 500,
    top_p: 1,
    stream: false,
    cacheEnabled: false
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
    If detected, explain why without repeating the problematic content.`
};
