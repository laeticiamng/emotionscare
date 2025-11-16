// @ts-nocheck

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, IS_DEV } from '@/lib/env';
import { logger } from '@/lib/logger';

// Client Supabase configuré avec validation d'environnement
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
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
if (IS_DEV) {
  logger.info('[SYSTEM] 🔌 Supabase client initialized', 'SYSTEM');
}

export default supabase;
