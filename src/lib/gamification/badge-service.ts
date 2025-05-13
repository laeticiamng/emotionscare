
import { supabase } from '@/lib/supabase-client';
import { Badge } from '@/types/gamification';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';

// Emotion badges configuration
export const EMOTION_BADGES = [
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
 * Evaluate badges for users based on their gamification data
 * @param userId User ID
 * @param emotionCounts Counts of emotions recorded
 * @param totalEmotions Total number of emotions recorded
 * @param streakDays Current streak days
 * @param currentBadges User's current badges
 * @returns Newly earned badge, if any
 */
export const evaluateBadgesForUser = (
  userId: string, 
  emotionCounts: Record<string, number>,
  totalEmotions: number,
  streakDays: number,
  currentBadges: Badge[]
): Badge | null => {
  
  let newBadge: Badge | null = null;

  // Check each badge type for achievement
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
        const positiveEmotions = ['joy', 'calm', 'excited', 'creative'];
        const negativeEmotions = ['anger', 'fear', 'sadness', 'stress'];
        
        const totalPositive = positiveEmotions.reduce((sum, emotion) => 
          sum + (emotionCounts[emotion] || 0), 0);
        const totalNegative = negativeEmotions.reduce((sum, emotion) => 
          sum + (emotionCounts[emotion] || 0), 0);
          
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
      
      newBadge = badge;
      break; // Only award one badge at a time
    }
  }
  
  return newBadge;
};
