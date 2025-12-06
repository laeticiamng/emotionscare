// @ts-nocheck
import { it, expect, afterEach } from 'vitest';
import db from '../helpers/db';
import { resetTables } from '../helpers/db';

afterEach(resetTables);

it('echo trigger fills pos_affect', async () => {
  await db.insert('echo_crystal').values({
    user_id_hash: 'hashT',
    joy_idx: 0.5,
    arousal_voice: 0.3,
    laugh_db: 70,
    laugh_pitch: 200,
    crystal_type: 'spike',
    color_hex: '#ABCDEF',
    sparkle_level: 0.4
  });
  const row = await db.selectFrom('echo_crystal')
                      .select('pos_affect')
                      .where('user_id_hash','=','hashT')
                      .executeTakeFirstOrThrow();
  expect(row.pos_affect).toBeCloseTo(0.5, 2);
});
