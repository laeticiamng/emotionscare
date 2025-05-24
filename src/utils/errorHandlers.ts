
import { toast } from '@/hooks/use-toast';

/**
 * Gestionnaire d'erreurs global pour les requêtes API
 */
export class ApiErrorHandler {
  
  /**
   * Gère les erreurs d'analytics (endpoint temporairement absent)
   */
  static handleAnalyticsError(error: any, context?: string): void {
    console.warn(`[Analytics Error] ${context || 'Unknown context'}:`, error);
    
    if (error?.status >= 400) {
      console.warn(`Analytics endpoint returned ${error.status}. Feature will be available in next release.`);
    }
    
    // Ne pas montrer de toast pour éviter de polluer l'UX
    // L'analytics est non-critique pour l'utilisateur
  }

  /**
   * Gère les erreurs des fonctions vocales (en maintenance)
   */
  static handleVoiceError(error: any, context?: string): void {
    console.error(`[Voice Error] ${context || 'Unknown context'}:`, error);
    
    if (error?.status >= 500) {
      toast({
        title: "Fonction vocale temporairement indisponible",
        description: "Nos services vocaux sont en maintenance. Réessayez dans quelques minutes.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Erreur de traitement vocal",
        description: "Impossible de traiter votre demande vocale pour le moment.",
        variant: "destructive",
      });
    }
  }

  /**
   * Gère les erreurs génériques (500, 404, etc.)
   */
  static handleGenericError(error: any, context?: string): void {
    console.error(`[API Error] ${context || 'Unknown context'}:`, error);
    
    if (error?.status === 500) {
      toast({
        title: "Service indisponible",
        description: "Nos serveurs rencontrent des difficultés. Réessayez plus tard.",
        variant: "destructive",
      });
    } else if (error?.status === 404) {
      toast({
        title: "Fonction en maintenance",
        description: "Cette fonctionnalité est temporairement indisponible.",
        variant: "destructive",
      });
    } else if (error?.status === 401) {
      // Géré par le AuthErrorHandler
      return;
    } else {
      toast({
        title: "Erreur inattendue",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  }

  /**
   * Timeout pour les fonctions vocales (15s max)
   */
  static createVoiceTimeout(timeoutMs: number = 15000): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Voice request timeout'));
      }, timeoutMs);
    });
  }
}

/**
 * Gestionnaire spécialisé pour les erreurs d'authentification
 */
export class AuthErrorHandler {
  
  /**
   * Gère les erreurs 401 (token expiré ou invalide)
   */
  static async handle401Error(navigate: (path: string) => void): Promise<void> {
    console.warn('[Auth] Token expired or invalid, logging out user');
    
    try {
      // Importer supabase de manière dynamique pour éviter les dépendances circulaires
      const { supabase } = await import('@/integrations/supabase/client');
      await supabase.auth.signOut();
    } catch (error) {
      console.error('[Auth] Error during signout:', error);
    }

    toast({
      title: "Session expirée",
      description: "Veuillez vous reconnecter.",
      variant: "destructive",
    });

    // Rediriger vers la page de login appropriée
    navigate('/choose-mode');
  }
}
