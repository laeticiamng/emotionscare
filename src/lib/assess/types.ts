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
  name: string;
  version: string;
  items: InstrumentItem[];
  expiry_minutes: number;
}

export interface StartRequest {
  instrument: InstrumentCode;
  locale?: LocaleCode;
}
