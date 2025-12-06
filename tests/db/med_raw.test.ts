// @ts-nocheck
import { beforeAll, it, expect, afterEach } from 'vitest';
import db, { resetTables } from '../helpers/db';

afterEach(resetTables);

beforeAll(async () => {
  await db.clear('flow_walk');
});

it('trigger fills mvpa_min', async () => {
  await db.insert('flow_walk').values({
    user_id_hash: 'hashT',
    steps: 300,
    cadence_spm: 110,
    breath_rate_rpm: 18,
    hrv_pre: 40,
    hrv_post: 60
  });
  const row = await db.selectFrom('flow_walk')
    .select('mvpa_min')
    .where('user_id_hash','=', 'hashT')
    .executeTakeFirstOrThrow();
  expect(row.mvpa_min).toBeGreaterThan(15);
});
