// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { invokeSupabaseEdge } from '@/lib/network/supabaseEdge';

import { ADDITIONAL_CATALOGS } from './clinical/catalogs';

export type LocaleCode = 'fr' | 'en' | 'es' | 'de' | 'it';

export type InstrumentCode =
  | 'WHO5'
  | 'STAI6'
  | 'PANAS'
  | 'PSS10'
  | 'WEMWBS'
  | 'SWEMWBS'
  | 'CBI'
  | 'UWES'
  | 'SAM'
  | 'SUDS'
  | 'SSQ'
  | 'UCLA3'
  | 'MSPSS'
  | 'AAQ2'
  | 'POMS'
  | 'ISI'
  | 'GAS'
  | 'GRITS'
  | 'BRS'
  | 'CVSQ';

export type AssessmentItemType = 'scale' | 'choice' | 'slider';

export interface AssessmentItem {
  id: string;
  prompt: string;
  type: AssessmentItemType;
  min?: number;
  max?: number;
  options?: string[];
  reversed?: boolean;
  subscale?: string;
}

export interface InstrumentCatalog {
  code: InstrumentCode;
  locale: LocaleCode;
  name: string;
  version: string;
  expiryMinutes: number;
  items: AssessmentItem[];
}

export interface OrchestrationHint {
  action: string;
  intensity: 'low' | 'medium' | 'high';
  context: string;
  durationMs?: number;
}

export interface AssessmentComputation {
  instrument: InstrumentCode;
  locale: LocaleCode;
  level: number;
  summary: string;
  hints: OrchestrationHint[];
  generatedAt: string;
}

export interface SubmitAssessmentOptions {
  locale?: LocaleCode;
  timestamp?: string;
  metadata?: Record<string, unknown>;
}

export interface SubmitAssessmentResult {
  success: boolean;
  computation?: AssessmentComputation;
}

type LevelBoundaries = [number, number];

type ScoringDefinition =
  | {
      strategy: 'sum' | 'average';
      reversedItems?: string[];
      thresholds: Record<0 | 1 | 2 | 3 | 4, LevelBoundaries>;
    }
  | {
      strategy: 'subscales';
      subscales: Record<string, string[]>;
      reversedItems?: string[];
      thresholds: Record<0 | 1 | 2 | 3 | 4, LevelBoundaries>;
    };

type LocaleCatalogs = Partial<Record<LocaleCode, InstrumentCatalog>>;

type SummaryDictionary = Record<
  InstrumentCode,
  Partial<Record<LocaleCode, Record<0 | 1 | 2 | 3 | 4, string>>>
>;

type HintDictionary = Record<InstrumentCode, Partial<Record<0 | 1 | 2 | 3 | 4, OrchestrationHint[]>>>;

const DEFAULT_LOCALE: LocaleCode = 'fr';

const deepFreeze = <T>(value: T): T => {
  if (Array.isArray(value)) {
    value.forEach(deepFreeze);
    return Object.freeze(value);
  }
  if (value && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
    return Object.freeze(value as Record<string, unknown>) as T;
  }
  return value;
};

const CATALOGS: Record<InstrumentCode, LocaleCatalogs> = deepFreeze({
  WHO5: {
    fr: {
      code: 'WHO5',
      locale: 'fr',
      name: 'Indice de bien-être OMS',
      version: '1.0',
      expiryMinutes: 30,
      items: [
        { id: '1', prompt: 'Je me suis senti·e gai·e et de bonne humeur', type: 'scale', min: 0, max: 5 },
        { id: '2', prompt: 'Je me suis senti·e calme et apaisé·e', type: 'scale', min: 0, max: 5 },
        { id: '3', prompt: 'Je me suis senti·e actif·ve et énergique', type: 'scale', min: 0, max: 5 },
        { id: '4', prompt: 'Je me suis réveillé·e en me sentant reposé·e', type: 'scale', min: 0, max: 5 },
        { id: '5', prompt: 'Ma vie quotidienne était remplie de choses inspirantes', type: 'scale', min: 0, max: 5 },
      ],
    },
    en: {
      code: 'WHO5',
      locale: 'en',
      name: 'WHO Well-Being Index',
      version: '1.0',
      expiryMinutes: 30,
      items: [
        { id: '1', prompt: 'I felt cheerful and in good spirits', type: 'scale', min: 0, max: 5 },
        { id: '2', prompt: 'I felt calm and relaxed', type: 'scale', min: 0, max: 5 },
        { id: '3', prompt: 'I felt active and full of energy', type: 'scale', min: 0, max: 5 },
        { id: '4', prompt: 'I woke up feeling fresh and rested', type: 'scale', min: 0, max: 5 },
        { id: '5', prompt: 'My daily life was filled with things that interest me', type: 'scale', min: 0, max: 5 },
      ],
    },
    es: {
      code: 'WHO5',
      locale: 'es',
      name: 'Índice de Bienestar OMS',
      version: '1.0',
      expiryMinutes: 30,
      items: [
        { id: '1', prompt: 'Me sentí alegre y de buen ánimo', type: 'scale', min: 0, max: 5 },
        { id: '2', prompt: 'Me sentí calmado/a y relajado/a', type: 'scale', min: 0, max: 5 },
        { id: '3', prompt: 'Me sentí activo/a y con energía', type: 'scale', min: 0, max: 5 },
        { id: '4', prompt: 'Me desperté sintiéndome fresco/a y descansado/a', type: 'scale', min: 0, max: 5 },
        { id: '5', prompt: 'Mi vida diaria estuvo llena de cosas que me interesan', type: 'scale', min: 0, max: 5 },
      ],
    },
    de: {
      code: 'WHO5',
      locale: 'de',
      name: 'WHO Wohlbefinden Index',
      version: '1.0',
      expiryMinutes: 30,
      items: [
        { id: '1', prompt: 'Ich fühlte mich fröhlich und guter Dinge', type: 'scale', min: 0, max: 5 },
        { id: '2', prompt: 'Ich fühlte mich ruhig und entspannt', type: 'scale', min: 0, max: 5 },
        { id: '3', prompt: 'Ich fühlte mich aktiv und voller Energie', type: 'scale', min: 0, max: 5 },
        { id: '4', prompt: 'Ich wachte erholt und frisch auf', type: 'scale', min: 0, max: 5 },
        { id: '5', prompt: 'Mein Alltag war voller Dinge, die mich interessieren', type: 'scale', min: 0, max: 5 },
      ],
    },
    it: {
      code: 'WHO5',
      locale: 'it',
      name: 'Indice di Benessere OMS',
      version: '1.0',
      expiryMinutes: 30,
      items: [
        { id: '1', prompt: 'Mi sono sentito/a allegro/a e di buon umore', type: 'scale', min: 0, max: 5 },
        { id: '2', prompt: 'Mi sono sentito/a calmo/a e rilassato/a', type: 'scale', min: 0, max: 5 },
        { id: '3', prompt: 'Mi sono sentito/a attivo/a ed energico/a', type: 'scale', min: 0, max: 5 },
        { id: '4', prompt: 'Mi sono svegliato/a sentendomi riposato/a', type: 'scale', min: 0, max: 5 },
        { id: '5', prompt: 'La mia vita quotidiana è stata piena di cose che mi interessano', type: 'scale', min: 0, max: 5 },
      ],
    },
  },
  STAI6: {
    fr: {
      code: 'STAI6',
      locale: 'fr',
      name: 'Inventaire état d’esprit (6 items)',
      version: '1.0',
      expiryMinutes: 20,
      items: [
        { id: '1', prompt: 'Je me sens calme', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '2', prompt: 'Je me sens tendu·e', type: 'scale', min: 1, max: 4 },
        { id: '3', prompt: 'Je me sens contrarié·e', type: 'scale', min: 1, max: 4 },
        { id: '4', prompt: 'Je me sens détendu·e', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '5', prompt: 'Je me sens préoccupé·e', type: 'scale', min: 1, max: 4 },
        { id: '6', prompt: 'Je me sens un peu confus·e', type: 'scale', min: 1, max: 4 },
      ],
    },
    en: {
      code: 'STAI6',
      locale: 'en',
      name: 'State Mood Inventory (6 items)',
      version: '1.0',
      expiryMinutes: 20,
      items: [
        { id: '1', prompt: 'I feel calm', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '2', prompt: 'I feel tense', type: 'scale', min: 1, max: 4 },
        { id: '3', prompt: 'I feel upset', type: 'scale', min: 1, max: 4 },
        { id: '4', prompt: 'I feel relaxed', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '5', prompt: 'I feel concerned', type: 'scale', min: 1, max: 4 },
        { id: '6', prompt: 'I feel a bit confused', type: 'scale', min: 1, max: 4 },
      ],
    },
    es: {
      code: 'STAI6',
      locale: 'es',
      name: 'Inventario de estado (6 ítems)',
      version: '1.0',
      expiryMinutes: 20,
      items: [
        { id: '1', prompt: 'Me siento tranquilo/a', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '2', prompt: 'Me siento tenso/a', type: 'scale', min: 1, max: 4 },
        { id: '3', prompt: 'Me siento alterado/a', type: 'scale', min: 1, max: 4 },
        { id: '4', prompt: 'Me siento relajado/a', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '5', prompt: 'Me siento preocupado/a', type: 'scale', min: 1, max: 4 },
        { id: '6', prompt: 'Me siento algo confundido/a', type: 'scale', min: 1, max: 4 },
      ],
    },
    de: {
      code: 'STAI6',
      locale: 'de',
      name: 'Stimmungsinventar (6 Items)',
      version: '1.0',
      expiryMinutes: 20,
      items: [
        { id: '1', prompt: 'Ich fühle mich ruhig', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '2', prompt: 'Ich fühle mich angespannt', type: 'scale', min: 1, max: 4 },
        { id: '3', prompt: 'Ich fühle mich aufgewühlt', type: 'scale', min: 1, max: 4 },
        { id: '4', prompt: 'Ich fühle mich gelassen', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '5', prompt: 'Ich fühle mich besorgt', type: 'scale', min: 1, max: 4 },
        { id: '6', prompt: 'Ich fühle mich etwas verwirrt', type: 'scale', min: 1, max: 4 },
      ],
    },
    it: {
      code: 'STAI6',
      locale: 'it',
      name: 'Inventario dello stato (6 item)',
      version: '1.0',
      expiryMinutes: 20,
      items: [
        { id: '1', prompt: 'Mi sento calmo/a', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '2', prompt: 'Mi sento teso/a', type: 'scale', min: 1, max: 4 },
        { id: '3', prompt: 'Mi sento agitato/a', type: 'scale', min: 1, max: 4 },
        { id: '4', prompt: 'Mi sento rilassato/a', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '5', prompt: 'Mi sento preoccupato/a', type: 'scale', min: 1, max: 4 },
        { id: '6', prompt: 'Mi sento un po’ confuso/a', type: 'scale', min: 1, max: 4 },
      ],
    },
  },
  PANAS: {
    fr: {
      code: 'PANAS',
      locale: 'fr',
      name: 'Affects positifs et nuancés',
      version: '1.0',
      expiryMinutes: 45,
      items: [
        { id: '1', prompt: 'Je me sens inspiré·e', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '2', prompt: 'Je me sens enthousiaste', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '3', prompt: 'Je me sens motivé·e', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '4', prompt: 'Je me sens attentif·ve', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '5', prompt: 'Je me sens énergique', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '6', prompt: 'Je me sens préoccupé·e', type: 'scale', min: 1, max: 5, subscale: 'NA' },
        { id: '7', prompt: 'Je me sens tendu·e', type: 'scale', min: 1, max: 5, subscale: 'NA' },
        { id: '8', prompt: 'Je me sens débordé·e', type: 'scale', min: 1, max: 5, subscale: 'NA' },
        { id: '9', prompt: 'Je me sens agacé·e', type: 'scale', min: 1, max: 5, subscale: 'NA' },
        { id: '10', prompt: 'Je me sens fragile', type: 'scale', min: 1, max: 5, subscale: 'NA' },
      ],
    },
    en: {
      code: 'PANAS',
      locale: 'en',
      name: 'Positive and Nuanced Affect',
      version: '1.0',
      expiryMinutes: 45,
      items: [
        { id: '1', prompt: 'I feel inspired', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '2', prompt: 'I feel enthusiastic', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '3', prompt: 'I feel motivated', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '4', prompt: 'I feel attentive', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '5', prompt: 'I feel energetic', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '6', prompt: 'I feel concerned', type: 'scale', min: 1, max: 5, subscale: 'NA' },
        { id: '7', prompt: 'I feel tense', type: 'scale', min: 1, max: 5, subscale: 'NA' },
        { id: '8', prompt: 'I feel overwhelmed', type: 'scale', min: 1, max: 5, subscale: 'NA' },
        { id: '9', prompt: 'I feel irritated', type: 'scale', min: 1, max: 5, subscale: 'NA' },
        { id: '10', prompt: 'I feel sensitive', type: 'scale', min: 1, max: 5, subscale: 'NA' },
      ],
    },
    es: {
      code: 'PANAS',
      locale: 'es',
      name: 'Afecto positivo y matizado',
      version: '1.0',
      expiryMinutes: 45,
      items: [
        { id: '1', prompt: 'Me siento inspirado/a', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '2', prompt: 'Me siento entusiasmado/a', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '3', prompt: 'Me siento motivado/a', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '4', prompt: 'Me siento atento/a', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '5', prompt: 'Me siento lleno/a de energía', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '6', prompt: 'Me siento preocupado/a', type: 'scale', min: 1, max: 5, subscale: 'NA' },
        { id: '7', prompt: 'Me siento tenso/a', type: 'scale', min: 1, max: 5, subscale: 'NA' },
        { id: '8', prompt: 'Me siento sobrepasado/a', type: 'scale', min: 1, max: 5, subscale: 'NA' },
        { id: '9', prompt: 'Me siento irritado/a', type: 'scale', min: 1, max: 5, subscale: 'NA' },
        { id: '10', prompt: 'Me siento sensible', type: 'scale', min: 1, max: 5, subscale: 'NA' },
      ],
    },
    de: {
      code: 'PANAS',
      locale: 'de',
      name: 'Positive und nuancierte Stimmung',
      version: '1.0',
      expiryMinutes: 45,
      items: [
        { id: '1', prompt: 'Ich fühle mich inspiriert', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '2', prompt: 'Ich fühle mich begeistert', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '3', prompt: 'Ich fühle mich motiviert', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '4', prompt: 'Ich fühle mich aufmerksam', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '5', prompt: 'Ich fühle mich voller Energie', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '6', prompt: 'Ich fühle mich besorgt', type: 'scale', min: 1, max: 5, subscale: 'NA' },
        { id: '7', prompt: 'Ich fühle mich angespannt', type: 'scale', min: 1, max: 5, subscale: 'NA' },
        { id: '8', prompt: 'Ich fühle mich überfordert', type: 'scale', min: 1, max: 5, subscale: 'NA' },
        { id: '9', prompt: 'Ich fühle mich verärgert', type: 'scale', min: 1, max: 5, subscale: 'NA' },
        { id: '10', prompt: 'Ich fühle mich empfindlich', type: 'scale', min: 1, max: 5, subscale: 'NA' },
      ],
    },
    it: {
      code: 'PANAS',
      locale: 'it',
      name: 'Affetti positivi e sfumati',
      version: '1.0',
      expiryMinutes: 45,
      items: [
        { id: '1', prompt: 'Mi sento ispirato/a', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '2', prompt: 'Mi sento entusiasta', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '3', prompt: 'Mi sento motivato/a', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '4', prompt: 'Mi sento attento/a', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '5', prompt: 'Mi sento pieno/a di energia', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '6', prompt: 'Mi sento preoccupato/a', type: 'scale', min: 1, max: 5, subscale: 'NA' },
        { id: '7', prompt: 'Mi sento teso/a', type: 'scale', min: 1, max: 5, subscale: 'NA' },
        { id: '8', prompt: 'Mi sento sopraffatto/a', type: 'scale', min: 1, max: 5, subscale: 'NA' },
        { id: '9', prompt: 'Mi sento irritato/a', type: 'scale', min: 1, max: 5, subscale: 'NA' },
        { id: '10', prompt: 'Mi sento sensibile', type: 'scale', min: 1, max: 5, subscale: 'NA' },
      ],
    },
  },
  PSS10: {
    fr: {
      code: 'PSS10',
      locale: 'fr',
      name: 'Ressenti face aux imprévus',
      version: '1.0',
      expiryMinutes: 60,
      items: [
        { id: '1', prompt: 'Je me sens dépassé·e par les changements inattendus', type: 'scale', min: 0, max: 4 },
        { id: '2', prompt: 'Je parviens à gérer mon agenda personnel', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '3', prompt: 'Je me sens serein·e face aux responsabilités', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '4', prompt: 'Je sens que les choses échappent à mon contrôle', type: 'scale', min: 0, max: 4 },
        { id: '5', prompt: 'Je gère calmement les obstacles', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '6', prompt: 'Je me sens en tension', type: 'scale', min: 0, max: 4 },
        { id: '7', prompt: 'Je garde la main sur ma to-do', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '8', prompt: 'Je me sens capable de rester posé·e', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '9', prompt: 'Je me sens impatient·e ou irrité·e', type: 'scale', min: 0, max: 4 },
        { id: '10', prompt: 'Je sens que les difficultés s’accumulent', type: 'scale', min: 0, max: 4 },
      ],
    },
    en: {
      code: 'PSS10',
      locale: 'en',
      name: 'Sense of load with daily surprises',
      version: '1.0',
      expiryMinutes: 60,
      items: [
        { id: '1', prompt: 'I feel overwhelmed by unexpected changes', type: 'scale', min: 0, max: 4 },
        { id: '2', prompt: 'I manage my personal schedule smoothly', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '3', prompt: 'I stay grounded with responsibilities', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '4', prompt: 'I sense things are slipping out of control', type: 'scale', min: 0, max: 4 },
        { id: '5', prompt: 'I handle obstacles with calm', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '6', prompt: 'I feel physical tension building up', type: 'scale', min: 0, max: 4 },
        { id: '7', prompt: 'I keep ownership of my to-do list', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '8', prompt: 'I remain steady even when things pile up', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '9', prompt: 'I feel impatient or on edge', type: 'scale', min: 0, max: 4 },
        { id: '10', prompt: 'I sense challenges stacking up', type: 'scale', min: 0, max: 4 },
      ],
    },
    es: {
      code: 'PSS10',
      locale: 'es',
      name: 'Sensación frente a los imprevistos',
      version: '1.0',
      expiryMinutes: 60,
      items: [
        { id: '1', prompt: 'Me siento sobrepasado/a por cambios inesperados', type: 'scale', min: 0, max: 4 },
        { id: '2', prompt: 'Gestiono mi agenda personal con calma', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '3', prompt: 'Me siento sereno/a con las responsabilidades', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '4', prompt: 'Siento que las cosas se me escapan de las manos', type: 'scale', min: 0, max: 4 },
        { id: '5', prompt: 'Afronto los obstáculos con serenidad', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '6', prompt: 'Noto tensión en mi cuerpo', type: 'scale', min: 0, max: 4 },
        { id: '7', prompt: 'Mantengo el control de mi lista de tareas', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '8', prompt: 'Logro mantener la calma cuando se acumulan cosas', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '9', prompt: 'Me siento impaciente o irritable', type: 'scale', min: 0, max: 4 },
        { id: '10', prompt: 'Siento que las dificultades se acumulan', type: 'scale', min: 0, max: 4 },
      ],
    },
    de: {
      code: 'PSS10',
      locale: 'de',
      name: 'Umgang mit täglichen Überraschungen',
      version: '1.0',
      expiryMinutes: 60,
      items: [
        { id: '1', prompt: 'Ich fühle mich von unerwarteten Änderungen überfordert', type: 'scale', min: 0, max: 4 },
        { id: '2', prompt: 'Ich behalte meinen persönlichen Kalender gut im Blick', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '3', prompt: 'Ich bleibe gelassen bei meinen Aufgaben', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '4', prompt: 'Ich habe das Gefühl, dass mir Dinge entgleiten', type: 'scale', min: 0, max: 4 },
        { id: '5', prompt: 'Ich gehe ruhig mit Hindernissen um', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '6', prompt: 'Ich spüre wachsende Anspannung', type: 'scale', min: 0, max: 4 },
        { id: '7', prompt: 'Ich behalte die Kontrolle über meine Aufgabenliste', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '8', prompt: 'Ich bleibe ruhig, auch wenn sich vieles aufstaut', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '9', prompt: 'Ich fühle mich ungeduldig oder gereizt', type: 'scale', min: 0, max: 4 },
        { id: '10', prompt: 'Ich habe den Eindruck, dass sich Schwierigkeiten häufen', type: 'scale', min: 0, max: 4 },
      ],
    },
    it: {
      code: 'PSS10',
      locale: 'it',
      name: 'Sensazione di carico con gli imprevisti',
      version: '1.0',
      expiryMinutes: 60,
      items: [
        { id: '1', prompt: 'Mi sento sopraffatto/a dai cambiamenti imprevisti', type: 'scale', min: 0, max: 4 },
        { id: '2', prompt: 'Gestisco il mio programma personale con serenità', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '3', prompt: 'Resto calmo/a con le responsabilità', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '4', prompt: 'Ho la sensazione che le cose mi sfuggano di mano', type: 'scale', min: 0, max: 4 },
        { id: '5', prompt: 'Affronto gli ostacoli con calma', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '6', prompt: 'Sento crescere tensione nel corpo', type: 'scale', min: 0, max: 4 },
        { id: '7', prompt: 'Tengo il controllo della mia lista di cose da fare', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '8', prompt: 'Riesco a restare posato/a quando tutto si accumula', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '9', prompt: 'Mi sento impaziente o irritabile', type: 'scale', min: 0, max: 4 },
        { id: '10', prompt: 'Sento che le difficoltà si accumulano', type: 'scale', min: 0, max: 4 },
      ],
    },
  },
  WEMWBS: {
    fr: {
      code: 'WEMWBS',
      locale: 'fr',
      name: 'Moments de vitalité partagée',
      version: '1.0',
      expiryMinutes: 90,
      items: [
        { id: '1', prompt: 'Je me sens optimiste quant à l’avenir', type: 'scale', min: 1, max: 5 },
        { id: '2', prompt: 'Je me sens utile pour mon entourage', type: 'scale', min: 1, max: 5 },
        { id: '3', prompt: 'Je me sens détendu·e et paisible', type: 'scale', min: 1, max: 5 },
        { id: '4', prompt: 'Je me sens intéressé·e par ce qui m’entoure', type: 'scale', min: 1, max: 5 },
        { id: '5', prompt: 'Je me sens énergique', type: 'scale', min: 1, max: 5 },
        { id: '6', prompt: 'Je me sens aimable avec moi-même', type: 'scale', min: 1, max: 5 },
        { id: '7', prompt: 'Je me sens proche des autres', type: 'scale', min: 1, max: 5 },
        { id: '8', prompt: 'Je me sens confiant·e', type: 'scale', min: 1, max: 5 },
        { id: '9', prompt: 'Je me sens prendre de bonnes décisions', type: 'scale', min: 1, max: 5 },
        { id: '10', prompt: 'Je me sens maître de ma trajectoire', type: 'scale', min: 1, max: 5 },
        { id: '11', prompt: 'Je sens ma vie prendre sens', type: 'scale', min: 1, max: 5 },
        { id: '12', prompt: 'Je me sens en contrôle de mes plans', type: 'scale', min: 1, max: 5 },
        { id: '13', prompt: 'Je me sens apprécier mon quotidien', type: 'scale', min: 1, max: 5 },
        { id: '14', prompt: 'Je me sens bien entouré·e', type: 'scale', min: 1, max: 5 },
      ],
    },
    en: {
      code: 'WEMWBS',
      locale: 'en',
      name: 'Shared moments of vitality',
      version: '1.0',
      expiryMinutes: 90,
      items: [
        { id: '1', prompt: 'I feel optimistic about the future', type: 'scale', min: 1, max: 5 },
        { id: '2', prompt: 'I feel useful to the people around me', type: 'scale', min: 1, max: 5 },
        { id: '3', prompt: 'I feel relaxed and at peace', type: 'scale', min: 1, max: 5 },
        { id: '4', prompt: 'I feel interested in my surroundings', type: 'scale', min: 1, max: 5 },
        { id: '5', prompt: 'I feel energetic', type: 'scale', min: 1, max: 5 },
        { id: '6', prompt: 'I feel kind towards myself', type: 'scale', min: 1, max: 5 },
        { id: '7', prompt: 'I feel close to other people', type: 'scale', min: 1, max: 5 },
        { id: '8', prompt: 'I feel confident', type: 'scale', min: 1, max: 5 },
        { id: '9', prompt: 'I feel able to make good decisions', type: 'scale', min: 1, max: 5 },
        { id: '10', prompt: 'I feel in charge of my direction', type: 'scale', min: 1, max: 5 },
        { id: '11', prompt: 'I feel my life has meaning', type: 'scale', min: 1, max: 5 },
        { id: '12', prompt: 'I feel in control of my plans', type: 'scale', min: 1, max: 5 },
        { id: '13', prompt: 'I feel appreciative of my daily life', type: 'scale', min: 1, max: 5 },
        { id: '14', prompt: 'I feel well supported', type: 'scale', min: 1, max: 5 },
      ],
    },
    es: {
      code: 'WEMWBS',
      locale: 'es',
      name: 'Momentos compartidos de vitalidad',
      version: '1.0',
      expiryMinutes: 90,
      items: [
        { id: '1', prompt: 'Me siento optimista con el futuro', type: 'scale', min: 1, max: 5 },
        { id: '2', prompt: 'Me siento útil para quienes me rodean', type: 'scale', min: 1, max: 5 },
        { id: '3', prompt: 'Me siento relajado/a y en paz', type: 'scale', min: 1, max: 5 },
        { id: '4', prompt: 'Me siento interesado/a por mi entorno', type: 'scale', min: 1, max: 5 },
        { id: '5', prompt: 'Me siento con energía', type: 'scale', min: 1, max: 5 },
        { id: '6', prompt: 'Me trato con amabilidad', type: 'scale', min: 1, max: 5 },
        { id: '7', prompt: 'Me siento cercano/a a los demás', type: 'scale', min: 1, max: 5 },
        { id: '8', prompt: 'Me siento confiado/a', type: 'scale', min: 1, max: 5 },
        { id: '9', prompt: 'Me siento capaz de tomar buenas decisiones', type: 'scale', min: 1, max: 5 },
        { id: '10', prompt: 'Siento que dirijo mi rumbo', type: 'scale', min: 1, max: 5 },
        { id: '11', prompt: 'Siento que mi vida tiene sentido', type: 'scale', min: 1, max: 5 },
        { id: '12', prompt: 'Me siento al mando de mis planes', type: 'scale', min: 1, max: 5 },
        { id: '13', prompt: 'Disfruto de mi día a día', type: 'scale', min: 1, max: 5 },
        { id: '14', prompt: 'Me siento bien acompañado/a', type: 'scale', min: 1, max: 5 },
      ],
    },
    de: {
      code: 'WEMWBS',
      locale: 'de',
      name: 'Geteilte Momente voller Vitalität',
      version: '1.0',
      expiryMinutes: 90,
      items: [
        { id: '1', prompt: 'Ich blicke optimistisch in die Zukunft', type: 'scale', min: 1, max: 5 },
        { id: '2', prompt: 'Ich fühle mich nützlich für andere', type: 'scale', min: 1, max: 5 },
        { id: '3', prompt: 'Ich fühle mich entspannt und friedlich', type: 'scale', min: 1, max: 5 },
        { id: '4', prompt: 'Ich interessiere mich für meine Umgebung', type: 'scale', min: 1, max: 5 },
        { id: '5', prompt: 'Ich fühle mich voller Energie', type: 'scale', min: 1, max: 5 },
        { id: '6', prompt: 'Ich bin freundlich zu mir selbst', type: 'scale', min: 1, max: 5 },
        { id: '7', prompt: 'Ich fühle mich anderen nahe', type: 'scale', min: 1, max: 5 },
        { id: '8', prompt: 'Ich bin zuversichtlich', type: 'scale', min: 1, max: 5 },
        { id: '9', prompt: 'Ich treffe gute Entscheidungen', type: 'scale', min: 1, max: 5 },
        { id: '10', prompt: 'Ich habe meine Richtung in der Hand', type: 'scale', min: 1, max: 5 },
        { id: '11', prompt: 'Ich empfinde Sinn in meinem Leben', type: 'scale', min: 1, max: 5 },
        { id: '12', prompt: 'Ich habe meine Pläne im Griff', type: 'scale', min: 1, max: 5 },
        { id: '13', prompt: 'Ich genieße meinen Alltag', type: 'scale', min: 1, max: 5 },
        { id: '14', prompt: 'Ich fühle mich gut unterstützt', type: 'scale', min: 1, max: 5 },
      ],
    },
    it: {
      code: 'WEMWBS',
      locale: 'it',
      name: 'Momenti condivisi di vitalità',
      version: '1.0',
      expiryMinutes: 90,
      items: [
        { id: '1', prompt: 'Mi sento ottimista verso il futuro', type: 'scale', min: 1, max: 5 },
        { id: '2', prompt: 'Mi sento utile per chi mi circonda', type: 'scale', min: 1, max: 5 },
        { id: '3', prompt: 'Mi sento rilassato/a e in pace', type: 'scale', min: 1, max: 5 },
        { id: '4', prompt: 'Mi sento interessato/a a ciò che mi circonda', type: 'scale', min: 1, max: 5 },
        { id: '5', prompt: 'Mi sento pieno/a di energia', type: 'scale', min: 1, max: 5 },
        { id: '6', prompt: 'Sono gentile con me stesso/a', type: 'scale', min: 1, max: 5 },
        { id: '7', prompt: 'Mi sento vicino/a agli altri', type: 'scale', min: 1, max: 5 },
        { id: '8', prompt: 'Mi sento fiducioso/a', type: 'scale', min: 1, max: 5 },
        { id: '9', prompt: 'Prendo buone decisioni', type: 'scale', min: 1, max: 5 },
        { id: '10', prompt: 'Sento di guidare il mio percorso', type: 'scale', min: 1, max: 5 },
        { id: '11', prompt: 'Sento che la mia vita ha significato', type: 'scale', min: 1, max: 5 },
        { id: '12', prompt: 'Controllo i miei progetti', type: 'scale', min: 1, max: 5 },
        { id: '13', prompt: 'Apprezzo la mia quotidianità', type: 'scale', min: 1, max: 5 },
        { id: '14', prompt: 'Mi sento ben supportato/a', type: 'scale', min: 1, max: 5 },
      ],
    },
  },
  CBI: {
    fr: {
      code: 'CBI',
      locale: 'fr',
      name: 'Équilibre énergie travail',
      version: '1.0',
      expiryMinutes: 75,
      items: [
        { id: '1', prompt: 'Je me sens vidé·e à la fin de la journée', type: 'scale', min: 0, max: 5 },
        { id: '2', prompt: 'Je me sens épuisé·e quand je commence la journée', type: 'scale', min: 0, max: 5 },
        { id: '3', prompt: 'Je me sens à bout de souffle émotionnellement', type: 'scale', min: 0, max: 5 },
        { id: '4', prompt: 'Je me sens distant·e de mon activité', type: 'scale', min: 0, max: 5 },
        { id: '5', prompt: 'Je me sens en retrait vis-à-vis de celles et ceux que j’accompagne', type: 'scale', min: 0, max: 5 },
        { id: '6', prompt: 'Je me sens satisfait·e de mon équilibre', type: 'scale', min: 0, max: 5, reversed: true },
      ],
    },
    en: {
      code: 'CBI',
      locale: 'en',
      name: 'Energy balance at work',
      version: '1.0',
      expiryMinutes: 75,
      items: [
        { id: '1', prompt: 'I feel drained at the end of the day', type: 'scale', min: 0, max: 5 },
        { id: '2', prompt: 'I feel tired when the day begins', type: 'scale', min: 0, max: 5 },
        { id: '3', prompt: 'I feel emotionally empty', type: 'scale', min: 0, max: 5 },
        { id: '4', prompt: 'I feel distant from my activity', type: 'scale', min: 0, max: 5 },
        { id: '5', prompt: 'I feel withdrawn from the people I support', type: 'scale', min: 0, max: 5 },
        { id: '6', prompt: 'I feel satisfied with my balance', type: 'scale', min: 0, max: 5, reversed: true },
      ],
    },
    es: {
      code: 'CBI',
      locale: 'es',
      name: 'Equilibrio de energía laboral',
      version: '1.0',
      expiryMinutes: 75,
      items: [
        { id: '1', prompt: 'Me siento agotado/a al final del día', type: 'scale', min: 0, max: 5 },
        { id: '2', prompt: 'Me siento cansado/a cuando empieza el día', type: 'scale', min: 0, max: 5 },
        { id: '3', prompt: 'Me siento vacío/a emocionalmente', type: 'scale', min: 0, max: 5 },
        { id: '4', prompt: 'Me siento distante de mi actividad', type: 'scale', min: 0, max: 5 },
        { id: '5', prompt: 'Me siento alejado/a de las personas a las que acompaño', type: 'scale', min: 0, max: 5 },
        { id: '6', prompt: 'Me siento satisfecho/a con mi equilibrio', type: 'scale', min: 0, max: 5, reversed: true },
      ],
    },
    de: {
      code: 'CBI',
      locale: 'de',
      name: 'Energiebalance im Arbeitsalltag',
      version: '1.0',
      expiryMinutes: 75,
      items: [
        { id: '1', prompt: 'Ich fühle mich am Ende des Tages ausgelaugt', type: 'scale', min: 0, max: 5 },
        { id: '2', prompt: 'Ich fühle mich müde, wenn der Tag beginnt', type: 'scale', min: 0, max: 5 },
        { id: '3', prompt: 'Ich fühle mich emotional leer', type: 'scale', min: 0, max: 5 },
        { id: '4', prompt: 'Ich fühle mich von meiner Tätigkeit distanziert', type: 'scale', min: 0, max: 5 },
        { id: '5', prompt: 'Ich fühle mich von den Menschen, die ich begleite, entfernt', type: 'scale', min: 0, max: 5 },
        { id: '6', prompt: 'Ich bin zufrieden mit meinem Gleichgewicht', type: 'scale', min: 0, max: 5, reversed: true },
      ],
    },
    it: {
      code: 'CBI',
      locale: 'it',
      name: 'Bilancio di energia al lavoro',
      version: '1.0',
      expiryMinutes: 75,
      items: [
        { id: '1', prompt: 'Mi sento svuotato/a a fine giornata', type: 'scale', min: 0, max: 5 },
        { id: '2', prompt: 'Mi sento stanco/a appena inizia la giornata', type: 'scale', min: 0, max: 5 },
        { id: '3', prompt: 'Mi sento emotivamente prosciugato/a', type: 'scale', min: 0, max: 5 },
        { id: '4', prompt: 'Mi sento distante dalla mia attività', type: 'scale', min: 0, max: 5 },
        { id: '5', prompt: 'Mi sento distante dalle persone che supporto', type: 'scale', min: 0, max: 5 },
        { id: '6', prompt: 'Mi sento soddisfatto/a del mio equilibrio', type: 'scale', min: 0, max: 5, reversed: true },
      ],
    },
  },
  UWES: {
    fr: {
      code: 'UWES',
      locale: 'fr',
      name: 'Engagement au fil des projets',
      version: '1.0',
      expiryMinutes: 75,
      items: [
        { id: '1', prompt: 'Je me sens plein·e d’énergie au travail', type: 'scale', min: 0, max: 6 },
        { id: '2', prompt: 'Je suis enthousiaste à propos de mes missions', type: 'scale', min: 0, max: 6 },
        { id: '3', prompt: 'Je suis fier·e de ce que je fais', type: 'scale', min: 0, max: 6 },
        { id: '4', prompt: 'Je suis inspiré·e par mon activité', type: 'scale', min: 0, max: 6 },
        { id: '5', prompt: 'Je me sens absorbé·e dans ce que je fais', type: 'scale', min: 0, max: 6 },
        { id: '6', prompt: 'Le temps passe vite quand je suis concentré·e', type: 'scale', min: 0, max: 6 },
        { id: '7', prompt: 'Je me sens résilient·e face aux défis', type: 'scale', min: 0, max: 6 },
        { id: '8', prompt: 'Je ressens une grande vitalité dans mes projets', type: 'scale', min: 0, max: 6 },
        { id: '9', prompt: 'Je me sens impliqué·e dans mes responsabilités', type: 'scale', min: 0, max: 6 },
      ],
    },
    en: {
      code: 'UWES',
      locale: 'en',
      name: 'Project engagement pulse',
      version: '1.0',
      expiryMinutes: 75,
      items: [
        { id: '1', prompt: 'I feel bursting with energy at work', type: 'scale', min: 0, max: 6 },
        { id: '2', prompt: 'I am enthusiastic about my tasks', type: 'scale', min: 0, max: 6 },
        { id: '3', prompt: 'I am proud of what I do', type: 'scale', min: 0, max: 6 },
        { id: '4', prompt: 'I feel inspired by my activity', type: 'scale', min: 0, max: 6 },
        { id: '5', prompt: 'I am fully absorbed in my work', type: 'scale', min: 0, max: 6 },
        { id: '6', prompt: 'Time flies when I am focused', type: 'scale', min: 0, max: 6 },
        { id: '7', prompt: 'I feel resilient when facing challenges', type: 'scale', min: 0, max: 6 },
        { id: '8', prompt: 'I sense strong vitality in my projects', type: 'scale', min: 0, max: 6 },
        { id: '9', prompt: 'I feel deeply involved in my responsibilities', type: 'scale', min: 0, max: 6 },
      ],
    },
    es: {
      code: 'UWES',
      locale: 'es',
      name: 'Impulso de compromiso',
      version: '1.0',
      expiryMinutes: 75,
      items: [
        { id: '1', prompt: 'Me siento lleno/a de energía en el trabajo', type: 'scale', min: 0, max: 6 },
        { id: '2', prompt: 'Estoy entusiasmado/a con mis tareas', type: 'scale', min: 0, max: 6 },
        { id: '3', prompt: 'Estoy orgulloso/a de lo que hago', type: 'scale', min: 0, max: 6 },
        { id: '4', prompt: 'Mi actividad me inspira', type: 'scale', min: 0, max: 6 },
        { id: '5', prompt: 'Me absorbo por completo en mi trabajo', type: 'scale', min: 0, max: 6 },
        { id: '6', prompt: 'El tiempo vuela cuando estoy concentrado/a', type: 'scale', min: 0, max: 6 },
        { id: '7', prompt: 'Me siento resistente ante los retos', type: 'scale', min: 0, max: 6 },
        { id: '8', prompt: 'Siento mucha vitalidad en mis proyectos', type: 'scale', min: 0, max: 6 },
        { id: '9', prompt: 'Me siento muy implicado/a en mis responsabilidades', type: 'scale', min: 0, max: 6 },
      ],
    },
    de: {
      code: 'UWES',
      locale: 'de',
      name: 'Engagement-Kompass',
      version: '1.0',
      expiryMinutes: 75,
      items: [
        { id: '1', prompt: 'Ich fühle mich voller Energie bei der Arbeit', type: 'scale', min: 0, max: 6 },
        { id: '2', prompt: 'Ich bin begeistert von meinen Aufgaben', type: 'scale', min: 0, max: 6 },
        { id: '3', prompt: 'Ich bin stolz auf das, was ich tue', type: 'scale', min: 0, max: 6 },
        { id: '4', prompt: 'Meine Tätigkeit inspiriert mich', type: 'scale', min: 0, max: 6 },
        { id: '5', prompt: 'Ich gehe in meiner Arbeit völlig auf', type: 'scale', min: 0, max: 6 },
        { id: '6', prompt: 'Die Zeit vergeht wie im Flug, wenn ich konzentriert bin', type: 'scale', min: 0, max: 6 },
        { id: '7', prompt: 'Ich fühle mich widerstandsfähig bei Herausforderungen', type: 'scale', min: 0, max: 6 },
        { id: '8', prompt: 'Ich spüre große Vitalität in meinen Projekten', type: 'scale', min: 0, max: 6 },
        { id: '9', prompt: 'Ich bin stark in meine Aufgaben eingebunden', type: 'scale', min: 0, max: 6 },
      ],
    },
    it: {
      code: 'UWES',
      locale: 'it',
      name: 'Impulso di coinvolgimento',
      version: '1.0',
      expiryMinutes: 75,
      items: [
        { id: '1', prompt: 'Mi sento pieno/a di energia sul lavoro', type: 'scale', min: 0, max: 6 },
        { id: '2', prompt: 'Sono entusiasta dei miei compiti', type: 'scale', min: 0, max: 6 },
        { id: '3', prompt: 'Sono orgoglioso/a di ciò che faccio', type: 'scale', min: 0, max: 6 },
        { id: '4', prompt: 'La mia attività mi ispira', type: 'scale', min: 0, max: 6 },
        { id: '5', prompt: 'Mi sento completamente immerso/a nel mio lavoro', type: 'scale', min: 0, max: 6 },
        { id: '6', prompt: 'Il tempo vola quando sono concentrato/a', type: 'scale', min: 0, max: 6 },
        { id: '7', prompt: 'Mi sento resiliente di fronte alle sfide', type: 'scale', min: 0, max: 6 },
        { id: '8', prompt: 'Sento una forte vitalità nei miei progetti', type: 'scale', min: 0, max: 6 },
        { id: '9', prompt: 'Mi sento molto coinvolto/a nelle mie responsabilità', type: 'scale', min: 0, max: 6 },
      ],
    },
  },
  SAM: {
    fr: {
      code: 'SAM',
      locale: 'fr',
      name: 'Auto-évaluation sensorielle',
      version: '1.0',
      expiryMinutes: 10,
      items: [
        { id: '1', prompt: 'Palette ressentie (du sombre au lumineux)', type: 'slider', min: 1, max: 9 },
        { id: '2', prompt: 'Tonus intérieur (du calme à l’intense)', type: 'slider', min: 1, max: 9 },
      ],
    },
    en: {
      code: 'SAM',
      locale: 'en',
      name: 'Self-assessment snapshot',
      version: '1.0',
      expiryMinutes: 10,
      items: [
        { id: '1', prompt: 'Overall tone (dark to bright)', type: 'slider', min: 1, max: 9 },
        { id: '2', prompt: 'Activation (calm to intense)', type: 'slider', min: 1, max: 9 },
      ],
    },
    es: {
      code: 'SAM',
      locale: 'es',
      name: 'Autoevaluación sensorial',
      version: '1.0',
      expiryMinutes: 10,
      items: [
        { id: '1', prompt: 'Tono global (de oscuro a luminoso)', type: 'slider', min: 1, max: 9 },
        { id: '2', prompt: 'Activación (de calma a intensa)', type: 'slider', min: 1, max: 9 },
      ],
    },
    de: {
      code: 'SAM',
      locale: 'de',
      name: 'Sensorische Selbsteinschätzung',
      version: '1.0',
      expiryMinutes: 10,
      items: [
        { id: '1', prompt: 'Gesamtton (dunkel bis hell)', type: 'slider', min: 1, max: 9 },
        { id: '2', prompt: 'Aktivierung (ruhig bis intensiv)', type: 'slider', min: 1, max: 9 },
      ],
    },
    it: {
      code: 'SAM',
      locale: 'it',
      name: 'Autoscatto sensoriale',
      version: '1.0',
      expiryMinutes: 10,
      items: [
        { id: '1', prompt: 'Tono generale (dallo scuro al luminoso)', type: 'slider', min: 1, max: 9 },
        { id: '2', prompt: 'Attivazione (dal calmo all’intenso)', type: 'slider', min: 1, max: 9 },
      ],
    },
  },
  SUDS: {
    fr: {
      code: 'SUDS',
      locale: 'fr',
      name: 'Intensité du moment',
      version: '1.0',
      expiryMinutes: 5,
      items: [
        { id: '1', prompt: 'Comment se sent l’intensité intérieure ?', type: 'slider', min: 0, max: 10 },
      ],
    },
    en: {
      code: 'SUDS',
      locale: 'en',
      name: 'Moment intensity scale',
      version: '1.0',
      expiryMinutes: 5,
      items: [
        { id: '1', prompt: 'How strong does the moment feel right now?', type: 'slider', min: 0, max: 10 },
      ],
    },
    es: {
      code: 'SUDS',
      locale: 'es',
      name: 'Intensidad del momento',
      version: '1.0',
      expiryMinutes: 5,
      items: [
        { id: '1', prompt: '¿Qué intensidad sientes en este momento?', type: 'slider', min: 0, max: 10 },
      ],
    },
    de: {
      code: 'SUDS',
      locale: 'de',
      name: 'Momentane Intensität',
      version: '1.0',
      expiryMinutes: 5,
      items: [
        { id: '1', prompt: 'Wie intensiv fühlt sich der Moment an?', type: 'slider', min: 0, max: 10 },
      ],
    },
    it: {
      code: 'SUDS',
      locale: 'it',
      name: 'Intensità del momento',
      version: '1.0',
      expiryMinutes: 5,
      items: [
        { id: '1', prompt: 'Quanta intensità senti adesso?', type: 'slider', min: 0, max: 10 },
      ],
    },
  },
  SSQ: {
    fr: {
      code: 'SSQ',
      locale: 'fr',
      name: 'Confort VR immédiat',
      version: '1.0',
      expiryMinutes: 20,
      items: [
        { id: '1', prompt: 'Je me sens parfaitement stable', type: 'scale', min: 0, max: 3, reversed: true },
        { id: '2', prompt: 'Je perçois quelques vertiges', type: 'scale', min: 0, max: 3 },
        { id: '3', prompt: 'Je ressens des inconforts visuels', type: 'scale', min: 0, max: 3 },
        { id: '4', prompt: 'Je préfère faire une pause', type: 'scale', min: 0, max: 3 },
      ],
    },
    en: {
      code: 'SSQ',
      locale: 'en',
      name: 'VR comfort snapshot',
      version: '1.0',
      expiryMinutes: 20,
      items: [
        { id: '1', prompt: 'I feel perfectly steady', type: 'scale', min: 0, max: 3, reversed: true },
        { id: '2', prompt: 'I notice slight dizziness', type: 'scale', min: 0, max: 3 },
        { id: '3', prompt: 'I sense visual discomfort', type: 'scale', min: 0, max: 3 },
        { id: '4', prompt: 'I would like to pause', type: 'scale', min: 0, max: 3 },
      ],
    },
    es: {
      code: 'SSQ',
      locale: 'es',
      name: 'Instantáneo de confort VR',
      version: '1.0',
      expiryMinutes: 20,
      items: [
        { id: '1', prompt: 'Me siento completamente estable', type: 'scale', min: 0, max: 3, reversed: true },
        { id: '2', prompt: 'Percibo un leve mareo', type: 'scale', min: 0, max: 3 },
        { id: '3', prompt: 'Siento incomodidad visual', type: 'scale', min: 0, max: 3 },
        { id: '4', prompt: 'Preferiría hacer una pausa', type: 'scale', min: 0, max: 3 },
      ],
    },
    de: {
      code: 'SSQ',
      locale: 'de',
      name: 'VR-Komfortmoment',
      version: '1.0',
      expiryMinutes: 20,
      items: [
        { id: '1', prompt: 'Ich fühle mich vollkommen stabil', type: 'scale', min: 0, max: 3, reversed: true },
        { id: '2', prompt: 'Ich bemerke leichte Schwindelgefühle', type: 'scale', min: 0, max: 3 },
        { id: '3', prompt: 'Ich spüre visuellen Unkomfort', type: 'scale', min: 0, max: 3 },
        { id: '4', prompt: 'Ich hätte gerne eine Pause', type: 'scale', min: 0, max: 3 },
      ],
    },
    it: {
      code: 'SSQ',
      locale: 'it',
      name: 'Scatto di comfort VR',
      version: '1.0',
      expiryMinutes: 20,
      items: [
        { id: '1', prompt: 'Mi sento perfettamente stabile', type: 'scale', min: 0, max: 3, reversed: true },
        { id: '2', prompt: 'Percepisco un lieve giramento', type: 'scale', min: 0, max: 3 },
        { id: '3', prompt: 'Avverto qualche disagio visivo', type: 'scale', min: 0, max: 3 },
        { id: '4', prompt: 'Preferisco fermarmi un momento', type: 'scale', min: 0, max: 3 },
      ],
    },
  },
  UCLA3: {
    fr: {
      code: 'UCLA3',
      locale: 'fr',
      name: 'Mini-baromètre de lien social',
      version: '1.0',
      expiryMinutes: 30,
      items: [
        {
          id: '1',
          prompt: 'Au cours des derniers jours, je me suis senti·e entouré·e.',
          type: 'scale',
          min: 1,
          max: 3,
          options: ['Rarement', 'Parfois', 'Souvent'],
        },
        {
          id: '2',
          prompt: 'J’avais des personnes avec qui partager vraiment ce que je ressens.',
          type: 'scale',
          min: 1,
          max: 3,
          options: ['Rarement', 'Parfois', 'Souvent'],
        },
        {
          id: '3',
          prompt: 'Je me suis senti·e en lien avec les autres.',
          type: 'scale',
          min: 1,
          max: 3,
          options: ['Rarement', 'Parfois', 'Souvent'],
        },
      ],
    },
  },
  MSPSS: {
    fr: {
      code: 'MSPSS',
      locale: 'fr',
      name: 'Soutiens autour de moi',
      version: '1.0',
      expiryMinutes: 30,
      items: [
        {
          id: '1',
          prompt: 'Les personnes proches me réconfortent quand j’en ai besoin.',
          type: 'scale',
          min: 1,
          max: 7,
          options: ['Rarement', 'Parfois', 'Toujours'],
        },
        {
          id: '2',
          prompt: 'Je peux compter sur des amis si quelque chose me tracasse.',
          type: 'scale',
          min: 1,
          max: 7,
          options: ['Rarement', 'Parfois', 'Toujours'],
        },
        {
          id: '3',
          prompt: 'Ma famille écoute mes préoccupations.',
          type: 'scale',
          min: 1,
          max: 7,
          options: ['Rarement', 'Parfois', 'Toujours'],
        },
        {
          id: '4',
          prompt: 'Je reçois l’affection dont j’ai besoin.',
          type: 'scale',
          min: 1,
          max: 7,
          options: ['Rarement', 'Parfois', 'Toujours'],
        },
        {
          id: '5',
          prompt: 'Je peux m’adresser à ma famille pour obtenir du soutien émotionnel.',
          type: 'scale',
          min: 1,
          max: 7,
          options: ['Rarement', 'Parfois', 'Toujours'],
        },
        {
          id: '6',
          prompt: 'Je peux partager mes joies et mes peines avec mes amis.',
          type: 'scale',
          min: 1,
          max: 7,
          options: ['Rarement', 'Parfois', 'Toujours'],
        },
        {
          id: '7',
          prompt: 'Les personnes importantes pour moi se soucient de mon bien-être.',
          type: 'scale',
          min: 1,
          max: 7,
          options: ['Rarement', 'Parfois', 'Toujours'],
        },
        {
          id: '8',
          prompt: 'Je peux parler de mes problèmes à ma famille.',
          type: 'scale',
          min: 1,
          max: 7,
          options: ['Rarement', 'Parfois', 'Toujours'],
        },
        {
          id: '9',
          prompt: 'Mes amis me proposent leur aide quand j’en ai besoin.',
          type: 'scale',
          min: 1,
          max: 7,
          options: ['Rarement', 'Parfois', 'Toujours'],
        },
        {
          id: '10',
          prompt: 'Je reçois de l’attention et de l’aide de la part de ma famille.',
          type: 'scale',
          min: 1,
          max: 7,
          options: ['Rarement', 'Parfois', 'Toujours'],
        },
        {
          id: '11',
          prompt: 'Je peux compter sur mes amis pour me parler quand je me sens mal.',
          type: 'scale',
          min: 1,
          max: 7,
          options: ['Rarement', 'Parfois', 'Toujours'],
        },
        {
          id: '12',
          prompt: 'Il y a des personnes autour de moi qui m’aident à me sentir en sécurité.',
          type: 'scale',
          min: 1,
          max: 7,
          options: ['Rarement', 'Parfois', 'Toujours'],
        },
      ],
    },
  },
  ...ADDITIONAL_CATALOGS,
});

const SUPPORTED_INSTRUMENTS = Object.freeze(Object.keys(CATALOGS) as InstrumentCode[]);
const SUPPORTED_INSTRUMENT_SET = new Set<InstrumentCode>(SUPPORTED_INSTRUMENTS);

export const supportedInstruments = SUPPORTED_INSTRUMENTS;
export const isSupportedInstrument = (value: string): value is InstrumentCode =>
  SUPPORTED_INSTRUMENT_SET.has(value as InstrumentCode);

const SCORING_DEFINITIONS: Record<InstrumentCode, ScoringDefinition> = deepFreeze({
  AAQ2: {
    strategy: 'sum',
    thresholds: {
      0: [7, 16],
      1: [17, 23],
      2: [24, 30],
      3: [31, 36],
      4: [37, 49],
    },
  },
  BRS: {
    strategy: 'average',
    reversedItems: ['2', '4', '6'],
    thresholds: {
      0: [1, 2],
      1: [2.01, 2.9],
      2: [2.91, 3.7],
      3: [3.71, 4.3],
      4: [4.31, 5],
    },
  },
  CBI: {
    strategy: 'sum',
    reversedItems: ['6'],
    thresholds: {
      0: [0, 9],
      1: [10, 14],
      2: [15, 20],
      3: [21, 25],
      4: [26, 30],
    },
  },
  CVSQ: {
    strategy: 'sum',
    thresholds: {
      0: [0, 3],
      1: [4, 7],
      2: [8, 12],
      3: [13, 17],
      4: [18, 24],
    },
  },
  GAS: {
    strategy: 'sum',
    thresholds: {
      0: [0, 5],
      1: [6, 9],
      2: [10, 13],
      3: [14, 17],
      4: [18, 20],
    },
  },
  GRITS: {
    strategy: 'average',
    reversedItems: ['1', '3', '5', '6'],
    thresholds: {
      0: [1, 2.2],
      1: [2.21, 2.9],
      2: [2.91, 3.6],
      3: [3.61, 4.3],
      4: [4.31, 5],
    },
  },
  ISI: {
    strategy: 'sum',
    thresholds: {
      0: [0, 7],
      1: [8, 14],
      2: [15, 18],
      3: [19, 21],
      4: [22, 28],
    },
  },
  MSPSS: {
    strategy: 'average',
    thresholds: {
      0: [1, 2.9],
      1: [3, 3.9],
      2: [4, 4.9],
      3: [5, 5.9],
      4: [6, 7],
    },
  },
  PANAS: {
    strategy: 'subscales',
    subscales: {
      PA: ['1', '2', '3', '4', '5'],
      NA: ['6', '7', '8', '9', '10'],
    },
    thresholds: {
      0: [-Infinity, -6],
      1: [-5, -1],
      2: [0, 4],
      3: [5, 9],
      4: [10, Infinity],
    },
  },
  POMS: {
    strategy: 'subscales',
    subscales: {
      tension: ['1', '2', '3', '4'],
      depression: ['5', '6', '7', '8'],
      anger: ['9', '10', '11', '12'],
      fatigue: ['13', '14', '15', '16'],
      confusion: ['17', '18', '19', '20'],
      vigor: ['21', '22', '23', '24'],
    },
    thresholds: {
      0: [-16, -5],
      1: [-4, 9],
      2: [10, 24],
      3: [25, 39],
      4: [40, 80],
    },
  },
  PSS10: {
    strategy: 'sum',
    reversedItems: ['2', '3', '5', '7', '8'],
    thresholds: {
      0: [0, 13],
      1: [14, 18],
      2: [19, 23],
      3: [24, 28],
      4: [29, 40],
    },
  },
  SAM: {
    strategy: 'subscales',
    subscales: {
      valence: ['1'],
      activation: ['2'],
    },
    thresholds: {
      0: [1, 2],
      1: [3, 4],
      2: [5, 5],
      3: [6, 7],
      4: [8, 9],
    },
  },
  SSQ: {
    strategy: 'sum',
    thresholds: {
      0: [0, 2],
      1: [3, 5],
      2: [6, 8],
      3: [9, 10],
      4: [11, 12],
    },
  },
  STAI6: {
    strategy: 'sum',
    reversedItems: ['1', '4'],
    thresholds: {
      0: [6, 10],
      1: [11, 15],
      2: [16, 20],
      3: [21, 23],
      4: [24, 24],
    },
  },
  SUDS: {
    strategy: 'sum',
    thresholds: {
      0: [0, 2],
      1: [3, 4],
      2: [5, 6],
      3: [7, 8],
      4: [9, 10],
    },
  },
  SWEMWBS: {
    strategy: 'sum',
    thresholds: {
      0: [7, 17],
      1: [18, 22],
      2: [23, 26],
      3: [27, 30],
      4: [31, 35],
    },
  },
  UCLA3: {
    strategy: 'sum',
    thresholds: {
      0: [3, 4],
      1: [5, 6],
      2: [7, 7],
      3: [8, 8],
      4: [9, 9],
    },
  },
  UWES: {
    strategy: 'sum',
    thresholds: {
      0: [0, 18],
      1: [19, 27],
      2: [28, 36],
      3: [37, 45],
      4: [46, 54],
    },
  },
  WEMWBS: {
    strategy: 'sum',
    thresholds: {
      0: [14, 35],
      1: [36, 45],
      2: [46, 55],
      3: [56, 62],
      4: [63, 70],
    },
  },
  WHO5: {
    strategy: 'sum',
    thresholds: {
      0: [0, 12],
      1: [13, 16],
      2: [17, 20],
      3: [21, 23],
      4: [24, 25],
    },
  },
});
const SUMMARY_TEXTS: SummaryDictionary = deepFreeze({
  WHO5: {
    fr: {
      0: 'besoin de réconfort',
      1: 'élan à choyer',
      2: 'équilibre serein',
      3: 'belle dynamique',
      4: 'énergie rayonnante',
    },
    en: {
      0: 'needs gentle care',
      1: 'light momentum growing',
      2: 'steady balance',
      3: 'bright rhythm',
      4: 'radiant energy',
    },
    es: {
      0: 'necesidad de abrigo',
      1: 'impulso delicado',
      2: 'balance tranquilo',
      3: 'ritmo positivo',
      4: 'energía luminosa',
    },
    de: {
      0: 'bedarf an sanfter Fürsorge',
      1: 'sanfter Auftrieb',
      2: 'ruhiges Gleichgewicht',
      3: 'heller Schwung',
      4: 'strahlende Energie',
    },
    it: {
      0: 'bisogno di tenerezza',
      1: 'slancio delicato',
      2: 'equilibrio sereno',
      3: 'buona dinamica',
      4: 'energia splendente',
    },
  },
  STAI6: {
    fr: {
      0: 'calme profond',
      1: 'souffle apaisé',
      2: 'tonus régulier',
      3: 'tension présente',
      4: 'besoin d’apaisement',
    },
    en: {
      0: 'deep calm',
      1: 'soft breathing',
      2: 'even tone',
      3: 'noticeable tension',
      4: 'needs soothing',
    },
    es: {
      0: 'calma profunda',
      1: 'respiración tranquila',
      2: 'tono equilibrado',
      3: 'tensión presente',
      4: 'necesita calma',
    },
    de: {
      0: 'tiefe Ruhe',
      1: 'sanfter Atem',
      2: 'ausgeglichen',
      3: 'spürbare Spannung',
      4: 'braucht Beruhigung',
    },
    it: {
      0: 'calma profonda',
      1: 'respiro morbido',
      2: 'tono regolare',
      3: 'tensione avvertita',
      4: 'serve pacatezza',
    },
  },
  PANAS: {
    fr: {
      0: 'couleurs à réchauffer',
      1: 'nuances délicates',
      2: 'palette équilibrée',
      3: 'teintes lumineuses',
      4: 'éclat vibrant',
    },
    en: {
      0: 'tones to warm up',
      1: 'gentle palette',
      2: 'balanced blend',
      3: 'bright shades',
      4: 'vivid glow',
    },
    es: {
      0: 'tonos por avivar',
      1: 'paleta suave',
      2: 'mezcla equilibrada',
      3: 'colores brillantes',
      4: 'brillo vibrante',
    },
    de: {
      0: 'Farben zum Aufwärmen',
      1: 'sanfte Palette',
      2: 'ausgewogene Mischung',
      3: 'leuchtende Töne',
      4: 'lebendige Strahlkraft',
    },
    it: {
      0: 'toni da riscaldare',
      1: 'palette delicata',
      2: 'miscela equilibrata',
      3: 'sfumature luminose',
      4: 'bagliore vibrante',
    },
  },
  PSS10: {
    fr: {
      0: 'charge légère',
      1: 'agenda soutenable',
      2: 'tempo à surveiller',
      3: 'rythme dense',
      4: 'besoin de relâche',
    },
    en: {
      0: 'light load',
      1: 'steady pace',
      2: 'tempo to monitor',
      3: 'dense rhythm',
      4: 'needs release',
    },
    es: {
      0: 'carga ligera',
      1: 'ritmo sostenible',
      2: 'tempo a vigilar',
      3: 'ritmo intenso',
      4: 'necesita alivio',
    },
    de: {
      0: 'leichte Last',
      1: 'stabiler Takt',
      2: 'Tempo im Blick',
      3: 'dichte Phase',
      4: 'braucht Entlastung',
    },
    it: {
      0: 'carico leggero',
      1: 'ritmo stabile',
      2: 'tempo da osservare',
      3: 'fase intensa',
      4: 'serve alleggerire',
    },
  },
  WEMWBS: {
    fr: {
      0: 'élan à raviver',
      1: 'base sereine',
      2: 'horizon positif',
      3: 'élan collectif',
      4: 'vitalité rayonnante',
    },
    en: {
      0: 'spark to rekindle',
      1: 'steady base',
      2: 'positive horizon',
      3: 'collective lift',
      4: 'radiant vitality',
    },
    es: {
      0: 'chispa a reavivar',
      1: 'base serena',
      2: 'horizonte positivo',
      3: 'impulso compartido',
      4: 'vitalidad radiante',
    },
    de: {
      0: 'Funke zum Entfachen',
      1: 'ruhige Basis',
      2: 'positiver Horizont',
      3: 'gemeinsamer Auftrieb',
      4: 'strahlende Vitalität',
    },
    it: {
      0: 'scintilla da ravvivare',
      1: 'base serena',
      2: 'orizzonte positivo',
      3: 'slancio condiviso',
      4: 'vitalità radiosa',
    },
  },
  CBI: {
    fr: {
      0: 'équilibre solide',
      1: 'légère fatigue',
      2: 'tonus à préserver',
      3: 'signal de pause',
      4: 'besoin de recharge',
    },
    en: {
      0: 'solid balance',
      1: 'light fatigue',
      2: 'energy to protect',
      3: 'pause needed',
      4: 'time to recharge',
    },
    es: {
      0: 'equilibrio sólido',
      1: 'fatiga leve',
      2: 'energía a cuidar',
      3: 'señal de pausa',
      4: 'necesita recarga',
    },
    de: {
      0: 'stabiles Gleichgewicht',
      1: 'leichte Müdigkeit',
      2: 'Energie schützen',
      3: 'Pause empfohlen',
      4: 'Zeit zum Auftanken',
    },
    it: {
      0: 'equilibrio solido',
      1: 'lievissima stanchezza',
      2: 'energia da tutelare',
      3: 'segnale di pausa',
      4: 'tempo di ricarica',
    },
  },
  UWES: {
    fr: {
      0: 'engagement en veille',
      1: 'envie à éveiller',
      2: 'entrain présent',
      3: 'flot engagé',
      4: 'élan inspirant',
    },
    en: {
      0: 'engagement on standby',
      1: 'spark to awaken',
      2: 'present drive',
      3: 'engaged flow',
      4: 'inspiring momentum',
    },
    es: {
      0: 'compromiso en pausa',
      1: 'chispa a activar',
      2: 'impulso presente',
      3: 'flujo implicado',
      4: 'impulso inspirador',
    },
    de: {
      0: 'Engagement in Bereitschaft',
      1: 'Funke zu entfachen',
      2: 'Antrieb vorhanden',
      3: 'engagierter Fluss',
      4: 'inspirierender Schwung',
    },
    it: {
      0: 'coinvolgimento in attesa',
      1: 'scintilla da attivare',
      2: 'slancio presente',
      3: 'flusso coinvolto',
      4: 'momento ispirante',
    },
  },
  SAM: {
    fr: {
      0: 'couleur très douce',
      1: 'palette à réchauffer',
      2: 'teinte équilibrée',
      3: 'éclat confortable',
      4: 'luminosité vive',
    },
    en: {
      0: 'very soft shade',
      1: 'palette to warm up',
      2: 'balanced tone',
      3: 'comforting glow',
      4: 'bright sparkle',
    },
    es: {
      0: 'tono muy suave',
      1: 'paleta por avivar',
      2: 'matiz equilibrado',
      3: 'brillo acogedor',
      4: 'destello brillante',
    },
    de: {
      0: 'sehr sanfter Ton',
      1: 'Palette zum Wärmen',
      2: 'ausgewogener Klang',
      3: 'angenehmes Leuchten',
      4: 'heller Funke',
    },
    it: {
      0: 'tono molto morbido',
      1: 'palette da scaldare',
      2: 'sfumatura equilibrata',
      3: 'bagliore avvolgente',
      4: 'scintilla luminosa',
    },
  },
  SUDS: {
    fr: {
      0: 'quiétude profonde',
      1: 'calme ressenti',
      2: 'élan modéré',
      3: 'intensité marquée',
      4: 'moment très vif',
    },
    en: {
      0: 'deep quiet',
      1: 'gentle calm',
      2: 'moderate tone',
      3: 'strong intensity',
      4: 'very vivid moment',
    },
    es: {
      0: 'quietud profunda',
      1: 'calma suave',
      2: 'tono moderado',
      3: 'intensidad marcada',
      4: 'momento muy vivo',
    },
    de: {
      0: 'tiefe Ruhe',
      1: 'sanfte Gelassenheit',
      2: 'moderater Ton',
      3: 'starke Intensität',
      4: 'sehr lebendiger Moment',
    },
    it: {
      0: 'quiete profonda',
      1: 'calma lieve',
      2: 'tono moderato',
      3: 'intensità marcata',
      4: 'momento molto vivido',
    },
  },
  SSQ: {
    fr: {
      0: 'confort total',
      1: 'équilibre à surveiller',
      2: 'besoin de douceur',
      3: 'pause conseillée',
      4: 'pause nécessaire',
    },
    en: {
      0: 'total comfort',
      1: 'balance to watch',
      2: 'needs gentle pace',
      3: 'pause suggested',
      4: 'pause needed',
    },
    es: {
      0: 'confort total',
      1: 'equilibrio a vigilar',
      2: 'necesita suavidad',
      3: 'pausa sugerida',
      4: 'pausa necesaria',
    },
    de: {
      0: 'voller Komfort',
      1: 'Gleichgewicht beobachten',
      2: 'braucht sanftes Tempo',
      3: 'Pause empfohlen',
      4: 'Pause nötig',
    },
    it: {
      0: 'comfort totale',
      1: 'equilibrio da osservare',
      2: 'serve ritmo lieve',
      3: 'pausa suggerita',
      4: 'pausa necessaria',
    },
  },
  UCLA3: {
    fr: {
      0: 'liens très présents',
      1: 'envie légère de connexion',
      2: 'envie de tisser plus de lien',
      3: 'envie marquée d’être écouté·e',
      4: 'besoin pressant de présence douce',
    },
    en: {
      0: 'connections feel close',
      1: 'seeking a touch more connection',
      2: 'ready to weave more ties',
      3: 'craving a listening ear',
      4: 'strong need for caring presence',
    },
    es: {
      0: 'vínculos muy presentes',
      1: 'ganas suaves de conexión',
      2: 'deseo de tejer más lazos',
      3: 'necesidad de escucha cercana',
      4: 'gran necesidad de presencia amable',
    },
    de: {
      0: 'Verbindungen sind nah',
      1: 'leiser Wunsch nach mehr Nähe',
      2: 'bereit für mehr Verknüpfung',
      3: 'Sehnsucht nach offenem Ohr',
      4: 'starkes Bedürfnis nach Fürsorge',
    },
    it: {
      0: 'legami molto presenti',
      1: 'desiderio leggero di connessione',
      2: 'voglia di tessere più legami',
      3: 'bisogno di un ascolto attento',
      4: 'forte bisogno di presenza premurosa',
    },
  },
  MSPSS: {
    fr: {
      0: 'soutiens à envelopper',
      1: 'réseau à réchauffer',
      2: 'appuis présents',
      3: 'cercle solide',
      4: 'cercle très soutenant',
    },
    en: {
      0: 'support to nurture',
      1: 'network to warm up',
      2: 'steady helpers',
      3: 'solid circle',
      4: 'deeply supportive circle',
    },
    es: {
      0: 'apoyos por cuidar',
      1: 'red para avivar',
      2: 'apoyos constantes',
      3: 'círculo sólido',
      4: 'círculo muy presente',
    },
    de: {
      0: 'Unterstützung zum Stärken',
      1: 'Netzwerk zum Wärmen',
      2: 'verlässliche Hilfe',
      3: 'starker Kreis',
      4: 'sehr tragender Kreis',
    },
    it: {
      0: 'sostegni da coltivare',
      1: 'rete da riscaldare',
      2: 'appoggi presenti',
      3: 'cerchia solida',
      4: 'cerchia molto presente',
    },
  },
  AAQ2: {
    fr: {
      0: 'souplesse fluide',
      1: 'ancrage malléable',
      2: 'cap à ajuster',
      3: 'prise intérieure',
      4: 'besoin de relâcher la prise',
    },
    en: {
      0: 'fluid flexibility',
      1: 'softly anchored',
      2: 'course to adjust',
      3: 'inner grip tight',
      4: 'needs to loosen grip',
    },
  },
  POMS: {
    fr: {
      0: 'horizon lumineux',
      1: 'nuances calmes',
      2: 'humeur à surveiller',
      3: 'tension marquée',
      4: 'humeur en surcharge',
    },
    en: {
      0: 'radiant horizon',
      1: 'calm hues',
      2: 'mood to monitor',
      3: 'pronounced strain',
      4: 'mood overloaded',
    },
  },
  ISI: {
    fr: {
      0: 'nuit apaisée',
      1: 'sommeil à harmoniser',
      2: 'repos fragile',
      3: 'veille persistante',
      4: 'soutien sommeil urgent',
    },
    en: {
      0: 'restful nights',
      1: 'sleep to harmonize',
      2: 'rest a bit fragile',
      3: 'persistent wakefulness',
      4: 'sleep support urgent',
    },
  },
  GAS: {
    fr: {
      0: 'cap à clarifier',
      1: 'progression naissante',
      2: 'chemin engagé',
      3: 'dynamique solide',
      4: 'objectif rayonnant',
    },
    en: {
      0: 'goal to clarify',
      1: 'nascent progress',
      2: 'path engaged',
      3: 'steady momentum',
      4: 'goal glowing',
    },
  },
  GRITS: {
    fr: {
      0: 'élan épars',
      1: 'persévérance naissante',
      2: 'tenue constante',
      3: 'persévérance affirmée',
      4: 'constance remarquable',
    },
    en: {
      0: 'scattered drive',
      1: 'grit emerging',
      2: 'steady holding',
      3: 'grit affirmed',
      4: 'remarkable consistency',
    },
  },
  BRS: {
    fr: {
      0: 'rebond fragile',
      1: 'ressort en éveil',
      2: 'souplesse présente',
      3: 'rebond solide',
      4: 'élasticité rayonnante',
    },
    en: {
      0: 'fragile rebound',
      1: 'spring awakening',
      2: 'resilience present',
      3: 'solid rebound',
      4: 'radiant elasticity',
    },
  },
  CVSQ: {
    fr: {
      0: 'regard confortable',
      1: 'vigilance visuelle légère',
      2: 'fatigue oculaire sensible',
      3: 'inconfort marqué',
      4: 'repos visuel prioritaire',
    },
    en: {
      0: 'eyes at ease',
      1: 'light visual vigilance',
      2: 'notable eye fatigue',
      3: 'marked discomfort',
      4: 'visual rest urgent',
    },
  },
  SWEMWBS: {
    fr: {
      0: 'étincelle discrète',
      1: 'bien-être en germination',
      2: 'équilibre vivant',
      3: 'élan confiant',
      4: 'rayonnement essentiel',
    },
    en: {
      0: 'quiet spark',
      1: 'wellbeing budding',
      2: 'living balance',
      3: 'confident lift',
      4: 'essential radiance',
    },
  },
});

const ORCHESTRATION_HINTS: HintDictionary = deepFreeze({
  WHO5: {
    0: [
      { action: 'gentle_tone', intensity: 'high', context: 'dashboard_cards' },
      { action: 'increase_support', intensity: 'medium', context: 'ui_adaptation' },
    ],
    1: [
      { action: 'gentle_tone', intensity: 'medium', context: 'journal_suggestions' },
    ],
    3: [
      { action: 'celebrate_progress', intensity: 'low', context: 'dashboard_cards' },
    ],
    4: [
      { action: 'encourage_movement', intensity: 'low', context: 'activity_suggestions' },
    ],
  },
  STAI6: {
    3: [
      { action: 'suggest_breathing', intensity: 'high', context: 'nyvee_module' },
      { action: 'reduce_intensity', intensity: 'medium', context: 'visual_effects' },
    ],
    4: [
      { action: 'extend_grounding', intensity: 'high', context: 'session_planning' },
      { action: 'softer_audio', intensity: 'medium', context: 'music_programming' },
    ],
  },
  PANAS: {
    0: [
      { action: 'offer_reflection', intensity: 'medium', context: 'journal_suggestions' },
      { action: 'warm_palette', intensity: 'low', context: 'ui_adaptation' },
    ],
    1: [
      { action: 'music_uplift', intensity: 'medium', context: 'music_programming' },
    ],
    3: [
      { action: 'share_wins', intensity: 'low', context: 'community_nudge' },
    ],
    4: [
      { action: 'invite_creativity', intensity: 'medium', context: 'story_mode' },
    ],
  },
  PSS10: {
    3: [
      { action: 'soften_planning', intensity: 'medium', context: 'agenda_helper' },
      { action: 'breath_prompt', intensity: 'medium', context: 'nyvee_module' },
    ],
    4: [
      { action: 'limit_notifications', intensity: 'high', context: 'ui_adaptation' },
      { action: 'prioritize_rest', intensity: 'medium', context: 'session_planning' },
    ],
  },
  WEMWBS: {
    0: [
      { action: 'offer_support_circle', intensity: 'medium', context: 'community_nudge' },
    ],
    1: [
      { action: 'celebrate_small_steps', intensity: 'low', context: 'dashboard_cards' },
    ],
    3: [
      { action: 'invite_mentoring', intensity: 'medium', context: 'community_nudge' },
    ],
    4: [
      { action: 'highlight_growth', intensity: 'low', context: 'dashboard_cards' },
    ],
  },
  CBI: {
    2: [
      { action: 'suggest_micro_break', intensity: 'medium', context: 'session_planning' },
    ],
    3: [
      { action: 'recommend_recovery', intensity: 'high', context: 'agenda_helper' },
      { action: 'calm_audio', intensity: 'medium', context: 'music_programming' },
    ],
    4: [
      { action: 'notify_coach', intensity: 'high', context: 'coach_followup' },
      { action: 'protect_calendar', intensity: 'high', context: 'agenda_helper' },
    ],
  },
  UWES: {
    0: [
      { action: 'spark_inspiration', intensity: 'medium', context: 'story_mode' },
    ],
    1: [
      { action: 'focus_clarify', intensity: 'medium', context: 'coach_followup' },
    ],
    3: [
      { action: 'share_best_practices', intensity: 'low', context: 'community_nudge' },
    ],
    4: [
      { action: 'celebrate_achievements', intensity: 'medium', context: 'dashboard_cards' },
    ],
  },
  SAM: {
    0: [
      { action: 'soften_colors', intensity: 'medium', context: 'ui_adaptation' },
      { action: 'breath_prompt', intensity: 'low', context: 'nyvee_module' },
    ],
    1: [
      { action: 'warm_palette', intensity: 'low', context: 'ui_adaptation' },
    ],
    3: [
      { action: 'encourage_expression', intensity: 'low', context: 'journal_suggestions' },
    ],
    4: [
      { action: 'invite_creativity', intensity: 'medium', context: 'story_mode' },
    ],
  },
  SUDS: {
    0: [
      { action: 'soft_exit', intensity: 'low', context: 'session_completion' },
    ],
    3: [
      { action: 'extend_session', intensity: 'medium', context: 'flash_glow', durationMs: 60_000 },
    ],
    4: [
      { action: 'activate_support', intensity: 'high', context: 'coach_followup' },
      { action: 'calm_audio', intensity: 'medium', context: 'music_programming' },
    ],
  },
  SSQ: {
    1: [
      { action: 'reduce_motion', intensity: 'medium', context: 'ui_adaptation' },
    ],
    2: [
      { action: 'suggest_break', intensity: 'medium', context: 'session_planning' },
    ],
    3: [
      { action: 'prompt_grounding', intensity: 'high', context: 'nyvee_module' },
      { action: 'lower_audio', intensity: 'medium', context: 'music_programming' },
    ],
    4: [
      { action: 'stop_vr_session', intensity: 'high', context: 'session_planning' },
      { action: 'notify_support', intensity: 'high', context: 'coach_followup' },
    ],
  },
});
const LEVELS: Array<0 | 1 | 2 | 3 | 4> = [0, 1, 2, 3, 4];

class ClinicalScoringService {
  private sanitizeLocale(locale?: LocaleCode): LocaleCode {
    if (!locale) return DEFAULT_LOCALE;
    const normalized = locale.toLowerCase() as LocaleCode;
    if (['fr', 'en', 'es', 'de', 'it'].includes(normalized)) {
      return normalized;
    }
    return DEFAULT_LOCALE;
  }

  private getBaseCatalog(instrument: InstrumentCode, locale: LocaleCode): InstrumentCatalog {
    const catalogByLocale = CATALOGS[instrument];
    if (!catalogByLocale) {
      throw new Error(`Unknown instrument ${instrument}`);
    }
    return catalogByLocale[locale] ?? catalogByLocale[DEFAULT_LOCALE];
  }

  getCatalog(instrument: InstrumentCode, locale: LocaleCode = DEFAULT_LOCALE): InstrumentCatalog {
    const resolvedLocale = this.sanitizeLocale(locale);
    const base = this.getBaseCatalog(instrument, resolvedLocale);
    return {
      ...base,
      items: base.items.map((item) => ({ ...item })),
    };
  }

  calculate(
    instrument: InstrumentCode,
    answers: Record<string, unknown>,
    locale: LocaleCode = DEFAULT_LOCALE,
  ): AssessmentComputation {
    const resolvedLocale = this.sanitizeLocale(locale);
    const base = this.getBaseCatalog(instrument, resolvedLocale);
    const sanitized = this.prepareAnswers(base, answers);
    const evaluation = this.evaluate(instrument, base, sanitized, resolvedLocale);

    return {
      instrument,
      locale: resolvedLocale,
      level: evaluation.level,
      summary: evaluation.summary,
      hints: evaluation.hints,
      generatedAt: new Date().toISOString(),
    };
  }

  async submitResponse(
    instrument: InstrumentCode,
    answers: Record<string, unknown>,
    options: SubmitAssessmentOptions = {},
  ): Promise<SubmitAssessmentResult> {
    try {
      const resolvedLocale = this.sanitizeLocale(options.locale);
      const base = this.getBaseCatalog(instrument, resolvedLocale);
      const sanitized = this.prepareAnswers(base, answers);
      const evaluation = this.evaluate(instrument, base, sanitized, resolvedLocale);

      const accessToken = await this.resolveSessionToken();
      const payload: { instrument: InstrumentCode; answers: Record<string, number>; ts?: string } = {
        instrument,
        answers: sanitized,
      };

      if (options.timestamp) {
        payload.ts = options.timestamp;
      }

      await invokeSupabaseEdge<typeof payload, unknown>('assess-submit', {
        payload,
        accessToken,
      });

      return {
        success: true,
        computation: {
          instrument,
          locale: resolvedLocale,
          level: evaluation.level,
          summary: evaluation.summary,
          hints: evaluation.hints,
          generatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      // Silent: clinical scoring submission error logged internally
      return { success: false };
    }
  }

  async getUISuggestion(): Promise<null> {
    return null;
  }

  private prepareAnswers(
    catalog: InstrumentCatalog,
    answers: Record<string, unknown>,
  ): Record<string, number> {
    const sanitized: Record<string, number> = {};

    for (const item of catalog.items) {
      const raw = answers[item.id];
      if (raw === null || raw === undefined) {
        continue;
      }

      const numeric = Number(raw);
      if (!Number.isFinite(numeric)) {
        continue;
      }

      const min = item.min ?? 0;
      const max = item.max ?? 5;
      const clamped = Math.min(max, Math.max(min, numeric));
      sanitized[item.id] = clamped;
    }

    if (Object.keys(sanitized).length === 0) {
      throw new Error('answers_required');
    }

    return sanitized;
  }

  private evaluate(
    instrument: InstrumentCode,
    catalog: InstrumentCatalog,
    sanitizedAnswers: Record<string, number>,
    locale: LocaleCode,
  ) {
    const { total, count, subscaleScores } = this.computeScores(
      instrument,
      catalog,
      sanitizedAnswers,
    );
    const level = this.determineLevel(instrument, total, count, subscaleScores);
    const summary = this.getSummaryText(instrument, locale, level);
    const hints = this.getHints(instrument, level);

    return { level, summary, hints };
  }

  private computeScores(
    instrument: InstrumentCode,
    catalog: InstrumentCatalog,
    answers: Record<string, number>,
  ) {
    const definition = SCORING_DEFINITIONS[instrument];
    let total = 0;
    let count = 0;
    const subscaleTotals: Record<string, number> = {};

    for (const item of catalog.items) {
      if (!Object.prototype.hasOwnProperty.call(answers, item.id)) {
        continue;
      }

      let value = answers[item.id];
      const min = item.min ?? 0;
      const max = item.max ?? 5;
      const reversed = item.reversed || definition.reversedItems?.includes(item.id);

      if (reversed) {
        value = max - value + min;
      }

      total += value;
      count += 1;

      if (item.subscale) {
        subscaleTotals[item.subscale] = (subscaleTotals[item.subscale] ?? 0) + value;
      }
    }

    if (definition.strategy === 'subscales') {
      // Provide a balance metric for instruments like PANAS
      const positive = subscaleTotals['PA'] ?? subscaleTotals['Positive'] ?? 0;
      const negative = subscaleTotals['NA'] ?? subscaleTotals['Negative'] ?? 0;
      subscaleTotals.balance = positive - negative;
    }

    return { total, count, subscaleScores: subscaleTotals };
  }

  private determineLevel(
    instrument: InstrumentCode,
    total: number,
    count: number,
    subscaleScores: Record<string, number>,
  ): 0 | 1 | 2 | 3 | 4 {
    const definition = SCORING_DEFINITIONS[instrument];
    if (!definition) {
      return 2;
    }

    if (instrument === 'PANAS') {
      const balance = subscaleScores.balance ?? 0;
      return this.resolveLevel(balance, definition.thresholds);
    }

    if (instrument === 'POMS') {
      const tension = subscaleScores.tension ?? 0;
      const depression = subscaleScores.depression ?? 0;
      const anger = subscaleScores.anger ?? 0;
      const fatigue = subscaleScores.fatigue ?? 0;
      const confusion = subscaleScores.confusion ?? 0;
      const vigor = subscaleScores.vigor ?? 0;
      const totalMoodDisturbance = tension + depression + anger + fatigue + confusion - vigor;
      return this.resolveLevel(totalMoodDisturbance, definition.thresholds);
    }

    if (instrument === 'SAM') {
      const valence = subscaleScores.valence ?? subscaleScores['1'] ?? 5;
      return this.resolveLevel(valence, definition.thresholds);
    }

    const baseValue = definition.strategy === 'average' && count > 0 ? total / count : total;
    return this.resolveLevel(baseValue, definition.thresholds);
  }

  private resolveLevel(value: number, thresholds: Record<0 | 1 | 2 | 3 | 4, LevelBoundaries>): 0 | 1 | 2 | 3 | 4 {
    for (const level of LEVELS) {
      const [min, max] = thresholds[level];
      const lowerBound = min === -Infinity ? Number.NEGATIVE_INFINITY : min;
      const upperBound = max === Infinity ? Number.POSITIVE_INFINITY : max;
      if (value >= lowerBound && value <= upperBound) {
        return level;
      }
    }

    if (value < thresholds[0][0]) {
      return 0;
    }
    return 4;
  }

  private getSummaryText(
    instrument: InstrumentCode,
    locale: LocaleCode,
    level: 0 | 1 | 2 | 3 | 4,
  ): string {
    const byInstrument = SUMMARY_TEXTS[instrument];
    if (!byInstrument) {
      return 'état observé';
    }
    const localized = byInstrument[locale] ?? byInstrument[DEFAULT_LOCALE];
    return localized[level] ?? 'état observé';
  }

  private getHints(instrument: InstrumentCode, level: 0 | 1 | 2 | 3 | 4): OrchestrationHint[] {
    const hints = ORCHESTRATION_HINTS[instrument]?.[level];
    if (!hints) {
      return [];
    }
    return hints.map((hint) => ({ ...hint }));
  }

  private async resolveSessionToken(): Promise<string> {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }

    const token = data.session?.access_token;
    if (!token) {
      throw new Error('auth_required');
    }

    return token;
  }
}

export const clinicalScoringService = new ClinicalScoringService();
