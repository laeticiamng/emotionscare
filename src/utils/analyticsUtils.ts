// @ts-nocheck

import { ApiErrorHandler } from '@/utils/errorHandlers';

/**
 * Utilitaire pour les appels analytics avec gestion d'erreur
 */
export const postAnalyticsEvent = async (eventData: any): Promise<void> => {
  try {
    const response = await fetch('/api/analytics/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error(`Analytics API returned ${response.status}`);
    }
  } catch (error: any) {
    ApiErrorHandler.handleAnalyticsError(error, 'postAnalyticsEvent');
  }
};

/**
 * Wrapper sécurisé pour les événements analytics
 */
export const trackEvent = async (event: string, data?: any): Promise<void> => {
  await postAnalyticsEvent({
    event,
    data,
    timestamp: new Date().toISOString(),
  });
};
