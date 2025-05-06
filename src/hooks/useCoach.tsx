
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { coachService, CoachEvent, triggerCoachEvent } from '@/lib/coachService';
import { useMusic } from '@/contexts/MusicContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

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
      if (eventType === 'scan_completed' && data?.emojis) {
        // Fix: Use emojis or another available property instead of emotion
        // Charger une playlist adaptée à l'émotion
        loadPlaylistForEmotion(data.emojis);
        
        // Ajouter une recommandation basée sur l'émotion via l'API OpenAI
        try {
          const { data: aiResponse, error } = await supabase.functions.invoke('chat-with-ai', {
            body: {
              message: `Propose une activité simple de bien-être adaptée à quelqu'un qui ressent ${data.emojis}. Réponds en une phrase courte.`,
              userContext: {
                recentEmotions: data.emojis,
                currentScore: data.score || 50
              }
            }
          });
          
          if (!error && aiResponse.response) {
            setRecommendations(prev => [aiResponse.response, ...prev].slice(0, 5));
          }
        } catch (error) {
          console.error('Error getting AI recommendation:', error);
          // Fallback recommendations en cas d'erreur
          let recommendation = '';
          
          // Use emoji data to determine recommendation
          const emoji = data.emojis.toLowerCase();
          if (emoji.includes('😢') || emoji.includes('😭')) {
            recommendation = 'Une session VR de méditation pourrait vous aider à retrouver votre équilibre.';
          } else if (emoji.includes('😡') || emoji.includes('😠')) {
            recommendation = 'Je vous suggère une séance de relaxation guidée pour canaliser votre énergie.';
          } else if (emoji.includes('😰') || emoji.includes('😨')) {
            recommendation = 'Des exercices de respiration profonde pourraient vous aider à vous recentrer.';
          } else if (emoji.includes('😓') || emoji.includes('😖')) {
            recommendation = 'Prenez un moment pour vous détendre avec notre playlist apaisante.';
          } else {
            recommendation = 'Continuez à prendre soin de vous avec nos routines bien-être.';
          }
          
          setRecommendations(prev => [recommendation, ...prev].slice(0, 5));
        }
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
  const triggerAfterScan = useCallback((emojis: string, confidence: number = 0.8) => {
    return triggerEvent('scan_completed', { emojis, confidence });
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

  // Pour poser une question directe au coach IA
  const askQuestion = useCallback(async (question: string): Promise<string> => {
    if (!user?.id) return "Veuillez vous connecter pour utiliser le coach IA.";
    
    try {
      return await coachService.askCoachQuestion(user.id, question);
    } catch (error) {
      console.error('Error asking coach question:', error);
      return "Je suis désolé, mais je rencontre des difficultés techniques pour répondre à votre question.";
    }
  }, [user]);

  return {
    triggerAfterScan,
    triggerAlert,
    triggerDailyReminder,
    suggestVRSession,
    askQuestion,
    isProcessing,
    lastTrigger,
    recommendations
  };
}

export default useCoach;
