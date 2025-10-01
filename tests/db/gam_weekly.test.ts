// @ts-nocheck
import { expect, it, afterEach } from 'vitest';
import db, { resetTables } from '../helpers/db';

afterEach(resetTables);

it('refresh populates weekly row', async () => {
  await db.exec('CALL public.refresh_metrics_gam()');
  const row = await db.selectFrom('metrics_weekly_gam')
                      .limit(1).executeTakeFirst();
  expect(row).toBeTruthy();
});
