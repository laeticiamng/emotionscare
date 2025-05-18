/**
 * Environnement centralisé
 *
 * Ce fichier gère les variables d'environnement avec validation
 */

import * as Sentry from '@sentry/react';

export const env = {
  // URL API
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',

  // Clés d'API
  NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  NEXT_PUBLIC_HUME_API_KEY: process.env.NEXT_PUBLIC_HUME_API_KEY || '',

  // DSN Sentry pour la surveillance des erreurs
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || '',

  // Configuration du serveur
  NODE_ENV: process.env.NODE_ENV || 'development'
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
