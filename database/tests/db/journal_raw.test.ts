import { expect, beforeAll, it, describe } from 'vitest';
import db, { clearTables } from './helpers/db';

beforeAll(async () => {
  await clearTables(['journal_voice','journal_text']);
});

describe('journal_voice trigger', () => {
  it('computes word_count & PANAS', async () => {
    await db.insertInto('journal_voice').values({
      user_id_hash: 'hashX',
      text_raw: 'Ceci est un test rapide',
      valence: 0.2
    }).execute();
    const row = await db.selectFrom('journal_voice')
      .select(['word_count','panas_pa'])
      .where('user_id_hash','=','hashX')
      .limit(1).executeTakeFirstOrThrow();
    expect(row.word_count).toBe(5);
    expect(row.panas_pa).toBe((0.2+1)*25);
  });
});

describe('journal_text trigger', () => {
  it('computes word_count & gratitude_hits', async () => {
    await db.insertInto('journal_text').values({
      user_id_hash: 'hashY',
      text_raw: 'Merci pour tout merci encore',
      valence: 0.1
    }).execute();
    const row = await db.selectFrom('journal_text')
      .select(['word_count','gratitude_hits'])
      .where('user_id_hash','=','hashY')
      .limit(1).executeTakeFirstOrThrow();
    expect(row.word_count).toBe(5);
    expect(row.gratitude_hits).toBe(2);
  });
});
