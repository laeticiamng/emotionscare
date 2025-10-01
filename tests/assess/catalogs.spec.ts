// @ts-nocheck
import { describe, expect, it } from 'vitest';

import { getAllCatalogs, getCatalog } from '../../src/lib/assess/catalogs.ts';
import type { InstrumentCode, LocaleCode } from '../../src/lib/assess/types.ts';

describe('assessment catalogs', () => {
  it('returns the WHO-5 catalog in French with five items', () => {
    const catalog = getCatalog('WHO5', 'fr');
    expect(catalog.code).toBe('WHO5');
    expect(catalog.expiry_minutes).toBe(30);
    expect(catalog.items).toHaveLength(5);
  });

  it('falls back to French when locale is unsupported and then to English when French is missing', () => {
    const fallbackToFrench = getCatalog('WHO5', 'pt' as LocaleCode);
    expect(fallbackToFrench.name).toContain('Indice');

    const catalogs = getAllCatalogs();
    const originalFrench = catalogs.SAM.fr;
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete catalogs.SAM.fr;
    try {
      const fallbackToEnglish = getCatalog('SAM', 'fr');
      expect(fallbackToEnglish.name).toContain('Self-Assessment Manikin');
    } finally {
      catalogs.SAM.fr = originalFrench;
    }
  });

  it('ensures item metadata stays within expected bounds', () => {
    const catalogs = getAllCatalogs();
    const allowedTypes = new Set(['scale', 'choice', 'slider']);

    (Object.keys(catalogs) as InstrumentCode[]).forEach((instrument) => {
      const locales = catalogs[instrument];
      Object.values(locales).forEach((catalog) => {
        catalog.items.forEach((item) => {
          expect(allowedTypes.has(item.type)).toBe(true);
          if (typeof item.min === 'number' && typeof item.max === 'number') {
            expect(item.min).toBeLessThanOrEqual(item.max);
          }
        });
      });
    });
  });
});
