/**
 * Music Unified - Capability Adaptive
 * Adaptation temps réel basée sur l'état physiologique (POMS)
 */

import type {
  PomsState,
  PomsTrend,
  PlaybackAdaptation,
  MusicalMood,
} from '../types';

/**
 * Mapping POMS vers présets musicaux
 */
const POMS_PRESET_MAP: Record<string, string> = {
  'relaxed-resourced': 'uplifting',
  'relaxed-stable': 'gentle',
  'relaxed-heavy': 'restorative',
  'open-resourced': 'balanced',
  'open-stable': 'neutral',
  'open-heavy': 'supportive',
  'vigilant-resourced': 'calming',
  'vigilant-stable': 'soothing',
  'vigilant-heavy': 'deep-rest',
};

/**
 * Descriptions des présets
 */
const PRESET_DESCRIPTIONS: Record<string, string> = {
  uplifting: 'Musique énergisante et positive',
  gentle: 'Musique douce et apaisante',
  restorative: 'Musique profondément relaxante',
  balanced: 'Musique équilibrée',
  neutral: 'Musique neutre et stable',
  supportive: 'Musique de soutien émotionnel',
  calming: 'Musique calmante progressive',
  soothing: 'Musique apaisante enveloppante',
  'deep-rest': 'Musique pour repos profond',
};

/**
 * Analyser l'état POMS et déterminer le preset adapté
 */
export function analyzePoms(state: PomsState): {
  preset: string;
  description: string;
  reasoning: string;
} {
  const key = `${state.tension}-${state.fatigue}`;
  const preset = POMS_PRESET_MAP[key] || 'neutral';

  return {
    preset,
    description: PRESET_DESCRIPTIONS[preset],
    reasoning: generatePomsReasoning(state),
  };
}

/**
 * Générer le raisonnement POMS
 */
function generatePomsReasoning(state: PomsState): string {
  const parts: string[] = [];

  // Analyser la tension
  switch (state.tension) {
    case 'relaxed':
      parts.push('Tension faible : les épaules sont souples, la respiration est ample');
      break;
    case 'open':
      parts.push('Tension modérée : tonus tranquille, présence stable');
      break;
    case 'vigilant':
      parts.push('Tension élevée : encore un peu de tension à relâcher');
      break;
  }

  // Analyser la fatigue
  switch (state.fatigue) {
    case 'resourced':
      parts.push('Énergie disponible : l\'élan intérieur est présent');
      break;
    case 'stable':
      parts.push('Énergie stable : le corps reste confortable');
      break;
    case 'heavy':
      parts.push('Fatigue présente : besoin de repos et récupération');
      break;
  }

  return parts.join('. ');
}

/**
 * Calculer la tendance POMS entre deux états
 */
export function calculatePomsTrend(before: PomsState, after: PomsState): PomsTrend {
  const tensionScore = {
    relaxed: 1,
    open: 2,
    vigilant: 3,
  };

  const fatigueScore = {
    resourced: 1,
    stable: 2,
    heavy: 3,
  };

  const tensionDelta = tensionScore[after.tension] - tensionScore[before.tension];
  const fatigueDelta = fatigueScore[after.fatigue] - fatigueScore[before.fatigue];

  const trend: PomsTrend = {
    tension_trend: tensionDelta < 0 ? 'down' : tensionDelta > 0 ? 'up' : 'steady',
    fatigue_trend: fatigueDelta < 0 ? 'down' : fatigueDelta > 0 ? 'up' : 'steady',
    note: null,
    completed: true,
  };

  // Générer note contextuelle
  const notes: string[] = [];
  if (trend.tension_trend === 'down') {
    notes.push('Belle détente repérée, on prolonge cette douceur');
  } else if (trend.tension_trend === 'up') {
    notes.push('On garde une présence très enveloppante pour relâcher');
  }

  if (trend.fatigue_trend === 'up') {
    notes.push('On adoucit le tempo pour soutenir la récupération');
  } else if (trend.fatigue_trend === 'down') {
    notes.push('Un regain d\'élan se dessine, on peut colorer légèrement la texture');
  }

  trend.note = notes.join('. ') || null;

  return trend;
}

/**
 * Déterminer si une adaptation est nécessaire
 */
export function shouldAdapt(
  currentPreset: string,
  pomsState: PomsState,
  lastAdaptation: PlaybackAdaptation | null,
  minTimeBetweenAdaptations: number = 120 // 2 minutes par défaut
): {
  should: boolean;
  reason?: string;
  newPreset?: string;
} {
  const suggestedAnalysis = analyzePoms(pomsState);
  const suggestedPreset = suggestedAnalysis.preset;

  // Si déjà sur le bon preset, pas d'adaptation
  if (currentPreset === suggestedPreset) {
    return { should: false };
  }

  // Vérifier le délai depuis dernière adaptation
  if (lastAdaptation) {
    const timeSinceLastAdaptation =
      (new Date().getTime() - new Date(lastAdaptation.timestamp).getTime()) / 1000;

    if (timeSinceLastAdaptation < minTimeBetweenAdaptations) {
      return {
        should: false,
        reason: 'Trop tôt pour une nouvelle adaptation',
      };
    }
  }

  // Adaptation nécessaire
  return {
    should: true,
    reason: suggestedAnalysis.reasoning,
    newPreset: suggestedPreset,
  };
}

/**
 * Créer une adaptation de lecture
 */
export function createAdaptation(
  fromPreset: string,
  toPreset: string,
  pomsState: PomsState,
  reason: string
): PlaybackAdaptation {
  const now = new Date().toISOString();

  // Calculer confiance basée sur la clarté de l'état POMS
  const confidence = calculateAdaptationConfidence(pomsState);

  return {
    timestamp: now,
    reason,
    from_preset: fromPreset,
    to_preset: toPreset,
    poms_state: pomsState,
    confidence,
  };
}

/**
 * Calculer la confiance de l'adaptation
 */
function calculateAdaptationConfidence(state: PomsState): number {
  // États extrêmes = confiance élevée
  if (state.tension === 'vigilant' && state.fatigue === 'heavy') {
    return 0.95; // Besoin clair de repos
  }
  if (state.tension === 'relaxed' && state.fatigue === 'resourced') {
    return 0.95; // État optimal clair
  }

  // États modérés = confiance moyenne
  if (state.tension === 'open' && state.fatigue === 'stable') {
    return 0.70; // État neutre
  }

  // Autres combinaisons
  return 0.80;
}

/**
 * Mapper POMS vers MusicalMood
 */
export function pomsToMusicalMood(state: PomsState): MusicalMood {
  let energy = 0.5;
  let valence = 0;
  let primary = 'neutral';

  // Calculer énergie basée sur fatigue
  switch (state.fatigue) {
    case 'resourced':
      energy = 0.8;
      break;
    case 'stable':
      energy = 0.5;
      break;
    case 'heavy':
      energy = 0.2;
      break;
  }

  // Calculer valence basée sur tension
  switch (state.tension) {
    case 'relaxed':
      valence = 0.6;
      primary = 'calm';
      break;
    case 'open':
      valence = 0.2;
      primary = 'neutral';
      break;
    case 'vigilant':
      valence = -0.4;
      primary = 'anxious';
      break;
  }

  return {
    primary,
    intensity: Math.abs(valence),
    energy,
    valence,
  };
}

/**
 * Suggérer des ajustements de configuration musicale
 */
export function suggestMusicAdjustments(state: PomsState): {
  tempo_adjustment: number;
  volume_adjustment: number;
  complexity_adjustment: number;
  reasoning: string;
} {
  let tempoAdjustment = 0;
  let volumeAdjustment = 0;
  let complexityAdjustment = 0;
  const reasons: string[] = [];

  // Ajustements basés sur tension
  if (state.tension === 'vigilant') {
    tempoAdjustment -= 10; // Ralentir
    complexityAdjustment -= 0.2; // Simplifier
    reasons.push('Tempo ralenti et musique simplifiée pour réduire la tension');
  } else if (state.tension === 'relaxed') {
    complexityAdjustment += 0.1; // Peut être plus complexe
  }

  // Ajustements basés sur fatigue
  if (state.fatigue === 'heavy') {
    volumeAdjustment -= 5; // Plus doux
    tempoAdjustment -= 5; // Plus lent
    reasons.push('Volume et tempo réduits pour favoriser le repos');
  } else if (state.fatigue === 'resourced') {
    tempoAdjustment += 5; // Plus dynamique
    reasons.push('Tempo légèrement augmenté pour soutenir l\'énergie');
  }

  return {
    tempo_adjustment: tempoAdjustment,
    volume_adjustment: volumeAdjustment,
    complexity_adjustment: complexityAdjustment,
    reasoning: reasons.join('. ') || 'Aucun ajustement majeur nécessaire',
  };
}

/**
 * Prédire l'évolution POMS optimale
 */
export function predictOptimalPomsEvolution(
  current: PomsState,
  targetMinutes: number
): PomsState[] {
  const steps = Math.ceil(targetMinutes / 5); // Une étape toutes les 5 minutes
  const evolution: PomsState[] = [current];

  let currentTension = current.tension;
  let currentFatigue = current.fatigue;

  for (let i = 1; i <= steps; i++) {
    // Évolution progressive vers l'état optimal
    if (currentTension === 'vigilant' && i > 1) {
      currentTension = 'open';
    } else if (currentTension === 'open' && i > 3) {
      currentTension = 'relaxed';
    }

    if (currentFatigue === 'heavy' && i > 2) {
      currentFatigue = 'stable';
    } else if (currentFatigue === 'stable' && i > 4) {
      currentFatigue = 'resourced';
    }

    evolution.push({
      tension: currentTension,
      fatigue: currentFatigue,
      timestamp: new Date(
        Date.now() + i * 5 * 60 * 1000
      ).toISOString(),
    });
  }

  return evolution;
}
