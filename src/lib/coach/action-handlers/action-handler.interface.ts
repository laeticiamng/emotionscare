// @ts-nocheck
/**
 * Action Handler Interface - Interface pour les gestionnaires d'actions du coach
 * Définition des types, contextes et comportements des handlers d'actions
 */

import { logger } from '@/lib/logger';

/** Types d'actions supportées */
export type ActionHandlerType =
  | 'notify'
  | 'schedule'
  | 'recommend'
  | 'analyze'
  | 'remind'
  | 'celebrate'
  | 'challenge'
  | 'meditation'
  | 'breathing'
  | 'activity'
  | 'social'
  | 'feedback'
  | 'goal'
  | 'custom';

/** Priorité de l'action */
export type ActionHandlerPriority = 'low' | 'medium' | 'high' | 'urgent';

/** Statut du handler */
export type HandlerStatus = 'idle' | 'executing' | 'completed' | 'failed' | 'disabled';

/** Contexte d'exécution */
export interface ExecutionContext {
  userId: string;
  sessionId?: string;
  timestamp: number;
  source?: 'user' | 'system' | 'scheduler' | 'ai';
  priority?: ActionHandlerPriority;
  metadata?: Record<string, unknown>;
  previousActions?: string[];
  userState?: UserExecutionState;
  environment?: EnvironmentContext;
}

/** État utilisateur pour l'exécution */
export interface UserExecutionState {
  currentMood?: string;
  energyLevel?: number;
  stressLevel?: number;
  lastActivity?: string;
  preferences?: Record<string, unknown>;
}

/** Contexte environnemental */
export interface EnvironmentContext {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: number;
  isWeekend: boolean;
  locale?: string;
  timezone?: string;
}

/** Résultat d'exécution */
export interface ExecutionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: ExecutionError;
  duration: number;
  timestamp: number;
  actionType: ActionHandlerType;
  metadata?: Record<string, unknown>;
}

/** Erreur d'exécution */
export interface ExecutionError {
  code: string;
  message: string;
  details?: unknown;
  retryable: boolean;
  suggestion?: string;
}

/** Configuration du handler */
export interface HandlerConfig {
  enabled: boolean;
  timeout: number;
  retryCount: number;
  retryDelay: number;
  validatePayload: boolean;
  logExecution: boolean;
  cacheResults: boolean;
  cacheDuration: number;
  rateLimitPerMinute?: number;
  requiredPermissions?: string[];
}

/** Métadonnées du handler */
export interface HandlerMetadata {
  name: string;
  description: string;
  version: string;
  author?: string;
  tags?: string[];
  category?: string;
  dependencies?: string[];
  createdAt: string;
  updatedAt: string;
}

/** Statistiques du handler */
export interface HandlerStats {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number;
  lastExecutionTime: number | null;
  lastSuccessTime: number | null;
  lastFailureTime: number | null;
  executionsByUser: Map<string, number>;
}

/** Options de validation */
export interface ValidationOptions {
  strict: boolean;
  allowExtraFields: boolean;
  requiredFields: string[];
  maxPayloadSize: number;
}

/** Schéma de payload */
export interface PayloadSchema {
  type: 'object' | 'array' | 'string' | 'number' | 'boolean';
  properties?: Record<string, PropertySchema>;
  required?: string[];
  additionalProperties?: boolean;
}

/** Schéma de propriété */
export interface PropertySchema {
  type: string;
  description?: string;
  required?: boolean;
  default?: unknown;
  enum?: unknown[];
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

/** Hook d'exécution */
export interface ExecutionHook {
  name: string;
  phase: 'before' | 'after' | 'error';
  handler: (context: HookContext) => void | Promise<void>;
  priority?: number;
}

/** Contexte de hook */
export interface HookContext {
  actionType: ActionHandlerType;
  phase: 'before' | 'after' | 'error';
  context: ExecutionContext;
  payload?: unknown;
  result?: ExecutionResult;
  error?: Error;
  timestamp: number;
}

/** Interface principale du handler d'action */
export interface ActionHandler<TPayload = unknown, TResult = unknown> {
  /** Type d'action géré */
  actionType: ActionHandlerType | string;

  /** Exécuter l'action */
  execute(userId: string, payload?: TPayload, context?: ExecutionContext): void | Promise<ExecutionResult<TResult>>;

  /** Valider le payload (optionnel) */
  validate?(payload: TPayload): boolean | ValidationResult;

  /** Configurer le handler (optionnel) */
  configure?(config: Partial<HandlerConfig>): void;

  /** Obtenir la configuration (optionnel) */
  getConfig?(): HandlerConfig;

  /** Obtenir les métadonnées (optionnel) */
  getMetadata?(): HandlerMetadata;

  /** Obtenir les statistiques (optionnel) */
  getStats?(): HandlerStats;

  /** Réinitialiser le handler (optionnel) */
  reset?(): void;

  /** Vérifier si le handler peut exécuter (optionnel) */
  canExecute?(context: ExecutionContext): boolean;

  /** Obtenir le schéma du payload (optionnel) */
  getPayloadSchema?(): PayloadSchema;
}

/** Résultat de validation */
export interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
  warnings?: string[];
}

/** Erreur de validation */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

/** Classe de base abstraite pour les handlers */
export abstract class BaseActionHandler<TPayload = unknown, TResult = unknown>
  implements ActionHandler<TPayload, TResult> {
  abstract actionType: ActionHandlerType | string;

  protected config: HandlerConfig = {
    enabled: true,
    timeout: 30000,
    retryCount: 3,
    retryDelay: 1000,
    validatePayload: true,
    logExecution: true,
    cacheResults: false,
    cacheDuration: 300000
  };

  protected stats: HandlerStats = {
    totalExecutions: 0,
    successfulExecutions: 0,
    failedExecutions: 0,
    averageExecutionTime: 0,
    lastExecutionTime: null,
    lastSuccessTime: null,
    lastFailureTime: null,
    executionsByUser: new Map()
  };

  protected hooks: ExecutionHook[] = [];
  protected cache = new Map<string, { result: TResult; timestamp: number }>();

  abstract execute(
    userId: string,
    payload?: TPayload,
    context?: ExecutionContext
  ): Promise<ExecutionResult<TResult>>;

  validate(payload: TPayload): boolean | ValidationResult {
    return true;
  }

  configure(config: Partial<HandlerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): HandlerConfig {
    return { ...this.config };
  }

  getStats(): HandlerStats {
    return {
      ...this.stats,
      executionsByUser: new Map(this.stats.executionsByUser)
    };
  }

  reset(): void {
    this.stats = {
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      averageExecutionTime: 0,
      lastExecutionTime: null,
      lastSuccessTime: null,
      lastFailureTime: null,
      executionsByUser: new Map()
    };
    this.cache.clear();
  }

  canExecute(context: ExecutionContext): boolean {
    return this.config.enabled;
  }

  protected async runHooks(phase: 'before' | 'after' | 'error', hookContext: HookContext): Promise<void> {
    const phaseHooks = this.hooks
      .filter(h => h.phase === phase)
      .sort((a, b) => (a.priority || 0) - (b.priority || 0));

    for (const hook of phaseHooks) {
      try {
        await hook.handler(hookContext);
      } catch (error) {
        logger.error(`Hook ${hook.name} failed`, { error, phase }, 'ACTION_HANDLER');
      }
    }
  }

  protected updateStats(duration: number, success: boolean, userId: string): void {
    this.stats.totalExecutions++;
    this.stats.lastExecutionTime = Date.now();

    if (success) {
      this.stats.successfulExecutions++;
      this.stats.lastSuccessTime = Date.now();
    } else {
      this.stats.failedExecutions++;
      this.stats.lastFailureTime = Date.now();
    }

    // Mettre à jour le temps moyen
    this.stats.averageExecutionTime =
      (this.stats.averageExecutionTime * (this.stats.totalExecutions - 1) + duration) /
      this.stats.totalExecutions;

    // Comptage par utilisateur
    const userCount = this.stats.executionsByUser.get(userId) || 0;
    this.stats.executionsByUser.set(userId, userCount + 1);
  }

  protected getCacheKey(userId: string, payload?: TPayload): string {
    return `${this.actionType}-${userId}-${JSON.stringify(payload || {})}`;
  }

  protected getCachedResult(key: string): TResult | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.config.cacheDuration) {
      return cached.result;
    }
    this.cache.delete(key);
    return null;
  }

  protected setCachedResult(key: string, result: TResult): void {
    this.cache.set(key, { result, timestamp: Date.now() });
  }

  addHook(hook: ExecutionHook): void {
    this.hooks.push(hook);
  }

  removeHook(name: string): boolean {
    const index = this.hooks.findIndex(h => h.name === name);
    if (index >= 0) {
      this.hooks.splice(index, 1);
      return true;
    }
    return false;
  }
}

/** Configuration par défaut */
export const DEFAULT_HANDLER_CONFIG: HandlerConfig = {
  enabled: true,
  timeout: 30000,
  retryCount: 3,
  retryDelay: 1000,
  validatePayload: true,
  logExecution: true,
  cacheResults: false,
  cacheDuration: 300000
};

/** Options de validation par défaut */
export const DEFAULT_VALIDATION_OPTIONS: ValidationOptions = {
  strict: false,
  allowExtraFields: true,
  requiredFields: [],
  maxPayloadSize: 1024 * 1024 // 1MB
};

/** Registre global des handlers */
const handlerRegistry = new Map<string, ActionHandler>();

/** Enregistrer un handler */
export function registerHandler(handler: ActionHandler): void {
  handlerRegistry.set(handler.actionType, handler);
  logger.info(`Handler registered: ${handler.actionType}`, {}, 'ACTION_HANDLER');
}

/** Obtenir un handler */
export function getHandler(actionType: string): ActionHandler | undefined {
  return handlerRegistry.get(actionType);
}

/** Supprimer un handler */
export function unregisterHandler(actionType: string): boolean {
  const deleted = handlerRegistry.delete(actionType);
  if (deleted) {
    logger.info(`Handler unregistered: ${actionType}`, {}, 'ACTION_HANDLER');
  }
  return deleted;
}

/** Lister tous les handlers */
export function listHandlers(): string[] {
  return Array.from(handlerRegistry.keys());
}

/** Vérifier si un handler existe */
export function hasHandler(actionType: string): boolean {
  return handlerRegistry.has(actionType);
}

/** Exécuter via le registre */
export async function executeViaRegistry<T>(
  actionType: string,
  userId: string,
  payload?: unknown,
  context?: ExecutionContext
): Promise<ExecutionResult<T> | null> {
  const handler = handlerRegistry.get(actionType);
  if (!handler) {
    logger.warn(`No handler found for action type: ${actionType}`, {}, 'ACTION_HANDLER');
    return null;
  }

  const result = await handler.execute(userId, payload, context);
  return result as ExecutionResult<T>;
}

/** Créer un contexte d'exécution */
export function createExecutionContext(
  userId: string,
  options?: Partial<ExecutionContext>
): ExecutionContext {
  return {
    userId,
    timestamp: Date.now(),
    source: 'system',
    priority: 'medium',
    ...options
  };
}

/** Créer un résultat de succès */
export function createSuccessResult<T>(
  actionType: ActionHandlerType,
  data: T,
  duration: number
): ExecutionResult<T> {
  return {
    success: true,
    data,
    duration,
    timestamp: Date.now(),
    actionType
  };
}

/** Créer un résultat d'erreur */
export function createErrorResult(
  actionType: ActionHandlerType,
  error: ExecutionError,
  duration: number
): ExecutionResult {
  return {
    success: false,
    error,
    duration,
    timestamp: Date.now(),
    actionType
  };
}

export default {
  registerHandler,
  getHandler,
  unregisterHandler,
  listHandlers,
  hasHandler,
  executeViaRegistry,
  createExecutionContext,
  createSuccessResult,
  createErrorResult,
  DEFAULT_HANDLER_CONFIG,
  DEFAULT_VALIDATION_OPTIONS
};
