import { sql } from 'kysely';
import { expect, test } from 'vitest';

test('micro_breaks trigger computes rmssd_delta', async () => {
  await sql`INSERT INTO micro_breaks (user_id_hash, hr_pre, hr_post)
            VALUES ('abc', 60, 70)`
    .execute();
  const { rmssd_delta } = await sql`SELECT rmssd_delta FROM micro_breaks
                                    WHERE user_id_hash='abc'
                                    ORDER BY ts DESC LIMIT 1`.executeTakeFirst();
  expect(rmssd_delta).toBe(10);
});
