import { sql } from 'kysely';
import { expect, test, afterEach } from 'vitest';
import { db, resetTables } from '../helpers/db';

afterEach(resetTables);

test('refresh_metrics_music aggregates sessions', async () => {
  await sql`INSERT INTO biotune_sessions (user_id_hash, duration_s, bpm_target, hrv_pre, hrv_post, energy_mode)
            VALUES ('hashA',300,70,50,80,'calm')`
    .execute(db);
  await sql`INSERT INTO neon_walk_sessions (user_id_hash, steps, avg_cadence, joy_idx)
            VALUES ('hashA',3000,110,0.7)`
    .execute(db);
  await sql`CALL public.refresh_metrics_music()`
    .execute(db);

  const r1 = await sql`SELECT mvpa_min FROM metrics_weekly_music
                        WHERE user_id_hash='hashA'`
    .execute(db);
  expect(r1.rows[0]?.mvpa_min).toBeCloseTo((3000/100)*(110/120), 2);

  const org = await sql`SELECT count(*)::int AS c FROM metrics_weekly_music_org`
    .execute(db);
  expect(org.rows[0].c).toBeGreaterThan(0);
});
