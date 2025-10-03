
import { rateLimiter } from './rateLimiter';
import { toast } from '@/hooks/use-toast';

/**
 * Client API sécurisé avec rate limiting et gestion d'erreurs
 */
class SecureApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseUrl = 'https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async makeRequest(
    endpoint: string, 
    options: RequestInit = {},
    rateLimitKey: string
  ): Promise<Response> {
    // Vérifier le rate limiting côté client
    const rateLimitResult = rateLimiter.checkLimit(rateLimitKey as any);
    if (!rateLimitResult.allowed) {
      const resetTime = rateLimitResult.resetTime ? new Date(rateLimitResult.resetTime) : null;
      const message = resetTime 
        ? `Trop de requêtes. Réessayez après ${resetTime.toLocaleTimeString()}`
        : 'Trop de requêtes. Veuillez patienter.';
      
      toast({
        title: "Limite atteinte",
        description: message,
        variant: "destructive",
      });
      
      throw new Error(message);
    }

    // Ajouter le token d'authentification
    const token = localStorage.getItem('supabase.auth.token');
    const headers = {
      ...this.defaultHeaders,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      ...options,
      headers,
    });

    // Gestion centralisée des erreurs HTTP
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `Erreur HTTP ${response.status}`;
      
      switch (response.status) {
        case 401:
          toast({
            title: "Non authentifié",
            description: "Veuillez vous reconnecter",
            variant: "destructive",
          });
          // Rediriger vers la page de connexion
          window.location.href = '/choose-mode';
          break;
        case 403:
          toast({
            title: "Accès refusé",
            description: "Vous n'avez pas les permissions nécessaires",
            variant: "destructive",
          });
          break;
        case 429:
          toast({
            title: "Trop de requêtes",
            description: errorMessage,
            variant: "destructive",
          });
          break;
        default:
          toast({
            title: "Erreur",
            description: errorMessage,
            variant: "destructive",
          });
      }
      
      throw new Error(errorMessage);
    }

    return response;
  }

  /**
   * Analyser une émotion depuis un texte
   */
  async analyzeEmotion(text: string) {
    const response = await this.makeRequest(
      'analyze-emotion',
      {
        method: 'POST',
        body: JSON.stringify({ text }),
      },
      'api_calls'
    );
    
    return response.json();
  }

  /**
   * Envoyer une invitation
   */
  async sendInvitation(email: string, role: string, organizationId?: string) {
    const response = await this.makeRequest(
      'send-invitation',
      {
        method: 'POST',
        body: JSON.stringify({ email, role, organizationId }),
      },
      'api_calls'
    );
    
    return response.json();
  }
}

export const secureApiClient = new SecureApiClient();
