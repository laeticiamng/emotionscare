// @ts-nocheck
/**
 * Boss Grit Orchestrator - Orchestrateur de défis de résilience
 * Gestion adaptative des challenges basés sur les scores GRIT et BRS
 */

import { logger } from '@/lib/logger';
import type { BossGritOrchestrationAction, BossGritOrchestratorInput } from './types';

/** Niveaux de difficulté */
export type DifficultyLevel = 'gentle' | 'easy' | 'moderate' | 'challenging' | 'intense';

/** État de résilience */
export type ResilienceState = 'vulnerable' | 'recovering' | 'stable' | 'strong' | 'resilient';

/** Type d'action d'orchestration */
export type GritActionType =
  | 'set_challenge_duration'
  | 'enable_compassion_streak'
  | 'set_difficulty'
  | 'adjust_intensity'
  | 'add_support'
  | 'trigger_checkpoint'
  | 'show_progress'
  | 'unlock_badge'
  | 'suggest_break';

/** Action étendue */
export interface ExtendedGritAction extends BossGritOrchestrationAction {
  actionType: GritActionType;
  priority?: 'low' | 'medium' | 'high';
  metadata?: Record<string, unknown>;
}

/** Input étendu */
export interface ExtendedGritInput extends BossGritOrchestratorInput {
  userId?: string;
  previousChallenges?: number;
  streakDays?: number;
  lastChallengeResult?: 'completed' | 'abandoned' | 'partial';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  energyLevel?: number;
  moodScore?: number;
  preferences?: GritPreferences;
}

/** Préférences utilisateur */
export interface GritPreferences {
  preferredDifficulty?: DifficultyLevel;
  maxChallengeDuration?: number;
  enableEncouragements?: boolean;
  enableCheckpoints?: boolean;
  showProgress?: boolean;
}

/** Résultat d'orchestration */
export interface GritOrchestrationResult {
  actions: ExtendedGritAction[];
  difficulty: DifficultyLevel;
  estimatedDuration: number;
  resilienceState: ResilienceState;
  recommendations: string[];
  metadata: OrchestrationMetadata;
}

/** Métadonnées d'orchestration */
export interface OrchestrationMetadata {
  orchestrationId: string;
  timestamp: number;
  inputFactors: string[];
  adjustmentsMade: string[];
}

/** Configuration de l'orchestrateur */
export interface GritOrchestratorConfig {
  enabled: boolean;
  minChallengeDuration: number;
  maxChallengeDuration: number;
  adaptToDifficulty: boolean;
  enableCompassionMode: boolean;
  checkpointInterval: number;
  encouragementFrequency: number;
}

/** Statistiques de l'orchestrateur */
export interface GritOrchestratorStats {
  totalOrchestrations: number;
  byDifficulty: Record<DifficultyLevel, number>;
  byResilienceState: Record<ResilienceState, number>;
  averageDuration: number;
  completionRate: number;
  lastOrchestration: number | null;
}

// Constantes de durée
const GENTLE_DURATION_MS = 60_000;    // 1 minute
const SHORT_DURATION_MS = 180_000;     // 3 minutes
const STANDARD_DURATION_MS = 600_000;  // 10 minutes
const EXTENDED_DURATION_MS = 900_000;  // 15 minutes
const INTENSE_DURATION_MS = 1200_000;  // 20 minutes

// Configuration par défaut
const DEFAULT_CONFIG: GritOrchestratorConfig = {
  enabled: true,
  minChallengeDuration: GENTLE_DURATION_MS,
  maxChallengeDuration: INTENSE_DURATION_MS,
  adaptToDifficulty: true,
  enableCompassionMode: true,
  checkpointInterval: 180_000, // 3 minutes
  encouragementFrequency: 120_000 // 2 minutes
};

// État global
let config: GritOrchestratorConfig = { ...DEFAULT_CONFIG };
const stats: GritOrchestratorStats = {
  totalOrchestrations: 0,
  byDifficulty: {
    gentle: 0, easy: 0, moderate: 0, challenging: 0, intense: 0
  },
  byResilienceState: {
    vulnerable: 0, recovering: 0, stable: 0, strong: 0, resilient: 0
  },
  averageDuration: 0,
  completionRate: 0,
  lastOrchestration: null
};

/** Résoudre un niveau numérique */
const resolveLevel = (value: number | undefined, defaultValue = 2): number =>
  typeof value === 'number' ? value : defaultValue;

/** Générer un ID unique */
function generateId(): string {
  return `grit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/** Déterminer l'état de résilience */
function determineResilienceState(gritLevel: number, brsLevel: number): ResilienceState {
  const combined = (gritLevel + brsLevel) / 2;

  if (combined <= 1) return 'vulnerable';
  if (combined <= 2) return 'recovering';
  if (combined <= 3) return 'stable';
  if (combined <= 4) return 'strong';
  return 'resilient';
}

/** Déterminer le niveau de difficulté */
function determineDifficulty(input: ExtendedGritInput): DifficultyLevel {
  const grit = resolveLevel(input.gritLevel);
  const brs = resolveLevel(input.brsLevel);
  const energy = input.energyLevel ?? 50;
  const mood = input.moodScore ?? 50;

  // Score combiné (0-100)
  const combinedScore = ((grit / 5) * 25) + ((brs / 5) * 25) + (energy / 4) + (mood / 4);

  // Ajuster selon les préférences
  if (input.preferences?.preferredDifficulty) {
    return input.preferences.preferredDifficulty;
  }

  // Ajuster selon l'heure
  let adjustment = 0;
  if (input.timeOfDay === 'morning') adjustment = 5;
  if (input.timeOfDay === 'night') adjustment = -10;

  const finalScore = combinedScore + adjustment;

  if (finalScore <= 20) return 'gentle';
  if (finalScore <= 40) return 'easy';
  if (finalScore <= 60) return 'moderate';
  if (finalScore <= 80) return 'challenging';
  return 'intense';
}

/** Calculer la durée du défi */
function calculateDuration(difficulty: DifficultyLevel, input: ExtendedGritInput): number {
  const baseDurations: Record<DifficultyLevel, number> = {
    gentle: GENTLE_DURATION_MS,
    easy: SHORT_DURATION_MS,
    moderate: STANDARD_DURATION_MS,
    challenging: EXTENDED_DURATION_MS,
    intense: INTENSE_DURATION_MS
  };

  let duration = baseDurations[difficulty];

  // Ajuster selon les préférences
  if (input.preferences?.maxChallengeDuration) {
    duration = Math.min(duration, input.preferences.maxChallengeDuration);
  }

  // Réduire pour les utilisateurs vulnérables
  const grit = resolveLevel(input.gritLevel);
  const brs = resolveLevel(input.brsLevel);
  if (grit <= 1 || brs <= 1) {
    duration = Math.min(duration, SHORT_DURATION_MS);
  }

  return Math.max(config.minChallengeDuration, Math.min(duration, config.maxChallengeDuration));
}

/** Générer les actions de base */
function generateBaseActions(
  duration: number,
  difficulty: DifficultyLevel,
  resilienceState: ResilienceState
): ExtendedGritAction[] {
  const actions: ExtendedGritAction[] = [];

  // Action de durée
  actions.push({
    action: 'set_challenge_duration',
    ms: duration,
    actionType: 'set_challenge_duration',
    priority: 'high'
  });

  // Mode compassion pour les états vulnérables
  if (resilienceState === 'vulnerable' || resilienceState === 'recovering') {
    actions.push({
      action: 'enable_compassion_streak',
      enabled: true,
      actionType: 'enable_compassion_streak',
      priority: 'high'
    });
  }

  // Ajuster la difficulté
  actions.push({
    action: 'set_difficulty',
    difficulty,
    actionType: 'set_difficulty',
    priority: 'medium'
  } as ExtendedGritAction);

  return actions;
}

/** Générer les actions de support */
function generateSupportActions(
  difficulty: DifficultyLevel,
  input: ExtendedGritInput
): ExtendedGritAction[] {
  const actions: ExtendedGritAction[] = [];

  // Checkpoints pour les défis plus longs
  if (input.preferences?.enableCheckpoints !== false) {
    if (difficulty !== 'gentle' && difficulty !== 'easy') {
      actions.push({
        action: 'trigger_checkpoint',
        interval: config.checkpointInterval,
        actionType: 'trigger_checkpoint',
        priority: 'medium'
      } as ExtendedGritAction);
    }
  }

  // Encouragements pour les utilisateurs en difficulté
  if (input.preferences?.enableEncouragements !== false) {
    const grit = resolveLevel(input.gritLevel);
    if (grit <= 2) {
      actions.push({
        action: 'add_support',
        type: 'encouragement',
        frequency: config.encouragementFrequency,
        actionType: 'add_support',
        priority: 'medium'
      } as ExtendedGritAction);
    }
  }

  // Affichage de la progression
  if (input.preferences?.showProgress !== false) {
    actions.push({
      action: 'show_progress',
      enabled: true,
      actionType: 'show_progress',
      priority: 'low'
    } as ExtendedGritAction);
  }

  return actions;
}

/** Générer des recommandations */
function generateRecommendations(
  resilienceState: ResilienceState,
  difficulty: DifficultyLevel
): string[] {
  const recommendations: string[] = [];

  const stateRecommendations: Record<ResilienceState, string[]> = {
    vulnerable: [
      'Commence par de petites victoires',
      'N\'hésite pas à faire une pause',
      'Le mode compassion est activé pour t\'accompagner'
    ],
    recovering: [
      'Tu fais des progrès, continue à ton rythme',
      'Écoute ton corps et tes émotions',
      'Chaque effort compte'
    ],
    stable: [
      'Tu es dans un bon état pour relever ce défi',
      'Maintiens cette belle énergie',
      'Tu peux ajuster la difficulté si besoin'
    ],
    strong: [
      'Tu es en forme pour un beau défi',
      'Challenge-toi progressivement',
      'Ta résilience s\'est renforcée'
    ],
    resilient: [
      'Tu es au top de ta forme mentale !',
      'Profite de cette énergie positive',
      'Tu inspires les autres par ta détermination'
    ]
  };

  recommendations.push(...stateRecommendations[resilienceState]);

  return recommendations;
}

/** Orchestrateur principal (rétrocompatibilité) */
export function bossGritOrchestrator(
  { gritLevel, brsLevel }: BossGritOrchestratorInput
): BossGritOrchestrationAction[] {
  const result = orchestrateGrit({ gritLevel, brsLevel });
  return result.actions;
}

/** Orchestration complète */
export function orchestrateGrit(input: ExtendedGritInput): GritOrchestrationResult {
  const startTime = performance.now();
  stats.totalOrchestrations++;
  stats.lastOrchestration = Date.now();

  const grit = resolveLevel(input.gritLevel);
  const brs = resolveLevel(input.brsLevel);

  // Déterminer l'état et la difficulté
  const resilienceState = determineResilienceState(grit, brs);
  const difficulty = determineDifficulty(input);

  stats.byDifficulty[difficulty]++;
  stats.byResilienceState[resilienceState]++;

  // Calculer la durée
  const duration = calculateDuration(difficulty, input);

  // Générer les actions
  const baseActions = generateBaseActions(duration, difficulty, resilienceState);
  const supportActions = generateSupportActions(difficulty, input);
  const actions = [...baseActions, ...supportActions];

  // Générer les recommandations
  const recommendations = generateRecommendations(resilienceState, difficulty);

  // Facteurs d'input
  const inputFactors: string[] = [`grit:${grit}`, `brs:${brs}`];
  if (input.energyLevel !== undefined) inputFactors.push(`energy:${input.energyLevel}`);
  if (input.moodScore !== undefined) inputFactors.push(`mood:${input.moodScore}`);
  if (input.timeOfDay) inputFactors.push(`time:${input.timeOfDay}`);

  // Ajustements effectués
  const adjustmentsMade: string[] = [];
  if (resilienceState === 'vulnerable') adjustmentsMade.push('compassion_mode_enabled');
  if (input.preferences?.maxChallengeDuration) adjustmentsMade.push('duration_capped_by_preference');

  logger.info('Grit orchestration completed', {
    difficulty,
    resilienceState,
    duration: duration / 1000,
    actionsCount: actions.length
  }, 'ORCHESTRATOR');

  return {
    actions,
    difficulty,
    estimatedDuration: duration,
    resilienceState,
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
export function configureGritOrchestrator(userConfig: Partial<GritOrchestratorConfig>): void {
  config = { ...config, ...userConfig };
}

/** Obtenir la configuration */
export function getGritConfig(): GritOrchestratorConfig {
  return { ...config };
}

/** Obtenir les statistiques */
export function getGritStats(): GritOrchestratorStats {
  return { ...stats };
}

/** Réinitialiser les statistiques */
export function resetGritStats(): void {
  stats.totalOrchestrations = 0;
  stats.averageDuration = 0;
  stats.completionRate = 0;
  stats.lastOrchestration = null;

  for (const key of Object.keys(stats.byDifficulty) as DifficultyLevel[]) {
    stats.byDifficulty[key] = 0;
  }
  for (const key of Object.keys(stats.byResilienceState) as ResilienceState[]) {
    stats.byResilienceState[key] = 0;
  }
}

/** Obtenir la durée recommandée pour un niveau */
export function getRecommendedDuration(gritLevel: number, brsLevel: number): number {
  const result = orchestrateGrit({ gritLevel, brsLevel });
  return result.estimatedDuration;
}

/** Obtenir l'état de résilience */
export function getResilienceState(gritLevel: number, brsLevel: number): ResilienceState {
  return determineResilienceState(
    resolveLevel(gritLevel),
    resolveLevel(brsLevel)
  );
}

/** Constantes exportées */
export const DURATION_PRESETS = {
  GENTLE: GENTLE_DURATION_MS,
  SHORT: SHORT_DURATION_MS,
  STANDARD: STANDARD_DURATION_MS,
  EXTENDED: EXTENDED_DURATION_MS,
  INTENSE: INTENSE_DURATION_MS
};

export default bossGritOrchestrator;
