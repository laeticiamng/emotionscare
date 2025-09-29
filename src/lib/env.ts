export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
export const IS_DEV = import.meta.env.DEV || false;

export const env = {
  VITE_SUPABASE_URL: SUPABASE_URL,
  VITE_SUPABASE_PUBLISHABLE_KEY: SUPABASE_ANON_KEY,
};