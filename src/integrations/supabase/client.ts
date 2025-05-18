
import { createClient } from '@supabase/supabase-js';

// Configuration de Supabase via les variables d'environnement
// Vérification des préfixes NEXT_PUBLIC_ et VITE_
const supabaseUrl = 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
  import.meta.env.VITE_SUPABASE_URL || 
  '';

const supabaseKey = 
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  '';

// Vérification minimale pour avertir des problèmes de configuration
if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Erreur de configuration Supabase: NEXT_PUBLIC_SUPABASE_URL/VITE_SUPABASE_URL et ' +
    'NEXT_PUBLIC_SUPABASE_ANON_KEY/VITE_SUPABASE_ANON_KEY doivent être définis dans les variables d\'environnement.'
  );
}

// Création du client Supabase avec les options d'authentification
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Export as default for compatibility
export default supabase;
