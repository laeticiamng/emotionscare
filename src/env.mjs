
/**
 * Environnement centralisé
 * 
 * Ce fichier gère les variables d'environnement avec validation
 */

export const env = {
  // URL API
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',
  
  // Clés d'API
  NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  NEXT_PUBLIC_HUME_API_KEY: process.env.NEXT_PUBLIC_HUME_API_KEY || '',
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  VITE_FIREBASE_API_KEY: process.env.VITE_FIREBASE_API_KEY || '',
  VITE_FIREBASE_AUTH_DOMAIN: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  VITE_FIREBASE_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID || '',
  VITE_FIREBASE_STORAGE_BUCKET: process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  VITE_FIREBASE_MESSAGING_SENDER_ID: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  VITE_FIREBASE_APP_ID: process.env.VITE_FIREBASE_APP_ID || '',
  VITE_FIREBASE_MEASUREMENT_ID: process.env.VITE_FIREBASE_MEASUREMENT_ID || '',
  
  // Configuration du serveur
  NODE_ENV: process.env.NODE_ENV || 'development'
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
  
  const missingVars = requiredVars.filter(key => !env[key]);
  
  if (missingVars.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missingVars.join(', ')}. Create a .env.local file with the required variables.`);
  }
}
