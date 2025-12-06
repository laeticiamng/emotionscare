import { it, expect, afterEach } from 'vitest';
import db, { resetTables } from '../helpers/db';

afterEach(resetTables);

it('nebula trigger computes rmssd_delta and coherence', async () => {
  await db.insertInto('vr_nebula_sessions').values({
    user_id_hash: 'hashZ',
    duration_s: 180,
    resp_rate_avg: 5.2,
    hrv_pre: 30,
    hrv_post: 60
  }).execute();
  const row = await db.selectFrom('vr_nebula_sessions')
                      .select(['rmssd_delta','coherence_score'])
                      .where('user_id_hash','=', 'hashZ')
                      .executeTakeFirstOrThrow();
  expect(row.rmssd_delta).toBe(30);
  expect(row.coherence_score).toBeGreaterThan(0);
});
