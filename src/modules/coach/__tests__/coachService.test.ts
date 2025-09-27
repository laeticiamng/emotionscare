import { describe, expect, it, vi } from 'vitest';

import { sha256Hex, webCryptoUnavailableMessage } from '@/lib/hash';
import { buildSystemPrompt, COACH_DISCLAIMERS } from '@/modules/coach/lib/prompts';
import { redactForTelemetry } from '@/modules/coach/lib/redaction';

describe('coach utils', () => {
  it('produces deterministic sha256 hashes', async () => {
    const value = await sha256Hex('user-123');
    expect(value).toHaveLength(64);
    expect(await sha256Hex('user-123')).toBe(value);
    expect(await sha256Hex('user-124')).not.toBe(value);
  });

  it('throws a clear error when Web Crypto is missing', async () => {
    try {
      vi.stubGlobal('crypto', undefined as unknown as Crypto);
      await expect(sha256Hex('user-123')).rejects.toThrow(webCryptoUnavailableMessage);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('builds system prompt according to mode and locale', () => {
    const b2c = buildSystemPrompt('b2c', 'fr');
    const b2b = buildSystemPrompt('b2b', 'en');
    expect(b2c).toContain('Adopte un ton chaleureux');
    expect(b2c).toContain('/app/breath');
    expect(b2b).toContain('professional tone');
    expect(b2b).toContain('/app/journal');
  });

  it('redacts PII and clamps length', () => {
    const input = 'Contacte-moi sur test@example.com ou au +33 6 12 34 56 78 pour en parler.';
    const redacted = redactForTelemetry(input, 50);
    expect(redacted).not.toContain('test@example.com');
    expect(redacted).not.toContain('+33 6 12');
    expect(redacted.length).toBeLessThanOrEqual(50);
  });

  it('exposes disclaimers in both locales', () => {
    expect(COACH_DISCLAIMERS.fr).toEqual(expect.arrayContaining(['Le Coach IA ne remplace pas un professionnel de santé.']));
    expect(COACH_DISCLAIMERS.en).toEqual(expect.arrayContaining(['The AI Coach does not replace a health professional.']));
  });
});
