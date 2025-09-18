/**
 * Gestionnaire centralisé des variables d'environnement
 * 
 * Toute la configuration d'environnement passe par ce fichier unique.
 * Les clés Supabase sont configurées directement ici pour simplicité.
 */

// Configuration Supabase (valeurs du projet)
export const SUPABASE_URL = 'https://yaincoxihiqdksxgrsrk.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU';

// Environnement 
export const NODE_ENV = import.meta.env.MODE || 'development';
export const IS_DEV = import.meta.env.DEV;
export const IS_PROD = import.meta.env.PROD;

// URLs API (optionnelles via .env.local)
export const API_URL = import.meta.env.VITE_API_URL || 'https://api.emotionscare.dev';
export const WEB_URL = import.meta.env.VITE_WEB_URL || 'http://localhost:3000';

// Observability / Sentry configuration
const parseRate = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, 0), 1);
};

export const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || '';
export const SENTRY_ENVIRONMENT = import.meta.env.VITE_SENTRY_ENVIRONMENT || NODE_ENV;
export const SENTRY_TRACES_SAMPLE_RATE = parseRate(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE, 0.1);
export const SENTRY_REPLAYS_SESSION_SAMPLE_RATE = parseRate(
  import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE,
  0
);
export const SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE = parseRate(
  import.meta.env.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE,
  1
);

// Configuration Firebase (optionnelle)
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

// Limites d'upload (optionnelles)
export const UPLOAD_MAX_SIZE = parseInt(import.meta.env.VITE_UPLOAD_MAX_SIZE || '10485760'); // 10MB
export const ALLOWED_IMAGE_TYPES = (import.meta.env.VITE_ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp').split(',');
export const ALLOWED_AUDIO_TYPES = (import.meta.env.VITE_ALLOWED_AUDIO_TYPES || 'audio/mpeg,audio/wav').split(',');

// Validation environnement
export const ENV_VALIDATION = {
  isConfigured: !!(SUPABASE_URL && SUPABASE_ANON_KEY),
  hasFirebase: !!(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId),
  hasSentry: Boolean(SENTRY_DSN)
};

// Log de démarrage en développement
if (IS_DEV) {
  console.log('🔧 EmotionsCare Environment:', {
    mode: NODE_ENV,
    supabase: ENV_VALIDATION.isConfigured ? '✅' : '❌',
    firebase: ENV_VALIDATION.hasFirebase ? '✅' : '⚠️ optionnel',
    sentry: ENV_VALIDATION.hasSentry ? '✅' : '⚠️ optionnel'
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
  SENTRY_DSN,
  SENTRY_ENVIRONMENT,
  SENTRY_TRACES_SAMPLE_RATE,
  SENTRY_REPLAYS_SESSION_SAMPLE_RATE,
  SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE,
  FIREBASE_CONFIG,
  UPLOAD_MAX_SIZE,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_AUDIO_TYPES,
  ENV_VALIDATION
};