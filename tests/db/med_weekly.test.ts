import { it, expect, afterEach } from 'vitest';
import db, { resetTables } from '../helpers/db';

afterEach(resetTables);

it('refresh populates user weekly row', async () => {
  await db.exec('CALL public.refresh_metrics_breath()');
  const row = await db.selectFrom('metrics_weekly_breath')
                      .select('coherence_avg')
                      .executeTakeFirst();
  expect(row).toBeTruthy();
});
