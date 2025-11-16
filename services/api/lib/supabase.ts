import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;
let customFactory: (() => SupabaseClient) | null = null;

const resolveUrl = () => process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const resolveKey = () => process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

const createDefaultClient = () => {
  const url = resolveUrl();
  const key = resolveKey();

  if (!url || !key) {
    throw new Error('Supabase credentials are not configured');
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { 'X-Client-Info': 'emotionscare-api' } },
  });
};

export const getSupabaseClient = (): SupabaseClient => {
  if (customFactory) {
    return customFactory();
  }

  if (!cachedClient) {
    cachedClient = createDefaultClient();
  }

  return cachedClient;
};

export const setSupabaseClientFactory = (factory?: () => SupabaseClient | null) => {
  customFactory = factory ?? null;
  cachedClient = null;
};
