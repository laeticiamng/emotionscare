
/**
 * Validation des variables d'environnement pour la production
 */

// Variables d'environnement requises
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

// Variables d'environnement optionnelles avec valeurs par défaut
const optionalEnvVars = {
  'VITE_APP_NAME': 'EmotionsCare',
  'VITE_APP_VERSION': '1.0.0',
  'VITE_ENVIRONMENT': 'development'
};

/**
 * Valide les variables d'environnement
 */
export function validateEnvironment() {
  const missing = requiredEnvVars.filter(envVar => !import.meta.env[envVar]);
  
  if (missing.length > 0) {
    console.warn('Variables d\'environnement manquantes:', missing);
    // En développement, on continue avec des warnings
    // En production, cela devrait être plus strict
  }
  
  // Définir les valeurs par défaut
  Object.entries(optionalEnvVars).forEach(([key, defaultValue]) => {
    if (!import.meta.env[key]) {
      import.meta.env[key] = defaultValue;
    }
  });
  
  console.log('Validation environnement:', {
    mode: import.meta.env.MODE,
    prod: import.meta.env.PROD,
    variables: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'))
  });
}

// Exécuter la validation
validateEnvironment();
