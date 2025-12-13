// @ts-nocheck

import { hasConsent } from "@/ui/CookieConsent";
import { logger } from '@/lib/logger';

/** Type d'événement analytics */
export type EventCategory =
  | 'page_view'
  | 'user_action'
  | 'feature_usage'
  | 'conversion'
  | 'error'
  | 'performance'
  | 'engagement'
  | 'custom';

/** Priorité d'événement */
export type EventPriority = 'critical' | 'high' | 'medium' | 'low';

/** Options d'événement */
export interface TrackEventOptions {
  properties?: Record<string, unknown>;
  anonymous?: boolean;
  category?: EventCategory;
  priority?: EventPriority;
  userId?: string;
  sessionId?: string;
  timestamp?: Date;
  metadata?: Record<string, unknown>;
}

/** Événement analytics */
export interface AnalyticsEvent {
  id: string;
  name: string;
  category: EventCategory;
  priority: EventPriority;
  properties: Record<string, unknown>;
  userId?: string;
  sessionId: string;
  timestamp: Date;
  anonymous: boolean;
  metadata?: Record<string, unknown>;
}

/** Configuration analytics */
export interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
  batchSize: number;
  flushInterval: number;
  endpoint?: string;
  apiKey?: string;
  sampleRate: number;
  excludeEvents?: string[];
  gdprCompliant: boolean;
  sessionTimeout: number;
}

/** Stats analytics */
export interface AnalyticsStats {
  totalEvents: number;
  eventsByCategory: Record<EventCategory, number>;
  eventsToday: number;
  lastEventAt: Date | null;
  sessionCount: number;
  uniqueUsers: number;
}

/** Contexte utilisateur */
export interface UserContext {
  userId?: string;
  traits?: Record<string, unknown>;
  anonymous: boolean;
}

const DEFAULT_CONFIG: AnalyticsConfig = {
  enabled: true,
  debug: process.env.NODE_ENV === 'development',
  batchSize: 10,
  flushInterval: 30000,
  sampleRate: 1.0,
  gdprCompliant: true,
  sessionTimeout: 30 * 60 * 1000
};

// État global
let config: AnalyticsConfig = { ...DEFAULT_CONFIG };
let sessionId: string = generateSessionId();
let sessionStart: Date = new Date();
let userContext: UserContext = { anonymous: true };
let eventQueue: AnalyticsEvent[] = [];
let flushTimer: NodeJS.Timeout | null = null;

const stats: AnalyticsStats = {
  totalEvents: 0,
  eventsByCategory: {
    page_view: 0,
    user_action: 0,
    feature_usage: 0,
    conversion: 0,
    error: 0,
    performance: 0,
    engagement: 0,
    custom: 0
  },
  eventsToday: 0,
  lastEventAt: null,
  sessionCount: 1,
  uniqueUsers: 0
};

/** Générer un ID de session */
function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/** Générer un ID d'événement */
function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/** Vérifier si l'échantillonnage permet l'événement */
function shouldSample(): boolean {
  return Math.random() < config.sampleRate;
}

/** Vérifier si l'événement est exclu */
function isExcluded(eventName: string): boolean {
  return config.excludeEvents?.includes(eventName) ?? false;
}

/** Initialiser l'analytics */
export function initAnalytics(userConfig?: Partial<AnalyticsConfig>): void {
  config = { ...DEFAULT_CONFIG, ...userConfig };

  // Démarrer le flush périodique
  if (flushTimer) clearInterval(flushTimer);
  if (config.flushInterval > 0) {
    flushTimer = setInterval(() => flush(), config.flushInterval);
  }

  // Écouter les changements de visibilité pour la session
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  // Écouter beforeunload pour flush final
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => flush(true));
  }

  logger.info('Analytics initialized', { config }, 'ANALYTICS');
}

/** Gérer les changements de visibilité */
function handleVisibilityChange(): void {
  if (document.visibilityState === 'visible') {
    const now = new Date();
    const sessionAge = now.getTime() - sessionStart.getTime();

    // Nouvelle session si timeout dépassé
    if (sessionAge > config.sessionTimeout) {
      sessionId = generateSessionId();
      sessionStart = now;
      stats.sessionCount++;
      trackEvent('session_start', { category: 'engagement' });
    }
  }
}

/** Définir le contexte utilisateur */
export function identify(userId: string, traits?: Record<string, unknown>): void {
  userContext = {
    userId,
    traits,
    anonymous: false
  };

  trackEvent('user_identified', {
    category: 'user_action',
    properties: { userId, ...traits }
  });

  logger.info('User identified', { userId }, 'ANALYTICS');
}

/** Réinitialiser le contexte utilisateur */
export function reset(): void {
  userContext = { anonymous: true };
  sessionId = generateSessionId();
  sessionStart = new Date();
  stats.sessionCount++;
}

/** Tracker un événement */
export const trackEvent = (eventName: string, options: TrackEventOptions = {}): void => {
  // Vérifications préliminaires
  if (!config.enabled) return;
  if (config.gdprCompliant && !hasConsent("analytics")) return;
  if (isExcluded(eventName)) return;
  if (!shouldSample()) return;

  const event: AnalyticsEvent = {
    id: generateEventId(),
    name: eventName,
    category: options.category || 'custom',
    priority: options.priority || 'medium',
    properties: options.properties || {},
    userId: options.userId || userContext.userId,
    sessionId: options.sessionId || sessionId,
    timestamp: options.timestamp || new Date(),
    anonymous: options.anonymous ?? userContext.anonymous,
    metadata: options.metadata
  };

  // Ajouter à la queue
  eventQueue.push(event);

  // Mettre à jour les stats
  stats.totalEvents++;
  stats.eventsByCategory[event.category]++;
  stats.eventsToday++;
  stats.lastEventAt = event.timestamp;

  // Log en mode debug
  if (config.debug) {
    logger.info('📊 Analytics Event', { event }, 'ANALYTICS');
  }

  // Flush si la queue est pleine
  if (eventQueue.length >= config.batchSize) {
    flush();
  }

  // Envoyer les événements critiques immédiatement
  if (event.priority === 'critical') {
    flush();
  }
};

/** Tracker une page vue */
export const trackPageView = (page: string, properties?: Record<string, unknown>): void => {
  trackEvent('page_view', {
    category: 'page_view',
    properties: {
      page,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      title: typeof document !== 'undefined' ? document.title : undefined,
      ...properties
    }
  });
};

/** Tracker une action utilisateur */
export const trackUserAction = (
  action: string,
  target?: string,
  properties?: Record<string, unknown>
): void => {
  trackEvent(action, {
    category: 'user_action',
    properties: { target, ...properties }
  });
};

/** Tracker une utilisation de fonctionnalité */
export const trackFeatureUsage = (
  feature: string,
  properties?: Record<string, unknown>
): void => {
  trackEvent('feature_used', {
    category: 'feature_usage',
    properties: { feature, ...properties }
  });
};

/** Tracker une conversion */
export const trackConversion = (
  conversionType: string,
  value?: number,
  properties?: Record<string, unknown>
): void => {
  trackEvent('conversion', {
    category: 'conversion',
    priority: 'high',
    properties: { type: conversionType, value, ...properties }
  });
};

/** Tracker une erreur */
export const trackError = (
  error: Error | string,
  context?: Record<string, unknown>
): void => {
  const errorData = error instanceof Error
    ? { message: error.message, stack: error.stack, name: error.name }
    : { message: error };

  trackEvent('error', {
    category: 'error',
    priority: 'high',
    properties: { error: errorData, context }
  });
};

/** Tracker une métrique de performance */
export const trackPerformance = (
  metric: string,
  value: number,
  unit: string = 'ms'
): void => {
  trackEvent('performance_metric', {
    category: 'performance',
    properties: { metric, value, unit }
  });
};

/** Tracker le temps passé */
export const trackTimeSpent = (
  context: string,
  durationMs: number
): void => {
  trackEvent('time_spent', {
    category: 'engagement',
    properties: { context, duration_ms: durationMs, duration_s: durationMs / 1000 }
  });
};

/** Tracker un événement personnalisé avec timing */
export function createTimer(eventName: string): () => void {
  const startTime = performance.now();

  return () => {
    const duration = performance.now() - startTime;
    trackEvent(eventName, {
      category: 'performance',
      properties: { duration_ms: Math.round(duration) }
    });
  };
}

/** Flush les événements vers le backend */
export async function flush(sync: boolean = false): Promise<void> {
  if (eventQueue.length === 0) return;

  const eventsToSend = [...eventQueue];
  eventQueue = [];

  if (config.endpoint && config.apiKey) {
    try {
      const sendData = async () => {
        await fetch(config.endpoint!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
          },
          body: JSON.stringify({ events: eventsToSend }),
          keepalive: sync
        });
      };

      if (sync && navigator.sendBeacon) {
        navigator.sendBeacon(
          config.endpoint,
          JSON.stringify({ events: eventsToSend })
        );
      } else {
        await sendData();
      }

      logger.debug('Analytics flushed', { count: eventsToSend.length }, 'ANALYTICS');
    } catch (err) {
      logger.error('Analytics flush failed', err as Error, 'ANALYTICS');
      // Remettre les événements dans la queue en cas d'échec
      eventQueue = [...eventsToSend, ...eventQueue].slice(0, 1000);
    }
  } else if (config.debug) {
    logger.debug('Analytics events (no endpoint)', { events: eventsToSend }, 'ANALYTICS');
  }
}

/** Obtenir les stats */
export function getAnalyticsStats(): AnalyticsStats {
  return { ...stats };
}

/** Obtenir la queue d'événements */
export function getEventQueue(): AnalyticsEvent[] {
  return [...eventQueue];
}

/** Obtenir l'ID de session */
export function getSessionId(): string {
  return sessionId;
}

/** Obtenir le contexte utilisateur */
export function getUserContext(): UserContext {
  return { ...userContext };
}

/** Désactiver l'analytics */
export function disableAnalytics(): void {
  config.enabled = false;
  if (flushTimer) {
    clearInterval(flushTimer);
    flushTimer = null;
  }
}

/** Réactiver l'analytics */
export function enableAnalytics(): void {
  config.enabled = true;
  if (!flushTimer && config.flushInterval > 0) {
    flushTimer = setInterval(() => flush(), config.flushInterval);
  }
}

/** Effacer les données locales (GDPR) */
export function clearAnalyticsData(): void {
  eventQueue = [];
  stats.totalEvents = 0;
  stats.eventsToday = 0;
  Object.keys(stats.eventsByCategory).forEach(key => {
    stats.eventsByCategory[key as EventCategory] = 0;
  });
  stats.lastEventAt = null;
  reset();
  logger.info('Analytics data cleared', {}, 'ANALYTICS');
}

export default {
  init: initAnalytics,
  track: trackEvent,
  trackPageView,
  trackUserAction,
  trackFeatureUsage,
  trackConversion,
  trackError,
  trackPerformance,
  trackTimeSpent,
  createTimer,
  identify,
  reset,
  flush,
  getStats: getAnalyticsStats,
  disable: disableAnalytics,
  enable: enableAnalytics,
  clearData: clearAnalyticsData
};
