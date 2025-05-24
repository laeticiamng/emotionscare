
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env-validation';

// Client Supabase configuré avec validation d'environnement
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'X-Client-Info': 'lovable-wellness-app',
    },
  },
});

// Log de connexion en développement
if (env.isDevelopment) {
  console.log('🔌 Supabase client initialized');
}

export default supabase;
