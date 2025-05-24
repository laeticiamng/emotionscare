
/**
 * Environnement centralisé
 *
 * Ce fichier gère les variables d'environnement avec validation
 *
 * Les variables exposées au client doivent être lues via `import.meta.env`.
 * Les scripts Node utilisent toujours les variables de leur propre environnement.
 */

export const env = {
  // Supabase - using actual project values
  NEXT_PUBLIC_SUPABASE_URL: 'https://yaincoxihiqdksxgrsrk.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU',
  
  // URL API
  NEXT_PUBLIC_API_URL: import.meta.env.VITE_PUBLIC_API_URL || 'https://api.example.com',
  NEXT_PUBLIC_WEB_URL: import.meta.env.VITE_PUBLIC_WEB_URL || 'http://localhost:3000',
  NEXT_PUBLIC_APP_ENV: import.meta.env.MODE || 'development',

  // Clés d'API - seront vides côté client, utilisées dans les edge functions
  NEXT_PUBLIC_OPENAI_API_KEY: '',
  NEXT_PUBLIC_HUME_API_KEY: '',
  NEXT_PUBLIC_MUSICGEN_API_KEY: '',
  
  // Configuration Firebase (optionnelle)
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
  console.log('✅ Configuration Supabase chargée');
}
