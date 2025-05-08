
import { useState, useEffect, useCallback, useRef } from 'react';
import { useCoach } from '@/hooks/coach/useCoach';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useApiConnection } from '@/hooks/dashboard/useApiConnection';

export function useCoachDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { recommendations, triggerDailyReminder, isProcessing } = useCoach();
  const { loadPlaylistForEmotion, openDrawer } = useMusic();
  const { apiReady, apiCheckInProgress } = useApiConnection();
  const hasTriggeredInitialReminder = useRef(false);
  
  // Questions rapides prédéfinies - peut être étendu ultérieurement pour être chargé depuis une API
  const [quickSuggestions] = useState<string[]>([
    "Comment gérer mon stress?",
    "Recommande-moi une musique apaisante",
    "J'ai besoin d'une pause mentale",
    "Techniques de respiration efficaces"
  ]);

  // Fonction pour jouer la musique recommandée par le coach
  const playRecommendedMusic = useCallback((emotion: string = 'calm') => {
    try {
      loadPlaylistForEmotion(emotion);
      openDrawer();
      toast({
        title: "Musique activée", 
        description: `Une playlist adaptée à votre humeur a été lancée.`
      });
    } catch (error) {
      console.error("Erreur lors du chargement de la musique:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la musique recommandée.",
        variant: "destructive"
      });
    }
  }, [loadPlaylistForEmotion, openDrawer, toast]);

  // Fonction pour actualiser les recommandations
  const handleRefreshRecommendations = useCallback(() => {
    if (!user?.id) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour obtenir des recommandations.",
        variant: "destructive"
      });
      return;
    }
    
    if (!apiReady) {
      toast({
        title: "API indisponible",
        description: "Le service d'IA n'est pas disponible actuellement.",
        variant: "destructive"
      });
      return;
    }

    triggerDailyReminder()
      .then(() => {
        toast({
          title: "Recommandations actualisées",
          description: "Nouvelles recommandations personnalisées"
        });
        hasTriggeredInitialReminder.current = true;
      })
      .catch(err => {
        console.error("Erreur lors de l'actualisation des recommandations:", err);
        toast({
          title: "Erreur",
          description: "Impossible d'actualiser les recommandations",
          variant: "destructive"
        });
      });
  }, [user?.id, apiReady, triggerDailyReminder, toast]);

  // Déclencher les recommandations quotidiennes au chargement du composant avec une meilleure gestion
  useEffect(() => {
    // Ne faire la requête que si toutes les conditions sont réunies et si nous ne l'avons pas déjà fait
    if (user?.id && apiReady && !apiCheckInProgress && !isProcessing && !hasTriggeredInitialReminder.current) {
      // Délai pour éviter de bloquer le rendu
      const reminderTimeout = setTimeout(() => {
        console.log("Déclenchement automatique des recommandations quotidiennes");
        triggerDailyReminder()
          .then(() => {
            hasTriggeredInitialReminder.current = true;
          })
          .catch(err => {
            console.error("Erreur lors du déclenchement des rappels quotidiens:", err);
          });
      }, 2500); // Délai plus long pour éviter les problèmes de chargement
      
      return () => clearTimeout(reminderTimeout);
    }
  }, [user?.id, triggerDailyReminder, apiReady, apiCheckInProgress, isProcessing]);

  return {
    recommendations,
    isProcessing,
    quickSuggestions,
    apiReady,
    apiCheckInProgress,
    playRecommendedMusic,
    handleRefreshRecommendations
  };
}
