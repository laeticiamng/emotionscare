
import { supabase } from '@/lib/supabase-client';
import { Challenge } from '@/types/gamification';
import { getGamificationData } from './gamification-data';
import { toast } from '@/hooks/use-toast';

/**
 * Complete a challenge
 * @param challengeId Challenge ID to complete
 */
export const completeChallenge = async (challengeId: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return false;
    
    const userId = user.user.id;
    
    // Mark the challenge as completed
    const { error } = await supabase
      .from('user_challenges')
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq('challenge_id', challengeId)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error completing challenge:', error);
      return false;
    }
    
    // Award points for completing the challenge
    const { data: challenge } = await supabase
      .from('challenges')
      .select('points')
      .eq('id', challengeId)
      .single();
    
    if (challenge) {
      // Get current gamification data
      const gamificationData = await getGamificationData(userId);
      if (gamificationData) {
        // Update points
        const newPoints = gamificationData.points + (challenge.points || 50);
        await supabase
          .from('user_gamification')
          .update({ points: newPoints })
          .eq('user_id', userId);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in completeChallenge:', error);
    return false;
  }
};

/**
 * Get all available challenges
 */
export const getChallenges = async (): Promise<Challenge[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return [];
    
    const userId = user.user.id;
    
    // Get all available challenges
    const { data: challenges, error } = await supabase
      .from('challenges')
      .select('*');
    
    if (error) {
      console.error('Error fetching challenges:', error);
      return [];
    }
    
    // Get user challenges to check which ones are completed
    const { data: userChallenges } = await supabase
      .from('user_challenges')
      .select('challenge_id, completed, progress')
      .eq('user_id', userId);
    
    // Mark challenges as completed if the user has completed them
    const processedChallenges = challenges.map(challenge => {
      const userChallenge = userChallenges?.find(uc => uc.challenge_id === challenge.id);
      return {
        ...challenge,
        completed: userChallenge?.completed || false,
        progress: userChallenge?.progress || 0
      };
    });
    
    return processedChallenges;
  } catch (error) {
    console.error('Error in getChallenges:', error);
    return [];
  }
};
