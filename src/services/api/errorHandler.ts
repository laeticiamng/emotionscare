import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export class ApiErrorHandler {
  static handle(error: any): ApiError {
    if (error.response) {
      return this.handleAxiosError(error);
    }
    return this.handleGenericError(error);
  }

  private static handleAxiosError(error: any): ApiError {
    const status = error.response?.status;
    const data = error.response?.data;
    const message = data?.message || error.message;

    // Log détaillé pour le debug
    logger.error('API Error', error, 'API');

    // Gestion spécifique par code d'erreur
    switch (status) {
      case 400:
        this.showToast('Erreur', 'Données invalides', 'destructive');
        break;
      case 401:
        this.showToast('Session expirée', 'Veuillez vous reconnecter', 'destructive');
        this.redirectToLogin();
        break;
      case 403:
        this.showToast('Accès refusé', 'Permissions insuffisantes', 'destructive');
        break;
      case 404:
        this.showToast('Non trouvé', 'Ressource introuvable', 'destructive');
        break;
      case 429:
        this.showToast('Limite atteinte', 'Trop de requêtes, patientez', 'destructive');
        break;
      case 500:
        this.showToast('Erreur serveur', 'Problème technique temporaire', 'destructive');
        break;
      default:
        if (status && status >= 500) {
          this.showToast('Erreur serveur', message, 'destructive');
        } else if (status && status >= 400) {
          this.showToast('Erreur', message, 'destructive');
        }
    }

    return {
      message,
      code: data?.code,
      status,
      details: data
    };
  }

  private static handleGenericError(error: Error): ApiError {
    logger.error('Generic Error', error, 'API');
    
    this.showToast('Erreur', 'Une erreur inattendue est survenue', 'destructive');
    
    return {
      message: error.message,
      details: error
    };
  }

  private static showToast(title: string, description: string, variant: 'destructive' | 'default' = 'default') {
    toast({
      variant,
      title,
      description,
      duration: variant === 'destructive' ? 5000 : 3000
    });
  }

  private static redirectToLogin() {
    // Sauvegarder l'URL actuelle pour redirection post-login
    sessionStorage.setItem('redirectUrl', window.location.pathname);
    
    // Nettoyer le token
    localStorage.removeItem('auth_token');
    
    // Rediriger vers login
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  }

  // Méthodes utilitaires pour les composants
  static isNetworkError(error: any): boolean {
    return error.code === 'NETWORK_ERROR' || !navigator.onLine;
  }

  static isTimeoutError(error: any): boolean {
    return error.code === 'ECONNABORTED' || error.message?.includes('timeout');
  }

  static shouldRetry(error: any): boolean {
    const status = error.status;
    return (
      this.isNetworkError(error) ||
      this.isTimeoutError(error) ||
      (status >= 500 && status < 600)
    );
  }
}

// Hook pour utiliser la gestion d'erreurs dans les composants
export const useErrorHandler = () => {
  const handleError = (error: any) => {
    return ApiErrorHandler.handle(error);
  };

  return { handleError };
};
