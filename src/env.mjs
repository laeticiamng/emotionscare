
/**
 * Environnement centralisé
 *
 * Ce fichier gère les variables d'environnement avec validation
 *
 * Les variables exposées au client doivent être lues via `import.meta.env`.
 * Les scripts Node utilisent toujours les variables de leur propre environnement.
 */

import * as Sentry from '@sentry/react';

export const env = {
  // URL API
  NEXT_PUBLIC_API_URL: import.meta.env.NEXT_PUBLIC_API_URL || import.meta.env.VITE_PUBLIC_API_URL || 'https://api.example.com',
  NEXT_PUBLIC_WEB_URL: import.meta.env.NEXT_PUBLIC_WEB_URL || import.meta.env.VITE_PUBLIC_WEB_URL || 'http://localhost:3000',
  NEXT_PUBLIC_APP_ENV: import.meta.env.NEXT_PUBLIC_APP_ENV || import.meta.env.MODE || 'development',

  // Clés d'API
  NEXT_PUBLIC_OPENAI_API_KEY: import.meta.env.NEXT_PUBLIC_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY || '',
  NEXT_PUBLIC_HUME_API_KEY: import.meta.env.NEXT_PUBLIC_HUME_API_KEY || import.meta.env.VITE_HUME_API_KEY || '',
  NEXT_PUBLIC_MUSICGEN_API_KEY: import.meta.env.NEXT_PUBLIC_MUSICGEN_API_KEY || import.meta.env.VITE_MUSICGEN_API_KEY || '',
  NEXT_PUBLIC_SUPABASE_URL: import.meta.env.NEXT_PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY || '',
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID || '',
  VITE_FIREBASE_MEASUREMENT_ID: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
  
  // Configuration du serveur
  NODE_ENV: import.meta.env.MODE || 'development',
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
      return !env[key] && !import.meta.env.VITE_SUPABASE_URL;
    }
    if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
      return !env[key] && !import.meta.env.VITE_SUPABASE_ANON_KEY;
    }
    return !env[key];
  });

  if (missingVars.length > 0) {
    const message = 'Variables d\'environnement manquantes: ' + missingVars.join(', ');
    console.warn(message);
    Sentry.captureMessage(message, 'warning');
  }
}
