/**
 * Service d'analytics sans PII - Conforme RGPD
 * Collecte uniquement des métriques techniques anonymisées
 */

interface AnalyticsEvent {
  event: string;
  category: 'routing' | 'module' | 'rh' | 'settings' | 'rgpd' | 'feedback';
  properties?: Record<string, string | number | boolean>;
  timestamp?: string;
}

class AnalyticsService {
  private isEnabled = true;
  private queue: AnalyticsEvent[] = [];

  /**
   * Track un événement sans données personnelles
   */
  track(event: string, category: AnalyticsEvent['category'], properties?: Record<string, any>): void {
    if (!this.isEnabled) return;

    // Redaction automatique - pas de PII
    const sanitizedProps = this.sanitizeProperties(properties);
    
    const analyticsEvent: AnalyticsEvent = {
      event,
      category,
      properties: sanitizedProps,
      timestamp: new Date().toISOString()
    };

    this.queue.push(analyticsEvent);
    this.processQueue();
  }

  /**
   * Événements de routage/navigation
   */
  trackRouting(action: string, role?: string): void {
    this.track(`router.${action}`, 'routing', { role });
  }

  trackRoleRedirect(fromRole: string, toPath: string): void {
    this.track('router.role.redirect', 'routing', { from_role: fromRole, to_path: toPath });
  }

  /**
   * Événements modules (sans PII)
   */
  trackModuleStart(moduleId: string): void {
    this.track(`module.${moduleId}.start`, 'module');
  }

  trackModuleFinish(moduleId: string, duration?: number): void {
    this.track(`module.${moduleId}.finish`, 'module', { duration_seconds: duration });
  }

  trackModuleFallback(moduleId: string, reason: string): void {
    this.track(`module.${moduleId}.fallback`, 'module', { reason });
  }

  /**
   * Événements RH (données agrégées uniquement)
   */
  trackRHDashboard(action: string): void {
    this.track(`rh.dashboard.${action}`, 'rh');
  }

  trackRHExport(format: string): void {
    this.track('rh.dashboard.export', 'rh', { format });
  }

  /**
   * Événements RGPD
   */
  trackPrivacyToggle(toggle: string, enabled: boolean): void {
    this.track('privacy.toggle', 'settings', { toggle, enabled });
  }

  trackRGPDExportRequest(): void {
    this.track('rgpd.export.requested', 'rgpd');
  }

  trackRGPDExportReady(): void {
    this.track('rgpd.export.ready', 'rgpd');
  }

  trackAccountDeletion(step: string): void {
    this.track(`account.delete.${step}`, 'rgpd');
  }

  /**
   * Événements notifications
   */
  trackNotificationOptin(result: 'accepted' | 'denied'): void {
    this.track(`notify.optin.${result}`, 'settings');
  }

  trackNotificationReminder(action: string): void {
    this.track(`notify.reminder.${action}`, 'settings');
  }

  /**
   * Événements feedback
   */
  trackFeedback(action: 'open' | 'submit' | 'fail'): void {
    this.track(`feedback.${action}`, 'feedback');
  }

  /**
   * Désactiver/réactiver analytics
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled) {
      this.queue = []; // Vider la queue si désactivé
    }
  }

  /**
   * Sanitize properties pour éviter les fuites PII
   */
  private sanitizeProperties(properties?: Record<string, any>): Record<string, string | number | boolean> {
    if (!properties) return {};

    const sanitized: Record<string, string | number | boolean> = {};
    
    // Liste blanche des propriétés autorisées
    const allowedKeys = [
      'role', 'module_id', 'action', 'format', 'toggle', 'enabled', 
      'duration_seconds', 'reason', 'from_role', 'to_path', 'step',
      'category', 'result'
    ];

    Object.entries(properties).forEach(([key, value]) => {
      if (allowedKeys.includes(key) && (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')) {
        sanitized[key] = value;
      }
    });

    return sanitized;
  }

  /**
   * Traitement de la queue (batch envoi)
   */
  private processQueue(): void {
    if (this.queue.length === 0) return;

    // Simulation d'envoi - dans la vraie implémentation, utiliser fetch
    try {
      console.log('[Analytics] Events sent:', this.queue.length);
      // Replace with real API call
      const mockAnalytics = {
        pageViews: Math.floor(Math.random() * 10000),
        uniqueUsers: Math.floor(Math.random() * 5000),
        conversionRate: (Math.random() * 10).toFixed(2) + '%',
        bounceRate: (Math.random() * 50).toFixed(2) + '%'
      };
      
      console.log('Analytics data loaded:', mockAnalytics);
      return mockAnalytics;
      // await fetch('/api/analytics/batch', { method: 'POST', body: JSON.stringify(this.queue) });
      this.queue = [];
    } catch (error) {
      console.warn('[Analytics] Failed to send events:', error);
      // Garder les événements en queue pour retry
    }
  }
}

export const analyticsService = new AnalyticsService();