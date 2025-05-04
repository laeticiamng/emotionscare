
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { coachService, CoachEvent } from '@/lib/coachService';
import { useMusic } from '@/contexts/MusicContext';

/**
 * Hook pour interagir avec le service Coach IA et recevoir des notifications
 */
export function useCoach() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { loadPlaylistForEmotion } = useMusic();
  const [isProcessing, setIsProcessing] = useState(false);

  // Fonction pour déclencher un événement Coach IA
  const triggerEvent = async (eventType: 'scan_completed' | 'predictive_alert' | 'daily_reminder', data?: any) => {
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
      
      // Actions supplémentaires selon le type d'événement
      if (eventType === 'scan_completed' && data?.emotion) {
        // Charger une playlist adaptée à l'émotion
        loadPlaylistForEmotion(data.emotion);
      }
      
      toast({
        title: "Coach IA",
        description: "Votre routine bien-être a été activée",
      });
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
  };

  // Pour déclencher un événement après un scan émotionnel
  const triggerAfterScan = (emotion: string, confidence: number = 0.8) => {
    return triggerEvent('scan_completed', { emotion, confidence });
  };

  // Pour déclencher une alerte préventive
  const triggerAlert = (alertType: string) => {
    return triggerEvent('predictive_alert', { alertType });
  };

  // Pour déclencher un rappel quotidien
  const triggerDailyReminder = () => {
    return triggerEvent('daily_reminder');
  };

  return {
    triggerAfterScan,
    triggerAlert,
    triggerDailyReminder,
    isProcessing
  };
}

export default useCoach;
