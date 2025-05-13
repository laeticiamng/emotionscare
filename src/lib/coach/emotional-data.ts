
import { supabase } from '@/integrations/supabase/client';
import { CoachAction, CoachEvent, EmotionalData } from './types';

/**
 * Service for storing and analyzing emotional data
 */
export class EmotionalDataService {
  private userId: string | null = null;
  
  constructor(userId?: string) {
    this.userId = userId || null;
  }
  
  setUserId(userId: string) {
    this.userId = userId;
  }
  
  async getEmotionalHistory(
    startDate?: Date, 
    endDate?: Date, 
    limit = 50
  ): Promise<EmotionalData[]> {
    if (!this.userId) {
      console.error("No user ID set for emotional data service");
      return [];
    }
    
    // In a real implementation, this would fetch from Supabase
    return [
      {
        emotion: "happy",
        intensity: 0.8,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        emotion: "calm",
        intensity: 0.6,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      }
    ];
  }
  
  async getEmotionalTrend(days = 7): Promise<Record<string, number>> {
    // Calculate emotional trends over time
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const history = await this.getEmotionalHistory(startDate, endDate);
    
    // Count emotions
    const counts: Record<string, number> = {};
    history.forEach(item => {
      const emotion = item.emotion;
      counts[emotion] = (counts[emotion] || 0) + 1;
    });
    
    return counts;
  }
  
  async getPredominantEmotion(days = 7): Promise<string | null> {
    const trends = await this.getEmotionalTrend(days);
    
    let predominant: string | null = null;
    let maxCount = 0;
    
    Object.entries(trends).forEach(([emotion, count]) => {
      if (count > maxCount) {
        predominant = emotion;
        maxCount = count;
      }
    });
    
    return predominant;
  }
}

const emotionalDataService = new EmotionalDataService();
export default emotionalDataService;
