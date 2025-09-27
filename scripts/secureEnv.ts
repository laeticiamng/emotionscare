import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const envPath = [
  `.env.${process.env.NODE_ENV}`,
  '.env.local',
  '.env',
].map(p => path.resolve(process.cwd(), p))
 .find(fs.existsSync);

if (envPath) {
  dotenv.config({ path: envPath });
}

/**
 * Copie uniquement les variables VITE_* nécessaires
 * dans process.env pour Vitest (côté Node)
 */
const VITE_KEYS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_APP_NAME',
  'VITE_APP_VERSION',
  'VITE_ENVIRONMENT',
];

for (const key of VITE_KEYS) {
  if (!(key in process.env)) {
    console.warn(`[secureEnv] Missing ${key} in ${envPath}`);
  }
}
export {};
