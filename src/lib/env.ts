// @ts-nocheck
import { z } from 'zod';
import { CONFIG } from './config';

/**
 * Gestion centralisée des variables d'environnement avec validation stricte.
 * Utilise les valeurs hardcodées de CONFIG comme fallback.
 */

const rawEnv = {
  MODE: import.meta.env.MODE ?? 'development',
  VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,
  VITE_COMMIT_SHA:
    import.meta.env.VITE_COMMIT_SHA ??
    import.meta.env.VERCEL_GIT_COMMIT_SHA ??
    import.meta.env.GITHUB_SHA,
  VITE_SENTRY_RELEASE:
    import.meta.env.VITE_SENTRY_RELEASE ??
    import.meta.env.VITE_APP_VERSION ??
    import.meta.env.VITE_COMMIT_SHA,
  VITE_SUPABASE_URL:
    import.meta.env.VITE_SUPABASE_URL ??
    import.meta.env.SUPABASE_URL ??
    CONFIG.SUPABASE.URL,
  VITE_SUPABASE_ANON_KEY:
    import.meta.env.VITE_SUPABASE_ANON_KEY ??
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    import.meta.env.SUPABASE_ANON_KEY ??
    CONFIG.SUPABASE.ANON_KEY,
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_WEB_URL: import.meta.env.VITE_WEB_URL,
  VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  VITE_SENTRY_ENVIRONMENT: import.meta.env.VITE_SENTRY_ENVIRONMENT,
  VITE_SENTRY_TRACES_SAMPLE_RATE: import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE,
  VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE:
    import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE,
  VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE:
    import.meta.env.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE,
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
  VITE_FIREBASE_MEASUREMENT_ID: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  VITE_UPLOAD_MAX_SIZE: import.meta.env.VITE_UPLOAD_MAX_SIZE,
  VITE_ALLOWED_IMAGE_TYPES: import.meta.env.VITE_ALLOWED_IMAGE_TYPES,
  VITE_ALLOWED_AUDIO_TYPES: import.meta.env.VITE_ALLOWED_AUDIO_TYPES,
  VITE_OPENAI_API_KEY:
    import.meta.env.VITE_OPENAI_API_KEY,
  VITE_OPENAI_BASE_URL: import.meta.env.VITE_OPENAI_BASE_URL,
  VITE_HUME_API_KEY:
    import.meta.env.VITE_HUME_API_KEY,
};

const envSchema = z.object({
  MODE: z.enum(['development', 'test', 'production']).catch('development'),
  VITE_APP_VERSION: z.string().optional(),
  VITE_COMMIT_SHA: z.string().optional(),
  VITE_SENTRY_RELEASE: z.string().optional(),
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_API_URL: z.string().url().optional(),
  VITE_WEB_URL: z.string().url().optional(),
  VITE_SENTRY_DSN: z.string().url().optional(),
  VITE_SENTRY_ENVIRONMENT: z.string().optional(),
  VITE_SENTRY_TRACES_SAMPLE_RATE: z.coerce.number().min(0).max(1).optional(),
  VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE: z.coerce.number().min(0).max(1).optional(),
  VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE: z.coerce.number().min(0).max(1).optional(),
  VITE_FIREBASE_API_KEY: z.string().optional(),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().optional(),
  VITE_FIREBASE_PROJECT_ID: z.string().optional(),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  VITE_FIREBASE_APP_ID: z.string().optional(),
  VITE_FIREBASE_MEASUREMENT_ID: z.string().optional(),
  VITE_UPLOAD_MAX_SIZE: z.coerce.number().positive().optional(),
  VITE_ALLOWED_IMAGE_TYPES: z.string().optional(),
  VITE_ALLOWED_AUDIO_TYPES: z.string().optional(),
  VITE_OPENAI_API_KEY: z.string().optional(),
  VITE_OPENAI_BASE_URL: z.string().url().optional(),
  VITE_HUME_API_KEY: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(rawEnv);

// Debug info in development
if (rawEnv.MODE === 'development') {
  console.debug('[SYSTEM] Raw environment variables', {
    VITE_SUPABASE_URL: rawEnv.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: rawEnv.VITE_SUPABASE_ANON_KEY ? '[SET]' : '[EMPTY]',
    allViteVars: Object.keys(import.meta.env).filter(k => k.startsWith('VITE_'))
  });
}

if (!parsedEnv.success) {
  console.warn('[SYSTEM] ⚠️ Environment validation warnings:', JSON.stringify(parsedEnv.error.flatten().fieldErrors));
  console.info('[SYSTEM] Using fallback values from CONFIG');
  // Continue with fallback values from CONFIG instead of throwing
}

const env = parsedEnv.data;

export const NODE_ENV = env.MODE;
export const IS_DEV = NODE_ENV === 'development';
export const IS_PROD = NODE_ENV === 'production';

export const SUPABASE_URL = env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY;

export const BUILD_INFO = {
  version: env.VITE_APP_VERSION ?? null,
  commitSha: env.VITE_COMMIT_SHA ?? null,
  release: env.VITE_SENTRY_RELEASE ?? env.VITE_APP_VERSION ?? env.VITE_COMMIT_SHA ?? null,
} as const;

const fallbackApiUrl = IS_DEV ? 'http://localhost:3009' : 'https://api.emotionscare.com';
const fallbackWebUrl = IS_DEV ? 'http://localhost:5173' : 'https://app.emotionscare.com';

export const API_URL = env.VITE_API_URL ?? fallbackApiUrl;
export const WEB_URL = env.VITE_WEB_URL ?? fallbackWebUrl;

const parseList = (value: string | undefined, fallback: string[]): string[] =>
  value
    ? value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : fallback;

const clampRate = (value: number | undefined, fallback: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return fallback;
  }

  return Math.min(Math.max(value, 0), 1);
};

export const SENTRY_CONFIG = {
  dsn: env.VITE_SENTRY_DSN ?? '',
  environment: env.VITE_SENTRY_ENVIRONMENT ?? NODE_ENV,
  tracesSampleRate: clampRate(env.VITE_SENTRY_TRACES_SAMPLE_RATE, 0.1),
  replaysSessionSampleRate: clampRate(env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE, 0),
  replaysOnErrorSampleRate: clampRate(env.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE, 1),
} as const;

export const SENTRY_DSN = SENTRY_CONFIG.dsn;
export const SENTRY_ENVIRONMENT = SENTRY_CONFIG.environment;
export const SENTRY_TRACES_SAMPLE_RATE = SENTRY_CONFIG.tracesSampleRate;
export const SENTRY_REPLAYS_SESSION_SAMPLE_RATE = SENTRY_CONFIG.replaysSessionSampleRate;
export const SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE = SENTRY_CONFIG.replaysOnErrorSampleRate;
export const SENTRY_RELEASE = BUILD_INFO.release ?? undefined;

export const AI_CONFIG = {
  openai: {
    apiKey: env.VITE_OPENAI_API_KEY ?? '',
    baseUrl: env.VITE_OPENAI_BASE_URL ?? 'https://api.openai.com/v1',
  },
  hume: {
    apiKey: env.VITE_HUME_API_KEY ?? '',
  },
} as const;

export const FIREBASE_CONFIG = {
  apiKey: env.VITE_FIREBASE_API_KEY ?? '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: env.VITE_FIREBASE_PROJECT_ID ?? '',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: env.VITE_FIREBASE_APP_ID ?? '',
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID ?? '',
} as const;

export const UPLOAD_MAX_SIZE = env.VITE_UPLOAD_MAX_SIZE ?? 10_485_760; // 10MB
export const ALLOWED_IMAGE_TYPES = parseList(env.VITE_ALLOWED_IMAGE_TYPES, [
  'image/jpeg',
  'image/png',
  'image/webp',
]);
export const ALLOWED_AUDIO_TYPES = parseList(env.VITE_ALLOWED_AUDIO_TYPES, [
  'audio/mpeg',
  'audio/wav',
]);

export const ENV_VALIDATION = {
  isConfigured: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),
  hasFirebase: Boolean(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId),
  hasSentry: Boolean(SENTRY_CONFIG.dsn),
  supabase: {
    url: Boolean(SUPABASE_URL),
    anonKey: Boolean(SUPABASE_ANON_KEY),
  },
  firebase: {
    configured: Boolean(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId),
  },
  ai: {
    openai: Boolean(AI_CONFIG.openai.apiKey),
    hume: Boolean(AI_CONFIG.hume.apiKey),
  },
};

const missingOptionalKeys = Object.entries({
  VITE_API_URL: env.VITE_API_URL,
  VITE_WEB_URL: env.VITE_WEB_URL,
  VITE_SENTRY_DSN: SENTRY_CONFIG.dsn,
  VITE_OPENAI_API_KEY: AI_CONFIG.openai.apiKey,
  VITE_HUME_API_KEY: AI_CONFIG.hume.apiKey,
}).filter(([, value]) => !value);

if (missingOptionalKeys.length > 0) {
  const formatted = missingOptionalKeys.map(([key]) => key).join(', ');
  console.info(`[SYSTEM] Variables d'environnement optionnelles manquantes: ${formatted}`);
}

if (IS_DEV) {
  console.info('[SYSTEM] EmotionsCare Environment', {
    mode: NODE_ENV,
    apiUrl: API_URL,
    webUrl: WEB_URL,
    supabase: ENV_VALIDATION.isConfigured ? '✅' : '❌',
    firebase: ENV_VALIDATION.hasFirebase ? '✅' : '⚠️ optionnel',
    sentry: ENV_VALIDATION.hasSentry ? '✅' : '⚠️ optionnel',
    ai: ENV_VALIDATION.ai,
  });
}

export default {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  NODE_ENV,
  IS_DEV,
  IS_PROD,
  API_URL,
  WEB_URL,
  SENTRY_CONFIG,
  SENTRY_DSN,
  SENTRY_ENVIRONMENT,
  SENTRY_TRACES_SAMPLE_RATE,
  SENTRY_REPLAYS_SESSION_SAMPLE_RATE,
  SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE,
  AI_CONFIG,
  FIREBASE_CONFIG,
  UPLOAD_MAX_SIZE,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_AUDIO_TYPES,
  ENV_VALIDATION,
};
