import { beforeAll, it, expect } from 'vitest';
import db from '../../database/tests/db/helpers/db';

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
