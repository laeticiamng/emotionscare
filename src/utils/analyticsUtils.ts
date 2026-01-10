import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface AnalyticsEvent {
  event: string;
  data?: Record<string, unknown>;
  timestamp?: string;
  user_id?: string;
}

/**
 * Envoie un événement analytics vers Supabase
 */
export const postAnalyticsEvent = async (eventData: AnalyticsEvent): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Insérer dans la table analytics_events si elle existe, sinon log localement
    const eventToStore = {
      event_type: eventData.event,
      event_data: eventData.data || {},
      created_at: eventData.timestamp || new Date().toISOString(),
      user_id: user?.id || null,
    };

    // Essayer d'insérer dans Supabase (silent fail si table n'existe pas)
    const { error } = await supabase
      .from('user_analytics_events')
      .insert(eventToStore);

    if (error) {
      // Fallback: stocker localement
      storeEventLocally(eventToStore);
    }

    // Aussi envoyer à Google Analytics si disponible
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventData.event, eventData.data);
    }
  } catch (error) {
    logger.warn('Analytics event failed, storing locally', { event: eventData.event }, 'ANALYTICS');
    storeEventLocally({
      event_type: eventData.event,
      event_data: eventData.data || {},
      created_at: new Date().toISOString(),
    });
  }
};

/**
 * Stocker l'événement localement si Supabase n'est pas disponible
 */
function storeEventLocally(event: Record<string, unknown>): void {
  try {
    const stored = localStorage.getItem('pending_analytics') || '[]';
    const events = JSON.parse(stored);
    events.push(event);
    // Garder seulement les 100 derniers événements
    const trimmed = events.slice(-100);
    localStorage.setItem('pending_analytics', JSON.stringify(trimmed));
  } catch {
    // Silent fail
  }
}

/**
 * Synchroniser les événements locaux vers Supabase
 */
export const syncLocalAnalytics = async (): Promise<number> => {
  try {
    const stored = localStorage.getItem('pending_analytics');
    if (!stored) return 0;

    const events = JSON.parse(stored);
    if (events.length === 0) return 0;

    const { error } = await supabase
      .from('user_analytics_events')
      .insert(events);

    if (!error) {
      localStorage.removeItem('pending_analytics');
      return events.length;
    }
  } catch {
    // Silent fail
  }
  return 0;
};

/**
 * Wrapper sécurisé pour les événements analytics
 */
export const trackEvent = async (event: string, data?: Record<string, unknown>): Promise<void> => {
  await postAnalyticsEvent({
    event,
    data,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track page view
 */
export const trackPageView = async (pagePath: string, pageTitle?: string): Promise<void> => {
  await trackEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  });
};

/**
 * Track user action
 */
export const trackUserAction = async (action: string, category: string, label?: string, value?: number): Promise<void> => {
  await trackEvent('user_action', {
    action,
    category,
    label,
    value,
  });
};
