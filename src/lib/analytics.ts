// @ts-nocheck
/**
 * Analytics utilities pour tracking événements utilisateur
 * Intègre Vercel Analytics + Supabase custom events
 */

import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsEvent {
  event_type: string;
  properties?: Record<string, any>;
  user_id?: string;
  timestamp?: Date;
}

/**
 * Track un événement utilisateur
 * Envoie à la fois vers Vercel Analytics et table Supabase
 */
export const trackEvent = async (
  eventName: string,
  properties?: Record<string, any>
): Promise<void> => {
  try {
    // Vercel Analytics (si disponible)
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va.track(eventName, properties);
    }

    // Supabase custom events (optionnel - créer table si besoin)
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Note: Créer table user_events si tracking custom souhaité
      // await supabase.from('user_events').insert({
      //   user_id: user.id,
      //   event_type: eventName,
      //   properties: properties || {},
      //   timestamp: new Date(),
      // });
    }

    // Event tracked silently
  } catch (error) {
    // Analytics error - silent fail
  }
};

/**
 * Track navigation vers une page
 */
export const trackPageView = (pagePath: string, pageTitle?: string): void => {
  trackEvent('page_view', {
    path: pagePath,
    title: pageTitle || document.title,
    referrer: document.referrer,
  });
};

/**
 * Track utilisation d'un module
 */
export const trackModuleUsage = (moduleName: string, action: string): void => {
  trackEvent('module_used', {
    module: moduleName,
    action,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track interaction utilisateur
 */
export const trackInteraction = (
  element: string,
  action: 'click' | 'hover' | 'focus' | 'submit'
): void => {
  trackEvent('user_interaction', {
    element,
    action,
  });
};

/**
 * Track erreur applicative
 */
export const trackError = (
  error: Error,
  context?: Record<string, any>
): void => {
  trackEvent('error_occurred', {
    message: error.message,
    stack: error.stack,
    ...context,
  });
};

/**
 * Track conversion (upgrade, purchase, etc.)
 */
export const trackConversion = (
  conversionType: string,
  value?: number,
  metadata?: Record<string, any>
): void => {
  trackEvent('conversion', {
    type: conversionType,
    value,
    ...metadata,
  });
};

/**
 * Hook React pour tracking automatique page view
 */
export const usePageTracking = (pageName: string): void => {
  React.useEffect(() => {
    trackPageView(window.location.pathname, pageName);
  }, [pageName]);
};

/**
 * Analytics events constants
 */
export const AnalyticsEvents = {
  // Module events
  MODULE_OPENED: 'module_opened',
  MODULE_COMPLETED: 'module_completed',
  MODULE_FAVORITED: 'module_favorited',
  
  // User actions
  SCAN_STARTED: 'scan_started',
  SCAN_COMPLETED: 'scan_completed',
  MUSIC_PLAYED: 'music_played',
  COACH_MESSAGE_SENT: 'coach_message_sent',
  JOURNAL_ENTRY_CREATED: 'journal_entry_created',
  
  // Navigation
  SIDEBAR_TOGGLED: 'sidebar_toggled',
  CATEGORY_FILTERED: 'category_filtered',
  SEARCH_PERFORMED: 'search_performed',
  
  // Conversion
  UPGRADE_CLICKED: 'upgrade_clicked',
  SUBSCRIPTION_STARTED: 'subscription_started',
  
  // Engagement
  FEATURE_DISCOVERY: 'feature_discovery',
  ONBOARDING_COMPLETED: 'onboarding_completed',
} as const;
