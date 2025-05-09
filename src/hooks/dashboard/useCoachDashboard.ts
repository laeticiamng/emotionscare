
import { useState, useEffect, useCallback } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getCoachRecommendations } from '@/lib/coach/coach-service';
import { safeOpen } from '@/lib/utils';

const DEFAULT_RECOMMENDATIONS = [
  "Essayez une séance de méditation guidée",
  "Écrivez dans votre journal pour exprimer vos pensées",
  "Faites une promenade dans la nature pour vous détendre",
  "Écoutez de la musique apaisante pour améliorer votre humeur"
];

export const useCoachDashboard = () => {
  const { setOpenDrawer } = useMusic();
  const { toast } = useToast();
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<string[]>(DEFAULT_RECOMMENDATIONS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quickSuggestions, setQuickSuggestions] = useState<string[]>([]);

  const loadRecommendations = useCallback(async () => {
    if (!user?.id) return;
    setIsProcessing(true);
    try {
      const aiRecommendations = await getCoachRecommendations(user.id);
      setRecommendations(aiRecommendations);
      setQuickSuggestions(aiRecommendations.slice(0, 3));
    } catch (error) {
      console.error("Failed to load AI recommendations:", error);
      setRecommendations([
        "Essayez une séance de méditation guidée",
        "Écrivez dans votre journal pour exprimer vos pensées",
        "Faites une promenade dans la nature pour vous détendre",
        "Écoutez de la musique apaisante pour améliorer votre humeur"
      ]);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les recommandations IA. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [user?.id, toast]);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  const playRecommendedMusic = (emotion: string) => {
    safeOpen(setOpenDrawer);
    toast({
      title: "Musique recommandée activée",
      description: `Playlist "${emotion}" chargée pour accompagner votre humeur.`,
    });
  };

  const handleRefreshRecommendations = () => {
    loadRecommendations();
  };

  return {
    recommendations,
    isProcessing,
    quickSuggestions,
    playRecommendedMusic,
    handleRefreshRecommendations,
  };
};
