
import { supabase } from '@/integrations/supabase/client';
import { EmotionalData, EmotionalTrend } from './types';

class EmotionalDataService {
  // Fetch the last emotional data for a specific user
  async getLastEmotionalData(userId: string): Promise<EmotionalData | null> {
    if (!userId) return null;
    
    const { data, error } = await supabase
      .from('emotional_data')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(1);
      
    if (error || !data || data.length === 0) {
      console.error('Error fetching emotional data:', error);
      return null;
    }
    
    return data[0] as EmotionalData;
  }
  
  // Fetch emotional data history for a specific user
  async getEmotionalDataHistory(userId: string, limit = 10): Promise<EmotionalData[]> {
    if (!userId) return [];
    
    const { data, error } = await supabase
      .from('emotional_data')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error fetching emotional data history:', error);
      return [];
    }
    
    return data as EmotionalData[];
  }

  // Insert or update emotional data for a user
  async updateUserEmotionalData(userId: string, data: Partial<EmotionalData>): Promise<void> {
    if (!userId) return;
    
    const emotionalData = {
      user_id: userId,
      timestamp: new Date().toISOString(),
      ...data
    };
    
    const { error } = await supabase
      .from('emotional_data')
      .insert(emotionalData);
      
    if (error) {
      console.error('Error updating emotional data:', error);
    }
  }
  
  // Analyze emotional data to detect trends
  async getEmotionalTrend(userId: string, days = 7): Promise<EmotionalTrend | null> {
    const history = await this.getEmotionalDataHistory(userId, days);
    
    if (history.length < 2) {
      return null;
    }
    
    // Simple trend analysis - more sophisticated analysis would be implemented here
    const recentEmotions = history.slice(0, Math.ceil(history.length / 2));
    const olderEmotions = history.slice(Math.ceil(history.length / 2));
    
    // Calculate average valence for recent and older emotions
    const recentValence = this.calculateAverageValence(recentEmotions);
    const olderValence = this.calculateAverageValence(olderEmotions);
    
    // Determine trend direction
    const direction = recentValence > olderValence ? 'improving' : 
                    recentValence < olderValence ? 'declining' : 'stable';
    
    return {
      userId,
      direction,
      magnitude: Math.abs(recentValence - olderValence),
      period: days
    };
  }
  
  // Helper method to calculate average valence from emotional data
  private calculateAverageValence(emotions: EmotionalData[]): number {
    if (emotions.length === 0) return 0;
    
    const totalValence = emotions.reduce((sum, emotion) => {
      return sum + (emotion.valence || 0);
    }, 0);
    
    return totalValence / emotions.length;
  }
  
  // Check if user has a negative emotional trend
  async hasNegativeTrend(userId: string): Promise<boolean> {
    const trend = await this.getEmotionalTrend(userId);
    return trend ? trend.direction === 'declining' && trend.magnitude > 0.2 : false;
  }
}

export const emotionalDataService = new EmotionalDataService();
