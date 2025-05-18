
import { createClient } from '@supabase/supabase-js';
import { supabase as supabaseClient } from '@/lib/supabase-client';

// Exporter le client centralisé de supabase-client.ts
export const supabase = supabaseClient;

// Également exporter par défaut pour la compatibilité
export default supabase;
