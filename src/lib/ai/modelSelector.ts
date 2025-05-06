
import { AI_MODEL_CONFIG, CoachModule, AIModelParams } from '@/lib/coach/types';

interface ModelSelectionCriteria {
  textLength?: number;
  isStreaming?: boolean;
  isComplex?: boolean;
  isFrequentRequest?: boolean;
  isBatchOperation?: boolean;
  moduleType: CoachModule;
  budgetExceeded?: boolean;
}

/**
 * Intelligent model selector based on request criteria
 * 
 * This implements the specification from the prompt:
 * - Chat/FAQ: gpt-4o-mini-2024-07-18 (with 24h cache)
 * - Coach init: gpt-4.1-2025-04-14 → then follow-up with gpt-4o-mini-2024-07-18
 * - Journal batch: gpt-4.1-2025-04-14
 * - Buddy & Scan: gpt-4o-mini-2024-07-18
 * - Budget guardrails to downgrade models when needed
 */
export function selectAIModel(criteria: ModelSelectionCriteria): AIModelParams {
  // Clone the default config for the module
  const config = { ...AI_MODEL_CONFIG[criteria.moduleType] };
  
  // Budget guardrail - always use cheaper model if budget exceeded
  if (criteria.budgetExceeded && criteria.moduleType !== 'scan') {
    return {
      model: "gpt-4o-mini-2024-07-18",
      temperature: config.temperature,
      max_tokens: config.max_tokens,
      top_p: config.top_p,
      stream: config.stream
    };
  }
  
  // For initial coach sessions, use more powerful model
  if (criteria.moduleType === 'coach' && criteria.isComplex) {
    return {
      model: "gpt-4.1-2025-04-14",
      temperature: 0.4,
      max_tokens: 512,
      top_p: 1.0,
      stream: true
    };
  }
  
  // For journal batch operations, use more capable model
  if (criteria.moduleType === 'journal' && criteria.isBatchOperation) {
    return {
      model: "gpt-4.1-2025-04-14",
      temperature: 0.3,
      max_tokens: 1024,
      top_p: 1.0,
      stream: false
    };
  }
  
  // For frequently asked questions with caching
  if (criteria.isFrequentRequest && criteria.moduleType === 'chat') {
    return {
      model: "gpt-4o-mini-2024-07-18",
      temperature: 0.2,
      max_tokens: 256,
      top_p: 1.0,
      stream: false
    };
  }
  
  // Return the default configuration for the module
  return config;
}

/**
 * Check if a request should be cached (for 24h)
 */
export function shouldCacheResponse(moduleType: CoachModule): boolean {
  // Only cache FAQ and Scan responses
  return ['chat', 'scan'].includes(moduleType);
}

/**
 * Generate cache key for AI responses
 */
export function generateCacheKey(model: string, prompt: string): string {
  return `${model}:${prompt.substring(0, 100)}`;
}
