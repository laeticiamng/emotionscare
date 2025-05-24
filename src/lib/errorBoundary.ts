
/**
 * Service de gestion d'erreur globale centralisé
 */

export interface ErrorReport {
  message: string;
  stack?: string;
  context?: string;
  timestamp: string;
  userAgent: string;
  url: string;
}

class GlobalErrorService {
  private errorQueue: ErrorReport[] = [];
  private maxErrors = 50;

  reportError(error: Error, context?: string): void {
    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.errorQueue.push(errorReport);
    
    // Garder seulement les dernières erreurs
    if (this.errorQueue.length > this.maxErrors) {
      this.errorQueue.shift();
    }

    // Log en console pour le développement
    console.error('[GlobalError]', errorReport);

    // En production, envoyer à un service de monitoring
    if (import.meta.env.PROD) {
      this.sendToMonitoring(errorReport);
    }
  }

  private async sendToMonitoring(errorReport: ErrorReport): Promise<void> {
    try {
      // Ici on pourrait envoyer à Sentry, LogRocket, etc.
      // Pour l'instant, on stocke localement
      const existingErrors = JSON.parse(localStorage.getItem('error_reports') || '[]');
      existingErrors.push(errorReport);
      
      // Garder seulement les 20 dernières erreurs
      if (existingErrors.length > 20) {
        existingErrors.splice(0, existingErrors.length - 20);
      }
      
      localStorage.setItem('error_reports', JSON.stringify(existingErrors));
    } catch (storageError) {
      console.error('Failed to store error report:', storageError);
    }
  }

  getErrorHistory(): ErrorReport[] {
    return [...this.errorQueue];
  }

  clearErrors(): void {
    this.errorQueue = [];
    localStorage.removeItem('error_reports');
  }
}

export const globalErrorService = new GlobalErrorService();

// Handler global pour les erreurs non capturées
window.addEventListener('error', (event) => {
  globalErrorService.reportError(
    new Error(event.message),
    `Uncaught error at ${event.filename}:${event.lineno}:${event.colno}`
  );
});

// Handler pour les promesses rejetées
window.addEventListener('unhandledrejection', (event) => {
  globalErrorService.reportError(
    new Error(event.reason?.message || 'Unhandled promise rejection'),
    'Unhandled promise rejection'
  );
});
