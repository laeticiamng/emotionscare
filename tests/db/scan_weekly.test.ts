// @ts-nocheck
import { beforeAll, it, expect, afterEach } from 'vitest';
import db, { resetTables } from '../helpers/db';

afterEach(resetTables);

beforeAll(async () => {
  await db.deleteFrom('scan_face').execute();
  await db.deleteFrom('scan_voice').execute();
  await db.deleteFrom('metrics_weekly_scan').execute();
});

it('refresh fills weekly row', async () => {
  await db.insertInto('scan_face').values({
    user_id_hash: 'hashX',
    duration_s: 6,
    valence_series: [0.1, 0.3, 0.5],
    arousal_series: [0.2, 0.2, 0.2]
  }).execute();
  await db.insertInto('scan_voice').values({
    user_id_hash: 'hashX',
    word: 'hope',
    valence_voice: 0.6,
    arousal_voice: 0.3
  }).execute();

  await db.exec('CALL public.refresh_metrics_scan()');
  const row = await db.selectFrom('metrics_weekly_scan')
                      .where('user_id_hash','=','hashX')
                      .executeTakeFirst();
  expect(row).not.toBeUndefined();
});
