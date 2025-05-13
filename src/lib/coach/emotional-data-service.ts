
import { supabase } from '@/integrations/supabase/client';
import { EmotionalData, EmotionalTrend } from './types';

class EmotionalDataService {
  // Mock storage for emotional data since the table doesn't exist in Supabase
  private emotionalData: Map<string, EmotionalData[]> = new Map();

  // Fetch the last emotional data for a specific user
  async getLastEmotionalData(userId: string): Promise<EmotionalData | null> {
    if (!userId) return null;
    
    // Get user data from our mock storage
    const userEmotions = this.emotionalData.get(userId) || [];
    
    if (userEmotions.length === 0) {
      return null;
    }
    
    // Sort by timestamp descending and get the first item
    return [...userEmotions].sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateB - dateA;
    })[0];
  }
  
  // Fetch emotional data history for a specific user
  async getEmotionalDataHistory(userId: string, limit = 10): Promise<EmotionalData[]> {
    if (!userId) return [];
    
    // Get user data from our mock storage
    const userEmotions = this.emotionalData.get(userId) || [];
    
    // Sort by timestamp descending and limit the results
    return [...userEmotions]
      .sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return dateB - dateA;
      })
      .slice(0, limit);
  }

  // Insert or update emotional data for a user
  async updateUserEmotionalData(userId: string, data: Partial<EmotionalData>): Promise<void> {
    if (!userId) return;
    
    const emotionalData: EmotionalData = {
      emotion: data.emotion || 'neutral',
      intensity: data.intensity || 0,
      timestamp: new Date().toISOString(),
      context: data.context,
      feedback: data.feedback
    };
    
    // Get or initialize user's emotional data
    const userEmotions = this.emotionalData.get(userId) || [];
    
    // Add new emotional data
    userEmotions.push(emotionalData);
    
    // Update the storage
    this.emotionalData.set(userId, userEmotions);
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
    
    // Use intensity as a proxy for valence in this simple implementation
    const totalValence = emotions.reduce((sum, emotion) => {
      return sum + emotion.intensity;
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
