
import { createClient } from '@supabase/supabase-js';

// Configuration de Supabase via les variables d'environnement
// Vérification des préfixes NEXT_PUBLIC_ et VITE_
const supabaseUrl = 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
  import.meta.env.VITE_SUPABASE_URL || 
  'https://placeholder-supabase-url.supabase.co';

const supabaseKey = 
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder-key-for-development';

// Vérification minimale pour avertir des problèmes de configuration
if (supabaseUrl === 'https://placeholder-supabase-url.supabase.co' || 
    supabaseKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder-key-for-development') {
  console.warn(
    'Configuration Supabase incomplète: NEXT_PUBLIC_SUPABASE_URL/VITE_SUPABASE_URL et/ou ' +
    'NEXT_PUBLIC_SUPABASE_ANON_KEY/VITE_SUPABASE_ANON_KEY ne sont pas définis. ' +
    'Utilisation de valeurs par défaut pour le développement.'
  );
}

// Création du client Supabase avec les options d'authentification
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Export as default for compatibility
export default supabase;
