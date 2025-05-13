import { Badge, Challenge, Achievement } from '@/types/gamification';

// Mock data for challenges
const challenges: Challenge[] = [
  {
    id: 'challenge-1',
    title: 'First Journal Entry',
    description: 'Create your first journal entry to start tracking your emotional journey.',
    points: 10,
    requirements: ['Create a journal entry'],
    completed: false,
    category: 'journal',
    difficulty: 'easy',
    name: 'First Journal Entry'  // Added name property
  },
  {
    id: 'challenge-2',
    title: 'Complete an Emotion Scan',
    description: 'Complete your first emotion scan to understand your emotional state.',
    points: 15,
    requirements: ['Use the emotion scanner'],
    completed: false,
    category: 'emotions',
    difficulty: 'easy',
    name: 'Complete an Emotion Scan'  // Added name property
  }
];

// Mock data for badges
const badges: Badge[] = [
  {
    id: 'badge-1',
    name: 'Emotion Explorer',
    description: 'Completed 5 emotion scans',
    image_url: '/badges/emotion-explorer.png',
    threshold: 5,
    progress: 2,
    unlocked: false
  },
  {
    id: 'badge-2',
    name: 'Journal Master',
    description: 'Created 10 journal entries',
    image_url: '/badges/journal-master.png',
    threshold: 10,
    progress: 3,
    unlocked: false
  }
];

// Get all challenges
export const getChallenges = async (): Promise<Challenge[]> => {
  return [...challenges];
};

// Get a specific challenge by ID
export const getChallenge = async (id: string): Promise<Challenge | undefined> => {
  return challenges.find(challenge => challenge.id === id);
};

// Complete a challenge
export const completeChallenge = async (id: string): Promise<Challenge | undefined> => {
  const challengeIndex = challenges.findIndex(challenge => challenge.id === id);
  
  if (challengeIndex === -1) {
    return undefined;
  }
  
  challenges[challengeIndex] = {
    ...challenges[challengeIndex],
    completed: true
  };
  
  return challenges[challengeIndex];
};

// Get all badges
export const getBadges = async (): Promise<Badge[]> => {
  return [...badges];
};

// Get a specific badge by ID
export const getBadge = async (id: string): Promise<Badge | undefined> => {
  return badges.find(badge => badge.id === id);
};

// Unlock a badge
export const unlockBadge = async (id: string): Promise<Badge | undefined> => {
  const badgeIndex = badges.findIndex(badge => badge.id === id);
  
  if (badgeIndex === -1) {
    return undefined;
  }
  
  badges[badgeIndex] = {
    ...badges[badgeIndex],
    unlocked: true,
    unlocked_at: new Date().toISOString(),
    progress: badges[badgeIndex].threshold || 1
  };
  
  return badges[badgeIndex];
};

// Update badge progress
export const updateBadgeProgress = async (id: string, progress: number): Promise<Badge | undefined> => {
  const badgeIndex = badges.findIndex(badge => badge.id === id);
  
  if (badgeIndex === -1) {
    return undefined;
  }
  
  const threshold = badges[badgeIndex].threshold || 1;
  const isUnlocked = progress >= threshold;
  
  badges[badgeIndex] = {
    ...badges[badgeIndex],
    progress,
    unlocked: isUnlocked,
    unlocked_at: isUnlocked ? new Date().toISOString() : undefined
  };
  
  return badges[badgeIndex];
};

// Awards a badge based on emotion data
export const processEmotionForBadges = async (
  userId: string,
  emotion: string,
  intensity: number
): Promise<Badge | null> => {
  try {
    // Get existing badges for this user
    const { data: existingBadges } = await supabase
      .from('badges')
      .select('*')
      .eq('user_id', userId);
      
    // Get total scan count
    const { count } = await supabase
      .from('emotions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
      
    let newBadge: Badge | null = null;
    
    // Check for milestone based badges
    if (count === 1) {
      newBadge = {
        id: 'first-scan',
        name: 'Premier Scan',
        description: 'Premier scan émotionnel complété',
        icon: 'award',
        category: 'milestone'
      };
    } else if (count === 10) {
      newBadge = {
        id: 'ten-scans',
        name: 'Scanner Émotionnel',
        description: '10 scans émotionnels complétés',
        icon: 'activity',
        category: 'milestone'
      };
    } else if (count === 50) {
      newBadge = {
        id: 'emotion-master',
        name: 'Maître des Émotions',
        description: '50 scans émotionnels complétés',
        icon: 'star',
        category: 'milestone'
      };
    }
    
    // Check for consistency streak badges
    const streakDays = await calculateEmotionStreak(userId);
    if (streakDays === 3) {
      const hasBadge = existingBadges?.some(b => b.name === 'Constance');
      if (!hasBadge) {
        newBadge = {
          id: 'three-day-streak',
          name: 'Constance',
          description: 'Scan émotionnel 3 jours consécutifs',
          icon: 'calendar',
          category: 'streak'
        };
      }
    } else if (streakDays === 7) {
      const hasBadge = existingBadges?.some(b => b.name === 'Régularité');
      if (!hasBadge) {
        newBadge = {
          id: 'week-streak',
          name: 'Régularité',
          description: 'Scan émotionnel 7 jours consécutifs',
          icon: 'calendar-check',
          category: 'streak'
        };
      }
    } else if (streakDays === 30) {
      const hasBadge = existingBadges?.some(b => b.name === 'Dévouement');
      if (!hasBadge) {
        newBadge = {
          id: 'month-streak',
          name: 'Dévouement',
          description: 'Scan émotionnel 30 jours consécutifs',
          icon: 'award',
          category: 'streak'
        };
      }
    }
    
    // Check for emotion diversity badges
    const { data: distinctEmotions } = await supabase
      .from('emotions')
      .select('emojis')
      .eq('user_id', userId)
      .not('emojis', 'is', null);
      
    // Count unique emotions
    const uniqueEmotions = new Set(distinctEmotions?.map(d => d.emojis));
    if (uniqueEmotions.size >= 5) {
      const hasBadge = existingBadges?.some(b => b.name === 'Émotion Variée');
      if (!hasBadge) {
        newBadge = {
          id: 'emotion-diversity',
          name: 'Émotion Variée',
          description: 'Expérience de 5 émotions différentes',
          icon: 'smile',
          category: 'diversity'
        };
      }
    }
    
    // Save the new badge if one was earned
    if (newBadge && userId) {
      const { error: badgeError } = await supabase
        .from('badges')
        .insert({
          user_id: userId,
          name: newBadge.name,
          description: newBadge.description,
          image_url: `/badges/${newBadge.id}.png`,
          awarded_at: new Date().toISOString()
        });
        
      if (badgeError) {
        console.error('Error saving badge:', badgeError);
        return null;
      }
      
      return newBadge;
    }
    
    return null;
  } catch (error) {
    console.error('Error processing emotion for badges:', error);
    return null;
  }
};

// Calculate consecutive days streak for a user
export const calculateEmotionStreak = async (userId: string): Promise<number> => {
  try {
    const { data: emotionsData, error } = await supabase
      .from('emotions')
      .select('date')
      .eq('user_id', userId)
      .order('date', { ascending: false });
      
    if (error || !emotionsData) {
      return 0;
    }
    
    if (emotionsData.length === 0) {
      return 0;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streakDays = 0;
    let currentDate = new Date(today);
    
    // Check for consecutive days with entries
    while (true) {
      // Format the date as yyyy-MM-dd to match with dates in the database
      const dateString = currentDate.toISOString().split('T')[0];
      
      // Find if there's an entry for this date
      const hasEntryForDate = emotionsData.some(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.toISOString().split('T')[0] === dateString;
      });
      
      if (hasEntryForDate) {
        streakDays++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streakDays;
  } catch (error) {
    console.error('Error calculating emotion streak:', error);
    return 0;
  }
};

export default {
  getChallenges,
  getChallenge,
  completeChallenge,
  getBadges,
  getBadge,
  unlockBadge,
  updateBadgeProgress,
  processEmotionForBadges,
  calculateEmotionStreak
};
