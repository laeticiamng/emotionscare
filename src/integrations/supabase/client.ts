import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, IS_DEV } from '@/lib/env';

/**
 * Indicates whether the Supabase client was successfully initialized.
 * When false, the app should degrade gracefully instead of crashing.
 */
export let isSupabaseConfigured = false;

function createSupabaseClient(): SupabaseClient {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error(
      '[SYSTEM] Supabase is not configured. Copy .env.example to .env and fill in VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.'
    );
    // Return a dummy client with a placeholder URL to avoid crash at module load time.
    // All network requests will fail, but the app will render with a configuration error message.
    return createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  try {
    const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
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

    isSupabaseConfigured = true;
    return client;
  } catch (error) {
    console.error('[SYSTEM] Failed to initialize Supabase client:', error);
    return createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
}

export const supabase = createSupabaseClient();

// Log de connexion en développement
if (IS_DEV) {
  // eslint-disable-next-line no-console
  console.info(
    `[SYSTEM] ${isSupabaseConfigured ? '🔌 Supabase client initialized' : '⚠️ Supabase not configured — app running in degraded mode'}`
  );
}

export default supabase;
