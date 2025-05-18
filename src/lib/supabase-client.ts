
import { createClient } from "@supabase/supabase-js";

// Configuration de Supabase via les variables d'environnement
const supabaseUrl = 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
  import.meta.env.VITE_SUPABASE_URL || 
  '';

const supabaseKey = 
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  '';

// Création du client Supabase avec les options d'authentification
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true
  }
});

export default supabase;
