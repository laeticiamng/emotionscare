export { useAnalytics, default as analyticsIntegration } from './analyticsIntegration';
export { trackScanEvent, scanAnalytics } from './scanEvents';
/**
 * Analytics - Système d'analytics unifié
 *
 * Intègre plusieurs providers d'analytics :
 * - Google Analytics 4
 * - Mixpanel
 * - Sentry (breadcrumbs & custom events)
 * - Console (dev mode)
 *
 * @module lib/analytics
 */

import { logger } from '@/lib/logger';
import { Sentry } from '@/lib/errors/sentry-compat';

// ============================================
// TYPES
// ============================================

export type AnalyticsEventName =
  // Auth events
  | 'login'
  | 'logout'
  | 'signup'
  | 'password_reset'
  | 'email_verified'
  // Navigation events
  | 'page_view'
  | 'feature_accessed'
  | 'modal_opened'
  | 'modal_closed'
  // User actions
  | 'button_clicked'
  | 'form_submitted'
  | 'form_error'
  | 'search_performed'
  | 'filter_applied'
  // Content events
  | 'content_viewed'
  | 'content_shared'
  | 'content_saved'
  | 'content_deleted'
  // Journal events
  | 'journal_entry_created'
  | 'journal_entry_updated'
  | 'journal_entry_deleted'
  | 'journal_mood_logged'
  // Scan events
  | 'scan_started'
  | 'scan_completed'
  | 'scan_failed'
  // Session events
  | 'session_started'
  | 'session_completed'
  | 'session_paused'
  | 'session_resumed'
  | 'session_abandoned'
  // Music events
  | 'music_played'
  | 'music_paused'
  | 'music_generated'
  | 'playlist_created'
  // VR events
  | 'vr_session_started'
  | 'vr_session_completed'
  // Coach events
  | 'coach_conversation_started'
  | 'coach_message_sent'
  | 'coach_feedback_given'
  // Gamification events
  | 'badge_earned'
  | 'challenge_joined'
  | 'challenge_completed'
  | 'streak_achieved'
  | 'level_up'
  // Assessment events
  | 'assessment_started'
  | 'assessment_completed'
  | 'assessment_abandoned'
  // Subscription events
  | 'subscription_started'
  | 'subscription_cancelled'
  | 'subscription_renewed'
  // Error events
  | 'error_occurred'
  | 'error_boundary_triggered'
  // Custom events
  | 'custom_event';

export interface AnalyticsEventProperties {
  [key: string]: string | number | boolean | undefined | null;
}

export interface AnalyticsUserProperties {
  userId?: string;
  email?: string;
  role?: string;
  plan?: string;
  organizationId?: string;
  createdAt?: string;
  [key: string]: string | number | boolean | undefined | null;
}

export interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
  providers: {
    googleAnalytics: boolean;
    mixpanel: boolean;
    sentry: boolean;
  };
  googleAnalyticsId?: string;
  mixpanelToken?: string;
}

// ============================================
// ANALYTICS PROVIDERS
// ============================================

/**
 * Google Analytics 4 provider
 */
const googleAnalytics = {
  isAvailable: (): boolean => {
    return typeof window !== 'undefined' && 'gtag' in window;
  },

  track: (eventName: string, properties?: AnalyticsEventProperties) => {
    if (!googleAnalytics.isAvailable()) return;
    try {
      (window as any).gtag('event', eventName, properties);
    } catch (error) {
      logger.warn('Google Analytics tracking failed', error, 'ANALYTICS');
    }
  },

  identify: (userId: string, properties?: AnalyticsUserProperties) => {
    if (!googleAnalytics.isAvailable()) return;
    try {
      (window as any).gtag('config', config.googleAnalyticsId, {
        user_id: userId,
        ...properties,
      });
    } catch (error) {
      logger.warn('Google Analytics identify failed', error, 'ANALYTICS');
    }
  },

  pageView: (path: string, title?: string) => {
    if (!googleAnalytics.isAvailable()) return;
    try {
      (window as any).gtag('event', 'page_view', {
        page_path: path,
        page_title: title,
      });
    } catch (error) {
      logger.warn('Google Analytics pageview failed', error, 'ANALYTICS');
    }
  },
};

/**
 * Mixpanel provider
 */
const mixpanel = {
  isAvailable: (): boolean => {
    return typeof window !== 'undefined' && 'mixpanel' in window;
  },

  track: (eventName: string, properties?: AnalyticsEventProperties) => {
    if (!mixpanel.isAvailable()) return;
    try {
      (window as any).mixpanel.track(eventName, properties);
    } catch (error) {
      logger.warn('Mixpanel tracking failed', error, 'ANALYTICS');
    }
  },

  identify: (userId: string, properties?: AnalyticsUserProperties) => {
    if (!mixpanel.isAvailable()) return;
    try {
      (window as any).mixpanel.identify(userId);
      if (properties) {
        (window as any).mixpanel.people.set(properties);
      }
    } catch (error) {
      logger.warn('Mixpanel identify failed', error, 'ANALYTICS');
    }
  },

  reset: () => {
    if (!mixpanel.isAvailable()) return;
    try {
      (window as any).mixpanel.reset();
    } catch (error) {
      logger.warn('Mixpanel reset failed', error, 'ANALYTICS');
    }
  },
};

/**
 * Sentry provider (for event tracking via breadcrumbs)
 */
const sentryAnalytics = {
  track: (eventName: string, properties?: AnalyticsEventProperties) => {
    try {
      Sentry.addBreadcrumb({
        category: 'analytics',
        message: eventName,
        level: 'info',
        data: properties,
      });
    } catch (error) {
      logger.warn('Sentry analytics tracking failed', error, 'ANALYTICS');
    }
  },

  identify: (userId: string, properties?: AnalyticsUserProperties) => {
    try {
      Sentry.setUser({
        id: userId,
        email: properties?.email as string | undefined,
        ...properties,
      });
    } catch (error) {
      logger.warn('Sentry identify failed', error, 'ANALYTICS');
    }
  },
};

// ============================================
// CONFIGURATION
// ============================================

const config: AnalyticsConfig = {
  enabled: import.meta.env.PROD || import.meta.env.VITE_ANALYTICS_DEBUG === 'true',
  debug: import.meta.env.DEV || import.meta.env.VITE_ANALYTICS_DEBUG === 'true',
  providers: {
    googleAnalytics: !!import.meta.env.VITE_GA_MEASUREMENT_ID,
    mixpanel: !!import.meta.env.VITE_MIXPANEL_TOKEN,
    sentry: true, // Always enabled with Sentry
  },
  googleAnalyticsId: import.meta.env.VITE_GA_MEASUREMENT_ID,
  mixpanelToken: import.meta.env.VITE_MIXPANEL_TOKEN,
};

// ============================================
// ANALYTICS API
// ============================================

/**
 * Track an analytics event
 */
export function track(
  eventName: AnalyticsEventName,
  properties?: AnalyticsEventProperties
): void {
  if (!config.enabled && !config.debug) return;

  const enrichedProperties = {
    ...properties,
    timestamp: Date.now(),
    page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    session_id: getSessionId(),
  };

  // Debug logging
  if (config.debug) {
    logger.debug(`[Analytics] ${eventName}`, enrichedProperties, 'ANALYTICS');
  }

  // Send to all enabled providers
  if (config.providers.googleAnalytics) {
    googleAnalytics.track(eventName, enrichedProperties);
  }

  if (config.providers.mixpanel) {
    mixpanel.track(eventName, enrichedProperties);
  }

  if (config.providers.sentry) {
    sentryAnalytics.track(eventName, enrichedProperties);
  }
}

/**
 * Track a page view
 */
export function pageView(path: string, title?: string): void {
  track('page_view', {
    page_path: path,
    page_title: title,
  });

  if (config.providers.googleAnalytics) {
    googleAnalytics.pageView(path, title);
  }
}

/**
 * Identify a user
 */
export function identify(
  userId: string,
  properties?: AnalyticsUserProperties
): void {
  if (!config.enabled && !config.debug) return;

  if (config.debug) {
    logger.debug(`[Analytics] Identify user: ${userId}`, properties, 'ANALYTICS');
  }

  if (config.providers.googleAnalytics) {
    googleAnalytics.identify(userId, properties);
  }

  if (config.providers.mixpanel) {
    mixpanel.identify(userId, properties);
  }

  if (config.providers.sentry) {
    sentryAnalytics.identify(userId, properties);
  }
}

/**
 * Reset analytics (on logout)
 */
export function reset(): void {
  if (config.debug) {
    logger.debug('[Analytics] Reset', {}, 'ANALYTICS');
  }

  if (config.providers.mixpanel) {
    mixpanel.reset();
  }

  if (config.providers.sentry) {
    Sentry.setUser(null);
  }

  // Clear session ID
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem('analytics_session_id');
  }
}

/**
 * Track timing (performance)
 */
export function trackTiming(
  category: string,
  variable: string,
  valueMs: number,
  label?: string
): void {
  track('custom_event', {
    event_category: 'timing',
    timing_category: category,
    timing_variable: variable,
    timing_value: valueMs,
    timing_label: label,
  });

  if (config.providers.googleAnalytics && googleAnalytics.isAvailable()) {
    try {
      (window as any).gtag('event', 'timing_complete', {
        name: variable,
        value: valueMs,
        event_category: category,
        event_label: label,
      });
    } catch (error) {
      logger.warn('Google Analytics timing failed', error, 'ANALYTICS');
    }
  }
}

/**
 * Track an error
 */
export function trackError(
  error: Error,
  context?: Record<string, any>
): void {
  track('error_occurred', {
    error_name: error.name,
    error_message: error.message,
    error_stack: error.stack?.slice(0, 500),
    ...context,
  });
}

// ============================================
// HELPERS
// ============================================

let sessionId: string | null = null;

function getSessionId(): string {
  if (sessionId) return sessionId;

  if (typeof sessionStorage !== 'undefined') {
    const stored = sessionStorage.getItem('analytics_session_id');
    if (stored) {
      sessionId = stored;
      return sessionId;
    }
  }

  sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem('analytics_session_id', sessionId);
  }

  return sessionId;
}

// ============================================
// CONVENIENCE METHODS
// ============================================

export const analytics = {
  // Core methods
  track,
  pageView,
  identify,
  reset,
  trackTiming,
  trackError,

  // Auth events
  trackLogin: (method: string = 'email') =>
    track('login', { method }),

  trackLogout: () =>
    track('logout'),

  trackSignup: (method: string = 'email') =>
    track('signup', { method }),

  // Feature events
  trackFeatureAccessed: (featureName: string, context?: Record<string, any>) =>
    track('feature_accessed', { feature_name: featureName, ...context }),

  // Button clicks
  trackButtonClick: (buttonId: string, label?: string) =>
    track('button_clicked', { button_id: buttonId, button_label: label }),

  // Form events
  trackFormSubmit: (formName: string, success: boolean = true) =>
    track('form_submitted', { form_name: formName, success }),

  trackFormError: (formName: string, errorField: string, errorMessage: string) =>
    track('form_error', { form_name: formName, error_field: errorField, error_message: errorMessage }),

  // Search
  trackSearch: (query: string, resultsCount: number) =>
    track('search_performed', { search_query: query, results_count: resultsCount }),

  // Content
  trackContentView: (contentType: string, contentId: string) =>
    track('content_viewed', { content_type: contentType, content_id: contentId }),

  trackContentShare: (contentType: string, contentId: string, shareMethod: string) =>
    track('content_shared', { content_type: contentType, content_id: contentId, share_method: shareMethod }),

  // Journal
  trackJournalEntry: (action: 'created' | 'updated' | 'deleted', entryId: string) =>
    track(`journal_entry_${action}`, { entry_id: entryId }),

  // Sessions
  trackSessionStart: (sessionType: string, sessionId: string) =>
    track('session_started', { session_type: sessionType, session_id: sessionId }),

  trackSessionComplete: (sessionType: string, sessionId: string, durationMs: number) =>
    track('session_completed', {
      session_type: sessionType,
      session_id: sessionId,
      duration_ms: durationMs,
    }),

  // Music
  trackMusicEvent: (action: 'played' | 'paused' | 'generated', trackId: string, details?: Record<string, any>) =>
    track(`music_${action}`, { track_id: trackId, ...details }),

  // Gamification
  trackBadgeEarned: (badgeId: string, badgeName: string) =>
    track('badge_earned', { badge_id: badgeId, badge_name: badgeName }),

  trackChallengeEvent: (action: 'joined' | 'completed', challengeId: string) =>
    track(`challenge_${action}`, { challenge_id: challengeId }),

  trackStreakAchieved: (streakDays: number, streakType: string) =>
    track('streak_achieved', { streak_days: streakDays, streak_type: streakType }),

  // Assessment
  trackAssessment: (action: 'started' | 'completed' | 'abandoned', assessmentType: string, score?: number) =>
    track(`assessment_${action}`, { assessment_type: assessmentType, score }),
};

export default analytics;
