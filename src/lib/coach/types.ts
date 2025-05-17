
// AI model configurations for different features
export const AI_MODEL_CONFIG = {
  chat: {
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 500,
    top_p: 1,
    stream: false,
    cacheEnabled: true,
    cacheTTL: 3600
  },
  journal: {
    model: 'gpt-4o',
    temperature: 0.5,
    maxTokens: 1000,
    top_p: 1,
    stream: false,
    cacheEnabled: true,
    cacheTTL: 7200
  },
  coach: {
    model: 'gpt-4o',
    temperature: 0.3,
    maxTokens: 500,
    top_p: 1,
    stream: false,
    cacheEnabled: true,
    cacheTTL: 3600
  },
  scan: {
    model: 'gpt-4o',
    temperature: 0.2,
    maxTokens: 300,
    top_p: 1,
    stream: false,
    cacheEnabled: true,
    cacheTTL: 1800
  }
};

export default AI_MODEL_CONFIG;
