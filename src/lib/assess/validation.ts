/**
 * Validation des instruments cliniques selon la recherche scientifique
 * Sources validées:
 * - WHO-5: BMC Psychiatry 2024, Frontiers Psychology 2025
 * - STAI-6: PMC 2009 (Support for Reliability and Validity) 
 * - SUDS: PMC 2025 (Rethinking the Subjective Units of Distress Scale)
 * - SAM: Validation IEEE, MDPI 2024
 * - PANAS-10: Journal of Cross-Cultural Psychology 2007
 * - PSS-10: BMC Psychiatry 2024, validation psychométrique
 */

import type { InstrumentCode } from './types';

// Configuration validée scientifiquement
export const VALIDATED_INSTRUMENTS = {
  WHO5: {
    name: 'WHO-5 Well-Being Index',
    items: 5,
    scale: [0, 4], // Échelle 0-4 validée
    description: 'Indice de bien-être validé scientifiquement',
    validation: 'BMC Psychiatry 2024, Frontiers Psychology 2025'
  },
  STAI6: {
    name: 'State Anxiety Inventory (6 items)',
    items: 6,
    scale: [1, 4], // Échelle 1-4 validée
    description: 'Mesure d\'état émotionnel validée',
    validation: 'PMC 2009 - Support for Reliability and Validity'
  },
  SAM: {
    name: 'Self-Assessment Manikin',
    items: 1,
    scale: [1, 9], // Échelle 1-9 validée
    description: 'Évaluation de valence émotionnelle',
    validation: 'IEEE, MDPI 2024 - Validation scientifique'
  },
  SUDS: {
    name: 'Subjective Units Scale',
    items: 1,
    scale: [0, 10], // Échelle 0-10 validée cliniquement
    description: 'Mesure d\'intensité subjective',
    validation: 'PMC 2025 - Rethinking the SUDS'
  },
  PANAS10: {
    name: 'Positive and Negative Affect Schedule (10 items)',
    items: 10,
    scale: [1, 5], // Échelle 1-5 validée
    description: 'Mesure d\'affect validée internationalement',
    validation: 'Journal of Cross-Cultural Psychology 2007'
  },
  PSS10: {
    name: 'Perceived Stress Scale (10 items)',
    items: 10,
    scale: [0, 4], // Échelle 0-4 validée
    description: 'Échelle de tension perçue',
    validation: 'BMC Psychiatry 2024 - Validation psychométrique'
  }
} as const;

/**
 * Valide si un instrument est supporté scientifiquement
 */
export function isValidatedInstrument(code: string): code is InstrumentCode {
  return code in VALIDATED_INSTRUMENTS;
}

/**
 * Retourne la configuration validée d'un instrument
 */
export function getInstrumentConfig(code: InstrumentCode) {
  return VALIDATED_INSTRUMENTS[code];
}

/**
 * Valide les réponses selon les échelles scientifiques
 */
export function validateResponses(instrument: InstrumentCode, answers: Record<string, number>): boolean {
  const config = getInstrumentConfig(instrument);
  if (!config) return false;
  
  const [min, max] = config.scale;
  
  // Vérifier que toutes les réponses sont dans l'échelle validée
  return Object.values(answers).every(value => 
    typeof value === 'number' && value >= min && value <= max
  );
}

/**
 * Retourne les sources de validation scientifique
 */
export function getValidationSources(): Record<string, string> {
  return Object.fromEntries(
    Object.entries(VALIDATED_INSTRUMENTS).map(([code, config]) => [
      code,
      config.validation
    ])
  );
}