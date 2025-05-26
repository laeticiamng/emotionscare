import { sql } from 'kysely';
import { expect, test } from 'vitest';

test('refresh_metrics_music aggregates sessions', async () => {
  await sql`INSERT INTO biotune_sessions (user_id_hash, duration_s, bpm_target, hrv_pre, hrv_post, energy_mode)
            VALUES ('hashA',300,70,50,80,'calm')`
    .execute();
  await sql`INSERT INTO neon_walk_sessions (user_id_hash, steps, avg_cadence, joy_idx)
            VALUES ('hashA',3000,110,0.7)`
    .execute();
  await sql`CALL public.refresh_metrics_music()`
    .execute();

  const row = await sql`SELECT mvpa_min FROM metrics_weekly_music
                        WHERE user_id_hash='hashA'`
    .executeTakeFirst();
  expect(row?.mvpa_min).toBeCloseTo((3000/100)*(110/120), 2);

  const org = await sql`SELECT count(*)::int AS c FROM metrics_weekly_music_org`
    .executeTakeFirst();
  expect(org.c).toBeGreaterThan(0);
});
