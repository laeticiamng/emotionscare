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
    console.warn(`⚠ Missing variables: ${missingVars.join(", ")}.\nCreate a .env.local file with the required variables.`);
  }
}
