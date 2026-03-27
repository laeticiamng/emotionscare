// @ts-nocheck
import { supabase } from '@/lib/supabase-client';
import { calculateLevel } from './level-service';
import { logger } from '@/lib/logger';

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
      logger.error('Error fetching gamification data', error as Error, 'API');
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
    logger.error('Error in getGamificationData', error as Error, 'API');
    return null;
  }
};

/**
 * Update gamification data for a user
 */
export const updateGamificationData = async (
  userId: string, 
  updates: Partial<{
    points: number,
    badges: any[],
    streak_days: number,
    emotion_counts: Record<string, number>,
    last_activity_date: string,
    level: number
  }>
) => {
  try {
    const { error } = await supabase
      .from('user_gamification')
      .update(updates)
      .eq('user_id', userId);
      
    if (error) {
      logger.error('Error updating gamification data', error as Error, 'API');
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Error in updateGamificationData', error as Error, 'API');
    return false;
  }
};

/**
 * Initialize gamification data for a new user
 */
export const initializeGamificationData = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('user_gamification')
      .insert({
        user_id: userId,
        points: 0,
        level: 1,
        badges: [],
        streak_days: 0,
        last_activity_date: new Date().toISOString().split('T')[0],
        emotion_counts: {}
      });
      
    if (error) {
      logger.error('Error initializing gamification data', error as Error, 'API');
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Error in initializeGamificationData', error as Error, 'API');
    return false;
  }
};
