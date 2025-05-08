
import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export function useApiConnection() {
  const [apiReady, setApiReady] = useState(true);
  const [apiCheckInProgress, setApiCheckInProgress] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  const retryTimeoutRef = useRef<number | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Délai entre deux vérifications d'API (15 minutes)
  const CHECK_INTERVAL = 15 * 60 * 1000;
  // Maximum d'essais automatiques
  const MAX_AUTO_RETRIES = 3;
  const [autoRetries, setAutoRetries] = useState(0);

  // Nettoyer le timeout lors du démontage du composant
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  // Fonction pour vérifier l'état de la connexion API
  const checkConnectionStatus = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('check-api-connection', {
        body: { userId }
      });
      
      if (error) {
        console.error("Erreur lors de la vérification de la connexion API:", error);
        return false;
      }
      
      return data?.connected === true;
    } catch (error) {
      console.error("Exception lors de la vérification de la connexion API:", error);
      return false;
    }
  }, []);

  // Fonction pour réinitialiser les compteurs de tentatives
  const resetRetries = useCallback(() => {
    setAutoRetries(0);
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  // Fonction pour effectuer manuellement un nouveau test de connexion
  const retryConnectionCheck = useCallback(async (silent: boolean = false): Promise<boolean> => {
    if (!user?.id || apiCheckInProgress) return apiReady;
    
    try {
      setApiCheckInProgress(true);
      const success = await checkConnectionStatus(user.id);
      setApiReady(success);
      setLastCheckTime(new Date());
      
      if (!silent) {
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
          
          // Réinitialiser les compteurs d'essais si la connexion est réussie
          resetRetries();
        }
      }
      
      return success;
    } catch (error) {
      console.error("Erreur lors de la nouvelle tentative de connexion:", error);
      setApiReady(false);
      
      if (!silent) {
        toast({
          title: "Erreur de connexion",
          description: "Impossible de vérifier l'état de la connexion API.",
          variant: "destructive"
        });
      }
      
      return false;
    } finally {
      setApiCheckInProgress(false);
    }
  }, [user?.id, apiCheckInProgress, checkConnectionStatus, toast, apiReady, resetRetries]);

  // Fonction pour gérer les tentatives automatiques
  const scheduleRetry = useCallback(() => {
    if (autoRetries < MAX_AUTO_RETRIES) {
      const delayMs = Math.pow(2, autoRetries) * 1000; // Exponential backoff: 1s, 2s, 4s, ...
      
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      
      console.log(`Planification d'une nouvelle tentative de connexion API dans ${delayMs/1000}s...`);
      
      retryTimeoutRef.current = window.setTimeout(async () => {
        setAutoRetries(prev => prev + 1);
        const success = await retryConnectionCheck(true);
        
        if (!success && autoRetries < MAX_AUTO_RETRIES - 1) {
          scheduleRetry();
        }
      }, delayMs);
    }
  }, [autoRetries, MAX_AUTO_RETRIES, retryConnectionCheck]);

  // Vérification automatique de la connexion API au chargement
  useEffect(() => {
    // Ne vérifier que si l'utilisateur est connecté
    if (!user?.id || apiCheckInProgress) return;
    
    // Vérifier s'il n'y a pas eu de vérification récente
    const shouldCheck = !lastCheckTime || 
                       (new Date().getTime() - lastCheckTime.getTime() > CHECK_INTERVAL);
    
    if (shouldCheck) {
      const checkAPIConnection = async () => {
        try {
          setApiCheckInProgress(true);
          const success = await checkConnectionStatus(user.id);
          console.log("Vérification de la connexion API OpenAI:", success ? "OK" : "Erreur");
          setApiReady(success);
          setLastCheckTime(new Date());
          
          if (!success) {
            toast({
              title: "Problème de connexion",
              description: "Impossible de se connecter à l'API OpenAI. Certaines fonctionnalités peuvent être limitées.",
              variant: "destructive"
            });
            
            // Planifier des tentatives automatiques de reconnexion
            scheduleRetry();
          } else {
            // Réinitialiser les tentatives si la connexion est rétablie
            resetRetries();
          }
        } catch (error) {
          console.error("Erreur de connexion à l'API OpenAI:", error);
          setApiReady(false);
          toast({
            title: "Problème de connexion",
            description: "Impossible de se connecter à l'API OpenAI. Certaines fonctionnalités peuvent être limitées.",
            variant: "destructive"
          });
          
          // Planifier des tentatives automatiques de reconnexion
          scheduleRetry();
        } finally {
          setApiCheckInProgress(false);
        }
      };
      
      checkAPIConnection();
    }
  }, [user?.id, toast, checkConnectionStatus, apiCheckInProgress, lastCheckTime, scheduleRetry, resetRetries, CHECK_INTERVAL]);

  return {
    apiReady,
    apiCheckInProgress,
    lastCheckTime,
    retryConnectionCheck
  };
}
