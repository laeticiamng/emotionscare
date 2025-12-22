import { hasConsent } from "@/ui/CookieConsent";
import { logger } from '@/lib/logger';

interface TrackEventOptions {
  properties?: Record<string, unknown>;
  anonymous?: boolean;
}

export const trackEvent = (eventName: string, options: TrackEventOptions = {}) => {
  if (!hasConsent("analytics")) return;
  if (process.env.NODE_ENV === 'development') {
    logger.info('📊 Analytics Event', { eventName, ...options }, 'ANALYTICS');
  }

  // En production, intégrer avec votre service d'analytics
  // Par exemple: analytics.track(eventName, options.properties);
};

export const trackPageView = (page: string) => {
  trackEvent('page_view', {
    properties: { page }
  });
};
