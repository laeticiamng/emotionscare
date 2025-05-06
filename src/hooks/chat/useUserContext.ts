
import { supabase } from '@/integrations/supabase/client';
import { UserContext } from '@/types/chat';

export const useUserContext = () => {
  // Get the user's emotional context
  const getUserContext = async (userId?: string): Promise<UserContext | null> => {
    if (!userId) return null;
    
    try {
      const { data: emotions } = await supabase
        .from('emotions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(3);
      
      if (!emotions || emotions.length === 0) return null;
      
      // Calculate average score
      const avgScore = emotions.reduce((acc, emotion) => acc + (emotion.score || 50), 0) / emotions.length;
      
      // Get recent emotions
      const recentEmotions = emotions.map(e => e.emojis || '').join(', ');
      
      return {
        recentEmotions,
        currentScore: Math.round(avgScore),
        lastEmotionDate: emotions[0].date
      };
    } catch (error) {
      console.error('Error getting user context:', error);
      return null;
    }
  };

  return { getUserContext };
};
