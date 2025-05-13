
import { Badge, Challenge, GamificationStats, LeaderboardEntry } from '@/types/gamification';
import { getBadgesForUser, getAllBadges } from './gamification/badge-service';
import { getChallengesForUser, getAllChallenges } from './gamification/challenge-service';
import { getUserStats } from './gamification/stats-service';

// Add the missing completeChallenge function
export const completeChallenge = async (
  userId: string,
  challengeId: string
): Promise<Challenge | null> => {
  try {
    console.log(`Completing challenge ${challengeId} for user ${userId}`);
    
    // In a real implementation, this would make an API call to update the challenge status
    // For now, we'll simulate a successful completion
    
    // Fetch the current challenge to update it
    const challenges = await getChallengesForUser(userId);
    const challenge = challenges.find(c => c.id === challengeId);
    
    if (!challenge) {
      console.error(`Challenge ${challengeId} not found for user ${userId}`);
      return null;
    }
    
    // Update challenge status to completed
    const updatedChallenge: Challenge = {
      ...challenge,
      status: 'completed',
      progress: 100
    };
    
    console.log(`Challenge ${challengeId} marked as completed`);
    
    // In a real implementation, we would persist this change
    
    return updatedChallenge;
  } catch (error) {
    console.error('Error completing challenge:', error);
    return null;
  }
};

// Export existing functions
export { 
  getBadgesForUser, 
  getAllBadges, 
  getChallengesForUser, 
  getAllChallenges,
  getUserStats 
};

// Add missing updateChallenge function
export const updateChallenge = async (
  userId: string,
  challengeId: string,
  updates: Partial<Challenge>
): Promise<Challenge | null> => {
  try {
    console.log(`Updating challenge ${challengeId} for user ${userId}`, updates);
    
    // In a real implementation, this would make an API call to update the challenge
    // For now, we'll simulate a successful update
    
    // Fetch the current challenge to update it
    const challenges = await getChallengesForUser(userId);
    const challenge = challenges.find(c => c.id === challengeId);
    
    if (!challenge) {
      console.error(`Challenge ${challengeId} not found for user ${userId}`);
      return null;
    }
    
    // Update challenge with new values
    const updatedChallenge: Challenge = {
      ...challenge,
      ...updates
    };
    
    console.log(`Challenge ${challengeId} updated successfully`);
    
    // In a real implementation, we would persist this change
    
    return updatedChallenge;
  } catch (error) {
    console.error('Error updating challenge:', error);
    return null;
  }
};
