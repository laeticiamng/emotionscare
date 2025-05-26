import { expect, it } from 'vitest';
import db from '../../database/tests/db/helpers/db';

it('refresh populates weekly row', async () => {
  await db.exec('CALL public.refresh_metrics_gam()');
  const row = await db.selectFrom('metrics_weekly_gam')
                      .limit(1).executeTakeFirst();
  expect(row).toBeTruthy();
});
