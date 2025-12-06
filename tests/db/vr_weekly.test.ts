import { it, expect, afterEach } from 'vitest';
import db, { resetTables } from '../helpers/db';

afterEach(resetTables);

it('refresh populates user weekly row', async () => {
  await db.raw('CALL public.refresh_metrics_vr()');
  const row = await db
      .selectFrom('metrics_weekly_vr')
      .where('user_id_hash','=', 'hashA')
      .executeTakeFirst();
  expect(row?.hrv_gain_median).toBeDefined();
});
