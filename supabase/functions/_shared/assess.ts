// @ts-nocheck
/**
 * Shared assessment utilities for Edge Functions
 */

import { z } from './zod.ts';

export const instrumentSchema = z.enum([
  'WHO5', 'STAI6', 'PANAS', 'PSS10', 'UCLA3', 'MSPSS',
  'AAQ2', 'POMS', 'SSQ', 'ISI', 'GAS', 'GRITS',
  'BRS', 'WEMWBS', 'UWES', 'CBI', 'CVSQ', 'SAM', 'SUDS'
]);

export const localeSchema = z.enum(['fr', 'en', 'es', 'de', 'it']);

export type InstrumentCode = z.infer<typeof instrumentSchema>;
export type LocaleCode = z.infer<typeof localeSchema>;

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

// Clinical instrument catalogs with localization
const CATALOGS: Record<InstrumentCode, Record<LocaleCode, InstrumentCatalog>> = {
  'WHO5': {
    'fr': {
      code: 'WHO5',
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
      name: 'Índice de Bienestar OMS',
      version: '1.0',
      expiry_minutes: 30,
      items: [
        { id: '1', prompt: 'Me he sentido alegre y de buen ánimo', type: 'scale', min: 0, max: 5 },
        { id: '2', prompt: 'Me he sentido calmado/a y relajado/a', type: 'scale', min: 0, max: 5 },
        { id: '3', prompt: 'Me he sentido activo/a y enérgico/a', type: 'scale', min: 0, max: 5 },
        { id: '4', prompt: 'Me he despertado sintiéndome fresco/a y descansado/a', type: 'scale', min: 0, max: 5 },
        { id: '5', prompt: 'Mi vida diaria ha estado llena de cosas que me interesan', type: 'scale', min: 0, max: 5 }
      ]
    },
    'de': {
      code: 'WHO5',
      name: 'WHO Wohlbefinden Index',
      version: '1.0',
      expiry_minutes: 30,
      items: [
        { id: '1', prompt: 'Ich war fröhlich und guter Laune', type: 'scale', min: 0, max: 5 },
        { id: '2', prompt: 'Ich habe mich ruhig und entspannt gefühlt', type: 'scale', min: 0, max: 5 },
        { id: '3', prompt: 'Ich habe mich energisch und aktiv gefühlt', type: 'scale', min: 0, max: 5 },
        { id: '4', prompt: 'Ich bin frisch und ausgeruht aufgewacht', type: 'scale', min: 0, max: 5 },
        { id: '5', prompt: 'Mein Alltag war voller Dinge, die mich interessieren', type: 'scale', min: 0, max: 5 }
      ]
    },
    'it': {
      code: 'WHO5',
      name: 'Indice di Benessere OMS',
      version: '1.0',
      expiry_minutes: 30,
      items: [
        { id: '1', prompt: 'Mi sono sentito/a allegro/a e di buon umore', type: 'scale', min: 0, max: 5 },
        { id: '2', prompt: 'Mi sono sentito/a calmo/a e rilassato/a', type: 'scale', min: 0, max: 5 },
        { id: '3', prompt: 'Mi sono sentito/a attivo/a ed energico/a', type: 'scale', min: 0, max: 5 },
        { id: '4', prompt: 'Mi sono svegliato/a sentendomi fresco/a e riposato/a', type: 'scale', min: 0, max: 5 },
        { id: '5', prompt: 'La mia vita quotidiana è stata piena di cose che mi interessano', type: 'scale', min: 0, max: 5 }
      ]
    }
  },
  'STAI6': {
    'fr': {
      code: 'STAI6',
      name: 'Inventaire d\'anxiété état (court)',
      version: '1.0',
      expiry_minutes: 15,
      items: [
        { id: '1', prompt: 'Je me sens calme', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '2', prompt: 'Je me sens tendu(e)', type: 'scale', min: 1, max: 4 },
        { id: '3', prompt: 'Je me sens contrarié(e)', type: 'scale', min: 1, max: 4 },
        { id: '4', prompt: 'Je me sens détendu(e)', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '5', prompt: 'Je me sens inquiet/ète', type: 'scale', min: 1, max: 4 },
        { id: '6', prompt: 'Je me sens confus(e)', type: 'scale', min: 1, max: 4 }
      ]
    },
    'en': {
      code: 'STAI6',
      name: 'State Anxiety Inventory (Short)',
      version: '1.0',
      expiry_minutes: 15,
      items: [
        { id: '1', prompt: 'I feel calm', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '2', prompt: 'I feel tense', type: 'scale', min: 1, max: 4 },
        { id: '3', prompt: 'I feel upset', type: 'scale', min: 1, max: 4 },
        { id: '4', prompt: 'I feel relaxed', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '5', prompt: 'I feel worried', type: 'scale', min: 1, max: 4 },
        { id: '6', prompt: 'I feel confused', type: 'scale', min: 1, max: 4 }
      ]
    },
    'es': {
      code: 'STAI6',
      name: 'Inventario de Ansiedad Estado (Corto)',
      version: '1.0',
      expiry_minutes: 15,
      items: [
        { id: '1', prompt: 'Me siento calmado/a', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '2', prompt: 'Me siento tenso/a', type: 'scale', min: 1, max: 4 },
        { id: '3', prompt: 'Me siento molesto/a', type: 'scale', min: 1, max: 4 },
        { id: '4', prompt: 'Me siento relajado/a', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '5', prompt: 'Me siento preocupado/a', type: 'scale', min: 1, max: 4 },
        { id: '6', prompt: 'Me siento confundido/a', type: 'scale', min: 1, max: 4 }
      ]
    },
    'de': {
      code: 'STAI6',
      name: 'Zustandsangst Inventar (Kurz)',
      version: '1.0',
      expiry_minutes: 15,
      items: [
        { id: '1', prompt: 'Ich fühle mich ruhig', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '2', prompt: 'Ich fühle mich angespannt', type: 'scale', min: 1, max: 4 },
        { id: '3', prompt: 'Ich fühle mich verärgert', type: 'scale', min: 1, max: 4 },
        { id: '4', prompt: 'Ich fühle mich entspannt', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '5', prompt: 'Ich fühle mich besorgt', type: 'scale', min: 1, max: 4 },
        { id: '6', prompt: 'Ich fühle mich verwirrt', type: 'scale', min: 1, max: 4 }
      ]
    },
    'it': {
      code: 'STAI6',
      name: 'Inventario Ansia di Stato (Breve)',
      version: '1.0',
      expiry_minutes: 15,
      items: [
        { id: '1', prompt: 'Mi sento calmo/a', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '2', prompt: 'Mi sento teso/a', type: 'scale', min: 1, max: 4 },
        { id: '3', prompt: 'Mi sento contrariato/a', type: 'scale', min: 1, max: 4 },
        { id: '4', prompt: 'Mi sento rilassato/a', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '5', prompt: 'Mi sento preoccupato/a', type: 'scale', min: 1, max: 4 },
        { id: '6', prompt: 'Mi sento confuso/a', type: 'scale', min: 1, max: 4 }
      ]
    }
  },
  'SAM': {
    'fr': {
      code: 'SAM',
      name: 'Auto-évaluation émotionnelle',
      version: '1.0',
      expiry_minutes: 5,
      items: [
        { id: '1', prompt: 'Plaisir/Déplaisir', type: 'slider', min: 1, max: 9 },
        { id: '2', prompt: 'Activation/Calme', type: 'slider', min: 1, max: 9 }
      ]
    },
    'en': {
      code: 'SAM',
      name: 'Self-Assessment Manikin',
      version: '1.0',
      expiry_minutes: 5,
      items: [
        { id: '1', prompt: 'Pleasure/Displeasure', type: 'slider', min: 1, max: 9 },
        { id: '2', prompt: 'Arousal/Calm', type: 'slider', min: 1, max: 9 }
      ]
    },
    'es': {
      code: 'SAM',
      name: 'Muñeco de Auto-evaluación',
      version: '1.0',
      expiry_minutes: 5,
      items: [
        { id: '1', prompt: 'Placer/Displacer', type: 'slider', min: 1, max: 9 },
        { id: '2', prompt: 'Activación/Calma', type: 'slider', min: 1, max: 9 }
      ]
    },
    'de': {
      code: 'SAM',
      name: 'Selbstbewertungs-Männchen',
      version: '1.0',
      expiry_minutes: 5,
      items: [
        { id: '1', prompt: 'Freude/Unfreude', type: 'slider', min: 1, max: 9 },
        { id: '2', prompt: 'Erregung/Ruhe', type: 'slider', min: 1, max: 9 }
      ]
    },
    'it': {
      code: 'SAM',
      name: 'Omino di Auto-valutazione',
      version: '1.0',
      expiry_minutes: 5,
      items: [
        { id: '1', prompt: 'Piacere/Dispiacere', type: 'slider', min: 1, max: 9 },
        { id: '2', prompt: 'Attivazione/Calma', type: 'slider', min: 1, max: 9 }
      ]
    }
  },
  'SUDS': {
    'fr': {
      code: 'SUDS',
      name: 'Unités subjectives de détresse',
      version: '1.0',
      expiry_minutes: 5,
      items: [
        { id: '1', prompt: 'Niveau de détresse actuel (0 = aucune, 10 = extrême)', type: 'slider', min: 0, max: 10 }
      ]
    },
    'en': {
      code: 'SUDS',
      name: 'Subjective Units of Distress',
      version: '1.0',
      expiry_minutes: 5,
      items: [
        { id: '1', prompt: 'Current distress level (0 = none, 10 = extreme)', type: 'slider', min: 0, max: 10 }
      ]
    },
    'es': {
      code: 'SUDS',
      name: 'Unidades Subjetivas de Angustia',
      version: '1.0',
      expiry_minutes: 5,
      items: [
        { id: '1', prompt: 'Nivel actual de angustia (0 = ninguna, 10 = extrema)', type: 'slider', min: 0, max: 10 }
      ]
    },
    'de': {
      code: 'SUDS',
      name: 'Subjektive Belastungseinheiten',
      version: '1.0',
      expiry_minutes: 5,
      items: [
        { id: '1', prompt: 'Aktueller Belastungsgrad (0 = keine, 10 = extrem)', type: 'slider', min: 0, max: 10 }
      ]
    },
    'it': {
      code: 'SUDS',
      name: 'Unità Soggettive di Distress',
      version: '1.0',
      expiry_minutes: 5,
      items: [
        { id: '1', prompt: 'Livello attuale di distress (0 = nessuno, 10 = estremo)', type: 'slider', min: 0, max: 10 }
      ]
    }
  },
  // Placeholder for other instruments - truncated for brevity
  'PANAS': {} as any,
  'PSS10': {} as any,
  'UCLA3': {} as any,
  'MSPSS': {} as any,
  'AAQ2': {
    'fr': {
      code: 'AAQ2',
      name: "Questionnaire d'acceptation et d'action", 
      version: '1.0',
      expiry_minutes: 30,
      items: [
        { id: '1', prompt: "Mes pensées difficiles m'empêchent d'avancer", type: 'scale', min: 1, max: 7 },
        { id: '2', prompt: 'Je lutte contre mes sentiments désagréables', type: 'scale', min: 1, max: 7 },
        { id: '3', prompt: 'Je suis dominé(e) par des souvenirs pénibles', type: 'scale', min: 1, max: 7 },
        { id: '4', prompt: 'Je fais tout pour éviter mes émotions inconfortables', type: 'scale', min: 1, max: 7 },
        { id: '5', prompt: 'Mes inquiétudes prennent toute la place', type: 'scale', min: 1, max: 7 },
        { id: '6', prompt: 'Je me sens piégé(e) par mes émotions', type: 'scale', min: 1, max: 7 },
        { id: '7', prompt: 'Je reste bloqué(e) dans des pensées douloureuses', type: 'scale', min: 1, max: 7 },
      ],
    },
    'en': {
      code: 'AAQ2',
      name: 'Acceptance and Action Questionnaire II',
      version: '1.0',
      expiry_minutes: 30,
      items: [
        { id: '1', prompt: 'My difficult thoughts keep me from moving forward', type: 'scale', min: 1, max: 7 },
        { id: '2', prompt: 'I struggle against unpleasant feelings', type: 'scale', min: 1, max: 7 },
        { id: '3', prompt: 'Painful memories dominate my attention', type: 'scale', min: 1, max: 7 },
        { id: '4', prompt: 'I do everything to avoid uncomfortable emotions', type: 'scale', min: 1, max: 7 },
        { id: '5', prompt: 'My worries take up all the space', type: 'scale', min: 1, max: 7 },
        { id: '6', prompt: 'I feel trapped by my emotions', type: 'scale', min: 1, max: 7 },
        { id: '7', prompt: 'I stay stuck in painful thoughts', type: 'scale', min: 1, max: 7 },
      ],
    },
  },
  'POMS': {} as any,
  'SSQ': {} as any,
  'ISI': {} as any,
  'GAS': {} as any,
  'GRITS': {} as any,
  'BRS': {} as any,
  'WEMWBS': {} as any,
  'UWES': {} as any,
  'CBI': {} as any,
  'CVSQ': {} as any
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
  const subscaleScores: Record<string, number> = {};

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

      // Track subscales
      if (item.subscale) {
        if (!subscaleScores[item.subscale]) {
          subscaleScores[item.subscale] = 0;
        }
        subscaleScores[item.subscale] += value;
      }
    }
  }

  // Generate level and summary
  const level = determineLevel(instrument, totalScore, itemCount, subscaleScores);
  const summary = generateSummary(instrument, level);
  const focus = instrument === 'AAQ2'
    ? level >= 3
      ? 'flexibility_rigide'
      : level <= 1
        ? 'flexibility_souple'
        : 'flexibility_transition'
    : undefined;

  return {
    summary,
    level,
    scores: { total: totalScore, ...subscaleScores },
    ...(focus ? { focus } : {}),
  };
}

function determineLevel(instrument: InstrumentCode, total: number, itemCount: number, subscales: Record<string, number>): number {
  switch (instrument) {
    case 'WHO5':
      if (total <= 12) return 0; // Vigilance
      if (total <= 16) return 1; // Attention
      if (total <= 20) return 2; // Neutre
      if (total <= 23) return 3; // Bon
      return 4; // Optimal

    case 'STAI6':
      if (total <= 10) return 0; // Très calme
      if (total <= 15) return 1; // Calme
      if (total <= 20) return 2; // Modéré
      if (total <= 23) return 3; // Anxieux
      return 4; // Très anxieux

    case 'SUDS':
      const sudsLevel = Math.floor(total / 2); // 0-10 scale to 0-4
      return Math.min(4, Math.max(0, sudsLevel));

    case 'SAM':
      // Use valence primarily for level
      const valence = subscales.valence || subscales['1'] || 5;
      if (valence >= 7) return 4; // Très positif
      if (valence >= 6) return 3; // Positif
      if (valence >= 4) return 2; // Neutre
      if (valence >= 3) return 1; // Négatif
      return 0; // Très négatif

    case 'AAQ2': {
      if (!itemCount) {
        return 2;
      }
      const average = total / itemCount;
      if (average <= 2.5) return 0;
      if (average <= 3.5) return 1;
      if (average <= 4.5) return 2;
      if (average <= 5.5) return 3;
      return 4;
    }

    default:
      return 2; // Neutral fallback
  }
}

function generateSummary(instrument: InstrumentCode, level: number): string {
  const summaries: Record<InstrumentCode, Record<number, string>> = {
    'WHO5': {
      0: 'bien-être fragile, besoin de douceur',
      1: 'bien-être à renforcer',
      2: 'bien-être stable',
      3: 'bien-être élevé',
      4: 'bien-être rayonnant'

    },
    'STAI6': {
      0: 'tension apaisée',
      1: 'tension douce',
      2: 'tension modérée',
      3: 'tension élevée',
      4: 'tension intense'
    },
    'SUDS': {
      0: 'tension très basse',
      1: 'tension apaisée',
      2: 'tension équilibrée',
      3: 'tension forte',
      4: 'tension critique'
    },
    'SAM': {
      0: 'affect à soutenir',
      1: 'affect en hausse',
      2: 'affect neutre',
      3: 'affect positif',
      4: 'affect rayonnant'
    },
    'AAQ2': {
      0: 'plus de souplesse ressentie',
      1: 'souplesse en progression',
      2: 'souplesse fluctuante',
      3: 'moment plus rigide',
      4: 'rigidité marquée, soutien renforcé'
    }
  };

  return summaries[instrument]?.[level] || 'état évalué';
}

export function sanitizeSummaryText(text: string): string {
  const cleaned = text
    .replace(/\d+(?:[.,]\d+)?%?/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned.length > 0 ? cleaned : 'résumé disponible';
}