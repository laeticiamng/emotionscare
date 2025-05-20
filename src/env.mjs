
/**
 * Environnement centralisé
 *
 * Ce fichier gère les variables d'environnement avec validation
 *
 * Les variables exposées au client doivent être lues via `import.meta.env`.
 * Les scripts Node utilisent toujours les variables de leur propre environnement.
 */

import * as Sentry from '@sentry/react';

// Support execution in Node.js where `import.meta.env` is not defined
const metaEnv = (typeof import.meta !== 'undefined' && import.meta.env) || {};
const envSource = { ...metaEnv, ...(typeof process !== 'undefined' ? process.env : {}) };

export const env = {
  // URL API
  NEXT_PUBLIC_API_URL: envSource.NEXT_PUBLIC_API_URL || envSource.VITE_PUBLIC_API_URL || 'https://api.example.com',
  NEXT_PUBLIC_WEB_URL: envSource.NEXT_PUBLIC_WEB_URL || envSource.VITE_PUBLIC_WEB_URL || 'http://localhost:3000',
  NEXT_PUBLIC_APP_ENV: envSource.NEXT_PUBLIC_APP_ENV || envSource.MODE || 'development',

  // Clés d'API
  NEXT_PUBLIC_OPENAI_API_KEY: envSource.NEXT_PUBLIC_OPENAI_API_KEY || envSource.VITE_OPENAI_API_KEY || '',
  NEXT_PUBLIC_HUME_API_KEY: envSource.NEXT_PUBLIC_HUME_API_KEY || envSource.VITE_HUME_API_KEY || '',
  NEXT_PUBLIC_SUPABASE_URL: envSource.NEXT_PUBLIC_SUPABASE_URL || envSource.VITE_SUPABASE_URL || '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: envSource.NEXT_PUBLIC_SUPABASE_ANON_KEY || envSource.VITE_SUPABASE_ANON_KEY || '',
  VITE_FIREBASE_API_KEY: envSource.VITE_FIREBASE_API_KEY || '',
  VITE_FIREBASE_AUTH_DOMAIN: envSource.VITE_FIREBASE_AUTH_DOMAIN || '',
  VITE_FIREBASE_PROJECT_ID: envSource.VITE_FIREBASE_PROJECT_ID || '',
  VITE_FIREBASE_STORAGE_BUCKET: envSource.VITE_FIREBASE_STORAGE_BUCKET || '',
  VITE_FIREBASE_MESSAGING_SENDER_ID: envSource.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  VITE_FIREBASE_APP_ID: envSource.VITE_FIREBASE_APP_ID || '',
  VITE_FIREBASE_MEASUREMENT_ID: envSource.VITE_FIREBASE_MEASUREMENT_ID || '',
  
  // Configuration du serveur
  NODE_ENV: envSource.MODE || 'development',
  
  // Configuration d'authentification (plus de contournement en développement)
};

// Validation simple en mode développement
  if (env.NODE_ENV === 'development') {
    checkEnvVars();
  }

function checkEnvVars() {
  const requiredVars = [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_OPENAI_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];

  const missingVars = requiredVars.filter(key => {
    // Vérifier avec préfixes NEXT_PUBLIC_ et VITE_ pour les clés Supabase
    if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
      return !env[key] && !envSource.VITE_SUPABASE_URL;
    }
    if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
      return !env[key] && !envSource.VITE_SUPABASE_ANON_KEY;
    }
    return !env[key];
  });

  if (missingVars.length > 0) {
    const message = 'Variables d\'environnement manquantes: ' + missingVars.join(', ');
    console.warn(message);
    if (typeof Sentry.captureMessage === 'function') {
      Sentry.captureMessage(message, 'warning');
    }
  }
}
