import { sql } from 'kysely';
import { expect, test } from 'vitest';

test('bubble_sessions trigger computes breath_idx and joy_idx', async () => {
  await sql`INSERT INTO bubble_sessions (user_id_hash, bpm, smile_amp)
            VALUES ('abc', 5, 0.8)`;
  const row = await sql`SELECT breath_idx, joy_idx FROM bubble_sessions
                        WHERE user_id_hash='abc'
                        ORDER BY ts DESC LIMIT 1`.executeTakeFirst();
  expect(row.breath_idx).toBe(1);
  expect(row.joy_idx).toBeCloseTo(0.8);
});
