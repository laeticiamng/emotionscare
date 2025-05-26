import { beforeAll, it, expect, describe } from 'vitest';
import db from './helpers/db';

beforeAll(async () => {
  await db.clearTables(['journal_voice','journal_text','metrics_weekly_journal']);
});

describe('metrics_weekly_journal view', () => {
  it('aggregates valence & gratitude', async () => {
    const user = 'hash_view';
    /* insère 1 capsule */
    await db.insert('journal_voice').values({
      user_id_hash: user, valence: 0.4, text_raw: 'ok'
    });
    /* insère 1 story gratitude */
    await db.insert('journal_text').values({
      user_id_hash: user,
      valence: 0.2,
      text_raw: 'Je dis merci beaucoup',
      gratitude_hits: 1
    });
    /* Refresh local */
    await db.execute('REFRESH MATERIALIZED VIEW metrics_weekly_journal');
    const row = await db
      .selectFrom('metrics_weekly_journal')
      .where('user_id_hash','=',user)
      .select(['valence_avg','gratitude_ratio'])
      .executeTakeFirstOrThrow();
    expect(row.valence_avg).toBeCloseTo(0.3,1);
    expect(row.gratitude_ratio).toBeGreaterThan(0);
  });
});
