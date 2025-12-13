// @ts-nocheck
/**
 * Session Events - Gestion des événements de session
 * Enregistrement, analyse et export des événements utilisateur
 */

import { SessionEvent } from "@/SCHEMA";
import { logger } from '@/lib/logger';

const KEY = "ec_session_events_v2";
const SETTINGS_KEY = "ec_events_settings";
const MAX_EVENTS = 10000;

/** Type d'événement étendu */
export type ExtendedEventType =
  | 'session_start'
  | 'session_end'
  | 'page_view'
  | 'interaction'
  | 'milestone'
  | 'achievement'
  | 'error'
  | 'score_update'
  | 'level_up'
  | 'custom';

/** Événement étendu */
export interface ExtendedSessionEvent extends SessionEvent {
  type?: ExtendedEventType;
  category?: string;
  value?: number;
  metadata?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
  duration?: number;
}

/** Agrégation d'événements */
export interface EventAggregation {
  count: number;
  totalValue: number;
  averageValue: number;
  minValue: number;
  maxValue: number;
  firstOccurrence: number;
  lastOccurrence: number;
}

/** Stats d'événements */
export interface EventStats {
  total: number;
  byType: Record<string, number>;
  byCategory: Record<string, number>;
  byDay: Record<string, number>;
  byHour: Record<number, number>;
  averagePerDay: number;
  peakHour: number;
  oldestEvent: number | null;
  newestEvent: number | null;
}

/** Filtres d'événements */
export interface EventFilters {
  type?: ExtendedEventType[];
  category?: string[];
  startDate?: number;
  endDate?: number;
  userId?: string;
  sessionId?: string;
  minValue?: number;
  maxValue?: number;
}

/** Configuration des événements */
export interface EventsConfig {
  maxEvents: number;
  autoCleanup: boolean;
  cleanupAfterDays: number;
  enablePersistence: boolean;
  batchSize: number;
  flushInterval: number;
}

// Configuration par défaut
const DEFAULT_CONFIG: EventsConfig = {
  maxEvents: MAX_EVENTS,
  autoCleanup: true,
  cleanupAfterDays: 30,
  enablePersistence: true,
  batchSize: 50,
  flushInterval: 5000
};

// État global
let config: EventsConfig = { ...DEFAULT_CONFIG };
let eventQueue: ExtendedSessionEvent[] = [];
let flushTimer: NodeJS.Timeout | null = null;
const listeners: Array<(events: ExtendedSessionEvent[]) => void> = [];

/** Configurer le système d'événements */
export function configureEvents(userConfig: Partial<EventsConfig>): void {
  config = { ...config, ...userConfig };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(config));

  // Redémarrer le timer de flush
  if (flushTimer) clearInterval(flushTimer);
  if (config.flushInterval > 0) {
    flushTimer = setInterval(flushEvents, config.flushInterval);
  }

  logger.info('Events configured', { config }, 'EVENTS');
}

/** Obtenir les événements */
export function getEvents(): SessionEvent[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

/** Obtenir les événements étendus */
export function getExtendedEvents(): ExtendedSessionEvent[] {
  return getEvents() as ExtendedSessionEvent[];
}

/** Enregistrer un événement */
export function recordEvent(evt: SessionEvent | ExtendedSessionEvent): ExtendedSessionEvent {
  const now = Date.now();
  const event: ExtendedSessionEvent = {
    ...evt,
    id: evt.id || crypto.randomUUID?.() || `evt_${now}_${Math.random().toString(36).slice(2)}`,
    timestamp: (evt as any).timestamp || now
  };

  // Ajouter à la queue
  eventQueue.push(event);

  // Flush si la queue est pleine
  if (eventQueue.length >= config.batchSize) {
    flushEvents();
  }

  // Notifier les listeners
  notifyListeners();

  logger.debug('Event recorded', { eventId: event.id, type: event.type }, 'EVENTS');

  return event;
}

/** Enregistrer plusieurs événements */
export function recordEvents(events: (SessionEvent | ExtendedSessionEvent)[]): ExtendedSessionEvent[] {
  return events.map(evt => recordEvent(evt));
}

/** Flush les événements en attente */
export function flushEvents(): void {
  if (eventQueue.length === 0) return;

  if (!config.enablePersistence) {
    eventQueue = [];
    return;
  }

  const list = getExtendedEvents();
  list.push(...eventQueue);

  // Limiter le nombre d'événements
  while (list.length > config.maxEvents) {
    list.shift();
  }

  localStorage.setItem(KEY, JSON.stringify(list));
  eventQueue = [];

  // Auto-cleanup si activé
  if (config.autoCleanup) {
    cleanupOldEvents();
  }

  logger.debug('Events flushed', { count: list.length }, 'EVENTS');
}

/** Nettoyer les anciens événements */
export function cleanupOldEvents(): number {
  const cutoff = Date.now() - (config.cleanupAfterDays * 24 * 60 * 60 * 1000);
  const events = getExtendedEvents();
  const filtered = events.filter(e => (e as any).timestamp >= cutoff);

  if (filtered.length < events.length) {
    localStorage.setItem(KEY, JSON.stringify(filtered));
    const removed = events.length - filtered.length;
    logger.info('Old events cleaned up', { removed }, 'EVENTS');
    return removed;
  }

  return 0;
}

/** Effacer tous les événements */
export function clearEvents(): void {
  localStorage.removeItem(KEY);
  eventQueue = [];
  notifyListeners();
  logger.info('Events cleared', {}, 'EVENTS');
}

/** Notifier les listeners */
function notifyListeners(): void {
  const allEvents = [...getExtendedEvents(), ...eventQueue];
  listeners.forEach(listener => listener(allEvents));
}

/** S'abonner aux événements */
export function subscribeEvents(listener: (events: ExtendedSessionEvent[]) => void): () => void {
  listeners.push(listener);
  listener([...getExtendedEvents(), ...eventQueue]);

  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
}

/** Filtrer les événements */
export function filterEvents(filters: EventFilters): ExtendedSessionEvent[] {
  let events = getExtendedEvents();

  if (filters.type?.length) {
    events = events.filter(e => e.type && filters.type!.includes(e.type));
  }

  if (filters.category?.length) {
    events = events.filter(e => e.category && filters.category!.includes(e.category));
  }

  if (filters.startDate) {
    events = events.filter(e => (e as any).timestamp >= filters.startDate!);
  }

  if (filters.endDate) {
    events = events.filter(e => (e as any).timestamp <= filters.endDate!);
  }

  if (filters.userId) {
    events = events.filter(e => e.userId === filters.userId);
  }

  if (filters.sessionId) {
    events = events.filter(e => e.sessionId === filters.sessionId);
  }

  if (filters.minValue !== undefined) {
    events = events.filter(e => e.value !== undefined && e.value >= filters.minValue!);
  }

  if (filters.maxValue !== undefined) {
    events = events.filter(e => e.value !== undefined && e.value <= filters.maxValue!);
  }

  return events;
}

/** Agréger les événements */
export function aggregateEvents(
  events: ExtendedSessionEvent[],
  groupBy: 'type' | 'category' | 'day' | 'hour'
): Record<string, EventAggregation> {
  const aggregations: Record<string, EventAggregation> = {};

  for (const event of events) {
    let key: string;

    switch (groupBy) {
      case 'type':
        key = event.type || 'unknown';
        break;
      case 'category':
        key = event.category || 'uncategorized';
        break;
      case 'day':
        key = new Date((event as any).timestamp).toISOString().split('T')[0];
        break;
      case 'hour':
        key = String(new Date((event as any).timestamp).getHours());
        break;
      default:
        key = 'all';
    }

    if (!aggregations[key]) {
      aggregations[key] = {
        count: 0,
        totalValue: 0,
        averageValue: 0,
        minValue: Infinity,
        maxValue: -Infinity,
        firstOccurrence: Infinity,
        lastOccurrence: -Infinity
      };
    }

    const agg = aggregations[key];
    agg.count++;

    if (event.value !== undefined) {
      agg.totalValue += event.value;
      agg.minValue = Math.min(agg.minValue, event.value);
      agg.maxValue = Math.max(agg.maxValue, event.value);
    }

    const timestamp = (event as any).timestamp;
    agg.firstOccurrence = Math.min(agg.firstOccurrence, timestamp);
    agg.lastOccurrence = Math.max(agg.lastOccurrence, timestamp);
  }

  // Calculer les moyennes et nettoyer
  for (const key in aggregations) {
    const agg = aggregations[key];
    agg.averageValue = agg.count > 0 ? agg.totalValue / agg.count : 0;

    if (agg.minValue === Infinity) agg.minValue = 0;
    if (agg.maxValue === -Infinity) agg.maxValue = 0;
    if (agg.firstOccurrence === Infinity) agg.firstOccurrence = 0;
    if (agg.lastOccurrence === -Infinity) agg.lastOccurrence = 0;
  }

  return aggregations;
}

/** Obtenir les stats */
export function getEventStats(): EventStats {
  const events = getExtendedEvents();

  const stats: EventStats = {
    total: events.length,
    byType: {},
    byCategory: {},
    byDay: {},
    byHour: {},
    averagePerDay: 0,
    peakHour: 0,
    oldestEvent: null,
    newestEvent: null
  };

  if (events.length === 0) return stats;

  // Initialiser byHour
  for (let i = 0; i < 24; i++) {
    stats.byHour[i] = 0;
  }

  for (const event of events) {
    const timestamp = (event as any).timestamp;

    // By type
    if (event.type) {
      stats.byType[event.type] = (stats.byType[event.type] || 0) + 1;
    }

    // By category
    if (event.category) {
      stats.byCategory[event.category] = (stats.byCategory[event.category] || 0) + 1;
    }

    // By day
    const day = new Date(timestamp).toISOString().split('T')[0];
    stats.byDay[day] = (stats.byDay[day] || 0) + 1;

    // By hour
    const hour = new Date(timestamp).getHours();
    stats.byHour[hour]++;

    // Oldest/Newest
    if (stats.oldestEvent === null || timestamp < stats.oldestEvent) {
      stats.oldestEvent = timestamp;
    }
    if (stats.newestEvent === null || timestamp > stats.newestEvent) {
      stats.newestEvent = timestamp;
    }
  }

  // Calculer la moyenne par jour
  const days = Object.keys(stats.byDay).length;
  stats.averagePerDay = days > 0 ? stats.total / days : 0;

  // Trouver l'heure de pointe
  let maxHourCount = 0;
  for (const hour in stats.byHour) {
    if (stats.byHour[hour] > maxHourCount) {
      maxHourCount = stats.byHour[hour];
      stats.peakHour = parseInt(hour);
    }
  }

  return stats;
}

/** Obtenir un événement par ID */
export function getEventById(id: string): ExtendedSessionEvent | null {
  const events = getExtendedEvents();
  return events.find(e => e.id === id) || null;
}

/** Obtenir les derniers événements */
export function getLastEvents(count: number): ExtendedSessionEvent[] {
  const events = getExtendedEvents();
  return events.slice(-count);
}

/** Exporter les événements en JSON */
export function exportEventsJSON(): string {
  return JSON.stringify({
    events: getExtendedEvents(),
    stats: getEventStats(),
    exportedAt: new Date().toISOString()
  }, null, 2);
}

/** Importer des événements */
export function importEvents(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);

    if (data.events && Array.isArray(data.events)) {
      const currentEvents = getExtendedEvents();
      const newEvents = [...currentEvents, ...data.events];

      // Dédupliquer par ID
      const uniqueEvents = newEvents.filter((event, index, self) =>
        index === self.findIndex(e => e.id === event.id)
      );

      // Limiter
      while (uniqueEvents.length > config.maxEvents) {
        uniqueEvents.shift();
      }

      localStorage.setItem(KEY, JSON.stringify(uniqueEvents));
      notifyListeners();

      logger.info('Events imported', { count: data.events.length }, 'EVENTS');
      return true;
    }

    return false;
  } catch (error) {
    logger.error('Events import failed', error as Error, 'EVENTS');
    return false;
  }
}

// Helpers pour types spécifiques

/** Enregistrer un début de session */
export function recordSessionStart(sessionId: string, userId?: string): ExtendedSessionEvent {
  return recordEvent({
    type: 'session_start',
    category: 'session',
    sessionId,
    userId
  } as ExtendedSessionEvent);
}

/** Enregistrer une fin de session */
export function recordSessionEnd(sessionId: string, duration: number, userId?: string): ExtendedSessionEvent {
  return recordEvent({
    type: 'session_end',
    category: 'session',
    sessionId,
    userId,
    duration,
    value: duration
  } as ExtendedSessionEvent);
}

/** Enregistrer une page vue */
export function recordPageView(page: string, sessionId?: string): ExtendedSessionEvent {
  return recordEvent({
    type: 'page_view',
    category: 'navigation',
    sessionId,
    metadata: { page }
  } as ExtendedSessionEvent);
}

/** Enregistrer une interaction */
export function recordInteraction(action: string, element?: string, value?: number): ExtendedSessionEvent {
  return recordEvent({
    type: 'interaction',
    category: 'ui',
    value,
    metadata: { action, element }
  } as ExtendedSessionEvent);
}

/** Enregistrer un milestone */
export function recordMilestone(name: string, value?: number, metadata?: Record<string, unknown>): ExtendedSessionEvent {
  return recordEvent({
    type: 'milestone',
    category: 'progress',
    value,
    metadata: { name, ...metadata }
  } as ExtendedSessionEvent);
}

/** Enregistrer un achievement */
export function recordAchievement(name: string, points?: number, metadata?: Record<string, unknown>): ExtendedSessionEvent {
  return recordEvent({
    type: 'achievement',
    category: 'gamification',
    value: points,
    metadata: { name, ...metadata }
  } as ExtendedSessionEvent);
}

// Démarrer le timer de flush
if (typeof window !== 'undefined' && config.flushInterval > 0) {
  flushTimer = setInterval(flushEvents, config.flushInterval);

  // Flush avant de quitter la page
  window.addEventListener('beforeunload', () => flushEvents());
}

export default {
  configureEvents,
  getEvents,
  getExtendedEvents,
  recordEvent,
  recordEvents,
  flushEvents,
  cleanupOldEvents,
  clearEvents,
  subscribeEvents,
  filterEvents,
  aggregateEvents,
  getEventStats,
  getEventById,
  getLastEvents,
  exportEventsJSON,
  importEvents,
  recordSessionStart,
  recordSessionEnd,
  recordPageView,
  recordInteraction,
  recordMilestone,
  recordAchievement
};
