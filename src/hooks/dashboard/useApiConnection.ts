
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export function useApiConnection() {
  const [apiReady, setApiReady] = useState(true);
  const [apiCheckInProgress, setApiCheckInProgress] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fonction pour vérifier l'état de la connexion API
  const checkConnectionStatus = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('check-api-connection', {
        body: { userId }
      });
      
      if (error) {
        console.error("Error checking API connection:", error);
        return false;
      }
      
      return data?.connected === true;
    } catch (error) {
      console.error("Exception checking API connection status:", error);
      return false;
    }
  }, []);

  // Fonction pour effectuer manuellement un nouveau test de connexion
  const retryConnectionCheck = useCallback(async (): Promise<boolean> => {
    if (!user?.id || apiCheckInProgress) return false;
    
    try {
      setApiCheckInProgress(true);
      const success = await checkConnectionStatus(user.id);
      setApiReady(success);
      setLastCheckTime(new Date());
      
      if (!success) {
        toast({
          title: "Problème de connexion",
          description: "Impossible de se connecter à l'API OpenAI. Certaines fonctionnalités peuvent être limitées.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Connexion établie",
          description: "La connexion à l'API OpenAI est opérationnelle."
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error during connection retry:", error);
      setApiReady(false);
      toast({
        title: "Erreur de connexion",
        description: "Impossible de vérifier l'état de la connexion API.",
        variant: "destructive"
      });
      return false;
    } finally {
      setApiCheckInProgress(false);
    }
  }, [user?.id, apiCheckInProgress, checkConnectionStatus, toast]);

  // Vérification automatique de la connexion API au chargement
  useEffect(() => {
    if (user?.id) {
      // Effectuer la vérification seulement si elle n'est pas déjà en cours
      if (!apiCheckInProgress) {
        const checkAPIConnection = async () => {
          try {
            setApiCheckInProgress(true);
            const success = await checkConnectionStatus(user.id);
            console.log("OpenAI API connection check:", success ? "OK" : "Error");
            setApiReady(success);
            setLastCheckTime(new Date());
            
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
    }
  }, [user?.id, toast, checkConnectionStatus, apiCheckInProgress]);

  return {
    apiReady,
    apiCheckInProgress,
    lastCheckTime,
    retryConnectionCheck
  };
}
