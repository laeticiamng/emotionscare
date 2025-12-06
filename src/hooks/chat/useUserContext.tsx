
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook pour récupérer et gérer le contexte utilisateur pour les chats IA
 */
export function useUserContext() {
  const { user } = useAuth();
  const [userContext, setUserContext] = useState<{
    recentEmotions?: string;
    currentScore?: number;
    lastEmotionDate?: string;
    preferredTopics?: string[];
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Charger le contexte utilisateur depuis Supabase
    const loadUserContext = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      
      try {
        // Récupérer les dernières émotions enregistrées
        const { data: emotions } = await supabase
          .from('emotions')
          .select('emojis, score, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (emotions && emotions.length > 0) {
          // Calculer le score émotionnel moyen
          const avgScore = emotions.reduce((acc, curr) => acc + (curr.score || 50), 0) / emotions.length;
          
          setUserContext({
            recentEmotions: emotions[0].emojis,
            currentScore: Math.round(avgScore),
            lastEmotionDate: emotions[0].created_at,
          });
        }
        
        // Récupérer les préférences utilisateur
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('preferred_topics')
          .eq('user_id', user.id)
          .single();
        
        if (preferences) {
          setUserContext(prev => ({
            ...prev,
            preferredTopics: preferences.preferred_topics
          }));
        }
      } catch (error) {
        console.error('Erreur lors du chargement du contexte utilisateur:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserContext();
  }, [user?.id]);

  return { userContext, isLoading };
}

export default useUserContext;
