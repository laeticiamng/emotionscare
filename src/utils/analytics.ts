
import { hasConsent } from "@/ui/CookieConsent";

interface TrackEventOptions {
  properties?: Record<string, any>;
  anonymous?: boolean;
}

export const trackEvent = (eventName: string, options: TrackEventOptions = {}) => {
  if (!hasConsent("analytics")) return;
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics Event:', eventName, options);
  }

  // En production, intégrer avec votre service d'analytics
  // Par exemple: analytics.track(eventName, options.properties);
};

export const trackPageView = (page: string) => {
  trackEvent('page_view', {
    properties: { page }
  });
};
