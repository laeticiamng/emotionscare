
import { supabase } from '@/lib/supabase-client';
import { Badge } from '@/types/gamification';
import { Emotion } from '@/types';
import { toast } from '@/hooks/use-toast';

import { POINTS } from './utils';
import { isConsecutiveDate } from './utils';
import { getGamificationData } from './gamification-data';
import { evaluateBadgesForUser } from './badge-service';
import { calculateLevel } from './level-service';

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
    
    // Calculate total emotions tracked
    const totalEmotions = Object.values(emotionCounts).reduce((a, b) => (a as number) + (b as number), 0) as number;
    
    const newBadge = evaluateBadgesForUser(
      userId, 
      emotionCounts, 
      totalEmotions, 
      streakDays, 
      currentBadges
    );
    
    if (newBadge) {
      // Add badge to array
      currentBadges.push(newBadge);
      
      // Add bonus points for earning a badge
      pointsToAdd += 50;
    }
    
    // 5. Calculate new level
    const newPoints = userData.points + pointsToAdd;
    const newLevel = calculateLevel(newPoints);
    
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
