// @ts-nocheck
/**
 * Shared assessment utilities for Edge Functions
 */

import { z } from './zod.ts';

export const instrumentSchema = z.enum([
  'WHO5', 'STAI6', 'PANAS', 'PSS10', 'UCLA3', 'MSPSS',
  'AAQ2', 'POMS', 'SSQ', 'ISI', 'GAS', 'GRITS',
  'BRS', 'WEMWBS', 'UWES', 'CBI', 'CVSQ', 'SAM', 'SUDS',
  'PHQ9', 'GAD7'
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
  // PHQ-9 - Patient Health Questionnaire (Depression)
  'PHQ9': {
    'fr': {
      code: 'PHQ9',
      locale: 'fr',
      name: 'Questionnaire sur la santé du patient (PHQ-9)',
      version: '1.0',
      expiry_minutes: 30,
      items: [
        { id: '1', prompt: 'Peu d\'intérêt ou de plaisir à faire les choses', type: 'scale', min: 0, max: 3 },
        { id: '2', prompt: 'Se sentir triste, déprimé(e) ou désespéré(e)', type: 'scale', min: 0, max: 3 },
        { id: '3', prompt: 'Difficultés à s\'endormir ou à rester endormi(e), ou trop dormir', type: 'scale', min: 0, max: 3 },
        { id: '4', prompt: 'Se sentir fatigué(e) ou avoir peu d\'énergie', type: 'scale', min: 0, max: 3 },
        { id: '5', prompt: 'Peu d\'appétit ou manger trop', type: 'scale', min: 0, max: 3 },
        { id: '6', prompt: 'Mauvaise opinion de soi-même', type: 'scale', min: 0, max: 3 },
        { id: '7', prompt: 'Difficultés à se concentrer', type: 'scale', min: 0, max: 3 },
        { id: '8', prompt: 'Bouger ou parler lentement, ou au contraire être agité(e)', type: 'scale', min: 0, max: 3 },
        { id: '9', prompt: 'Penser qu\'il vaudrait mieux mourir ou se faire du mal', type: 'scale', min: 0, max: 3 }
      ]
    },
    'en': {
      code: 'PHQ9',
      locale: 'en',
      name: 'Patient Health Questionnaire (PHQ-9)',
      version: '1.0',
      expiry_minutes: 30,
      items: [
        { id: '1', prompt: 'Little interest or pleasure in doing things', type: 'scale', min: 0, max: 3 },
        { id: '2', prompt: 'Feeling down, depressed, or hopeless', type: 'scale', min: 0, max: 3 },
        { id: '3', prompt: 'Trouble falling or staying asleep, or sleeping too much', type: 'scale', min: 0, max: 3 },
        { id: '4', prompt: 'Feeling tired or having little energy', type: 'scale', min: 0, max: 3 },
        { id: '5', prompt: 'Poor appetite or overeating', type: 'scale', min: 0, max: 3 },
        { id: '6', prompt: 'Feeling bad about yourself', type: 'scale', min: 0, max: 3 },
        { id: '7', prompt: 'Trouble concentrating on things', type: 'scale', min: 0, max: 3 },
        { id: '8', prompt: 'Moving or speaking slowly, or being restless', type: 'scale', min: 0, max: 3 },
        { id: '9', prompt: 'Thoughts that you would be better off dead or hurting yourself', type: 'scale', min: 0, max: 3 }
      ]
    }
  },
  // GAD-7 - Generalized Anxiety Disorder
  'GAD7': {
    'fr': {
      code: 'GAD7',
      locale: 'fr',
      name: 'Échelle d\'anxiété généralisée (GAD-7)',
      version: '1.0',
      expiry_minutes: 30,
      items: [
        { id: '1', prompt: 'Se sentir nerveux/nerveuse, anxieux/anxieuse ou tendu(e)', type: 'scale', min: 0, max: 3 },
        { id: '2', prompt: 'Être incapable d\'arrêter de s\'inquiéter ou de contrôler ses inquiétudes', type: 'scale', min: 0, max: 3 },
        { id: '3', prompt: 'S\'inquiéter trop de différentes choses', type: 'scale', min: 0, max: 3 },
        { id: '4', prompt: 'Avoir du mal à se détendre', type: 'scale', min: 0, max: 3 },
        { id: '5', prompt: 'Être si agité(e) qu\'il est difficile de tenir en place', type: 'scale', min: 0, max: 3 },
        { id: '6', prompt: 'Devenir facilement contrarié(e) ou irritable', type: 'scale', min: 0, max: 3 },
        { id: '7', prompt: 'Avoir peur que quelque chose d\'affreux puisse arriver', type: 'scale', min: 0, max: 3 }
      ]
    },
    'en': {
      code: 'GAD7',
      locale: 'en',
      name: 'Generalized Anxiety Disorder Scale (GAD-7)',
      version: '1.0',
      expiry_minutes: 30,
      items: [
        { id: '1', prompt: 'Feeling nervous, anxious, or on edge', type: 'scale', min: 0, max: 3 },
        { id: '2', prompt: 'Not being able to stop or control worrying', type: 'scale', min: 0, max: 3 },
        { id: '3', prompt: 'Worrying too much about different things', type: 'scale', min: 0, max: 3 },
        { id: '4', prompt: 'Trouble relaxing', type: 'scale', min: 0, max: 3 },
        { id: '5', prompt: 'Being so restless that it\'s hard to sit still', type: 'scale', min: 0, max: 3 },
        { id: '6', prompt: 'Becoming easily annoyed or irritable', type: 'scale', min: 0, max: 3 },
        { id: '7', prompt: 'Feeling afraid as if something awful might happen', type: 'scale', min: 0, max: 3 }
      ]
    }
  },
  // PSS-10 - Perceived Stress Scale
  'PSS10': {
    'fr': {
      code: 'PSS10',
      locale: 'fr',
      name: 'Échelle de stress perçu (PSS-10)',
      version: '1.0',
      expiry_minutes: 30,
      items: [
        { id: '1', prompt: 'Avez-vous été dérangé(e) par un événement inattendu?', type: 'scale', min: 0, max: 4 },
        { id: '2', prompt: 'Avez-vous senti que vous étiez incapable de contrôler les choses importantes de votre vie?', type: 'scale', min: 0, max: 4 },
        { id: '3', prompt: 'Vous êtes-vous senti(e) nerveux/nerveuse ou stressé(e)?', type: 'scale', min: 0, max: 4 },
        { id: '4', prompt: 'Avez-vous géré avec succès les petits problèmes irritants de la vie?', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '5', prompt: 'Avez-vous senti que vous faisiez face efficacement aux changements importants?', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '6', prompt: 'Avez-vous eu confiance en votre capacité à gérer vos problèmes personnels?', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '7', prompt: 'Avez-vous senti que les choses allaient comme vous le vouliez?', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '8', prompt: 'Avez-vous trouvé que vous ne pouviez pas faire face à tout ce que vous deviez faire?', type: 'scale', min: 0, max: 4 },
        { id: '9', prompt: 'Avez-vous été capable de maîtriser les irritations de la vie?', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '10', prompt: 'Avez-vous senti que les difficultés s\'accumulaient au point que vous ne pouviez les surmonter?', type: 'scale', min: 0, max: 4 }
      ]
    },
    'en': {
      code: 'PSS10',
      locale: 'en',
      name: 'Perceived Stress Scale (PSS-10)',
      version: '1.0',
      expiry_minutes: 30,
      items: [
        { id: '1', prompt: 'Been upset because of something that happened unexpectedly?', type: 'scale', min: 0, max: 4 },
        { id: '2', prompt: 'Felt that you were unable to control the important things in your life?', type: 'scale', min: 0, max: 4 },
        { id: '3', prompt: 'Felt nervous and stressed?', type: 'scale', min: 0, max: 4 },
        { id: '4', prompt: 'Dealt successfully with irritating life hassles?', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '5', prompt: 'Felt that you were effectively coping with important changes?', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '6', prompt: 'Felt confident about your ability to handle your personal problems?', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '7', prompt: 'Felt that things were going your way?', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '8', prompt: 'Found that you could not cope with all the things you had to do?', type: 'scale', min: 0, max: 4 },
        { id: '9', prompt: 'Been able to control irritations in your life?', type: 'scale', min: 0, max: 4, reversed: true },
        { id: '10', prompt: 'Felt difficulties were piling up so high that you could not overcome them?', type: 'scale', min: 0, max: 4 }
      ]
    }
  },
  // PANAS - Positive and Negative Affect Schedule
  'PANAS': {
    'fr': {
      code: 'PANAS',
      locale: 'fr',
      name: 'Échelle d\'affects positifs et négatifs',
      version: '1.0',
      expiry_minutes: 20,
      items: [
        { id: '1', prompt: 'Intéressé(e)', type: 'scale', min: 1, max: 5, subscale: 'positive' },
        { id: '2', prompt: 'Angoissé(e)', type: 'scale', min: 1, max: 5, subscale: 'negative' },
        { id: '3', prompt: 'Enthousiaste', type: 'scale', min: 1, max: 5, subscale: 'positive' },
        { id: '4', prompt: 'Contrarié(e)', type: 'scale', min: 1, max: 5, subscale: 'negative' },
        { id: '5', prompt: 'Fort(e)', type: 'scale', min: 1, max: 5, subscale: 'positive' },
        { id: '6', prompt: 'Coupable', type: 'scale', min: 1, max: 5, subscale: 'negative' },
        { id: '7', prompt: 'Effrayé(e)', type: 'scale', min: 1, max: 5, subscale: 'negative' },
        { id: '8', prompt: 'Hostile', type: 'scale', min: 1, max: 5, subscale: 'negative' },
        { id: '9', prompt: 'Inspiré(e)', type: 'scale', min: 1, max: 5, subscale: 'positive' },
        { id: '10', prompt: 'Fier/Fière', type: 'scale', min: 1, max: 5, subscale: 'positive' }
      ]
    },
    'en': {
      code: 'PANAS',
      locale: 'en',
      name: 'Positive and Negative Affect Schedule',
      version: '1.0',
      expiry_minutes: 20,
      items: [
        { id: '1', prompt: 'Interested', type: 'scale', min: 1, max: 5, subscale: 'positive' },
        { id: '2', prompt: 'Distressed', type: 'scale', min: 1, max: 5, subscale: 'negative' },
        { id: '3', prompt: 'Enthusiastic', type: 'scale', min: 1, max: 5, subscale: 'positive' },
        { id: '4', prompt: 'Upset', type: 'scale', min: 1, max: 5, subscale: 'negative' },
        { id: '5', prompt: 'Strong', type: 'scale', min: 1, max: 5, subscale: 'positive' },
        { id: '6', prompt: 'Guilty', type: 'scale', min: 1, max: 5, subscale: 'negative' },
        { id: '7', prompt: 'Scared', type: 'scale', min: 1, max: 5, subscale: 'negative' },
        { id: '8', prompt: 'Hostile', type: 'scale', min: 1, max: 5, subscale: 'negative' },
        { id: '9', prompt: 'Inspired', type: 'scale', min: 1, max: 5, subscale: 'positive' },
        { id: '10', prompt: 'Proud', type: 'scale', min: 1, max: 5, subscale: 'positive' }
      ]
    }
  },
  // ISI - Insomnia Severity Index
  'ISI': {
    'fr': {
      code: 'ISI',
      locale: 'fr',
      name: 'Index de sévérité de l\'insomnie',
      version: '1.0',
      expiry_minutes: 20,
      items: [
        { id: '1', prompt: 'Difficulté à s\'endormir', type: 'scale', min: 0, max: 4 },
        { id: '2', prompt: 'Difficulté à rester endormi(e)', type: 'scale', min: 0, max: 4 },
        { id: '3', prompt: 'Problème de réveil trop tôt le matin', type: 'scale', min: 0, max: 4 },
        { id: '4', prompt: 'Satisfaction par rapport au sommeil actuel', type: 'scale', min: 0, max: 4 },
        { id: '5', prompt: 'Impact sur le fonctionnement quotidien', type: 'scale', min: 0, max: 4 },
        { id: '6', prompt: 'Visibilité des problèmes de sommeil par les autres', type: 'scale', min: 0, max: 4 },
        { id: '7', prompt: 'Niveau d\'inquiétude concernant le sommeil', type: 'scale', min: 0, max: 4 }
      ]
    },
    'en': {
      code: 'ISI',
      locale: 'en',
      name: 'Insomnia Severity Index',
      version: '1.0',
      expiry_minutes: 20,
      items: [
        { id: '1', prompt: 'Difficulty falling asleep', type: 'scale', min: 0, max: 4 },
        { id: '2', prompt: 'Difficulty staying asleep', type: 'scale', min: 0, max: 4 },
        { id: '3', prompt: 'Problem waking up too early', type: 'scale', min: 0, max: 4 },
        { id: '4', prompt: 'Satisfaction with current sleep pattern', type: 'scale', min: 0, max: 4 },
        { id: '5', prompt: 'Impact on daily functioning', type: 'scale', min: 0, max: 4 },
        { id: '6', prompt: 'Noticeability of sleep problems to others', type: 'scale', min: 0, max: 4 },
        { id: '7', prompt: 'Level of worry about sleep', type: 'scale', min: 0, max: 4 }
      ]
    }
  },
  // BRS - Brief Resilience Scale
  'BRS': {
    'fr': {
      code: 'BRS',
      locale: 'fr',
      name: 'Échelle brève de résilience',
      version: '1.0',
      expiry_minutes: 15,
      items: [
        { id: '1', prompt: 'J\'ai tendance à me remettre rapidement des moments difficiles', type: 'scale', min: 1, max: 5 },
        { id: '2', prompt: 'J\'ai du mal à traverser les événements stressants', type: 'scale', min: 1, max: 5, reversed: true },
        { id: '3', prompt: 'Je ne mets pas longtemps à récupérer d\'un événement stressant', type: 'scale', min: 1, max: 5 },
        { id: '4', prompt: 'Il m\'est difficile de rebondir quand quelque chose de mal arrive', type: 'scale', min: 1, max: 5, reversed: true },
        { id: '5', prompt: 'Je traverse généralement les moments difficiles avec peu de problèmes', type: 'scale', min: 1, max: 5 },
        { id: '6', prompt: 'Je mets longtemps à me remettre des revers dans ma vie', type: 'scale', min: 1, max: 5, reversed: true }
      ]
    },
    'en': {
      code: 'BRS',
      locale: 'en',
      name: 'Brief Resilience Scale',
      version: '1.0',
      expiry_minutes: 15,
      items: [
        { id: '1', prompt: 'I tend to bounce back quickly after hard times', type: 'scale', min: 1, max: 5 },
        { id: '2', prompt: 'I have a hard time making it through stressful events', type: 'scale', min: 1, max: 5, reversed: true },
        { id: '3', prompt: 'It does not take me long to recover from a stressful event', type: 'scale', min: 1, max: 5 },
        { id: '4', prompt: 'It is hard for me to snap back when something bad happens', type: 'scale', min: 1, max: 5, reversed: true },
        { id: '5', prompt: 'I usually come through difficult times with little trouble', type: 'scale', min: 1, max: 5 },
        { id: '6', prompt: 'I tend to take a long time to get over set-backs in my life', type: 'scale', min: 1, max: 5, reversed: true }
      ]
    }
  },
  'UCLA3': {} as any,
  'MSPSS': {} as any,
  'AAQ2': {
    'fr': {
      code: 'AAQ2',
      locale: 'fr',
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
      locale: 'en',
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
  'GAS': {} as any,
  'GRITS': {} as any,
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

    // PHQ-9: 0-4 minimal, 5-9 mild, 10-14 moderate, 15-19 moderately severe, 20-27 severe
    case 'PHQ9':
      if (total <= 4) return 0; // Minimal
      if (total <= 9) return 1; // Léger
      if (total <= 14) return 2; // Modéré
      if (total <= 19) return 3; // Modéré-sévère
      return 4; // Sévère

    // GAD-7: 0-4 minimal, 5-9 mild, 10-14 moderate, 15-21 severe
    case 'GAD7':
      if (total <= 4) return 0; // Minimal
      if (total <= 9) return 1; // Léger
      if (total <= 14) return 2; // Modéré
      return 4; // Sévère

    // PSS-10: 0-13 low, 14-26 moderate, 27-40 high
    case 'PSS10':
      if (total <= 13) return 0; // Faible
      if (total <= 20) return 1; // Modéré bas
      if (total <= 26) return 2; // Modéré
      if (total <= 33) return 3; // Élevé
      return 4; // Très élevé

    // PANAS: Utilise le ratio positif/négatif
    case 'PANAS': {
      const positive = subscales.positive || 0;
      const negative = subscales.negative || 0;
      const ratio = positive - negative;
      if (ratio >= 15) return 4; // Très positif
      if (ratio >= 5) return 3; // Positif
      if (ratio >= -5) return 2; // Neutre
      if (ratio >= -15) return 1; // Négatif
      return 0; // Très négatif
    }

    // ISI: 0-7 none, 8-14 subthreshold, 15-21 moderate, 22-28 severe
    case 'ISI':
      if (total <= 7) return 0; // Aucune insomnie
      if (total <= 14) return 1; // Sous-seuil
      if (total <= 21) return 2; // Modérée
      return 4; // Sévère

    // BRS: 1-2.99 low, 3-4.3 normal, 4.31-5 high
    case 'BRS': {
      if (!itemCount) return 2;
      const avg = total / itemCount;
      if (avg >= 4.3) return 4; // Résilience élevée
      if (avg >= 3.5) return 3; // Bonne résilience
      if (avg >= 3.0) return 2; // Résilience normale
      if (avg >= 2.0) return 1; // Résilience faible
      return 0; // Résilience très faible
    }

    default:
      return 2; // Neutral fallback
  }
}

function generateSummary(instrument: InstrumentCode, level: number): string {
  const summaries: Record<string, Record<number, string>> = {
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
    },
    'PHQ9': {
      0: 'humeur stable, aucun signe dépressif',
      1: 'signes légers, vigilance recommandée',
      2: 'signes modérés, soutien conseillé',
      3: 'signes modérés-sévères, accompagnement nécessaire',
      4: 'signes sévères, aide professionnelle recommandée'
    },
    'GAD7': {
      0: 'anxiété minimale',
      1: 'anxiété légère',
      2: 'anxiété modérée',
      3: 'anxiété modérée-sévère',
      4: 'anxiété sévère, consultation recommandée'
    },
    'PSS10': {
      0: 'stress perçu faible',
      1: 'stress perçu modéré-bas',
      2: 'stress perçu modéré',
      3: 'stress perçu élevé',
      4: 'stress perçu très élevé'
    },
    'PANAS': {
      0: 'affects négatifs dominants',
      1: 'affects mitigés, tendance négative',
      2: 'affects équilibrés',
      3: 'affects positifs dominants',
      4: 'affects très positifs'
    },
    'ISI': {
      0: 'sommeil de qualité',
      1: 'difficultés légères de sommeil',
      2: 'insomnie modérée',
      3: 'insomnie modérée-sévère',
      4: 'insomnie sévère'
    },
    'BRS': {
      0: 'résilience très faible',
      1: 'résilience faible',
      2: 'résilience normale',
      3: 'bonne résilience',
      4: 'résilience élevée'
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