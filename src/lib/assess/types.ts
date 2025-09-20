export type LocaleCode = 'fr' | 'en' | 'es' | 'de' | 'it';

export type InstrumentCode = 'WHO5' | 'STAI6' | 'SAM' | 'SUDS';

export type ItemType = 'scale' | 'choice' | 'slider';

export interface InstrumentItem {
  id: string;
  prompt: string;
  type: ItemType;
  options?: string[];
  min?: number;
  max?: number;
  reversed?: boolean;
  subscale?: string;
}

export interface InstrumentCatalog {
  code: InstrumentCode;
  locale: LocaleCode;
  name: string;
  version: string;
  expiry_minutes: number;
  items: InstrumentItem[];
}

export interface ScoringResult {
  level: 0 | 1 | 2 | 3 | 4;
  summary: string;
  focus?: string;
  instrument_version: string;
  generated_at: string;
}

export interface StartRequest {
  instrument: InstrumentCode;
  locale?: LocaleCode;
}

export type StartResponse = InstrumentCatalog;

export interface SubmitRequest {
  instrument: InstrumentCode;
  locale: LocaleCode;
  answers: Record<string, number | string | boolean>;
  timestamp?: string;
  phase?: 'pre' | 'post';
}

export interface SubmitResponse {
  level: 0 | 1 | 2 | 3 | 4;
  summary: string;
  focus?: string;
  instrument_version: string;
  generated_at: string;
}
