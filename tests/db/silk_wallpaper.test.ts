import { sql } from 'kysely';
import { expect, test, afterEach } from 'vitest';
import { db, resetTables } from '../helpers/db';

afterEach(resetTables);

test('silk_wallpaper trigger initializes hr_drop', async () => {
  await sql`INSERT INTO silk_wallpaper (user_id_hash, hr_1min, tap_len_ms)
            VALUES ('abc', 65, 1200)`
    .execute(db);
  const res = await sql`SELECT hr_drop FROM silk_wallpaper
                                 WHERE user_id_hash='abc'
                                 ORDER BY ts DESC LIMIT 1`.execute(db);
  const { hr_drop } = res.rows[0];
  expect(hr_drop).toBe(0);
});
