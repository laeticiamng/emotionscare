
/**
 * Environnement centralisé
 *
 * Ce fichier gère les variables d'environnement avec validation
 */

import * as Sentry from '@sentry/react';

export const env = {
  // URL API
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',
  NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000',
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',

  // Clés d'API
  NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  NEXT_PUBLIC_HUME_API_KEY: process.env.NEXT_PUBLIC_HUME_API_KEY || '',
  // DSN Sentry pour la surveillance des erreurs
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || '',

  // Configuration Supabase
  VITE_SUPABASE_URL:
    process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  VITE_SUPABASE_ANON_KEY:
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',

  // Configuration uploads
  NEXT_PUBLIC_UPLOAD_MAX_SIZE: Number(process.env.NEXT_PUBLIC_UPLOAD_MAX_SIZE || '10485760'),
  NEXT_PUBLIC_ALLOWED_IMAGE_TYPES:
    process.env.NEXT_PUBLIC_ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp',
  NEXT_PUBLIC_ALLOWED_AUDIO_TYPES:
    process.env.NEXT_PUBLIC_ALLOWED_AUDIO_TYPES || 'audio/mpeg,audio/wav,audio/ogg',

  // Configuration du serveur
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Configuration d'authentification
  SKIP_AUTH_CHECK: process.env.SKIP_AUTH_CHECK === 'true' || process.env.NODE_ENV === 'development'
};

// Validation simple en mode développement
if (env.NODE_ENV === 'development') {
  checkEnvVars();
}

function checkEnvVars() {
  const requiredVars = [
    'NEXT_PUBLIC_API_URL'
  ];

  const missingVars = requiredVars.filter(key => !env[key]);

  if (missingVars.length > 0) {
    const message = `Missing env vars: ${missingVars.join(', ')}`;
    console.warn(`\u26A0\uFE0F ${message}\nCreate a .env.local file with the required variables.`);
    if (env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.captureMessage(message, 'error');
    }
  }
}
