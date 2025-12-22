import { logger } from '@/lib/logger';

/**
 * Service global de gestion d'erreurs pour la production
 */

interface ErrorReport {
  message: string;
  stack?: string;
  context?: string;
  timestamp: string;
  userAgent: string;
  url: string;
}

class GlobalErrorService {
  private errors: ErrorReport[] = [];
  
  /**
   * Signaler une erreur
   */
  reportError(error: Error, context?: string) {
    const report: ErrorReport = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    this.errors.push(report);
    logger.error('Erreur capturée', error, 'SYSTEM');
    
    // En production, envoyer à un service de monitoring
    if (import.meta.env.PROD) {
      this.sendToMonitoring(report);
    }
  }
  
  private sendToMonitoring(report: ErrorReport) {
    // Intégration future avec Sentry ou autre service
    logger.info('Envoi vers monitoring', { report }, 'SYSTEM');
  }
  
  /**
   * Obtenir les erreurs récentes
   */
  getRecentErrors(limit = 10) {
    return this.errors.slice(-limit);
  }
  
  /**
   * Nettoyer les anciennnes erreurs
   */
  clearOldErrors() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    this.errors = this.errors.filter(
      error => new Date(error.timestamp) > oneHourAgo
    );
  }
}

export const globalErrorService = new GlobalErrorService();

// Capturer les erreurs non gérées
window.addEventListener('error', (event) => {
  globalErrorService.reportError(
    new Error(event.message),
    `Erreur globale: ${event.filename}:${event.lineno}`
  );
});

// Capturer les promesses rejetées
window.addEventListener('unhandledrejection', (event) => {
  globalErrorService.reportError(
    new Error(event.reason?.message || 'Promise rejetée'),
    'Promise non gérée'
  );
});

logger.info('Service global d\'erreurs initialisé', undefined, 'SYSTEM');
