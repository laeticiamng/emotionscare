import { describe, expect, it } from 'vitest';

import { sha256Hex } from '@/lib/hash';

describe('sha256Hex', () => {
  it('returns empty string for empty input', async () => {
    expect(await sha256Hex('')).toBe('');
  });

  it('hashes "abc" (NIST vector)', async () => {
    const out = await sha256Hex('abc');
    expect(out).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });

  it('hashes "The quick brown fox jumps over the lazy dog"', async () => {
    const out = await sha256Hex('The quick brown fox jumps over the lazy dog');
    expect(out).toBe('d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592');
  });

  it('hashes unicode content deterministically', async () => {
    const out = await sha256Hex('élégant 🫶');
    expect(out).toMatch(/^[0-9a-f]{64}$/);
  });
});
