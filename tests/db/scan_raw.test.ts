import { beforeAll, it, expect, afterEach } from 'vitest';
import db, { resetTables } from '../helpers/db';

afterEach(resetTables);

beforeAll(async () => {
  await db.deleteFrom('scan_face').execute();
});

it('trigger fills valence_avg', async () => {
  await db.insertInto('scan_face').values({
    user_id_hash: 'hashT',
    duration_s: 3,
    valence_series: [0.2, 0.2, 0.4],
    arousal_series: [0.1, 0.1, 0.1]
  }).execute();
  const row = await db.selectFrom('scan_face')
                      .select('valence_avg')
                      .where('user_id_hash','=', 'hashT')
                      .executeTakeFirstOrThrow();
  expect(row.valence_avg).toBeCloseTo(0.266, 2);
});
