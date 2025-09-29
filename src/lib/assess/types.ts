export type LocaleCode = 'fr' | 'en' | 'es' | 'de' | 'it';

/**
 * Instruments cliniques validés scientifiquement
 * Basé sur les recherches validées:
 * - WHO5: BMC Psychiatry 2024, Frontiers Psychology 2025
 * - STAI6: PMC 2009 (Support for Reliability and Validity)
 * - SUDS: PMC 2025 (Rethinking the Subjective Units of Distress Scale)
 * - SAM: IEEE, MDPI 2024
 * - PANAS10: Journal of Cross-Cultural Psychology 2007
 * - PSS10: BMC Psychiatry 2024
 */
export type InstrumentCode = 
  | 'WHO5'    // WHO-5 Well-Being Index (validé scientifiquement)
  | 'STAI6'   // State-Trait Anxiety Inventory 6 items (validé PMC)
  | 'SAM'     // Self-Assessment Manikin (validé IEEE/MDPI)
  | 'SUDS'    // Subjective Units of Distress Scale (validé PMC 2025)
  | 'PANAS10' // Positive and Negative Affect Schedule 10 items (validé international)
  | 'PSS10';  // Perceived Stress Scale 10 items (validé BMC)

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
  items: InstrumentItem[];
  expiry_minutes: number;
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