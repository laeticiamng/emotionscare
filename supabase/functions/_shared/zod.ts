// Direct import for Deno runtime (Supabase Edge Functions)
const mod = await import('https://deno.land/x/zod@v3.22.4/mod.ts');
export const z = (mod as any).z;
