import { it, expect } from 'vitest';
import db from '../../database/tests/db/helpers/db';

it('refresh populates user weekly row', async () => {
  await db.raw('CALL public.refresh_metrics_vr()');
  const row = await db
      .selectFrom('metrics_weekly_vr')
      .where('user_id_hash','=', 'hashA')
      .executeTakeFirst();
  expect(row?.hrv_gain_median).toBeDefined();
});
