import { describe, expect, it } from 'vitest';

import { suggestAction } from '@/lib/b2b/reporting';

describe('suggestAction', () => {
  it('privileges recovery when fatigue is mentioned', () => {
    const result = suggestAction({
      wemwbs: 'Ambiance plus tendue, prêter attention aux signaux.',
      cbi: 'Fatigue ressentie, sécuriser des temps calmes.',
      uwes: 'Implication stable, petits élans réguliers.',
    });
    expect(result).toBe('Réunion courte sans agenda pour relâcher.');
    expect(result.split('.').filter(Boolean)).toHaveLength(1);
  });

  it('synchronises focus time when ambiance et envie align', () => {
    const result = suggestAction({
      wemwbs: 'Ambiance globalement posée.',
      cbi: 'Énergie légère, respiration fluide partagée.',
      uwes: "Implication forte, envie d'avancer partagée.",
    });
    expect(result).toBe('Bloquer 30 min focus sans sollicitations, en équipe.');
  });

  it('falls back to a check-in otherwise', () => {
    const result = suggestAction({
      wemwbs: 'Ambiance à préciser.',
      cbi: 'Fatigue à clarifier ensemble.',
      uwes: 'Implication à observer.',
    });
    expect(result).toBe('Réunion courte sans agenda pour relâcher.');

    const neutral = suggestAction({
      wemwbs: 'Ambiance à préciser.',
      cbi: 'Énergie préservée.',
      uwes: 'Implication à observer.',
    });
    expect(neutral).toBe('Commencer la semaine par un check-in 2 questions, 5 minutes.');
  });
});
