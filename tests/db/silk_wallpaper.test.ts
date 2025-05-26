import { sql } from 'kysely';
import { expect, test } from 'vitest';

test('silk_wallpaper trigger initializes hr_drop', async () => {
  await sql`INSERT INTO silk_wallpaper (user_id_hash, hr_1min, tap_len_ms)
            VALUES ('abc', 65, 1200)`;
  const { hr_drop } = await sql`SELECT hr_drop FROM silk_wallpaper
                                 WHERE user_id_hash='abc'
                                 ORDER BY ts DESC LIMIT 1`.executeTakeFirst();
  expect(hr_drop).toBe(0);
});
