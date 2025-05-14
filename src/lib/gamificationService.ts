
import { Badge, EmotionResult } from '@/types';
import { supabase } from './supabaseClient';
import { calculateProgressToNextLevel, calculateXpToNextLevel } from './gamification/level-service';
import { Challenge } from '@/hooks/community-gamification/types';

// Processes emotion data for potential badges
export async function processEmotionForBadges(userId: string, emotion: EmotionResult): Promise<Badge[]> {
  try {
    // Mock implementation - would typically call a backend service
    console.log('Processing emotion for badges:', userId, emotion);
    
    // Check for emotion-related badges
    const earnedBadges: Badge[] = [];
    
    // Example: badge for experiencing joy
    if (emotion.emotion === 'joy' || emotion.primaryEmotion?.name === 'joy') {
      earnedBadges.push({
        id: 'joy-badge-1',
        name: 'Joyful Explorer',
        description: 'Experienced joy and shared it with others',
        image_url: '/badges/joy.svg'
      });
    }
    
    // Example: badge for managing anger
    if (emotion.emotion === 'anger' || emotion.primaryEmotion?.name === 'anger') {
      earnedBadges.push({
        id: 'anger-badge-1',
        name: 'Emotion Master',
        description: 'Successfully recognized and managed feelings of anger',
        image_url: '/badges/anger-management.svg'
      });
    }
    
    // In a real implementation, you would save these badges to the database
    if (earnedBadges.length > 0) {
      console.log('User earned badges:', earnedBadges);
      
      // Simulate saving to database
      // await saveBadgesToDatabase(userId, earnedBadges);
    }
    
    return earnedBadges;
  } catch (error) {
    console.error('Error processing emotion for badges:', error);
    return [];
  }
}

// Get all badges for a user
export async function getBadgesForUser(userId: string): Promise<Badge[]> {
  try {
    // In a real implementation, you would fetch badges from the database
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching badges:', error);
    return [];
  }
}

// Get all challenges for a user
export async function getChallengesForUser(userId: string): Promise<Challenge[]> {
  try {
    // Mock implementation - would typically call a backend service
    console.log('Fetching challenges for user:', userId);
    
    // Sample challenges (would normally come from a database)
    const challenges: Challenge[] = [
      {
        id: 'challenge-1',
        name: 'Daily Emotion Check-in',
        description: 'Check in with your emotions for 7 consecutive days',
        type: 'streak',
        category: 'emotional',
        difficulty: 'easy',
        points: 100,
        status: 'in-progress',
        progress: 3,
        requirements: ['Daily check-in for 7 days'],
        rewards: ['Badge "Emotion Tracker"', '100 XP']
      }
    ];
    
    return challenges;
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return [];
  }
}

// Get gamification stats for a user
export async function getUserGamificationStats(userId: string) {
  try {
    // Mock implementation - would typically call a backend service
    console.log('Fetching gamification stats for user:', userId);
    
    // Sample stats (would normally come from a database)
    const stats = {
      level: 3,
      points: 450,
      badges: 5,
      challenges: 2,
      streakDays: 7,
      nextMilestone: 500,
      progressToNextLevel: calculateProgressToNextLevel(userId),
      xpToNextLevel: calculateXpToNextLevel(userId)
    };
    
    return stats;
  } catch (error) {
    console.error('Error fetching gamification stats:', error);
    return null;
  }
}
