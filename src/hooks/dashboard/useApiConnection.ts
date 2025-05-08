
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export function useApiConnection() {
  const [apiReady, setApiReady] = useState(true);
  const [apiCheckInProgress, setApiCheckInProgress] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Function to check the API connection status
  const checkConnectionStatus = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('check-api-connection', {
        body: { userId }
      });
      
      return data?.connected === true;
    } catch (error) {
      console.error("Error checking API connection status:", error);
      return false;
    }
  }, []);

  // Check API connection on load
  useEffect(() => {
    if (user?.id) {
      // API connection check
      const checkAPIConnection = async () => {
        try {
          setApiCheckInProgress(true);
          const success = await checkConnectionStatus(user.id);
          console.log("OpenAI API connection check:", success ? "OK" : "Error");
          setApiReady(success);
          
          if (!success) {
            toast({
              title: "Problème de connexion",
              description: "Impossible de se connecter à l'API OpenAI. Certaines fonctionnalités peuvent être limitées.",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error("Error connecting to OpenAI API:", error);
          setApiReady(false);
          toast({
            title: "Problème de connexion",
            description: "Impossible de se connecter à l'API OpenAI. Certaines fonctionnalités peuvent être limitées.",
            variant: "destructive"
          });
        } finally {
          setApiCheckInProgress(false);
        }
      };
      
      checkAPIConnection();
    }
  }, [user?.id, toast, checkConnectionStatus]);

  return {
    apiReady,
    apiCheckInProgress
  };
}
