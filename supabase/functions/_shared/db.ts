
import { createClient } from './supabase.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

export const supabase = createClient(supabaseUrl, anonKey);

// Simple database utility functions for Edge Functions
export const db = {
  async query(sql: string, params: any[] = []): Promise<any> {
    console.log('DB query:', sql, params);
    return { rows: [] };
  },
  
  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    return callback();
  },

  // Helper methods for common operations
  selectFrom(table: string) {
    return {
      selectAll() { return this; },
      where() { return this; },
      unionAll() { return this; },
      execute: async () => []
    };
  },

  raw(query: string) { 
    return query; 
  }
};

// Database interfaces for type safety
export interface Database {
  biotune_sessions: {
    id: string;
    user_id_hash: string;
    ts_start: Date;
    duration_s: number;
    bpm_target: number;
    hrv_pre: number;
    hrv_post: number;
    energy_mode: 'calm' | 'energize';
    rmssd_delta: number | null;
    coherence: number | null;
  };
  neon_walk_sessions: {
    id: string;
    user_id_hash: string;
    ts_walk: Date;
    steps: number;
    avg_cadence: number;
    hr_avg: number;
    joy_idx: number;
    mvpa_min: number | null;
  };
}

export default db;
