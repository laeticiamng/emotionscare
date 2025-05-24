
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Intercepteur global pour la gestion des erreurs d'authentification
 */
export class AuthInterceptor {
  private static isRedirecting = false;

  /**
   * Ajoute le token d'authentification aux headers
   */
  static async addAuthHeaders(headers: HeadersInit = {}): Promise<HeadersInit> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session?.access_token) {
        console.warn('[AuthInterceptor] No valid session found');
        return headers;
      }

      return {
        ...headers,
        'Authorization': `Bearer ${session.access_token}`,
      };
    } catch (error) {
      console.error('[AuthInterceptor] Error getting session:', error);
      return headers;
    }
  }

  /**
   * Wrapper fetch sécurisé avec gestion automatique des erreurs 401
   */
  static async secureFetch(url: string, options: RequestInit = {}): Promise<Response | null> {
    try {
      // Ajouter les headers d'authentification
      const headers = await this.addAuthHeaders(options.headers);
      
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Gérer les erreurs d'authentification
      if (response.status === 401) {
        await this.handle401Error();
        return null;
      }

      // Gérer les autres erreurs de serveur
      if (response.status >= 500) {
        toast({
          title: "Service indisponible",
          description: "Nos serveurs rencontrent des difficultés. Réessayez plus tard.",
          variant: "destructive",
        });
        return null;
      }

      return response;
    } catch (error: any) {
      console.error('[AuthInterceptor] Network error:', error);
      toast({
        title: "Erreur réseau",
        description: "Vérifiez votre connexion internet et réessayez.",
        variant: "destructive",
      });
      return null;
    }
  }

  /**
   * Gestion centralisée des erreurs 401
   */
  static async handle401Error(): Promise<void> {
    if (this.isRedirecting) {
      return; // Éviter les redirections multiples
    }

    this.isRedirecting = true;

    try {
      console.warn('[AuthInterceptor] Session expired, logging out user');
      
      // Déconnecter l'utilisateur
      await supabase.auth.signOut();
      
      // Afficher un message à l'utilisateur
      toast({
        title: "Session expirée",
        description: "Veuillez vous reconnecter pour continuer.",
        variant: "destructive",
      });

      // Redirection vers la page de sélection de mode après un court délai
      setTimeout(() => {
        window.location.href = '/choose-mode';
      }, 2000);

    } catch (error) {
      console.error('[AuthInterceptor] Error during logout:', error);
      // Redirection forcée en cas d'erreur
      window.location.href = '/choose-mode';
    } finally {
      // Reset du flag après délai
      setTimeout(() => {
        this.isRedirecting = false;
      }, 3000);
    }
  }

  /**
   * Vérifie le statut de la session actuelle
   */
  static async checkSessionStatus(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      return !error && !!session?.access_token;
    } catch (error) {
      console.error('[AuthInterceptor] Error checking session:', error);
      return false;
    }
  }
}
