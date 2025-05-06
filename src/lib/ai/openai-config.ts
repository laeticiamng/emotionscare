
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
    model: "gpt-4o-mini-2024-07-18",
    temperature: 0.2,
    max_tokens: 256,
    top_p: 1.0,
    stream: false,
    cacheEnabled: true,
    cacheTTL: 86400 // 24 hours cache
  },
  
  // Coach initial session - more powerful model with streaming
  coach: {
    model: "gpt-4.1-2025-04-14",
    temperature: 0.4,
    max_tokens: 512,
    top_p: 1.0,
    stream: true
  },
  
  // Coach follow-up sessions - cheaper model with streaming
  coach_followup: {
    model: "gpt-4o-mini-2024-07-18",
    temperature: 0.2,
    max_tokens: 512,
    top_p: 1.0,
    stream: true
  },
  
  // Journal & long-form content - powerful model for batch processing
  journal: {
    model: "gpt-4.1-2025-04-14",
    temperature: 0.3,
    max_tokens: 1024,
    top_p: 1.0,
    stream: false
  },
  
  // Buddy/peer suggestions - friendly tone, shorter responses
  buddy: {
    model: "gpt-4o-mini-2024-07-18",
    temperature: 0.5,
    max_tokens: 256,
    top_p: 1.0,
    stream: false
  },
  
  // Scan/quick check-ups - efficient, concise responses
  scan: {
    model: "gpt-4o-mini-2024-07-18",
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
  "gpt-4.1-2025-04-14": 100, // $100 monthly threshold
  "gpt-4o-2024-08-06": 75,   // $75 monthly threshold
  "default": 200              // $200 overall budget threshold
};

/**
 * Models to use as fallbacks when budget thresholds are exceeded
 */
export const BUDGET_FALLBACKS = {
  "gpt-4.1-2025-04-14": "gpt-4o-mini-2024-07-18",
  "gpt-4o-2024-08-06": "gpt-4o-mini-2024-07-18",
  "default": "gpt-4o-mini-2024-07-18"
};

/**
 * Get the optimal model configuration based on module and budget constraints
 */
export function getModelConfig(module: AIModule, budgetExceeded = false): OpenAIModelParams {
  const config = { ...AI_MODEL_CONFIG[module] };
  
  // Apply budget guardrails if needed
  if (budgetExceeded && module !== 'scan') { // Always keep scan quality as it's minimal cost
    config.model = "gpt-4o-mini-2024-07-18";
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
  // Use the last user message as the key, plus the model
  const lastUserMessage = messages.findLast(m => m.role === 'user')?.content || '';
  return `${model}:${lastUserMessage.substring(0, 100)}`;
}
