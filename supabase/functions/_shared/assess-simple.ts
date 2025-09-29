/**
 * Assessment utilities - simplified version without Zod
 */

export type InstrumentCode = 'WHO5' | 'STAI6' | 'SAM' | 'SUDS' | 'AAQ2';
export type LocaleCode = 'fr' | 'en' | 'es' | 'de' | 'it';

interface InstrumentItem {
  id: string;
  prompt: string;
  type: 'scale' | 'choice' | 'slider';
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
  summary: string;
  level: number;
  scores: Record<string, number>;
  focus?: string;
}

// Simplified catalog with all required locales for WHO5
const CATALOGS: Record<InstrumentCode, Record<LocaleCode, InstrumentCatalog>> = {
  'WHO5': {
    'fr': {
      code: 'WHO5',
      locale: 'fr',
      name: 'Indice de bien-être OMS',
      version: '1.0',
      expiry_minutes: 30,
      items: [
        { id: '1', prompt: 'Je me suis senti(e) gai(e) et de bonne humeur', type: 'scale', min: 0, max: 5 },
        { id: '2', prompt: 'Je me suis senti(e) calme et détendu(e)', type: 'scale', min: 0, max: 5 },
        { id: '3', prompt: 'Je me suis senti(e) actif/ve et énergique', type: 'scale', min: 0, max: 5 },
        { id: '4', prompt: 'Je me suis réveillé(e) en me sentant frais/fraîche et reposé(e)', type: 'scale', min: 0, max: 5 },
        { id: '5', prompt: 'Ma vie quotidienne a été remplie de choses qui m\'intéressent', type: 'scale', min: 0, max: 5 }
      ]
    },
    'en': {
      code: 'WHO5',
      locale: 'en',
      name: 'WHO Well-Being Index',
      version: '1.0',
      expiry_minutes: 30,
      items: [
        { id: '1', prompt: 'I have felt cheerful and in good spirits', type: 'scale', min: 0, max: 5 },
        { id: '2', prompt: 'I have felt calm and relaxed', type: 'scale', min: 0, max: 5 },
        { id: '3', prompt: 'I have felt active and vigorous', type: 'scale', min: 0, max: 5 },
        { id: '4', prompt: 'I woke up feeling fresh and rested', type: 'scale', min: 0, max: 5 },
        { id: '5', prompt: 'My daily life has been filled with things that interest me', type: 'scale', min: 0, max: 5 }
      ]
    },
    'es': {
      code: 'WHO5',
      locale: 'es',
      name: 'Índice de Bienestar OMS',
      version: '1.0',
      expiry_minutes: 30,
      items: [
        { id: '1', prompt: 'Me he sentido alegre y de buen ánimo', type: 'scale', min: 0, max: 5 }
      ]
    },
    'de': {
      code: 'WHO5',
      locale: 'de',
      name: 'WHO Wohlbefinden Index',
      version: '1.0',
      expiry_minutes: 30,
      items: [
        { id: '1', prompt: 'Ich war fröhlich und guter Laune', type: 'scale', min: 0, max: 5 }
      ]
    },
    'it': {
      code: 'WHO5',
      locale: 'it',
      name: 'Indice di Benessere OMS',
      version: '1.0',
      expiry_minutes: 30,
      items: [
        { id: '1', prompt: 'Mi sono sentito/a allegro/a e di buon umore', type: 'scale', min: 0, max: 5 }
      ]
    }
  },
  'STAI6': {} as any,
  'SAM': {} as any,
  'SUDS': {} as any,
  'AAQ2': {} as any
};

export function getCatalog(instrument: InstrumentCode, locale: LocaleCode = 'fr'): InstrumentCatalog {
  const instrumentCatalogs = CATALOGS[instrument];
  if (!instrumentCatalogs) {
    throw new Error(`Unknown instrument: ${instrument}`);
  }

  const catalog = instrumentCatalogs[locale] || instrumentCatalogs['fr'] || instrumentCatalogs['en'];
  if (!catalog) {
    throw new Error(`No catalog available for ${instrument} in ${locale}`);
  }

  return { ...catalog, locale };
}

export function summarizeAssessment(instrument: InstrumentCode, answers: Record<string, any>): ScoringResult {
  const catalog = getCatalog(instrument);
  
  // Calculate basic score
  let totalScore = 0;
  let itemCount = 0;

  for (const item of catalog.items) {
    if (answers[item.id] !== undefined) {
      let value = Number(answers[item.id]);
      
      // Handle reversed items
      if (item.reversed) {
        const range = (item.max || 5) - (item.min || 1) + 1;
        value = range - value + (item.min || 1);
      }
      
      totalScore += value;
      itemCount++;
    }
  }

  // Generate level and summary based on WHO5 scoring
  let level = 2; // Default neutral
  let summary = 'évaluation terminée';

  if (instrument === 'WHO5') {
    if (totalScore <= 12) {
      level = 0;
      summary = 'bien-être fragile, besoin de douceur';
    } else if (totalScore <= 16) {
      level = 1;
      summary = 'bien-être à renforcer';
    } else if (totalScore <= 20) {
      level = 2;
      summary = 'bien-être stable';
    } else if (totalScore <= 23) {
      level = 3;
      summary = 'bien-être élevé';
    } else {
      level = 4;
      summary = 'bien-être rayonnant';
    }
  }

  return {
    summary,
    level,
    scores: { total: totalScore }
  };
}