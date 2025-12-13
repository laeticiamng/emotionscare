// @ts-nocheck
/**
 * Feature Flags - Système de feature flags
 * Gestion des fonctionnalités activables/désactivables
 */

import flags from "./flags.json" assert { type: "json" };

/** Types de feature flags */
export type FeatureFlagType = 'boolean' | 'percentage' | 'variant' | 'user_list';

/** Environnement */
export type Environment = 'development' | 'staging' | 'production' | 'test';

/** Configuration d'un flag */
export interface FeatureFlagConfig {
  name: string;
  description?: string;
  type: FeatureFlagType;
  defaultValue: boolean;
  enabled: boolean;
  percentage?: number;
  variants?: string[];
  userList?: string[];
  environments?: Environment[];
  startDate?: string;
  endDate?: string;
  metadata?: Record<string, unknown>;
}

/** Contexte d'évaluation */
export interface EvaluationContext {
  userId?: string;
  environment?: Environment;
  attributes?: Record<string, unknown>;
  timestamp?: number;
}

/** Résultat d'évaluation */
export interface EvaluationResult {
  enabled: boolean;
  variant?: string;
  reason: EvaluationReason;
  timestamp: number;
}

/** Raison de l'évaluation */
export type EvaluationReason =
  | 'default'
  | 'user_targeted'
  | 'percentage_rollout'
  | 'environment_match'
  | 'date_range'
  | 'override'
  | 'disabled';

/** Statistiques des flags */
export interface FlagStats {
  totalFlags: number;
  enabledFlags: number;
  disabledFlags: number;
  evaluations: number;
  evaluationsByFlag: Record<string, number>;
  lastEvaluation: number | null;
}

/** Override de flag */
export interface FlagOverride {
  flagName: string;
  value: boolean;
  userId?: string;
  expiresAt?: number;
}

// Configuration globale
interface GlobalConfig {
  environment: Environment;
  defaultEnabled: boolean;
  cacheEnabled: boolean;
  cacheTTL: number;
  logEnabled: boolean;
}

const globalConfig: GlobalConfig = {
  environment: 'development',
  defaultEnabled: false,
  cacheEnabled: true,
  cacheTTL: 60000,
  logEnabled: false
};

// Cache des évaluations
const evaluationCache = new Map<string, { result: boolean; timestamp: number }>();

// Overrides
const overrides = new Map<string, FlagOverride>();

// Statistiques
const stats: FlagStats = {
  totalFlags: Object.keys(flags).length,
  enabledFlags: 0,
  disabledFlags: 0,
  evaluations: 0,
  evaluationsByFlag: {},
  lastEvaluation: null
};

// Initialiser les stats
Object.entries(flags).forEach(([name, value]) => {
  if (value) {
    stats.enabledFlags++;
  } else {
    stats.disabledFlags++;
  }
  stats.evaluationsByFlag[name] = 0;
});

/** Configurer le système de flags */
export function configureFlags(config: Partial<GlobalConfig>): void {
  Object.assign(globalConfig, config);
}

/** Obtenir la configuration */
export function getFlagsConfig(): GlobalConfig {
  return { ...globalConfig };
}

/** Générer une clé de cache */
function getCacheKey(name: string, context?: EvaluationContext): string {
  return context?.userId ? `${name}:${context.userId}` : name;
}

/** Vérifier le cache */
function checkCache(key: string): boolean | null {
  if (!globalConfig.cacheEnabled) return null;

  const cached = evaluationCache.get(key);
  if (cached && Date.now() - cached.timestamp < globalConfig.cacheTTL) {
    return cached.result;
  }

  return null;
}

/** Mettre en cache */
function setCache(key: string, result: boolean): void {
  if (globalConfig.cacheEnabled) {
    evaluationCache.set(key, { result, timestamp: Date.now() });
  }
}

/** Fonction principale de feature flag */
export function ff(name: keyof typeof flags, context?: EvaluationContext): boolean {
  // Vérifier les overrides
  const override = overrides.get(name as string);
  if (override) {
    if (!override.expiresAt || override.expiresAt > Date.now()) {
      if (!override.userId || override.userId === context?.userId) {
        return override.value;
      }
    } else {
      overrides.delete(name as string);
    }
  }

  // Vérifier le cache
  const cacheKey = getCacheKey(name as string, context);
  const cached = checkCache(cacheKey);
  if (cached !== null) {
    return cached;
  }

  // Évaluer le flag
  const result = Boolean((flags as Record<string, boolean>)[name]);

  // Mettre en cache
  setCache(cacheKey, result);

  // Mettre à jour les stats
  stats.evaluations++;
  stats.evaluationsByFlag[name as string] = (stats.evaluationsByFlag[name as string] || 0) + 1;
  stats.lastEvaluation = Date.now();

  if (globalConfig.logEnabled) {
    console.log(`[FeatureFlag] ${name}: ${result}`);
  }

  return result;
}

/** Évaluer avec contexte complet */
export function evaluate(
  name: string,
  context?: EvaluationContext
): EvaluationResult {
  const enabled = ff(name as keyof typeof flags, context);

  return {
    enabled,
    reason: 'default',
    timestamp: Date.now()
  };
}

/** Vérifier si un flag existe */
export function hasFlag(name: string): boolean {
  return name in flags;
}

/** Obtenir tous les flags */
export function getAllFlags(): Record<string, boolean> {
  return { ...flags } as Record<string, boolean>;
}

/** Obtenir les flags activés */
export function getEnabledFlags(): string[] {
  return Object.entries(flags)
    .filter(([, value]) => value)
    .map(([name]) => name);
}

/** Obtenir les flags désactivés */
export function getDisabledFlags(): string[] {
  return Object.entries(flags)
    .filter(([, value]) => !value)
    .map(([name]) => name);
}

/** Ajouter un override */
export function setOverride(
  flagName: string,
  value: boolean,
  options?: { userId?: string; expiresAt?: number }
): void {
  overrides.set(flagName, {
    flagName,
    value,
    userId: options?.userId,
    expiresAt: options?.expiresAt
  });

  // Invalider le cache
  if (options?.userId) {
    evaluationCache.delete(`${flagName}:${options.userId}`);
  } else {
    evaluationCache.delete(flagName);
  }
}

/** Supprimer un override */
export function removeOverride(flagName: string): boolean {
  return overrides.delete(flagName);
}

/** Supprimer tous les overrides */
export function clearOverrides(): void {
  overrides.clear();
}

/** Obtenir les overrides */
export function getOverrides(): FlagOverride[] {
  return Array.from(overrides.values());
}

/** Vider le cache */
export function clearCache(): void {
  evaluationCache.clear();
}

/** Obtenir les statistiques */
export function getStats(): FlagStats {
  return { ...stats };
}

/** Réinitialiser les statistiques */
export function resetStats(): void {
  stats.evaluations = 0;
  stats.lastEvaluation = null;
  for (const key of Object.keys(stats.evaluationsByFlag)) {
    stats.evaluationsByFlag[key] = 0;
  }
}

/** Vérifier plusieurs flags */
export function checkFlags(
  names: string[],
  context?: EvaluationContext
): Record<string, boolean> {
  const results: Record<string, boolean> = {};
  for (const name of names) {
    results[name] = ff(name as keyof typeof flags, context);
  }
  return results;
}

/** Vérifier si tous les flags sont activés */
export function allEnabled(names: string[], context?: EvaluationContext): boolean {
  return names.every(name => ff(name as keyof typeof flags, context));
}

/** Vérifier si au moins un flag est activé */
export function anyEnabled(names: string[], context?: EvaluationContext): boolean {
  return names.some(name => ff(name as keyof typeof flags, context));
}

/** Écouter les changements de flags */
type FlagChangeListener = (flagName: string, newValue: boolean) => void;
const listeners: FlagChangeListener[] = [];

export function onFlagChange(listener: FlagChangeListener): () => void {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index >= 0) listeners.splice(index, 1);
  };
}

/** Notifier les listeners */
function notifyListeners(flagName: string, newValue: boolean): void {
  listeners.forEach(listener => listener(flagName, newValue));
}

/** Wrapper conditionnel */
export function withFeatureFlag<T>(
  flagName: string,
  enabledValue: T,
  disabledValue: T,
  context?: EvaluationContext
): T {
  return ff(flagName as keyof typeof flags, context) ? enabledValue : disabledValue;
}

/** Exécuter si le flag est activé */
export async function ifEnabled<T>(
  flagName: string,
  callback: () => T | Promise<T>,
  context?: EvaluationContext
): Promise<T | undefined> {
  if (ff(flagName as keyof typeof flags, context)) {
    return callback();
  }
  return undefined;
}

export default ff;
