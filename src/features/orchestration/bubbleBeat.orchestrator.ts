// @ts-nocheck
/**
 * Bubble Beat Orchestrator - Orchestrateur de rythme cardiaque et relaxation
 * Gestion adaptative des sessions basées sur le niveau de stress PSS
 */

import { logger } from '@/lib/logger';
import type { BubbleBeatOrchestrationAction, BubbleBeatOrchestratorInput } from './types';

/** Niveau de stress */
export type StressLevel = 'relaxed' | 'mild' | 'moderate' | 'elevated' | 'high';

/** Variante de parcours */
export type PathVariant = 'hr' | 'breath' | 'music' | 'nature' | 'meditation' | 'mixed';

/** Type d'action d'orchestration */
export type BubbleActionType =
  | 'set_path_variant'
  | 'set_path_duration'
  | 'post_cta'
  | 'adjust_tempo'
  | 'set_ambient'
  | 'enable_biofeedback'
  | 'show_visualization'
  | 'trigger_reward';

/** Action étendue */
export interface ExtendedBubbleAction extends BubbleBeatOrchestrationAction {
  actionType: BubbleActionType;
  priority?: 'low' | 'medium' | 'high';
  metadata?: Record<string, unknown>;
}

/** Input étendu */
export interface ExtendedBubbleInput extends BubbleBeatOrchestratorInput {
  userId?: string;
  currentHeartRate?: number;
  targetHeartRate?: number;
  previousSessions?: number;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  preferences?: BubblePreferences;
  environment?: EnvironmentContext;
}

/** Préférences utilisateur */
export interface BubblePreferences {
  preferredVariant?: PathVariant;
  maxSessionDuration?: number;
  enableBiofeedback?: boolean;
  enableVisualizations?: boolean;
  musicPreference?: 'calm' | 'ambient' | 'nature' | 'silence';
  hapticFeedback?: boolean;
}

/** Contexte environnemental */
export interface EnvironmentContext {
  noiseLevel?: 'quiet' | 'moderate' | 'noisy';
  lighting?: 'dark' | 'dim' | 'bright';
  location?: 'indoor' | 'outdoor';
}

/** Résultat d'orchestration */
export interface BubbleOrchestrationResult {
  actions: ExtendedBubbleAction[];
  pathVariant: PathVariant;
  estimatedDuration: number;
  stressLevel: StressLevel;
  targetState: TargetState;
  recommendations: string[];
  metadata: OrchestrationMetadata;
}

/** État cible */
export interface TargetState {
  targetHeartRate?: number;
  targetBreathRate?: number;
  expectedCalm: number; // 0-100
}

/** Métadonnées d'orchestration */
export interface OrchestrationMetadata {
  orchestrationId: string;
  timestamp: number;
  inputFactors: string[];
  adjustmentsMade: string[];
}

/** Configuration de l'orchestrateur */
export interface BubbleOrchestratorConfig {
  enabled: boolean;
  minSessionDuration: number;
  maxSessionDuration: number;
  adaptToStress: boolean;
  enableBiofeedback: boolean;
  defaultVariant: PathVariant;
  tempoRange: { min: number; max: number };
}

/** Statistiques de l'orchestrateur */
export interface BubbleOrchestratorStats {
  totalOrchestrations: number;
  byStressLevel: Record<StressLevel, number>;
  byPathVariant: Record<PathVariant, number>;
  averageDuration: number;
  averageStressReduction: number;
  lastOrchestration: number | null;
}

// Constantes de durée
const QUICK_DURATION_MS = 60_000;      // 1 minute
const CALM_DURATION_MS = 120_000;      // 2 minutes
const STANDARD_DURATION_MS = 300_000;  // 5 minutes
const EXTENDED_DURATION_MS = 600_000;  // 10 minutes
const DEEP_DURATION_MS = 900_000;      // 15 minutes

// Variants de parcours
const CALM_VARIANT_KEY: PathVariant = 'hr';
const BREATH_VARIANT_KEY: PathVariant = 'breath';
const NATURE_VARIANT_KEY: PathVariant = 'nature';
const MEDITATION_VARIANT_KEY: PathVariant = 'meditation';

// Configuration par défaut
const DEFAULT_CONFIG: BubbleOrchestratorConfig = {
  enabled: true,
  minSessionDuration: QUICK_DURATION_MS,
  maxSessionDuration: DEEP_DURATION_MS,
  adaptToStress: true,
  enableBiofeedback: true,
  defaultVariant: 'hr',
  tempoRange: { min: 40, max: 80 }
};

// État global
let config: BubbleOrchestratorConfig = { ...DEFAULT_CONFIG };
const stats: BubbleOrchestratorStats = {
  totalOrchestrations: 0,
  byStressLevel: {
    relaxed: 0, mild: 0, moderate: 0, elevated: 0, high: 0
  },
  byPathVariant: {
    hr: 0, breath: 0, music: 0, nature: 0, meditation: 0, mixed: 0
  },
  averageDuration: 0,
  averageStressReduction: 0,
  lastOrchestration: null
};

/** Générer un ID unique */
function generateId(): string {
  return `bubble-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/** Déterminer le niveau de stress */
function determineStressLevel(pssLevel: number | undefined): StressLevel {
  if (pssLevel === undefined) return 'moderate';

  if (pssLevel <= 1) return 'relaxed';
  if (pssLevel <= 2) return 'mild';
  if (pssLevel <= 3) return 'moderate';
  if (pssLevel <= 4) return 'elevated';
  return 'high';
}

/** Sélectionner la variante de parcours */
function selectPathVariant(
  stressLevel: StressLevel,
  input: ExtendedBubbleInput
): PathVariant {
  // Respecter les préférences si définies
  if (input.preferences?.preferredVariant) {
    return input.preferences.preferredVariant;
  }

  // Sélection basée sur le stress
  const variantsByStress: Record<StressLevel, PathVariant> = {
    relaxed: 'music',
    mild: 'breath',
    moderate: 'hr',
    elevated: 'meditation',
    high: 'hr'
  };

  // Ajuster selon l'heure
  if (input.timeOfDay === 'night') {
    return 'meditation';
  }
  if (input.timeOfDay === 'morning') {
    return stressLevel === 'high' ? 'hr' : 'breath';
  }

  return variantsByStress[stressLevel];
}

/** Calculer la durée de session */
function calculateDuration(
  stressLevel: StressLevel,
  input: ExtendedBubbleInput
): number {
  const baseDurations: Record<StressLevel, number> = {
    relaxed: QUICK_DURATION_MS,
    mild: CALM_DURATION_MS,
    moderate: STANDARD_DURATION_MS,
    elevated: EXTENDED_DURATION_MS,
    high: EXTENDED_DURATION_MS
  };

  let duration = baseDurations[stressLevel];

  // Ajuster selon les préférences
  if (input.preferences?.maxSessionDuration) {
    duration = Math.min(duration, input.preferences.maxSessionDuration);
  }

  // Sessions plus longues le soir pour la détente
  if (input.timeOfDay === 'evening' || input.timeOfDay === 'night') {
    duration = Math.min(duration * 1.5, config.maxSessionDuration);
  }

  return Math.max(config.minSessionDuration, Math.min(duration, config.maxSessionDuration));
}

/** Calculer l'état cible */
function calculateTargetState(
  stressLevel: StressLevel,
  input: ExtendedBubbleInput
): TargetState {
  const currentHR = input.currentHeartRate ?? 75;
  const targetHR = input.targetHeartRate ?? Math.max(60, currentHR - 10);

  const calmTargets: Record<StressLevel, number> = {
    relaxed: 90,
    mild: 80,
    moderate: 70,
    elevated: 60,
    high: 50
  };

  return {
    targetHeartRate: targetHR,
    targetBreathRate: 6, // Respiration cohérente
    expectedCalm: calmTargets[stressLevel]
  };
}

/** Sélectionner le CTA post-session */
function selectPostCTA(stressLevel: StressLevel): string {
  const ctaByStress: Record<StressLevel, string> = {
    relaxed: 'flash_glow',
    mild: 'flash_glow',
    moderate: 'nyvee',
    elevated: 'nyvee',
    high: 'nyvee'
  };

  return ctaByStress[stressLevel];
}

/** Générer les actions de base */
function generateBaseActions(
  variant: PathVariant,
  duration: number,
  stressLevel: StressLevel
): ExtendedBubbleAction[] {
  const actions: ExtendedBubbleAction[] = [];

  // Variante de parcours
  actions.push({
    action: 'set_path_variant',
    key: variant,
    actionType: 'set_path_variant',
    priority: 'high'
  });

  // Durée du parcours
  actions.push({
    action: 'set_path_duration',
    ms: duration,
    actionType: 'set_path_duration',
    priority: 'high'
  });

  // CTA post-session
  actions.push({
    action: 'post_cta',
    key: selectPostCTA(stressLevel),
    actionType: 'post_cta',
    priority: 'medium'
  });

  return actions;
}

/** Générer les actions de support */
function generateSupportActions(
  stressLevel: StressLevel,
  input: ExtendedBubbleInput
): ExtendedBubbleAction[] {
  const actions: ExtendedBubbleAction[] = [];

  // Biofeedback pour les niveaux de stress élevés
  if (config.enableBiofeedback && input.preferences?.enableBiofeedback !== false) {
    if (stressLevel === 'elevated' || stressLevel === 'high') {
      actions.push({
        action: 'enable_biofeedback',
        enabled: true,
        actionType: 'enable_biofeedback',
        priority: 'medium'
      } as ExtendedBubbleAction);
    }
  }

  // Ajuster le tempo selon le stress
  const tempoByStress: Record<StressLevel, number> = {
    relaxed: 70,
    mild: 65,
    moderate: 60,
    elevated: 55,
    high: 50
  };

  actions.push({
    action: 'adjust_tempo',
    bpm: tempoByStress[stressLevel],
    actionType: 'adjust_tempo',
    priority: 'medium'
  } as ExtendedBubbleAction);

  // Visualisations
  if (input.preferences?.enableVisualizations !== false) {
    actions.push({
      action: 'show_visualization',
      type: stressLevel === 'high' ? 'calm_waves' : 'bubbles',
      actionType: 'show_visualization',
      priority: 'low'
    } as ExtendedBubbleAction);
  }

  // Ambiance sonore
  if (input.preferences?.musicPreference) {
    actions.push({
      action: 'set_ambient',
      type: input.preferences.musicPreference,
      actionType: 'set_ambient',
      priority: 'low'
    } as ExtendedBubbleAction);
  }

  return actions;
}

/** Générer des recommandations */
function generateRecommendations(
  stressLevel: StressLevel,
  variant: PathVariant
): string[] {
  const recommendations: string[] = [];

  const stressRecommendations: Record<StressLevel, string[]> = {
    relaxed: [
      'Profite de ce moment de calme',
      'Tu es déjà dans un bel état de détente',
      'Continue sur cette lancée positive'
    ],
    mild: [
      'Une courte session pour maintenir ton équilibre',
      'Respire profondément et laisse-toi porter',
      'Tu vas rapidement retrouver ton calme'
    ],
    moderate: [
      'Concentre-toi sur ta respiration',
      'Laisse les bulles guider ton rythme',
      'Chaque bulle qui éclate relâche une tension'
    ],
    elevated: [
      'Prends le temps dont tu as besoin',
      'Le biofeedback t\'aide à trouver ton rythme',
      'Tu es plus fort(e) que ton stress'
    ],
    high: [
      'Tu fais bien de prendre ce moment pour toi',
      'Respire avec les bulles, inspire le calme',
      'Chaque seconde compte dans ta détente'
    ]
  };

  recommendations.push(...stressRecommendations[stressLevel]);

  return recommendations;
}

/** Orchestrateur principal (rétrocompatibilité) */
export function bubbleBeatOrchestrator(
  { pssLevel }: BubbleBeatOrchestratorInput
): BubbleBeatOrchestrationAction[] {
  const result = orchestrateBubble({ pssLevel });
  return result.actions;
}

/** Orchestration complète */
export function orchestrateBubble(input: ExtendedBubbleInput): BubbleOrchestrationResult {
  const startTime = performance.now();
  stats.totalOrchestrations++;
  stats.lastOrchestration = Date.now();

  // Déterminer le niveau de stress
  const stressLevel = determineStressLevel(input.pssLevel);
  stats.byStressLevel[stressLevel]++;

  // Sélectionner la variante
  const pathVariant = selectPathVariant(stressLevel, input);
  stats.byPathVariant[pathVariant]++;

  // Calculer la durée
  const duration = calculateDuration(stressLevel, input);

  // Calculer l'état cible
  const targetState = calculateTargetState(stressLevel, input);

  // Générer les actions
  const baseActions = generateBaseActions(pathVariant, duration, stressLevel);
  const supportActions = generateSupportActions(stressLevel, input);
  const actions = [...baseActions, ...supportActions];

  // Générer les recommandations
  const recommendations = generateRecommendations(stressLevel, pathVariant);

  // Facteurs d'input
  const inputFactors: string[] = [`pss:${input.pssLevel ?? 'undefined'}`];
  if (input.currentHeartRate) inputFactors.push(`hr:${input.currentHeartRate}`);
  if (input.timeOfDay) inputFactors.push(`time:${input.timeOfDay}`);

  // Ajustements effectués
  const adjustmentsMade: string[] = [];
  if (input.preferences?.preferredVariant) adjustmentsMade.push('variant_from_preference');
  if (stressLevel === 'high') adjustmentsMade.push('high_stress_protocol');

  logger.info('Bubble orchestration completed', {
    stressLevel,
    pathVariant,
    duration: duration / 1000,
    actionsCount: actions.length
  }, 'ORCHESTRATOR');

  return {
    actions,
    pathVariant,
    estimatedDuration: duration,
    stressLevel,
    targetState,
    recommendations,
    metadata: {
      orchestrationId: generateId(),
      timestamp: Date.now(),
      inputFactors,
      adjustmentsMade
    }
  };
}

/** Configurer l'orchestrateur */
export function configureBubbleOrchestrator(userConfig: Partial<BubbleOrchestratorConfig>): void {
  config = { ...config, ...userConfig };
}

/** Obtenir la configuration */
export function getBubbleConfig(): BubbleOrchestratorConfig {
  return { ...config };
}

/** Obtenir les statistiques */
export function getBubbleStats(): BubbleOrchestratorStats {
  return { ...stats };
}

/** Réinitialiser les statistiques */
export function resetBubbleStats(): void {
  stats.totalOrchestrations = 0;
  stats.averageDuration = 0;
  stats.averageStressReduction = 0;
  stats.lastOrchestration = null;

  for (const key of Object.keys(stats.byStressLevel) as StressLevel[]) {
    stats.byStressLevel[key] = 0;
  }
  for (const key of Object.keys(stats.byPathVariant) as PathVariant[]) {
    stats.byPathVariant[key] = 0;
  }
}

/** Obtenir le niveau de stress */
export function getStressLevel(pssLevel: number): StressLevel {
  return determineStressLevel(pssLevel);
}

/** Obtenir la durée recommandée */
export function getRecommendedDuration(pssLevel: number): number {
  const stressLevel = determineStressLevel(pssLevel);
  return calculateDuration(stressLevel, { pssLevel });
}

/** Constantes exportées */
export const DURATION_PRESETS = {
  QUICK: QUICK_DURATION_MS,
  CALM: CALM_DURATION_MS,
  STANDARD: STANDARD_DURATION_MS,
  EXTENDED: EXTENDED_DURATION_MS,
  DEEP: DEEP_DURATION_MS
};

export const PATH_VARIANTS = {
  HR: CALM_VARIANT_KEY,
  BREATH: BREATH_VARIANT_KEY,
  NATURE: NATURE_VARIANT_KEY,
  MEDITATION: MEDITATION_VARIANT_KEY
};

export default bubbleBeatOrchestrator;
