import { sql } from 'kysely';
import { expect, test, afterEach } from 'vitest';
import { db, resetTables } from '../helpers/db';

afterEach(resetTables);

test('bubble_sessions trigger computes breath_idx and joy_idx', async () => {
  await sql`INSERT INTO bubble_sessions (user_id_hash, bpm, smile_amp)
            VALUES ('abc', 5, 0.8)`
    .execute(db);
  const res = await sql`SELECT breath_idx, joy_idx FROM bubble_sessions
                        WHERE user_id_hash='abc'
                        ORDER BY ts DESC LIMIT 1`.execute(db);
  const row = res.rows[0];
  expect(row.breath_idx).toBe(1);
  expect(row.joy_idx).toBeCloseTo(0.8);
});
