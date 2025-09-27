
import { useAuthStore } from '@/stores/useAuthStore';
import { supabase } from '@/integrations/supabase/client';

interface SecureAPIOptions {
  requireAuth?: boolean;
  allowAnonymous?: boolean;
}

export const useSecureAPI = () => {
  const { session, isAuthenticated } = useAuthStore();

  const secureCall = async <T>(
    apiCall: () => Promise<T>,
    options: SecureAPIOptions = { requireAuth: true }
  ): Promise<T | null> => {
    // Vérifier l'authentification si requise
    if (options.requireAuth && !isAuthenticated) {
      console.warn('🚫 API call blocked - authentication required');
      throw new Error('Authentication required for this operation');
    }

    // Vérifier que la session est valide
    if (options.requireAuth && session) {
      const expiresAt = session.expires_at * 1000;
      const now = Date.now();
      
      if (expiresAt < now) {
        console.warn('🚫 API call blocked - session expired');
        throw new Error('Session expired, please login again');
      }
    }

    try {
      return await apiCall();
    } catch (error) {
      console.error('❌ Secure API call failed:', error);
      throw error;
    }
  };

  const getAuthHeaders = () => {
    if (!session?.access_token) {
      return {};
    }

    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    };
  };

  const secureSupabaseCall = async <T>(
    operation: () => Promise<{ data: T; error: any }>
  ): Promise<T> => {
    if (!isAuthenticated) {
      throw new Error('Authentication required for Supabase operations');
    }

    const { data, error } = await operation();
    
    if (error) {
      console.error('❌ Supabase operation failed:', error);
      throw error;
    }

    return data;
  };

  return {
    secureCall,
    getAuthHeaders,
    secureSupabaseCall,
    isAuthenticated,
    session
  };
};
