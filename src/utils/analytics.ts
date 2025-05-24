
import { trackEvent } from './analyticsUtils';

/**
 * Wrapper legacy pour la compatibilité
 */
export const postAnalyticsEvent = async (eventData: any): Promise<void> => {
  return trackEvent(eventData.event, eventData.data);
};

export { trackEvent };
