
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { coachService, CoachEvent } from '@/lib/coachService';
import { useMusic } from '@/contexts/MusicContext';
import { useNavigate } from 'react-router-dom';

/**
 * Hook pour interagir avec le service Coach IA et recevoir des notifications
 */
export function useCoach() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { loadPlaylistForEmotion } = useMusic();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTrigger, setLastTrigger] = useState<Date | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

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
      
      // Actions supplémentaires selon le type d'événement
      if (eventType === 'scan_completed' && data?.emotion) {
        // Charger une playlist adaptée à l'émotion
        loadPlaylistForEmotion(data.emotion);
        
        // Ajouter une recommandation basée sur l'émotion
        let recommendation = '';
        switch(data.emotion.toLowerCase()) {
          case 'tristesse':
            recommendation = 'Une session VR de méditation pourrait vous aider à retrouver votre équilibre.';
            break;
          case 'colère':
            recommendation = 'Je vous suggère une séance de relaxation guidée pour canaliser votre énergie.';
            break;
          case 'anxiété':
            recommendation = 'Des exercices de respiration profonde pourraient vous aider à vous recentrer.';
            break;
          case 'stress':
            recommendation = 'Prenez un moment pour vous détendre avec notre playlist apaisante.';
            break;
          default:
            recommendation = 'Continuez à prendre soin de vous avec nos routines bien-être.';
        }
        
        setRecommendations(prev => [recommendation, ...prev].slice(0, 5));
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
  }, [user, toast, loadPlaylistForEmotion]);

  // Pour déclencher un événement après un scan émotionnel
  const triggerAfterScan = useCallback((emotion: string, confidence: number = 0.8) => {
    return triggerEvent('scan_completed', { emotion, confidence });
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
  const suggestVRSession = useCallback((emotion: string) => {
    // Suggestion basée sur l'émotion
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
    triggerAfterScan,
    triggerAlert,
    triggerDailyReminder,
    suggestVRSession,
    isProcessing,
    lastTrigger,
    recommendations
  };
}

export default useCoach;
