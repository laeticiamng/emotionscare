// @ts-nocheck

import { GlobalInterceptor } from './globalInterceptor';
import { logger } from '@/lib/logger';

/**
 * Analytics sécurisées avec fallbacks robustes
 * Ne bloque JAMAIS l'UI en cas d'erreur
 */
export class SecureAnalytics {
  private static baseUrl = 'https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1';
  private static timeout = 5000; // 5s timeout pour analytics
  private static isOffline = false;
  
  /**
   * Envoie un événement analytics de manière sécurisée
   */
  static async trackEvent(eventData: {
    event: string;
    data?: any;
    userId?: string;
  }): Promise<void> {
    // Si offline détecté, ne pas essayer
    if (this.isOffline) {
      logger.warn('[Analytics] Service offline - skipping event', {}, 'ANALYTICS');
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await GlobalInterceptor.secureFetch(`${this.baseUrl}/analytics/event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...eventData,
          timestamp: new Date().toISOString(),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response) {
        // GlobalInterceptor a géré l'erreur
        this.markAsOffline();
        return;
      }

      // Reset offline flag si succès
      this.isOffline = false;

    } catch (error: any) {
      if (error.name === 'AbortError') {
        logger.warn('[Analytics] Request timeout - marking as offline', {}, 'ANALYTICS');
      } else {
        logger.warn('[Analytics] Error sending event', { message: error.message }, 'ANALYTICS');
      }
      
      this.markAsOffline();
    }
  }

  /**
   * Marque le service analytics comme offline temporairement
   */
  private static markAsOffline(): void {
    this.isOffline = true;
    
    // Réessayer dans 30 secondes
    setTimeout(() => {
      this.isOffline = false;
      logger.info('[Analytics] Service back online - resuming tracking', {}, 'ANALYTICS');
    }, 30000);
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

  /**
   * Get service status
   */
  static getStatus(): { isOffline: boolean } {
    return { isOffline: this.isOffline };
  }
}

// Export legacy pour compatibilité
export const postAnalyticsEvent = SecureAnalytics.trackEvent;
