
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useApiConnection() {
  const [apiReady, setApiReady] = useState(false);
  const [apiCheckInProgress, setApiCheckInProgress] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        setApiCheckInProgress(true);
        setApiError(null);
        
        // Check if Supabase configuration exists by trying to make a simple request
        // rather than accessing protected properties
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        
        if (error) {
          throw error;
        }
        
        setApiReady(true);
      } catch (error) {
        console.error('API connection check failed:', error);
        setApiError('Failed to connect to API');
        setApiReady(false);
      } finally {
        setApiCheckInProgress(false);
      }
    };

    checkApiConnection();
  }, []);

  const retryConnection = async () => {
    setApiCheckInProgress(true);
    setApiError(null);
    
    try {
      // Try to make a simple request to validate connection
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error) {
        throw error;
      }
      
      setApiReady(true);
    } catch (error) {
      console.error('API reconnection attempt failed:', error);
      setApiError('Failed to reconnect to API');
      setApiReady(false);
    } finally {
      setApiCheckInProgress(false);
    }
  };

  return {
    apiReady,
    apiCheckInProgress,
    apiError,
    retryConnection
  };
}
