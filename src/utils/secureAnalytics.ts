
import { toast } from '@/hooks/use-toast';

/**
 * Gestionnaire sécurisé pour les événements analytics
 * Assure un fonctionnement sans interruption même si l'endpoint n'existe pas
 */
export class SecureAnalytics {
  private static baseUrl = 'https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1';
  
  /**
   * Envoie un événement analytics de manière sécurisée
   * Ne bloque jamais l'UI en cas d'erreur
   */
  static async trackEvent(eventData: {
    event: string;
    data?: any;
    userId?: string;
  }): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics/event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...eventData,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.status >= 400) {
        if (response.status === 404) {
          console.warn('[Analytics] Endpoint not yet available - feature in development');
        } else {
          console.warn(`[Analytics] Service returned ${response.status} - continuing silently`);
        }
      }
    } catch (error: any) {
      // Analytics failures should never interrupt user experience
      console.warn('[Analytics] Offline or unreachable - continuing silently', error.message);
    }
  }

  /**
   * Track page view
   */
  static async trackPageView(pageName: string, userId?: string): Promise<void> {
    await this.trackEvent({
      event: 'page_view',
      data: { page: pageName },
      userId,
    });
  }

  /**
   * Track user action
   */
  static async trackAction(action: string, data?: any, userId?: string): Promise<void> {
    await this.trackEvent({
      event: 'user_action',
      data: { action, ...data },
      userId,
    });
  }
}

// Wrapper legacy pour compatibilité
export const postAnalyticsEvent = SecureAnalytics.trackEvent;
