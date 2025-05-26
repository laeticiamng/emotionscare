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
});

export default db;
