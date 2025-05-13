
import { supabase } from '@/integrations/supabase/client';
import { EmotionalData, EmotionalTrend } from './types';

export class EmotionalDataService {
  private userId: string | null = null;
  private emotionalData: Map<string, EmotionalData[]> = new Map();
  
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
          userId: this.userId,
          emotion: "happy",
          intensity: 0.8,
          timestamp: new Date().toISOString()
        },
        {
          userId: this.userId,
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
  
  // Add missing methods that were referenced in emotion-handlers.ts
  updateUserEmotionalData(userId: string, data: any): void {
    if (!this.emotionalData.has(userId)) {
      this.emotionalData.set(userId, []);
    }
    
    const userEmotions = this.emotionalData.get(userId) || [];
    
    const newEmotionData: EmotionalData = {
      userId,
      emotion: data.emotion || "neutral",
      intensity: data.confidence || data.intensity || 0.5,
      timestamp: new Date().toISOString(),
      context: data.context
    };
    
    userEmotions.push(newEmotionData);
    
    // Keep only the most recent 100 entries
    if (userEmotions.length > 100) {
      userEmotions.shift();
    }
  }
  
  hasNegativeTrend(userId: string): boolean {
    const userEmotions = this.emotionalData.get(userId) || [];
    
    if (userEmotions.length < 3) {
      return false;
    }
    
    // Get the 3 most recent emotions
    const recentEmotions = userEmotions.slice(-3);
    
    // Check if there's a negative trend in intensity
    const negativeEmotions = ['sad', 'angry', 'anxious', 'depressed', 'stressed', 'worried', 'fearful', 'upset'];
    
    const hasNegativeEmotions = recentEmotions.filter(e => 
      negativeEmotions.includes(e.emotion.toLowerCase())
    ).length >= 2;
    
    // Very simplified trend detection
    return hasNegativeEmotions;
  }
}

// Export a singleton instance
export const emotionalDataService = new EmotionalDataService();
