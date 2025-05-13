import { supabase } from '@/lib/supabase-client';
import { Badge, EmotionBadge, GamificationLevel } from '@/types/gamification';
import { v4 as uuidv4 } from 'uuid';
import { Emotion } from '@/types';
import { toast } from '@/hooks/use-toast';

// Gamification points for different activities
const POINTS = {
  EMOTION_SCAN: 10,
  STREAK_DAY: 5,
  JOURNAL_ENTRY: 15,
  MEDITATION_COMPLETE: 20,
  COACH_CHAT: 5,
  BALANCED_EMOTION: 15
};

// Level thresholds
const LEVEL_THRESHOLDS = [
  0,     // Level 1
  100,   // Level 2
  250,   // Level 3
  500,   // Level 4
  1000,  // Level 5
  2000,  // Level 6
  3500,  // Level 7
  5000,  // Level 8
  7500,  // Level 9
  10000  // Level 10
];

// Emotion badges configuration
const EMOTION_BADGES: EmotionBadge[] = [
  {
    id: 'emotion-tracker-bronze',
    name: 'Traceur d\'émotions Bronze',
    description: 'Enregistrez 5 émotions',
    type: 'achievement',
    icon: '🥉',
    threshold: 5,
    emotionCount: 5
  },
  {
    id: 'emotion-tracker-silver',
    name: 'Traceur d\'émotions Argent',
    description: 'Enregistrez 25 émotions',
    type: 'achievement',
    icon: '🥈',
    threshold: 25,
    emotionCount: 25
  },
  {
    id: 'emotion-tracker-gold',
    name: 'Traceur d\'émotions Or',
    description: 'Enregistrez 100 émotions',
    type: 'achievement',
    icon: '🥇',
    threshold: 100,
    emotionCount: 100
  },
  {
    id: 'joy-explorer',
    name: 'Explorateur de Joie',
    description: 'Explorez votre joie 10 fois',
    type: 'emotion',
    icon: '😄',
    emotion: 'joy',
    threshold: 10
  },
  {
    id: 'calm-mind',
    name: 'Esprit Calme',
    description: 'Atteignez un état calme 10 fois',
    type: 'emotion',
    icon: '😌',
    emotion: 'calm',
    threshold: 10
  },
  {
    id: 'courage-badge',
    name: 'Badge de Courage',
    description: 'Admettez votre peur 5 fois',
    type: 'emotion',
    icon: '😰',
    emotion: 'fear',
    threshold: 5
  },
  {
    id: 'emotional-awareness',
    name: 'Conscience Émotionnelle',
    description: 'Enregistrez 5 émotions différentes',
    type: 'diversity',
    icon: '🌈',
    threshold: 5
  },
  {
    id: 'emotional-balance',
    name: 'Équilibre Émotionnel',
    description: 'Maintenez un équilibre entre émotions positives et négatives',
    type: 'balance',
    icon: '☯️',
    threshold: 10
  },
  {
    id: 'streak-week',
    name: 'Régularité Hebdomadaire',
    description: 'Enregistrez des émotions 7 jours de suite',
    type: 'streak',
    icon: '🔥',
    threshold: 7,
    streakDays: 7
  }
];

/**
 * Process an emotion scan for gamification badges and points
 * @param userId User ID
 * @param emotion Emotion detected
 * @param confidence Confidence level of detection
 * @returns The badge earned, if any
 */
export const processEmotionForBadges = async (
  userId: string,
  emotion: string,
  confidence: number
): Promise<Badge | null> => {
  try {
    // 1. Get user's current gamification data
    const { data: userData, error: userError } = await supabase
      .from('user_gamification')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (userError && userError.code !== 'PGRST116') {
      console.error('Error fetching user gamification data:', userError);
      return null;
    }

    // 2. If no data exists, create it
    if (!userData) {
      const { error: createError } = await supabase
        .from('user_gamification')
        .insert({
          user_id: userId,
          points: POINTS.EMOTION_SCAN,
          level: 1,
          badges: [],
          streak_days: 1,
          last_activity_date: new Date().toISOString().split('T')[0],
          emotion_counts: { [emotion]: 1 }
        });
      
      if (createError) {
        console.error('Error creating user gamification data:', createError);
        return null;
      }
      
      return null; // First entry, no badges yet
    }
    
    // 3. Prepare data for update
    const today = new Date().toISOString().split('T')[0];
    const lastActivityDate = userData.last_activity_date;
    const isConsecutiveDay = isConsecutiveDate(lastActivityDate, today);
    
    let streakDays = userData.streak_days || 0;
    if (isConsecutiveDay) {
      streakDays += 1;
    } else if (lastActivityDate !== today) {
      streakDays = 1; // Reset streak if not consecutive and not same day
    }
    
    // Update emotion counts
    const emotionCounts = userData.emotion_counts || {};
    emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    
    // Calculate points to add
    let pointsToAdd = POINTS.EMOTION_SCAN;
    if (isConsecutiveDay && lastActivityDate !== today) {
      pointsToAdd += POINTS.STREAK_DAY;
    }
    
    // Check for balanced emotions
    const positiveEmotions = ['joy', 'calm', 'excited', 'creative'];
    const negativeEmotions = ['anger', 'fear', 'sadness', 'stress'];
    
    const totalPositive = positiveEmotions.reduce((sum, emotion) => 
      sum + (emotionCounts[emotion] || 0), 0);
    const totalNegative = negativeEmotions.reduce((sum, emotion) => 
      sum + (emotionCounts[emotion] || 0), 0);
    
    // Bonus for emotional balance
    if (totalPositive > 0 && totalNegative > 0 && 
        Math.abs(totalPositive - totalNegative) <= 3 && 
        totalPositive + totalNegative >= 10) {
      pointsToAdd += POINTS.BALANCED_EMOTION;
    }
    
    // 4. Check for badges
    const currentBadges = userData.badges || [];
    let newBadge: Badge | null = null;
    
    // Calculate total emotions tracked
    const totalEmotions = Object.values(emotionCounts).reduce((a, b) => (a as number) + (b as number), 0) as number;
    
    // Check each badge type
    for (const badgeTemplate of EMOTION_BADGES) {
      // Skip if user already has this badge
      if (currentBadges.some(b => b.id === badgeTemplate.id)) {
        continue;
      }
      
      let badgeEarned = false;
      
      switch (badgeTemplate.type) {
        case 'achievement':
          // Emotion tracker badges based on total count
          if (totalEmotions >= badgeTemplate.threshold) {
            badgeEarned = true;
          }
          break;
          
        case 'emotion':
          // Specific emotion badges
          if (badgeTemplate.emotion && 
              emotionCounts[badgeTemplate.emotion] >= badgeTemplate.threshold) {
            badgeEarned = true;
          }
          break;
          
        case 'diversity':
          // Emotion diversity badge
          if (Object.keys(emotionCounts).length >= badgeTemplate.threshold) {
            badgeEarned = true;
          }
          break;
          
        case 'balance':
          // Emotional balance badge
          if (totalPositive >= badgeTemplate.threshold/2 && 
              totalNegative >= badgeTemplate.threshold/2 && 
              Math.abs(totalPositive - totalNegative) <= 3) {
            badgeEarned = true;
          }
          break;
          
        case 'streak':
          // Streak badge
          if (streakDays >= badgeTemplate.threshold) {
            badgeEarned = true;
          }
          break;
      }
      
      if (badgeEarned) {
        // Create badge instance with timestamp
        const badge: Badge = {
          id: badgeTemplate.id,
          name: badgeTemplate.name,
          description: badgeTemplate.description,
          icon: badgeTemplate.icon,
          earned_at: new Date().toISOString(),
          type: badgeTemplate.type
        };
        
        // Add badge to array
        currentBadges.push(badge);
        newBadge = badge;
        
        // Add bonus points for earning a badge
        pointsToAdd += 50;
        
        break; // Only award one badge at a time
      }
    }
    
    // 5. Calculate new level
    const newPoints = userData.points + pointsToAdd;
    let newLevel = userData.level;
    
    // Check if user leveled up
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (newPoints >= LEVEL_THRESHOLDS[i]) {
        newLevel = i + 1;
        break;
      }
    }
    
    // 6. Update user data
    const { error: updateError } = await supabase
      .from('user_gamification')
      .update({
        points: newPoints,
        level: newLevel,
        badges: currentBadges,
        streak_days: streakDays,
        last_activity_date: today,
        emotion_counts: emotionCounts
      })
      .eq('user_id', userId);
    
    if (updateError) {
      console.error('Error updating user gamification data:', updateError);
      return null;
    }
    
    return newBadge;
  } catch (error) {
    console.error('Error processing emotion for badges:', error);
    return null;
  }
};

/**
 * Check if two dates are consecutive
 */
function isConsecutiveDate(date1: string, date2: string): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // Reset hours to compare just dates
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  
  // Calculate difference in days
  const diffTime = d2.getTime() - d1.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
  return diffDays === 1;
}

/**
 * Get gamification data for a user
 */
export const getGamificationData = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_gamification')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching gamification data:', error);
      return null;
    }
    
    if (!data) {
      // Return default data structure if no data exists
      return {
        points: 0,
        level: 1,
        badges: [],
        streak_days: 0,
        emotion_counts: {},
        last_activity_date: null
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error in getGamificationData:', error);
    return null;
  }
};

/**
 * Get level data based on points
 */
export const getLevelData = (points: number): GamificationLevel => {
  // Determine current level
  let currentLevel = 1;
  let nextLevel = 2;
  let currentLevelThreshold = 0;
  let nextLevelThreshold = LEVEL_THRESHOLDS[1];
  
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_THRESHOLDS[i]) {
      currentLevel = i + 1;
      currentLevelThreshold = LEVEL_THRESHOLDS[i];
      nextLevel = i + 2;
      nextLevelThreshold = LEVEL_THRESHOLDS[i + 1] || LEVEL_THRESHOLDS[i] * 2;
      break;
    }
  }
  
  // Calculate progress to next level
  const pointsInCurrentLevel = points - currentLevelThreshold;
  const pointsToNextLevel = nextLevelThreshold - currentLevelThreshold;
  const progress = Math.min(100, Math.round((pointsInCurrentLevel / pointsToNextLevel) * 100));
  
  return {
    currentLevel,
    nextLevel,
    progress,
    points,
    pointsToNextLevel: nextLevelThreshold - points
  };
};

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
 * Get all available badges
 */
export const getBadges = async (): Promise<Badge[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return [];
    
    const userId = user.user.id;
    
    // Get all available badges from the database
    const { data: badges, error } = await supabase
      .from('badges')
      .select('*');
    
    if (error) {
      console.error('Error fetching badges:', error);
      return [];
    }
    
    // Get user badges to check which ones are already unlocked
    const { data: userBadges } = await supabase
      .from('user_badges')
      .select('badge_id, unlocked_at')
      .eq('user_id', userId);
    
    // Mark badges as unlocked if the user has them
    const processedBadges = badges.map(badge => {
      const userBadge = userBadges?.find(ub => ub.badge_id === badge.id);
      return {
        ...badge,
        unlocked: !!userBadge,
        unlocked_at: userBadge?.unlocked_at
      };
    });
    
    return processedBadges;
  } catch (error) {
    console.error('Error in getBadges:', error);
    return [];
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
