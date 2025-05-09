
import { useState, useEffect } from 'react';

export function useApiConnection() {
  const [apiReady, setApiReady] = useState(false);
  const [apiCheckInProgress, setApiCheckInProgress] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        setApiCheckInProgress(true);
        setApiError(null);
        
        // Simulate API health check
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock success response
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
    await new Promise(resolve => setTimeout(resolve, 1000));
    setApiCheckInProgress(true);
    setApiError(null);
    
    try {
      // Simulate API check
      await new Promise(resolve => setTimeout(resolve, 1500));
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
