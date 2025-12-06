// @ts-nocheck

// Configuration for AI models used in different parts of the application
export const AI_MODEL_CONFIG = {
  chat: {
    model: 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 0.9,
    stream: true,
    cacheEnabled: true,
    cacheTTL: 3600 // Cache for 1 hour
  },
  journal: {
    model: 'gpt-4o',
    temperature: 0.5,
    max_tokens: 1500,
    top_p: 0.9,
    stream: true,
    cacheEnabled: true,
    cacheTTL: 86400 // Cache for 24 hours
  },
  coach: {
    model: 'gpt-4o',
    temperature: 0.3,
    max_tokens: 800,
    top_p: 0.95,
    stream: false,
    cacheEnabled: true,
    cacheTTL: 3600 // Cache for 1 hour
  },
  scan: {
    model: 'gpt-4o-mini',
    temperature: 0.4,
    max_tokens: 1000,
    top_p: 0.9,
    stream: false,
    cacheEnabled: true,
    cacheTTL: 1800 // Cache for 30 minutes
  }
};

export default AI_MODEL_CONFIG;
