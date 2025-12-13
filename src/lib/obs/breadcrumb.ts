// @ts-nocheck
/**
 * Breadcrumb - Système de fil d'Ariane pour le debugging
 * Trace les actions utilisateur et événements système
 */

import { logger } from '@/lib/logger';
import { redact } from '@/lib/obs/redact';

/** Niveau de breadcrumb */
export type BreadcrumbLevel = 'debug' | 'info' | 'warning' | 'error' | 'fatal' | 'log';

/** Type de breadcrumb */
export type BreadcrumbType =
  | 'default'
  | 'navigation'
  | 'http'
  | 'ui'
  | 'user'
  | 'error'
  | 'query'
  | 'transaction'
  | 'info'
  | 'debug';

/** Options de breadcrumb */
export type BreadcrumbOptions = {
  message?: string;
  data?: Record<string, unknown> | undefined;
  level?: BreadcrumbLevel;
  type?: BreadcrumbType;
  timestamp?: number;
};

/** Breadcrumb complet */
export interface Breadcrumb {
  id: string;
  category: string;
  message: string;
  level: BreadcrumbLevel;
  type: BreadcrumbType;
  data?: Record<string, unknown>;
  timestamp: number;
}

/** Configuration du système de breadcrumbs */
export interface BreadcrumbConfig {
  maxBreadcrumbs: number;
  enabled: boolean;
  enabledLevels: BreadcrumbLevel[];
  enabledTypes: BreadcrumbType[];
  redactSensitiveData: boolean;
  autoCapture: {
    navigation: boolean;
    clicks: boolean;
    inputs: boolean;
    console: boolean;
    fetch: boolean;
    xhr: boolean;
  };
}

/** Stats des breadcrumbs */
export interface BreadcrumbStats {
  total: number;
  byLevel: Record<BreadcrumbLevel, number>;
  byType: Record<BreadcrumbType, number>;
  byCategory: Record<string, number>;
  oldestTimestamp: number | null;
  newestTimestamp: number | null;
}

// Configuration par défaut
const DEFAULT_CONFIG: BreadcrumbConfig = {
  maxBreadcrumbs: 100,
  enabled: true,
  enabledLevels: ['debug', 'info', 'warning', 'error', 'fatal', 'log'],
  enabledTypes: ['default', 'navigation', 'http', 'ui', 'user', 'error', 'query', 'transaction', 'info', 'debug'],
  redactSensitiveData: true,
  autoCapture: {
    navigation: true,
    clicks: true,
    inputs: false,
    console: false,
    fetch: true,
    xhr: true
  }
};

// État global
let config: BreadcrumbConfig = { ...DEFAULT_CONFIG };
const breadcrumbs: Breadcrumb[] = [];
const listeners: Array<(breadcrumb: Breadcrumb) => void> = [];
let idCounter = 0;

/** Générer un ID unique */
function generateId(): string {
  return `bc_${Date.now()}_${++idCounter}`;
}

/** Configurer le système de breadcrumbs */
export function configureBreadcrumbs(userConfig: Partial<BreadcrumbConfig>): void {
  config = { ...config, ...userConfig };
  logger.info('Breadcrumbs configured', { config }, 'BREADCRUMB');
}

/** Ajouter un breadcrumb */
export function addBreadcrumb(category: string, options: BreadcrumbOptions = {}): Breadcrumb | null {
  if (!config.enabled) return null;

  const level = options.level ?? 'info';
  const type = (options.type as BreadcrumbType) ?? 'default';

  // Vérifier si le niveau et le type sont activés
  if (!config.enabledLevels.includes(level)) return null;
  if (!config.enabledTypes.includes(type)) return null;

  // Sanitizer les données
  const sanitizedData = options.data && config.redactSensitiveData
    ? (redact(options.data) as Record<string, unknown>)
    : options.data;

  const breadcrumb: Breadcrumb = {
    id: generateId(),
    category,
    message: options.message ?? '',
    level,
    type,
    data: sanitizedData,
    timestamp: options.timestamp ?? Date.now()
  };

  // Ajouter et limiter la taille
  breadcrumbs.push(breadcrumb);
  while (breadcrumbs.length > config.maxBreadcrumbs) {
    breadcrumbs.shift();
  }

  // Notifier les listeners
  listeners.forEach(listener => listener(breadcrumb));

  // Logger selon le niveau
  const logLevel = level === 'warning' ? 'warn' : level === 'fatal' ? 'error' : level;
  if (logLevel === 'info' || logLevel === 'warn' || logLevel === 'error' || logLevel === 'debug') {
    logger[logLevel as 'info' | 'warn' | 'error' | 'debug'](
      breadcrumb.message || category,
      sanitizedData,
      category.toUpperCase()
    );
  }

  return breadcrumb;
}

/** Obtenir tous les breadcrumbs */
export function getBreadcrumbs(): Breadcrumb[] {
  return [...breadcrumbs];
}

/** Obtenir les derniers breadcrumbs */
export function getLastBreadcrumbs(count: number): Breadcrumb[] {
  return breadcrumbs.slice(-count);
}

/** Obtenir les breadcrumbs par catégorie */
export function getBreadcrumbsByCategory(category: string): Breadcrumb[] {
  return breadcrumbs.filter(b => b.category === category);
}

/** Obtenir les breadcrumbs par niveau */
export function getBreadcrumbsByLevel(level: BreadcrumbLevel): Breadcrumb[] {
  return breadcrumbs.filter(b => b.level === level);
}

/** Obtenir les breadcrumbs par type */
export function getBreadcrumbsByType(type: BreadcrumbType): Breadcrumb[] {
  return breadcrumbs.filter(b => b.type === type);
}

/** Obtenir les breadcrumbs dans un intervalle de temps */
export function getBreadcrumbsInRange(startTime: number, endTime: number): Breadcrumb[] {
  return breadcrumbs.filter(b => b.timestamp >= startTime && b.timestamp <= endTime);
}

/** Effacer tous les breadcrumbs */
export function clearBreadcrumbs(): void {
  breadcrumbs.length = 0;
  logger.debug('Breadcrumbs cleared', {}, 'BREADCRUMB');
}

/** Souscrire aux nouveaux breadcrumbs */
export function subscribeBreadcrumbs(listener: (breadcrumb: Breadcrumb) => void): () => void {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
}

/** Obtenir les stats des breadcrumbs */
export function getBreadcrumbStats(): BreadcrumbStats {
  const stats: BreadcrumbStats = {
    total: breadcrumbs.length,
    byLevel: {
      debug: 0,
      info: 0,
      warning: 0,
      error: 0,
      fatal: 0,
      log: 0
    },
    byType: {
      default: 0,
      navigation: 0,
      http: 0,
      ui: 0,
      user: 0,
      error: 0,
      query: 0,
      transaction: 0,
      info: 0,
      debug: 0
    },
    byCategory: {},
    oldestTimestamp: breadcrumbs[0]?.timestamp ?? null,
    newestTimestamp: breadcrumbs[breadcrumbs.length - 1]?.timestamp ?? null
  };

  for (const bc of breadcrumbs) {
    stats.byLevel[bc.level]++;
    stats.byType[bc.type]++;
    stats.byCategory[bc.category] = (stats.byCategory[bc.category] || 0) + 1;
  }

  return stats;
}

// Helpers pour types spécifiques

/** Ajouter un breadcrumb de navigation */
export function addNavigationBreadcrumb(from: string, to: string, data?: Record<string, unknown>): Breadcrumb | null {
  return addBreadcrumb('navigation', {
    message: `Navigated from ${from} to ${to}`,
    type: 'navigation',
    level: 'info',
    data: { from, to, ...data }
  });
}

/** Ajouter un breadcrumb HTTP */
export function addHttpBreadcrumb(
  method: string,
  url: string,
  statusCode?: number,
  data?: Record<string, unknown>
): Breadcrumb | null {
  const level: BreadcrumbLevel = statusCode && statusCode >= 400 ? 'error' : 'info';
  return addBreadcrumb('http', {
    message: `${method} ${url}${statusCode ? ` [${statusCode}]` : ''}`,
    type: 'http',
    level,
    data: { method, url, statusCode, ...data }
  });
}

/** Ajouter un breadcrumb UI */
export function addUIBreadcrumb(
  action: string,
  element?: string,
  data?: Record<string, unknown>
): Breadcrumb | null {
  return addBreadcrumb('ui', {
    message: `${action}${element ? ` on ${element}` : ''}`,
    type: 'ui',
    level: 'info',
    data: { action, element, ...data }
  });
}

/** Ajouter un breadcrumb utilisateur */
export function addUserBreadcrumb(
  action: string,
  userId?: string,
  data?: Record<string, unknown>
): Breadcrumb | null {
  return addBreadcrumb('user', {
    message: action,
    type: 'user',
    level: 'info',
    data: { action, userId, ...data }
  });
}

/** Ajouter un breadcrumb d'erreur */
export function addErrorBreadcrumb(
  error: Error | string,
  context?: Record<string, unknown>
): Breadcrumb | null {
  const errorData = error instanceof Error
    ? { name: error.name, message: error.message, stack: error.stack }
    : { message: error };

  return addBreadcrumb('error', {
    message: errorData.message,
    type: 'error',
    level: 'error',
    data: { error: errorData, context }
  });
}

/** Ajouter un breadcrumb de requête */
export function addQueryBreadcrumb(
  query: string,
  params?: unknown[],
  duration?: number,
  data?: Record<string, unknown>
): Breadcrumb | null {
  return addBreadcrumb('query', {
    message: query.slice(0, 100) + (query.length > 100 ? '...' : ''),
    type: 'query',
    level: 'debug',
    data: { query, params, duration, ...data }
  });
}

/** Ajouter un breadcrumb de transaction */
export function addTransactionBreadcrumb(
  name: string,
  status: 'start' | 'success' | 'failure',
  data?: Record<string, unknown>
): Breadcrumb | null {
  const level: BreadcrumbLevel = status === 'failure' ? 'error' : 'info';
  return addBreadcrumb('transaction', {
    message: `${name} - ${status}`,
    type: 'transaction',
    level,
    data: { name, status, ...data }
  });
}

/** Exporter les breadcrumbs en JSON */
export function exportBreadcrumbsJSON(): string {
  return JSON.stringify({
    breadcrumbs,
    stats: getBreadcrumbStats(),
    exportedAt: new Date().toISOString()
  }, null, 2);
}

/** Formater les breadcrumbs pour affichage */
export function formatBreadcrumbsForDisplay(): string {
  return breadcrumbs
    .map(b => {
      const time = new Date(b.timestamp).toISOString();
      return `[${time}] [${b.level.toUpperCase()}] [${b.category}] ${b.message}`;
    })
    .join('\n');
}

// Auto-capture setup
if (typeof window !== 'undefined') {
  // Navigation
  if (config.autoCapture.navigation) {
    window.addEventListener('popstate', () => {
      addNavigationBreadcrumb('history', window.location.pathname);
    });
  }

  // Clicks
  if (config.autoCapture.clicks) {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target) {
        const tagName = target.tagName?.toLowerCase();
        const id = target.id ? `#${target.id}` : '';
        const classes = target.className ? `.${target.className.split(' ').join('.')}` : '';
        addUIBreadcrumb('click', `${tagName}${id}${classes}`);
      }
    }, { passive: true, capture: true });
  }
}

export default {
  configureBreadcrumbs,
  addBreadcrumb,
  getBreadcrumbs,
  getLastBreadcrumbs,
  getBreadcrumbsByCategory,
  getBreadcrumbsByLevel,
  getBreadcrumbsByType,
  getBreadcrumbsInRange,
  clearBreadcrumbs,
  subscribeBreadcrumbs,
  getBreadcrumbStats,
  addNavigationBreadcrumb,
  addHttpBreadcrumb,
  addUIBreadcrumb,
  addUserBreadcrumb,
  addErrorBreadcrumb,
  addQueryBreadcrumb,
  addTransactionBreadcrumb,
  exportBreadcrumbsJSON,
  formatBreadcrumbsForDisplay
};
