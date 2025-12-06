import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, RequestConfig, ErrorInterceptor, RequestInterceptor } from '@/types/api';
import { logger } from '@/lib/logger';

/**
 * Client HTTP centralisé avec intercepteurs pour auth/erreurs
 * Point 5: Services API Foundation - Client HTTP configuré
 */
class HttpClient {
  private baseURL: string;
  private requestInterceptors: RequestInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(baseURL: string = 'https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1') {
    this.baseURL = baseURL;
    this.setupDefaultInterceptors();
  }

  /**
   * Configuration des intercepteurs par défaut
   */
  private setupDefaultInterceptors() {
    // Intercepteur d'authentification
    this.addRequestInterceptor(async (config) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${session.access_token}`,
        };
      }
      return config;
    });

    // Intercepteur de gestion d'erreurs
    this.addErrorInterceptor((error) => {
      logger.error('API Error', error, 'API');
      
      // Gestion des erreurs d'authentification
      if (error.status === 401) {
        logger.warn('Unauthorized access - signing out', { status: 401 }, 'API');
        supabase.auth.signOut();
        window.location.href = '/login';
      }
      
      // Gestion des erreurs de permissions
      if (error.status === 403) {
        logger.error('Access forbidden', { message: error.message, status: 403 }, 'API');
      }
      
      return Promise.reject(error);
    });
  }

  /**
   * Ajouter un intercepteur de requête
   */
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Ajouter un intercepteur d'erreur
   */
  addErrorInterceptor(interceptor: ErrorInterceptor) {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * Appliquer les intercepteurs de requête
   */
  private async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let processedConfig = { ...config };
    
    for (const interceptor of this.requestInterceptors) {
      processedConfig = await interceptor(processedConfig);
    }
    
    return processedConfig;
  }

  /**
   * Appliquer les intercepteurs d'erreur
   */
  private async applyErrorInterceptors(error: any): Promise<never> {
    for (const interceptor of this.errorInterceptors) {
      await interceptor(error);
    }
    throw error;
  }

  /**
   * Méthode générique pour les requêtes HTTP
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Appliquer les intercepteurs de requête
      const processedConfig = await this.applyRequestInterceptors({
        ...config,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
      });

      const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}/${endpoint}`;
      
      const response = await fetch(url, {
        method: processedConfig.method || 'GET',
        headers: processedConfig.headers,
        body: processedConfig.data ? JSON.stringify(processedConfig.data) : undefined,
        ...processedConfig,
      });

      if (!response.ok) {
        const error = {
          status: response.status,
          message: response.statusText,
          data: await response.json().catch(() => ({})),
        };
        await this.applyErrorInterceptors(error);
      }

      const data = await response.json();
      
      return {
        data,
        status: response.status,
        message: 'Success',
        success: true,
      };
    } catch (error: any) {
      await this.applyErrorInterceptors(error);
      throw error;
    }
  }

  /**
   * Requête GET
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * Requête POST
   */
  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', data });
  }

  /**
   * Requête PUT
   */
  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', data });
  }

  /**
   * Requête DELETE
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * Requête PATCH
   */
  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', data });
  }
}

// Instance singleton du client HTTP
export const httpClient = new HttpClient();
export default httpClient;