
/**
 * Service functions for the dashboard
 */

import { supabase } from '@/lib/supabaseClient';
import { MoodData, Emotion, EmotionPrediction, Badge } from '@/types';

/**
 * Fetch user emotions
 */
export const fetchUserEmotions = async (userId: string, days = 30) => {
  const { data, error } = await supabase
    .from('emotions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(days);
  
  if (error) {
    console.error('Error fetching user emotions:', error);
    throw error;
  }
  
  return data as Emotion[];
};

/**
 * Fetch user mood data
 */
export const fetchMoodData = async (userId: string, days = 30): Promise<MoodData[]> => {
  try {
    // Mock implementation - replace with actual API call
    const mockData: MoodData[] = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      mockData.push({
        date: date.toISOString(),
        value: Math.floor(Math.random() * 10) + 1,
        sentiment: Math.random() * 2 - 1, // Between -1 and 1
        anxiety: Math.random() * 10,
        energy: Math.random() * 10
      });
    }
    
    return mockData.reverse();
  } catch (error) {
    console.error('Error fetching mood data:', error);
    throw error;
  }
};

/**
 * Fetch reports data (absenteeism, productivity, etc.)
 */
export const fetchReports = async (
  reportTypes: string[],
  days: number = 30,
  segment?: { dimensionKey: string | null; optionKey: string | null }
) => {
  // Mock implementation - replace with actual API call
  const result: Record<string, any> = {};
  
  // Generate mock data for each report type
  reportTypes.forEach(type => {
    const data = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      data.push({
        date: `${date.getDate()}/${date.getMonth() + 1}`,
        value: Math.floor(Math.random() * 100)
      });
    }
    
    result[type] = data.reverse();
  });
  
  return result;
};

/**
 * Fetch user emotion predictions
 */
export const fetchPredictions = async (userId: string): Promise<EmotionPrediction> => {
  // This is a mock implementation
  return {
    predictedEmotion: 'contentment',
    emotion: 'contentment', // Added the required 'emotion' property
    probability: 0.8,
    confidence: 0.75,
    triggers: ['work stress', 'sleep quality', 'social interactions'],
    recommendations: [
      'Take short breaks every 2 hours',
      'Practice deep breathing exercises',
      'Consider a short walk outside'
    ]
  };
};

/**
 * Fetch user badges count
 */
export const fetchBadgesCount = async (userId: string): Promise<number> => {
  try {
    // Mock implementation - replace with actual API call
    return 5; // Mock badge count
  } catch (error) {
    console.error('Error fetching badges count:', error);
    return 0;
  }
};

/**
 * Fetch user badges
 */
export const fetchBadges = async (userId: string): Promise<Badge[]> => {
  try {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .eq('user_id', userId)
      .order('awarded_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching badges:', error);
    return [];
  }
};

/**
 * Fetch predictive analytics
 */
export const getPredictiveAnalytics = async (userId: string): Promise<EmotionPrediction> => {
  // This would be an actual API call in a real application
  // For demonstration, we'll return mock data
  
  return {
    predictedEmotion: 'calm',
    emotion: 'calm', // Added the required 'emotion' property
    probability: 0.85,
    confidence: 0.75,
    triggers: [
      'Work-related stress',
      'Inadequate sleep patterns',
      'Regular physical activity'
    ],
    recommendations: [
      'Consider mindfulness meditation for 10 minutes daily',
      'Maintain regular sleep schedule',
      'Continue physical activity routine'
    ]
  };
};
