
import { useState, useEffect, useCallback } from 'react';
import { useCoach } from '@/hooks/coach/useCoach';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export function useCoachDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { recommendations, triggerDailyReminder, isProcessing } = useCoach();
  const { loadPlaylistForEmotion, openDrawer } = useMusic();
  const [quickSuggestions] = useState<string[]>([
    "Comment gérer mon stress?",
    "Recommande-moi une musique apaisante",
    "J'ai besoin d'une pause mentale"
  ]);

  // Function to play music recommended by coach
  const playRecommendedMusic = useCallback((emotion: string = 'calm') => {
    loadPlaylistForEmotion(emotion);
    openDrawer();
    toast({
      title: "Musique activée", 
      description: `Une playlist adaptée à votre humeur a été lancée.`
    });
  }, [loadPlaylistForEmotion, openDrawer, toast]);

  // Function to refresh recommendations
  const handleRefreshRecommendations = useCallback(() => {
    if (user?.id) {
      triggerDailyReminder()
        .then(() => {
          toast({
            title: "Recommandations actualisées",
            description: "Nouvelles recommandations personnalisées"
          });
        })
        .catch(err => {
          console.error("Error refreshing recommendations:", err);
          toast({
            title: "Erreur",
            description: "Impossible d'actualiser les recommandations",
            variant: "destructive"
          });
        });
    }
  }, [user?.id, triggerDailyReminder, toast]);

  // Trigger daily reminder on component mount
  useEffect(() => {
    if (user?.id) {
      // Delay the daily reminder to ensure it doesn't block rendering
      const reminderTimeout = setTimeout(() => {
        triggerDailyReminder().catch(err => {
          console.error("Error triggering daily reminder:", err);
        });
      }, 1000);
      
      return () => clearTimeout(reminderTimeout);
    }
  }, [user?.id, triggerDailyReminder]);

  return {
    recommendations,
    isProcessing,
    quickSuggestions,
    playRecommendedMusic,
    handleRefreshRecommendations
  };
}
