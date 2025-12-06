import { createClient } from './supabase.ts';

const url = Deno.env.get('SUPABASE_URL') || '';
const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

export const supabase = createClient(url, key);
