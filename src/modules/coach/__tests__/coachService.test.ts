import { describe, expect, it } from 'vitest';

import { __coachInternals } from '@/modules/coach/coachService';

describe('coachService internals', () => {
  it('normalizes emotion labels with accents and synonyms', () => {
    const { normalizeEmotionLabel } = __coachInternals;

    expect(normalizeEmotionLabel('Heureux')).toBe('joie');
    expect(normalizeEmotionLabel('TRISTE')).toBe('tristesse');
    expect(normalizeEmotionLabel('Inconnu')).toBe('neutre');
    expect(normalizeEmotionLabel(undefined)).toBe('neutre');
  });

  it('clamps history length and truncates long messages', () => {
    const { clampHistory } = __coachInternals;

    const history = Array.from({ length: 10 }, (_, index) => ({
      role: index % 2 === 0 ? 'user' : 'assistant',
      content: `Message ${index} `.repeat(50),
    }));

    const result = clampHistory(history, 4);

    expect(result).toHaveLength(4);
    result.forEach(item => {
      expect(item.content.length).toBeLessThanOrEqual(240);
    });
  });

  it('creates deterministic SHA-256 hashes', async () => {
    const { hashText } = __coachInternals;

    const first = await hashText('hello world');
    const second = await hashText('hello world');
    const different = await hashText('different');

    expect(first).toHaveLength(64);
    expect(first).toBe(second);
    expect(different).not.toBe(first);
  });

  it('keeps summary instructions stable', () => {
    const { SUMMARY_INSTRUCTIONS } = __coachInternals;

    expect(SUMMARY_INSTRUCTIONS).toMatchInlineSnapshot(`
"Tu es un agent de conformité EmotionsCare.
Tu reçois l'historique d'un échange entre un utilisateur et un coach IA.
Rédige un résumé anonymisé sans mentionner de noms propres ni de détails identifiants.
Réponds en JSON strict avec le format suivant :
{
  \"summary\": \"phrase synthétique (max 180 caractères)\",
  \"signals\": [\"mot-clé 1\", \"mot-clé 2\", \"mot-clé 3\"]
}
Ne fournis aucune autre clé que summary et signals."
    `);
  });
});

