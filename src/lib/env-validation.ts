// ---------------------------------------------------------------------------
// src/lib/env-validation.ts
// ---------------------------------------------------------------------------

/**
 * Variables d’environnement requises pour l’app
 */
const REQUIRED = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'] as const;

/**
 * Variables optionnelles + valeurs par défaut
 */
const OPTIONAL: Record<string, string> = {
  VITE_APP_NAME: 'EmotionsCare',
  VITE_APP_VERSION: '1.0.0',
  VITE_ENVIRONMENT: 'development',
};

/**
 * Vérifie les variables d’environnement, applique les valeurs par défaut
 * et logge un petit récap.
 */
export function validateEnvironment() {
  const missing = REQUIRED.filter((k) => !import.meta.env[k]);

  if (missing.length) {
    console.warn('[env-validation] Variables manquantes :', missing);
  }

  Object.entries(OPTIONAL).forEach(([k, def]) => {
    if (!import.meta.env[k]) {
      import.meta.env[k] = def;
    }
  });

  console.info('[env-validation] MODE=', import.meta.env.MODE,
               'VITE_* keys=', Object.keys(import.meta.env).filter((k) => k.startsWith('VITE_')));
}

/* -------------------------------------------------------------------------
 *  ⬇️  L’export dont Supabase (client.ts) a besoin
 * ---------------------------------------------------------------------- */
export const env = {
  SUPABASE_URL:      import.meta.env.VITE_SUPABASE_URL      || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
};

// Exécute la vérification au chargement du module
validateEnvironment();