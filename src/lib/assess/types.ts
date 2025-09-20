export type LocaleCode = 'fr' | 'en' | 'es' | 'de' | 'it';
export type InstrumentCode = 'WHO5' | 'STAI6' | 'SAM' | 'SUDS';

export interface ScoringResult {
  level: 0 | 1 | 2 | 3 | 4;
  summary: string;
  focus?: string;
  instrument_version: string;
  generated_at: string;
}

export interface InstrumentCatalog {
  code: InstrumentCode;
  locale: LocaleCode;
  name: string;
  version: string;
}
