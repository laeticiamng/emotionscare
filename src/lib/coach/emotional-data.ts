
import { supabase } from '@/integrations/supabase/client';
import { CoachAction, CoachEvent, EmotionalData } from './types';

export class EmotionalDataService {
  private userId: string | null = null;
  
  constructor(userId?: string) {
    this.userId = userId || null;
  }
  
  setUserId(userId: string) {
    this.userId = userId;
  }
  
  async addEmotionEntry(data: EmotionalData): Promise<boolean> {
    if (!this.userId) {
      console.error("User ID required for adding emotion entry");
      return false;
    }
    
    try {
      // In a real implementation, save to Supabase
      console.log("Adding emotion entry:", data);
      return true;
    } catch (error) {
      console.error("Error adding emotion entry:", error);
      return false;
    }
  }
  
  async getRecentEmotions(days = 7): Promise<EmotionalData[]> {
    if (!this.userId) {
      return [];
    }
    
    try {
      const date = new Date();
      date.setDate(date.getDate() - days);
      
      // Mock data for now
      return [
        {
          emotion: "happy",
          intensity: 0.8,
          timestamp: new Date().toISOString()
        },
        {
          emotion: "calm",
          intensity: 0.6,
          timestamp: new Date(Date.now() - 86400000).toISOString()
        }
      ];
    } catch (error) {
      console.error("Error fetching emotions:", error);
      return [];
    }
  }
  
  async analyzeEmotionalTrend(): Promise<{
    primaryEmotion: string;
    trend: 'improving' | 'declining' | 'stable';
    averageIntensity: number;
  }> {
    const emotions = await this.getRecentEmotions();
    
    if (emotions.length === 0) {
      return {
        primaryEmotion: "neutral",
        trend: "stable",
        averageIntensity: 0.5
      };
    }
    
    // Simple analysis - in a real app this would be more sophisticated
    const emotionCounts: Record<string, number> = {};
    let totalIntensity = 0;
    
    emotions.forEach(entry => {
      emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;
      totalIntensity += entry.intensity;
    });
    
    const primaryEmotion = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])[0][0];
      
    return {
      primaryEmotion,
      trend: "stable", // Simplified for this implementation
      averageIntensity: totalIntensity / emotions.length
    };
  }
}

// Export a singleton instance
export const emotionalDataService = new EmotionalDataService();
