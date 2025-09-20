import type { InstrumentCatalog, InstrumentCode, LocaleCode } from './types';

const CATALOGS: Record<InstrumentCode, Partial<Record<LocaleCode, InstrumentCatalog>>> = {
  WHO5: {
    fr: { code: 'WHO5', locale: 'fr', name: 'Indice de bien-être OMS', version: '1.0' },
    en: { code: 'WHO5', locale: 'en', name: 'WHO Well-Being Index', version: '1.0' },
    es: { code: 'WHO5', locale: 'es', name: 'Índice de Bienestar OMS', version: '1.0' },
    de: { code: 'WHO5', locale: 'de', name: 'WHO Wohlbefinden Index', version: '1.0' },
    it: { code: 'WHO5', locale: 'it', name: 'Indice di Benessere OMS', version: '1.0' },
  },
  STAI6: {
    fr: { code: 'STAI6', locale: 'fr', name: 'Inventaire d’anxiété état (court)', version: '1.0' },
    en: { code: 'STAI6', locale: 'en', name: 'State Anxiety Inventory (Short)', version: '1.0' },
    es: { code: 'STAI6', locale: 'es', name: 'Inventario de Ansiedad Estado (Corto)', version: '1.0' },
    de: { code: 'STAI6', locale: 'de', name: 'Zustandsangst Inventar (Kurz)', version: '1.0' },
    it: { code: 'STAI6', locale: 'it', name: 'Inventario Ansia di Stato (Breve)', version: '1.0' },
  },
  SAM: {
    fr: { code: 'SAM', locale: 'fr', name: 'Auto-évaluation émotionnelle', version: '1.0' },
    en: { code: 'SAM', locale: 'en', name: 'Self-Assessment Manikin', version: '1.0' },
    es: { code: 'SAM', locale: 'es', name: 'Maniquí de Autoevaluación', version: '1.0' },
    de: { code: 'SAM', locale: 'de', name: 'Selbstbeurteilungsfigur', version: '1.0' },
    it: { code: 'SAM', locale: 'it', name: 'Manichino di Auto-Valutazione', version: '1.0' },
  },
  SUDS: {
    fr: { code: 'SUDS', locale: 'fr', name: 'Échelle de détresse subjective', version: '1.0' },
    en: { code: 'SUDS', locale: 'en', name: 'Subjective Units of Distress Scale', version: '1.0' },
    es: { code: 'SUDS', locale: 'es', name: 'Escala Subjetiva de Malestar', version: '1.0' },
    de: { code: 'SUDS', locale: 'de', name: 'Subjektive Belastungsskala', version: '1.0' },
    it: { code: 'SUDS', locale: 'it', name: 'Scala di Disagio Soggettivo', version: '1.0' },
  },
};

export function getCatalog(instrument: InstrumentCode, locale: LocaleCode = 'fr'): InstrumentCatalog {
  const catalogs = CATALOGS[instrument];
  if (!catalogs) {
    throw new Error(`Unknown instrument: ${instrument}`);
  }

  return catalogs[locale] ?? catalogs.fr ?? catalogs.en!;
}
