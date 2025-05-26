import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';
import { afterAll, beforeAll, expect, test } from 'vitest';

interface MetricsWeeklyMusic {
  user_id_hash: string;
  week_start: string;
  mvpa_min: number;
}

interface Database {
  metrics_weekly_music: MetricsWeeklyMusic;
  metrics_weekly_music_org: { org_id: number };
}

let db: Kysely<Database>;

beforeAll(async () => {
  const dialect = new PostgresDialect({
    pool: new pg.Pool({ connectionString: process.env.DATABASE_URL })
  });
  db = new Kysely<Database>({ dialect });
  await db.raw('call public.refresh_metrics_music()');
});

afterAll(async () => {
  await db.destroy();
});

test('metrics populated', async () => {
  const rows = await db.selectFrom('metrics_weekly_music').selectAll().execute();
  expect(rows.length).toBeGreaterThan(0);
});

test('org view exists', async () => {
  const exists = await db
    .selectFrom('metrics_weekly_music_org')
    .select('org_id')
    .execute();
  expect(exists.length).toBeGreaterThan(0);
});
