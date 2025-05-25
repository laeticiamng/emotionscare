
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { getLoginRoute } from './routeUtils';

/**
 * Intercepteur global unifié pour la gestion des erreurs d'authentification et API
 * Remplace l'ancien AuthInterceptor pour éviter la duplication
 */
export class GlobalInterceptor {
  private static isRedirecting = false;

  /**
   * Ajoute les headers d'authentification à une requête avec vérification stricte
   */
  static async addAuthHeaders(headers: HeadersInit = {}): Promise<HeadersInit> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('[GlobalInterceptor] Session error:', error);
        throw new Error('Invalid session');
      }

      if (!session?.access_token) {
        console.warn('[GlobalInterceptor] No valid access token found');
        throw new Error('No access token');
      }

      return {
        ...headers,
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      };
    } catch (error) {
      console.error('[GlobalInterceptor] Error getting session:', error);
      // En cas d'erreur de session, déclencher la déconnexion
      await this.handle401Error();
      throw error;
    }
  }

  /**
   * Fetch sécurisé avec gestion automatique des erreurs et retry logic
   */
  static async secureFetch(url: string, options: RequestInit = {}): Promise<Response | null> {
    try {
      // Ajouter les headers d'authentification si nécessaire
      const headers = await this.addAuthHeaders(options.headers);
      
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Gestion des erreurs d'authentification avec retry
      if (response.status === 401) {
        console.log('[GlobalInterceptor] Token might be expired, trying to refresh...');
        
        // Essayer de rafraîchir le token une fois
        const { data: { session: newSession } } = await supabase.auth.getSession();
        if (newSession?.access_token) {
          const retryResponse = await fetch(url, {
            ...options,
            headers: {
              ...headers,
              'Authorization': `Bearer ${newSession.access_token}`,
            },
          });
          
          if (retryResponse.status === 401) {
            await this.handle401Error();
            return null;
          }
          
          return retryResponse;
        } else {
          await this.handle401Error();
          return null;
        }
      }

      // Gestion des erreurs serveur
      if (response.status >= 500) {
        this.handleServerError(response.status, url);
        return null;
      }

      // Gestion silencieuse des erreurs analytics
      if (response.status === 404 && url.includes('analytics')) {
        console.warn('[Analytics] Endpoint not available - feature in development');
        return null;
      }

      return response;
    } catch (error: any) {
      this.handleNetworkError(error, url);
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
      console.warn('[GlobalInterceptor] Session expired, logging out user');
      
      await supabase.auth.signOut();
      
      toast({
        title: "Session expirée",
        description: "Veuillez vous reconnecter pour continuer.",
        variant: "destructive",
      });

      // Redirection intelligente selon la page actuelle
      const currentPath = window.location.pathname;
      let redirectPath = '/choose-mode';

      if (currentPath.startsWith('/b2b/user')) {
        redirectPath = getLoginRoute('b2b_user');
      } else if (currentPath.startsWith('/b2b/admin')) {
        redirectPath = getLoginRoute('b2b_admin');
      } else if (currentPath.startsWith('/b2c')) {
        redirectPath = getLoginRoute('b2c');
      }

      setTimeout(() => {
        window.location.href = redirectPath;
      }, 2000);

    } catch (error) {
      console.error('[GlobalInterceptor] Error during logout:', error);
      window.location.href = '/choose-mode';
    } finally {
      setTimeout(() => {
        this.isRedirecting = false;
      }, 5000);
    }
  }

  /**
   * Gestion des erreurs serveur (5xx)
   */
  static handleServerError(status: number, url: string): void {
    console.error(`[GlobalInterceptor] Server error ${status} on ${url}`);
    
    toast({
      title: "Service indisponible",
      description: "Nos serveurs rencontrent des difficultés. Réessayez plus tard.",
      variant: "destructive",
    });
  }

  /**
   * Gestion des erreurs réseau
   */
  static handleNetworkError(error: any, url: string): void {
    console.error(`[GlobalInterceptor] Network error on ${url}:`, error);
    
    // Ne pas afficher de toast pour les erreurs analytics
    if (!url.includes('analytics')) {
      toast({
        title: "Erreur réseau",
        description: "Vérifiez votre connexion internet et réessayez.",
        variant: "destructive",
      });
    }
  }

  /**
   * Vérifie le statut de la session actuelle avec token strict
   */
  static async checkSessionStatus(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      return !error && !!session?.access_token && 
             session.expires_at ? session.expires_at > Date.now() / 1000 : false;
    } catch (error) {
      console.error('[GlobalInterceptor] Error checking session:', error);
      return false;
    }
  }
}
