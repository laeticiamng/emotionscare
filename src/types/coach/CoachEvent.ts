// @ts-nocheck
/**
 * Coach Event Types - Événements du système de coaching
 * Types pour les messages, suggestions, notifications et interactions du coach
 */

/** Types d'événements du coach */
export type CoachEventType =
  | 'message'
  | 'suggestion'
  | 'notification'
  | 'recommendation'
  | 'reminder'
  | 'celebration'
  | 'insight'
  | 'challenge'
  | 'check_in'
  | 'feedback_request'
  | 'milestone'
  | 'alert';

/** Priorité de l'événement */
export type EventPriority = 'low' | 'medium' | 'high' | 'urgent';

/** Statut de l'événement */
export type EventStatus = 'pending' | 'delivered' | 'read' | 'dismissed' | 'actioned' | 'expired';

/** Catégorie de l'événement */
export type EventCategory =
  | 'wellbeing'
  | 'activity'
  | 'meditation'
  | 'breathing'
  | 'sleep'
  | 'social'
  | 'motivation'
  | 'education'
  | 'system';

/** Événement du coach */
export interface CoachEvent {
  id: string;
  type: CoachEventType;
  content: string;
  timestamp: string;
  userId: string;
  metadata?: CoachEventMetadata;
  read?: boolean;
  priority?: EventPriority;
  status?: EventStatus;
  category?: EventCategory;
  expiresAt?: string;
  scheduledFor?: string;
  actionUrl?: string;
  actions?: CoachEventAction[];
  context?: CoachEventContext;
  analytics?: CoachEventAnalytics;
}

/** Métadonnées de l'événement */
export interface CoachEventMetadata {
  title?: string;
  subtitle?: string;
  icon?: string;
  imageUrl?: string;
  source?: EventSource;
  tags?: string[];
  relatedEventIds?: string[];
  triggeredBy?: EventTrigger;
  ttl?: number;
  deliveryChannel?: DeliveryChannel[];
  locale?: string;
  version?: number;
  [key: string]: unknown;
}

/** Source de l'événement */
export interface EventSource {
  type: 'system' | 'ai' | 'user_action' | 'schedule' | 'trigger' | 'external';
  id?: string;
  name?: string;
}

/** Déclencheur de l'événement */
export interface EventTrigger {
  type: TriggerType;
  condition?: string;
  value?: unknown;
  timestamp: string;
}

/** Types de déclencheurs */
export type TriggerType =
  | 'mood_change'
  | 'streak_milestone'
  | 'inactivity'
  | 'time_based'
  | 'location_based'
  | 'behavior_pattern'
  | 'goal_progress'
  | 'external_event'
  | 'user_request'
  | 'ai_recommendation';

/** Canaux de livraison */
export type DeliveryChannel = 'in_app' | 'push' | 'email' | 'sms';

/** Action associée à un événement */
export interface CoachEventAction {
  id: string;
  type: ActionType;
  label: string;
  icon?: string;
  url?: string;
  payload?: Record<string, unknown>;
  isPrimary?: boolean;
  confirmRequired?: boolean;
  confirmMessage?: string;
}

/** Types d'actions */
export type ActionType =
  | 'navigate'
  | 'dismiss'
  | 'snooze'
  | 'complete'
  | 'share'
  | 'feedback'
  | 'start_activity'
  | 'view_details'
  | 'custom';

/** Contexte de l'événement */
export interface CoachEventContext {
  previousEvents?: string[];
  userState?: UserStateContext;
  sessionId?: string;
  conversationId?: string;
  emotionalContext?: EmotionalContext;
  environmentContext?: EnvironmentContext;
}

/** État de l'utilisateur */
export interface UserStateContext {
  currentMood?: string;
  moodIntensity?: number;
  energyLevel?: number;
  stressLevel?: number;
  lastActivity?: string;
  lastActivityTime?: string;
  currentStreak?: number;
  dailyGoalProgress?: number;
}

/** Contexte émotionnel */
export interface EmotionalContext {
  recentMoods: Array<{ mood: string; timestamp: string }>;
  dominantMood?: string;
  moodTrend?: 'improving' | 'stable' | 'declining';
  volatility?: number;
}

/** Contexte environnemental */
export interface EnvironmentContext {
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek?: number;
  isWeekend?: boolean;
  weather?: string;
  location?: string;
}

/** Analytiques de l'événement */
export interface CoachEventAnalytics {
  impressions?: number;
  interactions?: number;
  completionRate?: number;
  engagementScore?: number;
  sentimentResponse?: number;
  timeToAction?: number;
  dismissalReason?: string;
}

/** Filtres d'événements */
export interface CoachEventFilter {
  types?: CoachEventType[];
  categories?: EventCategory[];
  priorities?: EventPriority[];
  statuses?: EventStatus[];
  dateFrom?: string;
  dateTo?: string;
  unreadOnly?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'timestamp' | 'priority' | 'status';
  sortOrder?: 'asc' | 'desc';
}

/** Statistiques des événements */
export interface CoachEventStats {
  totalEvents: number;
  unreadEvents: number;
  eventsByType: Record<CoachEventType, number>;
  eventsByCategory: Record<EventCategory, number>;
  averageEngagementRate: number;
  mostEngagedType: CoachEventType;
  lastEventTimestamp?: string;
}

/** Configuration des événements */
export interface CoachEventConfig {
  enableNotifications: boolean;
  enablePush: boolean;
  enableEmail: boolean;
  maxEventsPerDay: number;
  priorityThreshold: EventPriority;
  autoExpireAfterDays: number;
  preferredCategories?: EventCategory[];
}

/** Créateur d'événement */
export interface CreateCoachEventInput {
  type: CoachEventType;
  content: string;
  userId: string;
  metadata?: Partial<CoachEventMetadata>;
  priority?: EventPriority;
  category?: EventCategory;
  scheduledFor?: string;
  expiresAt?: string;
  actions?: CoachEventAction[];
}

/** Valeurs par défaut */
export const DEFAULT_EVENT_CONFIG: CoachEventConfig = {
  enableNotifications: true,
  enablePush: true,
  enableEmail: false,
  maxEventsPerDay: 10,
  priorityThreshold: 'low',
  autoExpireAfterDays: 7
};

/** Type guard pour CoachEventType */
export function isValidEventType(value: unknown): value is CoachEventType {
  const validTypes: CoachEventType[] = [
    'message', 'suggestion', 'notification', 'recommendation',
    'reminder', 'celebration', 'insight', 'challenge',
    'check_in', 'feedback_request', 'milestone', 'alert'
  ];
  return typeof value === 'string' && validTypes.includes(value as CoachEventType);
}

/** Créer un événement avec valeurs par défaut */
export function createCoachEvent(input: CreateCoachEventInput): CoachEvent {
  return {
    id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: input.type,
    content: input.content,
    timestamp: new Date().toISOString(),
    userId: input.userId,
    metadata: input.metadata,
    read: false,
    priority: input.priority || 'medium',
    status: 'pending',
    category: input.category || 'wellbeing',
    scheduledFor: input.scheduledFor,
    expiresAt: input.expiresAt,
    actions: input.actions
  };
}

export default {
  DEFAULT_EVENT_CONFIG,
  isValidEventType,
  createCoachEvent
};
