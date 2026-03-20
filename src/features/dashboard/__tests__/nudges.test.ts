import { describe, expect, it } from 'vitest';

import { cardNudges, listAllNudges, toneMessages } from '../nudges';

describe('dashboard nudges copy', () => {
  it('contains entries for every tone and locale', () => {
    Object.values(toneMessages).forEach((localeMap) => {
      expect(localeMap.fr.headline.length).toBeGreaterThan(0);
      expect(localeMap.en.headline.length).toBeGreaterThan(0);
    });

    Object.values(cardNudges).forEach((toneMap) => {
      Object.values(toneMap).forEach((localeMap) => {
        expect(localeMap.fr.length).toBeGreaterThan(0);
        expect(localeMap.en.length).toBeGreaterThan(0);
      });
    });
  });

  it('never exposes numerical characters', () => {
    listAllNudges().forEach((entry) => {
      expect(entry).not.toMatch(/\d/);
    });
  });
});
