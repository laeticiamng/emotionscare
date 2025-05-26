import { Kysely, PostgresDialect } from 'https://deno.land/x/kysely@0.27.2/mod.ts';
import { Pool } from 'https://deno.land/x/postgres@v0.17.0/mod.ts';

const pool = new Pool({
  hostname: Deno.env.get('SUPABASE_DB_HOST') ?? '',
  database: Deno.env.get('SUPABASE_DB_NAME') ?? '',
  user: Deno.env.get('SUPABASE_DB_USER') ?? '',
  password: Deno.env.get('SUPABASE_DB_PASSWORD') ?? '',
  port: Number(Deno.env.get('SUPABASE_DB_PORT') ?? '5432')
}, 3);

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

const db = new Kysely<Database>({
  dialect: new PostgresDialect({ pool })
});

export default db;
