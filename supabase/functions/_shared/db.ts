export default {
  selectFrom() {
    return {
      selectAll() { return this; },
      where() { return this; },
      unionAll() { return this; },
      execute: async () => []
    };
  },
  raw(v: string) { return v; }
};
import { Kysely, PostgresDialect } from 'https://esm.sh/kysely@0.26.4';
import { Pool } from 'https://deno.land/x/postgres@v0.17.0/mod.ts';

interface MetricsWeeklyJournal {
  user_id_hash: string;
  week_start: string;
  valence_avg: number | null;
  panas_pa_avg: number | null;
  panas_na_avg: number | null;
  gratitude_ratio: number | null;
  wpm_median: number | null;
}

interface MetricsWeeklyOrg {
  org_id: string;
  week_start: string;
  n_users: number;
  valence_avg: number | null;
  panas_pa_avg: number | null;
  panas_na_avg: number | null;
  gratitude_ratio: number | null;
  wpm_median: number | null;
}

interface Database {
  metrics_weekly_journal: MetricsWeeklyJournal;
  metrics_weekly_org: MetricsWeeklyOrg;
}

const pool = new Pool(Deno.env.get('DATABASE_URL') ?? '', 3, true);

const db = new Kysely<Database>({
  dialect: new PostgresDialect({ pool }),
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
