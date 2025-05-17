
export interface AI_MODEL_CONFIG_Type {
  model: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  stream: boolean;
  cacheEnabled?: boolean;
  cacheTTL?: number;
}

export interface AI_MODEL_CONFIG_Map {
  chat: AI_MODEL_CONFIG_Type;
  journal: AI_MODEL_CONFIG_Type;
  coach: AI_MODEL_CONFIG_Type;
  scan: AI_MODEL_CONFIG_Type;
  [key: string]: AI_MODEL_CONFIG_Type;
}

export const AI_MODEL_CONFIG: AI_MODEL_CONFIG_Map = {
  chat: {
    model: 'gpt-4o',
    temperature: 0.7,
    max_tokens: 500,
    top_p: 1,
    stream: false,
    cacheEnabled: true,
    cacheTTL: 3600
  },
  journal: {
    model: 'gpt-4o',
    temperature: 0.5,
    max_tokens: 1000,
    top_p: 1,
    stream: false,
    cacheEnabled: true,
    cacheTTL: 7200
  },
  coach: {
    model: 'gpt-4o',
    temperature: 0.3,
    max_tokens: 500,
    top_p: 1,
    stream: false,
    cacheEnabled: true,
    cacheTTL: 3600
  },
  scan: {
    model: 'gpt-4o',
    temperature: 0.2,
    max_tokens: 300,
    top_p: 1,
    stream: false,
    cacheEnabled: true,
    cacheTTL: 1800
  }
};

export default AI_MODEL_CONFIG;
