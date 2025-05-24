
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Intercepteur global pour la gestion des erreurs d'authentification
 * Renforcé pour la conformité JWT stricte
 */
export class AuthInterceptor {
  private static isRedirecting = false;

  /**
   * Ajoute le token d'authentification aux headers avec vérification stricte
   */
  static async addAuthHeaders(headers: HeadersInit = {}): Promise<HeadersInit> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('[AuthInterceptor] Session error:', error);
        throw new Error('Invalid session');
      }

      if (!session?.access_token) {
        console.warn('[AuthInterceptor] No valid access token found');
        throw new Error('No access token');
      }

      return {
        ...headers,
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      };
    } catch (error) {
      console.error('[AuthInterceptor] Error getting session:', error);
      // En cas d'erreur de session, déclencher la déconnexion
      await this.handle401Error();
      throw error;
    }
  }

  /**
   * Wrapper fetch sécurisé avec gestion automatique des erreurs
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

      // Gérer les erreurs de serveur avec toast approprié
      if (response.status >= 500) {
        toast({
          title: "Service indisponible",
          description: "Nos serveurs rencontrent des difficultés. Réessayez plus tard.",
          variant: "destructive",
        });
        return null;
      }

      // Gérer les erreurs 404 analytics en silence
      if (response.status === 404 && url.includes('analytics')) {
        console.warn('[Analytics] Endpoint not available - feature in development');
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
   * Gestion centralisée des erreurs 401 avec redirection intelligente
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

      // Redirection intelligente selon la page actuelle
      const currentPath = window.location.pathname;
      let redirectPath = '/choose-mode';

      if (currentPath.startsWith('/b2b/user')) {
        redirectPath = '/b2b/user/login';
      } else if (currentPath.startsWith('/b2b/admin')) {
        redirectPath = '/b2b/admin/login';
      } else if (currentPath.startsWith('/b2c')) {
        redirectPath = '/b2c/login';
      }

      // Redirection après délai pour laisser le toast s'afficher
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 2000);

    } catch (error) {
      console.error('[AuthInterceptor] Error during logout:', error);
      // Redirection forcée en cas d'erreur
      window.location.href = '/choose-mode';
    } finally {
      // Reset du flag après délai
      setTimeout(() => {
        this.isRedirecting = false;
      }, 5000);
    }
  }

  /**
   * Vérifie le statut de la session actuelle avec token strict
   */
  static async checkSessionStatus(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      return !error && !!session?.access_token && session.expires_at ? session.expires_at > Date.now() / 1000 : false;
    } catch (error) {
      console.error('[AuthInterceptor] Error checking session:', error);
      return false;
    }
  }
}
