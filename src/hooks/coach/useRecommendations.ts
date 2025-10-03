
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useActivity } from '@/hooks/useActivity';

/**
 * Hook to handle coach recommendations generation and management
 */
export function useRecommendations() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [sessionScore, setSessionScore] = useState<number | null>(null);
  const [lastEmotion, setLastEmotion] = useState<string | null>(null);
  const { logActivity } = useActivity();

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
        
        // Log activity
        logActivity('use_coach', { 
          action: 'recommendation_generated', 
          emotion: recentEmojis || 'unknown'
        });
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
  }, [user?.id, logActivity]);

  return {
    recommendations,
    lastEmotion,
    sessionScore,
    generateRecommendation,
    setLastEmotion,
    setSessionScore
  };
}
