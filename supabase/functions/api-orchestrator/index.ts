// @ts-nocheck
/**
 * 🎯 API Orchestrator - Gestionnaire Intelligent des APIs
 * 
 * Optimise les appels aux APIs externes:
 * - OpenAI (GPT-5, Whisper, DALL-E, TTS)
 * - Hume AI (Face, Voice, Prosody)
 * - Suno/MusicGen
 * 
 * Fonctionnalités:
 * - Caching intelligent
 * - Batch processing
 * - Rate limiting adaptatif
 * - Fallback local
 * - Cost tracking
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============= Configuration =============

const API_CONFIGS = {
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    key: () => Deno.env.get('OPENAI_API_KEY'),
    costPer1kTokens: {
      'gpt-5': 0.03,
      'gpt-5-mini': 0.015,
      'whisper-1': 0.006,
      'dall-e-3': 0.04,
      'tts-1': 0.015
    },
    rateLimits: {
      'gpt-5': { rpm: 500, tpm: 150000 },
      'gpt-5-mini': { rpm: 1000, tpm: 200000 }
    }
  },
  hume: {
    baseUrl: 'https://api.hume.ai/v0',
    key: () => Deno.env.get('HUME_API_KEY'),
    costPerRequest: {
      face: 0.005,
      voice: 0.008,
      prosody: 0.008
    },
    rateLimits: {
      face: { rpm: 60 },
      voice: { rpm: 60 }
    }
  },
  suno: {
    baseUrl: 'https://api.suno.ai',
    key: () => Deno.env.get('SUNO_API_KEY'),
    costPerGeneration: 0.10,
    rateLimits: { rpm: 20 }
  }
};

// ============= Cache Intelligent =============

interface CacheEntry {
  data: any;
  timestamp: number;
  hits: number;
  cost: number;
}

const CACHE = new Map<string, CacheEntry>();
const CACHE_TTL = {
  openai_chat: 3600000, // 1h pour conversations similaires
  openai_embedding: 86400000, // 24h pour embeddings
  hume_face: 300000, // 5min pour expressions stables
  hume_voice: 300000,
  music_generation: 604800000, // 7 jours pour tracks générés
};

function getCacheKey(api: string, model: string, input: any): string {
  const hash = JSON.stringify(input).slice(0, 100);
  return `${api}:${model}:${hash}`;
}

function getFromCache(key: string, ttl: number): any | null {
  const entry = CACHE.get(key);
  if (!entry) return null;
  
  const age = Date.now() - entry.timestamp;
  if (age > ttl) {
    CACHE.delete(key);
    return null;
  }
  
  entry.hits++;
  console.log(`✅ Cache HIT: ${key} (hits: ${entry.hits}, age: ${Math.round(age/1000)}s)`);
  return entry.data;
}

function saveToCache(key: string, data: any, cost: number) {
  CACHE.set(key, {
    data,
    timestamp: Date.now(),
    hits: 0,
    cost
  });
  
  // Cleanup old entries (keep only 1000 most recent)
  if (CACHE.size > 1000) {
    const sorted = Array.from(CACHE.entries())
      .sort((a, b) => b[1].timestamp - a[1].timestamp);
    sorted.slice(1000).forEach(([key]) => CACHE.delete(key));
  }
}

// ============= Rate Limiting Adaptatif =============

interface RateLimitState {
  requests: number[];
  tokens: number[];
}

const RATE_LIMITS = new Map<string, RateLimitState>();

function checkRateLimit(api: string, model: string, tokensNeeded: number = 0): boolean {
  const key = `${api}:${model}`;
  const config = API_CONFIGS[api]?.rateLimits[model];
  if (!config) return true;
  
  const now = Date.now();
  const state = RATE_LIMITS.get(key) || { requests: [], tokens: [] };
  
  // Nettoyer les anciennes entrées (> 1 min)
  state.requests = state.requests.filter(t => now - t < 60000);
  state.tokens = state.tokens.filter(t => now - t < 60000);
  
  // Vérifier limites
  if (state.requests.length >= config.rpm) {
    console.warn(`⚠️ Rate limit atteint pour ${key}: ${config.rpm} RPM`);
    return false;
  }
  
  if (config.tpm && state.tokens.length + tokensNeeded > config.tpm) {
    console.warn(`⚠️ Token limit atteint pour ${key}: ${config.tpm} TPM`);
    return false;
  }
  
  // Enregistrer la requête
  state.requests.push(now);
  if (tokensNeeded > 0) {
    state.tokens.push(...Array(tokensNeeded).fill(now));
  }
  
  RATE_LIMITS.set(key, state);
  return true;
}

// ============= Batch Processing =============

interface BatchRequest {
  id: string;
  api: string;
  model: string;
  input: any;
  resolve: (value: any) => void;
  reject: (error: any) => void;
}

const BATCH_QUEUES = new Map<string, BatchRequest[]>();
const BATCH_TIMERS = new Map<string, any>();
const BATCH_SIZE = 5;
const BATCH_DELAY = 2000; // 2 secondes

function addToBatch(api: string, model: string, input: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const queueKey = `${api}:${model}`;
    const queue = BATCH_QUEUES.get(queueKey) || [];
    
    queue.push({
      id: crypto.randomUUID(),
      api,
      model,
      input,
      resolve,
      reject
    });
    
    BATCH_QUEUES.set(queueKey, queue);
    
    // Traiter immédiatement si batch plein
    if (queue.length >= BATCH_SIZE) {
      processBatch(queueKey);
    } else {
      // Sinon, planifier traitement différé
      if (!BATCH_TIMERS.has(queueKey)) {
        const timer = setTimeout(() => {
          processBatch(queueKey);
        }, BATCH_DELAY);
        BATCH_TIMERS.set(queueKey, timer);
      }
    }
  });
}

async function processBatch(queueKey: string) {
  const queue = BATCH_QUEUES.get(queueKey) || [];
  if (queue.length === 0) return;
  
  BATCH_QUEUES.delete(queueKey);
  const timer = BATCH_TIMERS.get(queueKey);
  if (timer) {
    clearTimeout(timer);
    BATCH_TIMERS.delete(queueKey);
  }
  
  console.log(`📦 Processing batch: ${queueKey} (${queue.length} requests)`);
  
  const [api, model] = queueKey.split(':');
  
  try {
    // Traiter chaque requête du batch
    for (const req of queue) {
      try {
        const result = await callAPIDirectly(api, model, req.input);
        req.resolve(result);
      } catch (error) {
        req.reject(error);
      }
    }
  } catch (error) {
    queue.forEach(req => req.reject(error));
  }
}

// ============= Appels API Directs =============

async function callAPIDirectly(api: string, model: string, input: any): Promise<any> {
  const config = API_CONFIGS[api];
  if (!config) {
    throw new Error(`API inconnue: ${api}`);
  }
  
  const apiKey = config.key();
  if (!apiKey) {
    throw new Error(`Clé API manquante pour ${api}`);
  }
  
  // Vérifier rate limit
  const estimatedTokens = JSON.stringify(input).length / 4;
  if (!checkRateLimit(api, model, estimatedTokens)) {
    throw new Error(`Rate limit dépassé pour ${api}:${model}`);
  }
  
  let url: string;
  let headers: Record<string, string>;
  let body: any;
  
  if (api === 'openai') {
    headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };
    
    if (model.startsWith('gpt')) {
      url = `${config.baseUrl}/chat/completions`;
      body = {
        model,
        messages: input.messages,
        temperature: input.temperature || 0.7,
        max_tokens: input.max_tokens || 1000
      };
    } else if (model === 'whisper-1') {
      url = `${config.baseUrl}/audio/transcriptions`;
      const formData = new FormData();
      formData.append('file', input.file);
      formData.append('model', model);
      headers['Content-Type'] = 'multipart/form-data';
      body = formData;
    } else if (model.startsWith('dall-e')) {
      url = `${config.baseUrl}/images/generations`;
      body = {
        model,
        prompt: input.prompt,
        n: input.n || 1,
        size: input.size || '1024x1024'
      };
    } else if (model.startsWith('tts')) {
      url = `${config.baseUrl}/audio/speech`;
      body = {
        model,
        input: input.text,
        voice: input.voice || 'alloy'
      };
    }
  } else if (api === 'hume') {
    headers = {
      'X-Hume-Api-Key': apiKey,
      'Content-Type': 'application/json'
    };
    
    url = `${config.baseUrl}/batch/jobs`;
    body = {
      models: { [model]: {} },
      urls: input.urls || undefined,
      files: input.files || undefined
    };
  } else if (api === 'suno') {
    headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };
    
    url = `${config.baseUrl}/generate`;
    body = {
      prompt: input.prompt,
      duration: input.duration || 30
    };
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: body instanceof FormData ? body : JSON.stringify(body)
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error ${response.status}: ${error}`);
  }
  
  const result = await response.json();
  
  // Calculer le coût
  let cost = 0;
  if (api === 'openai' && result.usage) {
    const tokensUsed = result.usage.total_tokens;
    cost = (tokensUsed / 1000) * (config.costPer1kTokens[model] || 0.01);
  } else if (api === 'hume') {
    cost = config.costPerRequest[model] || 0.005;
  } else if (api === 'suno') {
    cost = config.costPerGeneration;
  }
  
  console.log(`💰 API Call: ${api}:${model} - Cost: $${cost.toFixed(4)}`);
  
  return { result, cost };
}

// ============= Orchestration Intelligente =============

async function smartAPICall(api: string, model: string, input: any, options: {
  useBatch?: boolean;
  useCache?: boolean;
  fallbackLocal?: boolean;
} = {}) {
  const cacheKey = getCacheKey(api, model, input);
  
  // 1. Vérifier cache
  if (options.useCache !== false) {
    const ttlKey = `${api}_${model.replace(/-\d+$/, '')}`;
    const ttl = CACHE_TTL[ttlKey] || 3600000;
    const cached = getFromCache(cacheKey, ttl);
    if (cached) {
      return { result: cached, cost: 0, source: 'cache' };
    }
  }
  
  try {
    // 2. Appel API (avec ou sans batch)
    let response;
    if (options.useBatch) {
      response = await addToBatch(api, model, input);
    } else {
      response = await callAPIDirectly(api, model, input);
    }
    
    // 3. Sauvegarder en cache
    if (options.useCache !== false) {
      saveToCache(cacheKey, response.result, response.cost);
    }
    
    return { ...response, source: 'api' };
    
  } catch (error) {
    // 4. Fallback local si activé
    if (options.fallbackLocal && api === 'hume') {
      console.warn(`⚠️ Fallback local pour ${api}:${model}`);
      return {
        result: {
          emotions: ['neutral'],
          confidence: 0.5,
          fallback: true
        },
        cost: 0,
        source: 'fallback'
      };
    }
    
    throw error;
  }
}

// ============= Endpoint Principal =============

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, api, model, input, options } = await req.json();

    if (action === 'call') {
      const result = await smartAPICall(api, model, input, options);
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (action === 'stats') {
      // Statistiques de cache et coûts
      let totalCost = 0;
      let totalHits = 0;
      CACHE.forEach(entry => {
        totalCost += entry.cost;
        totalHits += entry.hits;
      });
      
      const stats = {
        cache: {
          size: CACHE.size,
          totalHits,
          totalCostSaved: totalCost
        },
        rateLimits: Object.fromEntries(RATE_LIMITS)
      };
      
      return new Response(JSON.stringify(stats), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (action === 'clearCache') {
      CACHE.clear();
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    throw new Error(`Action inconnue: ${action}`);

  } catch (error) {
    console.error('❌ Orchestrator Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
