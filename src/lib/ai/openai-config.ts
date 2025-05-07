
/**
 * OpenAI API Models Configuration
 * 
 * This file contains all the models, parameters, and configurations for OpenAI API calls.
 * It implements the budget guardrails and module-specific optimizations as specified.
 */

export type OpenAIModelParams = {
  model: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  stream: boolean;
  cacheEnabled?: boolean;
  cacheTTL?: number; // in seconds
};

// Module types for different parts of the application
export type AIModule = 'chat' | 'coach' | 'coach_followup' | 'journal' | 'buddy' | 'scan';

// Model configurations per module
export const AI_MODEL_CONFIG: Record<AIModule, OpenAIModelParams> = {
  // Chat general & FAQ - cheapest model with caching
  chat: {
    model: "gpt-4o-mini",
    temperature: 0.2,
    max_tokens: 256,
    top_p: 1.0,
    stream: false,
    cacheEnabled: true,
    cacheTTL: 86400 // 24 hours cache
  },
  
  // Coach initial session - more powerful model with streaming
  coach: {
    model: "gpt-4o",
    temperature: 0.4,
    max_tokens: 512,
    top_p: 1.0,
    stream: true
  },
  
  // Coach follow-up sessions - cheaper model with streaming
  coach_followup: {
    model: "gpt-4o-mini",
    temperature: 0.2,
    max_tokens: 512,
    top_p: 1.0,
    stream: true
  },
  
  // Journal & long-form content - powerful model for batch processing
  journal: {
    model: "gpt-4o",
    temperature: 0.3,
    max_tokens: 1024,
    top_p: 1.0,
    stream: false
  },
  
  // Buddy/peer suggestions - friendly tone, shorter responses
  buddy: {
    model: "gpt-4o-mini",
    temperature: 0.5,
    max_tokens: 256,
    top_p: 1.0,
    stream: false
  },
  
  // Scan/quick check-ups - efficient, concise responses
  scan: {
    model: "gpt-4o-mini",
    temperature: 0.2,
    max_tokens: 128,
    top_p: 1.0,
    stream: false,
    cacheEnabled: true,
    cacheTTL: 86400 // 24 hours cache
  }
};

/**
 * Budget thresholds for OpenAI API usage
 * When thresholds are exceeded, the system will downgrade to more cost-effective models
 */
export const BUDGET_THRESHOLDS = {
  "gpt-4o": 100, // $100 monthly threshold
  "gpt-4o-mini": 20,   // $20 monthly threshold
  "default": 200       // $200 overall budget threshold
};

/**
 * Models to use as fallbacks when budget thresholds are exceeded
 */
export const BUDGET_FALLBACKS = {
  "gpt-4o": "gpt-4o-mini",
  "default": "gpt-4o-mini"
};

/**
 * Get the optimal model configuration based on module and budget constraints
 */
export function getModelConfig(module: AIModule, budgetExceeded = false): OpenAIModelParams {
  const config = { ...AI_MODEL_CONFIG[module] };
  
  // Apply budget guardrails if needed
  if (budgetExceeded && module !== 'scan') { // Always keep scan quality as it's minimal cost
    config.model = "gpt-4o-mini";
  }
  
  return config;
}

/**
 * Common headers for OpenAI API calls
 */
export function getOpenAIHeaders(apiKey: string) {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
  };
}

/**
 * Generate a cache key for OpenAI requests
 */
export function generateCacheKey(model: string, messages: any[]): string {
  // Find the last user message (replacing findLast with a more compatible approach)
  let lastUserMessage = '';
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') {
      lastUserMessage = messages[i].content || '';
      break;
    }
  }
  
  return `${model}:${lastUserMessage.substring(0, 100)}`;
}
