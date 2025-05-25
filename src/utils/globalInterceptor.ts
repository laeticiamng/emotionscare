
import { toast } from '@/hooks/use-toast';

/**
 * Intercepteur global consolidé pour la gestion des requêtes API
 * Version production avec sécurité renforcée
 */
export class GlobalInterceptor {
  private static readonly BASE_URL = 'https://yaincoxihiqdksxgrsrk.supabase.co';
  private static readonly TOKEN_KEY = 'sb-yaincoxihiqdksxgrsrk-auth-token';
  private static retryCount = new Map<string, number>();
  private static readonly MAX_RETRIES = 3;

  /**
   * Effectue un appel API sécurisé avec retry automatique
   */
  static async secureFetch(url: string, options: RequestInit = {}): Promise<Response | null> {
    const requestKey = `${url}-${JSON.stringify(options)}`;
    
    try {
      const token = this.getStoredToken();
      const secureHeaders = this.buildSecureHeaders(token, options.headers);
      
      const response = await fetch(url, {
        ...options,
        headers: secureHeaders,
      });

      if (response.status === 401) {
        return this.handle401WithRetry(url, options, requestKey);
      }

      // Reset retry count on success
      this.retryCount.delete(requestKey);
      
      return response;
    } catch (error: any) {
      console.error('[GlobalInterceptor] Request failed:', error);
      return null;
    }
  }

  /**
   * Gère les erreurs 401 avec retry automatique
   */
  private static async handle401WithRetry(
    url: string, 
    options: RequestInit, 
    requestKey: string
  ): Promise<Response | null> {
    const currentRetries = this.retryCount.get(requestKey) || 0;
    
    if (currentRetries >= this.MAX_RETRIES) {
      await this.handle401Error();
      return null;
    }

    // Increment retry count
    this.retryCount.set(requestKey, currentRetries + 1);
    
    // Clear current session
    this.clearSession();
    
    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, 1000 * (currentRetries + 1)));
    
    // Retry with fresh token
    return this.secureFetch(url, options);
  }

  /**
   * Construit les headers sécurisés
   */
  private static buildSecureHeaders(token: string | null, customHeaders?: HeadersInit): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      ...customHeaders,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Récupère le token stocké de manière sécurisée
   */
  private static getStoredToken(): string | null {
    try {
      const stored = localStorage.getItem(this.TOKEN_KEY);
      if (!stored) return null;
      
      const session = JSON.parse(stored);
      return session?.access_token || null;
    } catch {
      return null;
    }
  }

  /**
   * Gère les erreurs 401 (token expiré)
   */
  static async handle401Error(): Promise<void> {
    console.warn('[GlobalInterceptor] Token expired, clearing session');
    
    this.clearSession();
    
    // Rediriger vers la page de connexion
    if (typeof window !== 'undefined') {
      window.location.href = '/choose-mode';
    }
  }

  /**
   * Vide la session de manière sécurisée
   */
  private static clearSession(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      
      // Clear all retry counts
      this.retryCount.clear();
    } catch (error) {
      console.error('[GlobalInterceptor] Error clearing session:', error);
    }
  }

  /**
   * Vérifie le statut de la session
   */
  static async checkSessionStatus(): Promise<boolean> {
    const token = this.getStoredToken();
    if (!token) return false;

    try {
      const stored = localStorage.getItem(this.TOKEN_KEY);
      if (!stored) return false;
      
      const session = JSON.parse(stored);
      const expiresAt = session?.expires_at;
      
      if (!expiresAt) return false;
      
      // Check if token expires in next 5 minutes
      const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
      return expiresAt * 1000 > fiveMinutesFromNow;
    } catch {
      return false;
    }
  }
}
