// @ts-nocheck
import { sql } from 'kysely';
import { expect, test, afterEach } from 'vitest';
import { db, resetTables } from '../helpers/db';

afterEach(resetTables);

test('micro_breaks trigger computes rmssd_delta', async () => {
  await sql`INSERT INTO micro_breaks (user_id_hash, hr_pre, hr_post)
            VALUES ('abc', 60, 70)`
    .execute(db);
  const res = await sql`SELECT rmssd_delta FROM micro_breaks
                                    WHERE user_id_hash='abc'
                                    ORDER BY ts DESC LIMIT 1`.execute(db);
  const { rmssd_delta } = res.rows[0];
  expect(rmssd_delta).toBe(10);
});
