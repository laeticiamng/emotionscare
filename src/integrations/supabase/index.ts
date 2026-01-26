// @ts-nocheck

import { supabase as supabaseClient } from "./client";

// Export the client from client.ts
export const supabase = supabaseClient;

// Also export directly for compatibility with existing imports
export default supabase;
