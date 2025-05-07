
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useMusic } from '@/contexts/MusicContext';
import { useNavigate } from 'react-router-dom';
import { coachService, CoachEvent } from '@/lib/coach/coach-service';

/**
 * Hook to handle coach event triggering and processing
 */
export function useCoachEvents(
  generateRecommendation: () => Promise<void>,
  setLastEmotion: (emotion: string) => void,
  setSessionScore: (score: number) => void
) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { loadPlaylistForEmotion } = useMusic();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTrigger, setLastTrigger] = useState<Date | null>(null);

  // Fonction pour déclencher un événement Coach IA
  const triggerEvent = useCallback(async (eventType: 'scan_completed' | 'predictive_alert' | 'daily_reminder', data?: any) => {
    if (!user?.id) return;
    
    setIsProcessing(true);
    
    try {
      // Créer un événement Coach IA
      const event: CoachEvent = {
        type: eventType,
        user_id: user.id,
        data
      };
      
      // Traiter l'événement via le service Coach
      await coachService.processEvent(event);
      
      // Mettre à jour la date du dernier déclenchement
      setLastTrigger(new Date());
      
      // Generate a new recommendation
      generateRecommendation();
      
      // Actions supplémentaires selon le type d'événement
      if (eventType === 'scan_completed' && data?.emojis) {
        // Charger une playlist adaptée à l'émotion
        loadPlaylistForEmotion(data.emojis);
        setLastEmotion(data.emojis);
        if (data.score) {
          setSessionScore(data.score);
        }
      }
      
    } catch (error) {
      console.error('Error triggering coach event:', error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter votre demande",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [user, toast, loadPlaylistForEmotion, generateRecommendation, setLastEmotion, setSessionScore]);

  // Pour déclencher un événement après un scan émotionnel
  const triggerAfterScan = useCallback((emojis: string, score: number = 50) => {
    return triggerEvent('scan_completed', { emojis, score });
  }, [triggerEvent]);

  // Pour déclencher une alerte préventive
  const triggerAlert = useCallback((alertType: string) => {
    return triggerEvent('predictive_alert', { alertType });
  }, [triggerEvent]);

  // Pour déclencher un rappel quotidien
  const triggerDailyReminder = useCallback(() => {
    return triggerEvent('daily_reminder');
  }, [triggerEvent]);

  // Suggérer une session VR basée sur l'émotion
  const suggestVRSession = useCallback((emojis: string) => {
    // Suggestion basée sur l'émoji
    toast({
      title: "Coach IA",
      description: `Une session VR adaptée à votre état émotionnel est disponible.`,
    });
    
    // Rediriger vers la page VR avec un délai pour laisser le temps de lire le toast
    setTimeout(() => {
      navigate('/vr-session');
    }, 2000);
  }, [toast, navigate]);

  return {
    isProcessing,
    lastTrigger,
    triggerAfterScan,
    triggerAlert,
    triggerDailyReminder,
    suggestVRSession
  };
}
