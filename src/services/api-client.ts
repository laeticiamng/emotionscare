/**
 * Client API centralisé avec gestion d'erreurs robuste
 * Implémente toutes les bonnes pratiques de sécurité et UX
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

// Types pour la gestion d'erreurs
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
  userMessage: string; // Message adapté pour l'utilisateur
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

// Configuration des retry et timeouts
const API_CONFIG = {
  timeout: 10000, // 10 secondes
  maxRetries: 3,
  retryDelay: 1000, // 1 seconde
};

/**
 * Utilitaire pour les délais avec promesses
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Transformation des erreurs techniques en messages utilisateur
 */
const transformError = (error: any): ApiError => {
  // Erreurs réseau
  if (error.name === 'NetworkError' || error.message?.includes('fetch')) {
    return {
      message: error.message,
      userMessage: 'Problème de connexion. Vérifiez votre connexion internet.',
      statusCode: 0
    };
  }

  // Erreurs Supabase
  if (error.code) {
    const errorMap: Record<string, string> = {
      'invalid_credentials': 'Identifiants incorrects.',
      'email_not_confirmed': 'Veuillez confirmer votre email avant de vous connecter.',
      'too_many_requests': 'Trop de tentatives. Veuillez patienter quelques minutes.',
      'invalid_grant': 'Session expirée. Veuillez vous reconnecter.',
      'email_already_exists': 'Cette adresse email est déjà utilisée.',
      'weak_password': 'Le mot de passe doit contenir au moins 8 caractères.',
      'signup_disabled': 'Les inscriptions sont temporairement désactivées.',
    };

    return {
      message: error.message,
      code: error.code,
      userMessage: errorMap[error.code] || 'Une erreur s\'est produite. Veuillez réessayer.',
      statusCode: error.status || 400
    };
  }

  // Erreurs HTTP standards
  if (error.status) {
    const statusMap: Record<number, string> = {
      400: 'Données invalides. Vérifiez vos informations.',
      401: 'Vous devez vous connecter pour accéder à cette ressource.',
      403: 'Vous n\'avez pas les permissions nécessaires.',
      404: 'Ressource non trouvée.',
      409: 'Conflit détecté. Les données ont peut-être été modifiées.',
      422: 'Données incomplètes ou invalides.',
      429: 'Trop de requêtes. Veuillez patienter.',
      500: 'Erreur serveur. Notre équipe a été notifiée.',
      502: 'Service temporairement indisponible.',
      503: 'Maintenance en cours. Veuillez réessayer plus tard.',
    };

    return {
      message: error.message,
      statusCode: error.status,
      userMessage: statusMap[error.status] || 'Erreur inattendue. Veuillez réessayer.',
    };
  }

  // Erreur par défaut
  return {
    message: error.message || 'Unknown error',
    userMessage: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
  };
};

/**
 * Retry logic avec backoff exponentiel
 */
const withRetry = async <T>(
  operation: () => Promise<T>,
  retries = API_CONFIG.maxRetries
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      // Ne pas retry sur certaines erreurs
      const apiError = transformError(error);
      const noRetryStatusCodes = [400, 401, 403, 404, 422];
      
      if (apiError.statusCode && noRetryStatusCodes.includes(apiError.statusCode)) {
        throw error;
      }

      await delay(API_CONFIG.retryDelay * (API_CONFIG.maxRetries - retries + 1));
      return withRetry(operation, retries - 1);
    }
    throw error;
  }
};

/**
 * Client API principal
 */
export class ApiClient {
  /**
   * Wrapper pour les requêtes avec gestion d'erreurs complète
   */
  private static async request<T>(
    operation: () => Promise<{ data: T; error: any }>
  ): Promise<ApiResponse<T>> {
    try {
      const result = await withRetry(async () => {
        const { data, error } = await operation();
        
        if (error) {
          throw error;
        }
        
        return data;
      });

      return {
        data: result,
        success: true
      };

    } catch (error) {
      const apiError = transformError(error);
      
      // Log pour le debugging
      logger.error('API Error', error as Error, 'API');

      return {
        error: apiError,
        success: false
      };
    }
  }

  /**
   * Authentification
   */
  static async signIn(email: string, password: string): Promise<ApiResponse<any>> {
    return this.request(async () => {
      const result = await supabase.auth.signInWithPassword({ email, password });
      return result as { data: any; error: any };
    });
  }

  static async signUp(email: string, password: string, metadata?: any) {
    return this.request(() => 
      supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      })
    );
  }

  static async signOut(): Promise<ApiResponse<unknown>> {
    return this.request(async () => {
      const result = await supabase.auth.signOut();
      return { data: {}, error: result.error };
    });
  }

  static async resetPassword(email: string) {
    return this.request(() => 
      supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
    );
  }

  /**
   * Gestion des profils
   */
  static async getProfile(userId: string): Promise<ApiResponse<any>> {
    return this.request(async () => 
      await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
    );
  }

  static async updateProfile(userId: string, updates: any): Promise<ApiResponse<any>> {
    return this.request(async () => 
      await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
    );
  }

  /**
   * Upload de fichiers
   */
  static async uploadFile(bucket: string, path: string, file: File) {
    return this.request(() => 
      supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        })
    );
  }

  /**
   * Données métier (exemples)
   */
  static async getEmotionScans(userId: string, limit = 50): Promise<ApiResponse<any[] | null>> {
    return this.request(async () => 
      await supabase
        .from('emotion_scans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)
    );
  }

  static async createEmotionScan(scanData: any) {
    const payload = {
      user_id: scanData.user_id ?? scanData.userId ?? null,
      mood: scanData.mood ?? scanData.emotion ?? null,
      confidence: scanData.confidence ?? null,
      emotions: scanData.emotions ?? { scores: scanData.scores ?? {} },
      summary: scanData.summary ?? scanData.description ?? null,
      scan_type: scanData.scan_type ?? scanData.source ?? 'manual',
      recommendations: Array.isArray(scanData.recommendations) ? scanData.recommendations : [],
      insights: Array.isArray(scanData.insights) ? scanData.insights : [],
      emotional_balance: scanData.emotional_balance ?? null,
    };

    return this.request(async () =>
      await supabase
        .from('emotion_scans')
        .insert(payload)
        .select()
        .single()
    );
  }

  /**
   * Health check pour monitoring
   */
  static async healthCheck() {
    return this.request(async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      return { data: { status: 'healthy', timestamp: new Date() }, error };
    });
  }
}

export default ApiClient;