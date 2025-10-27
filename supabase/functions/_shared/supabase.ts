// Direct import for Deno runtime (Supabase Edge Functions)
const mod = await import('https://esm.sh/@supabase/supabase-js@2');
export const createClient = (mod as any).createClient;
