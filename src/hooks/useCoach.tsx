
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { coachService, CoachEvent, triggerCoachEvent } from '@/lib/coach/coach-service';
import { useMusic } from '@/contexts/MusicContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook pour interagir avec le service Coach IA et recevoir des recommandations
 */
export function useCoach() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { loadPlaylistForEmotion } = useMusic();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTrigger, setLastTrigger] = useState<Date | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [sessionScore, setSessionScore] = useState<number | null>(null);
  const [lastEmotion, setLastEmotion] = useState<string | null>(null);

  // Fetch initial recommendations on component mount
  useEffect(() => {
    if (user?.id && recommendations.length === 0) {
      generateRecommendation();
    }
  }, [user?.id]);

  // Generate a recommendation based on recent user data
  const generateRecommendation = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      // Get recent emotion data
      const { data: emotions } = await supabase
        .from('emotions')
        .select('emojis, score')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(3);
      
      const recentEmojis = emotions?.length ? emotions[0].emojis : null;
      const avgScore = emotions?.length ? 
        Math.round(emotions.reduce((acc, e) => acc + (e.score || 50), 0) / emotions.length) : 
        null;
      
      if (avgScore) {
        setSessionScore(avgScore);
      }
      
      if (recentEmojis) {
        setLastEmotion(recentEmojis);
      }
      
      // Generate recommendation with AI
      const prompt = `Donne-moi un conseil bien-être court et pratique ${
        recentEmojis ? `pour une personne qui ressent ${recentEmojis}` : 
        avgScore ? `pour une personne dont le score émotionnel est ${avgScore}/100` : 
        ''
      }. Sois concis (max 160 caractères) et actionable.`;
      
      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: {
          message: prompt,
          userContext: {
            recentEmotions: recentEmojis,
            currentScore: avgScore
          },
          model: "gpt-4o-mini",
          temperature: 0.3,
          max_tokens: 100
        }
      });
      
      if (error) throw error;
      
      if (data?.response) {
        // Clean up response
        const recommendation = data.response.trim()
          .replace(/^["']|["']$/g, '') // Remove quotes
          .replace(/^\d+\.\s*/, ''); // Remove numbering
        
        setRecommendations(prev => [recommendation, ...prev].slice(0, 5));
      }
    } catch (error) {
      console.error('Error generating recommendation:', error);
      
      // Provide fallback recommendations
      const fallbackRecommendations = [
        "Prenez une pause de 5 minutes pour respirer profondément et vous recentrer.",
        "Une courte marche de 10 minutes peut faire des merveilles pour votre concentration et votre humeur.",
        "Essayez la méthode 4-7-8 : inspirez pendant 4s, retenez 7s, expirez 8s. Répétez 4 fois."
      ];
      
      // Add a random recommendation
      const randomIndex = Math.floor(Math.random() * fallbackRecommendations.length);
      setRecommendations(prev => [fallbackRecommendations[randomIndex], ...prev].slice(0, 5));
    }
  }, [user?.id]);

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
  }, [user, toast, loadPlaylistForEmotion, generateRecommendation]);

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

  // Pour poser une question directe au coach IA
  const askQuestion = useCallback(async (question: string): Promise<string> => {
    if (!user?.id) return "Veuillez vous connecter pour utiliser le coach IA.";
    
    try {
      // Obtenir de nouvelles recommandations basées sur la question
      generateRecommendation();
      
      return await coachService.askCoachQuestion(user.id, question);
    } catch (error) {
      console.error('Error asking coach question:', error);
      return "Je suis désolé, mais je rencontre des difficultés techniques pour répondre à votre question.";
    }
  }, [user, generateRecommendation]);

  return {
    triggerAfterScan,
    triggerAlert,
    triggerDailyReminder,
    suggestVRSession,
    askQuestion,
    isProcessing,
    lastTrigger,
    recommendations,
    generateRecommendation,
    sessionScore,
    lastEmotion
  };
}

export default useCoach;
