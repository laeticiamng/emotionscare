import { it, expect } from 'vitest';
import db from '../../database/tests/db/helpers/db';

it('refresh populates user weekly row', async () => {
  await db.exec('CALL public.refresh_metrics_breath()');
  const row = await db.selectFrom('metrics_weekly_breath')
                      .select('coherence_avg')
                      .executeTakeFirst();
  expect(row).toBeTruthy();
});
