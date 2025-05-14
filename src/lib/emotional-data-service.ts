
import { Emotion, EmotionResult } from "@/types/emotion";

export class EmotionalDataService {
  /**
   * Store a new emotion record
   */
  async storeEmotion(emotion: Emotion): Promise<Emotion> {
    // In a real implementation, this would persist to Supabase
    console.log('Storing emotion:', emotion);
    
    // Mock response - adding an ID and timestamp
    return {
      ...emotion,
      id: emotion.id || `emotion-${Date.now()}`,
      date: emotion.date || new Date().toISOString()
    };
  }
  
  /**
   * Get emotion records for a user
   */
  async getUserEmotions(userId: string, limit: number = 10): Promise<Emotion[]> {
    // Mock data
    return Array(limit).fill(null).map((_, index) => ({
      id: `emotion-${Date.now() - index * 86400000}`,
      user_id: userId,
      date: new Date(Date.now() - index * 86400000).toISOString(),
      emotion: ['calm', 'focused', 'stressed', 'motivated', 'tired'][Math.floor(Math.random() * 5)],
      score: Math.round(Math.random() * 100) / 100,
      intensity: Math.round(Math.random() * 100) / 100,
      confidence: Math.round(Math.random() * 100) / 100,
      text: index % 3 === 0 ? 'User submitted text for this emotion' : undefined,
      emojis: index % 3 === 0 ? '😌' : undefined,
      ai_feedback: index % 2 === 0 ? 'AI analysis of this emotional state' : undefined
    }));
  }
  
  /**
   * Get emotion stats for a user
   */
  async getUserEmotionStats(userId: string): Promise<{
    averageScore: number;
    topEmotions: { emotion: string; count: number }[];
    trends: { date: string; score: number }[];
  }> {
    // Mock data
    return {
      averageScore: 0.72,
      topEmotions: [
        { emotion: 'focused', count: 15 },
        { emotion: 'calm', count: 8 },
        { emotion: 'stressed', count: 6 }
      ],
      trends: Array(7).fill(null).map((_, index) => ({
        date: new Date(Date.now() - index * 86400000).toISOString().split('T')[0],
        score: Math.round((0.5 + Math.random() * 0.5) * 100) / 100
      })).reverse()
    };
  }
  
  /**
   * Get team emotion stats
   */
  async getTeamEmotionStats(teamId: string): Promise<{
    averageScore: number;
    userCount: number;
    emotionDistribution: { emotion: string; percentage: number }[];
    trends: { date: string; score: number }[];
  }> {
    // Mock data
    return {
      averageScore: 0.68,
      userCount: 12,
      emotionDistribution: [
        { emotion: 'focused', percentage: 40 },
        { emotion: 'calm', percentage: 25 },
        { emotion: 'stressed', percentage: 20 },
        { emotion: 'motivated', percentage: 10 },
        { emotion: 'tired', percentage: 5 }
      ],
      trends: Array(14).fill(null).map((_, index) => ({
        date: new Date(Date.now() - index * 86400000).toISOString().split('T')[0],
        score: Math.round((0.5 + Math.random() * 0.4) * 100) / 100
      })).reverse()
    };
  }
}

// Singleton instance
export const emotionalDataService = new EmotionalDataService();
export default emotionalDataService;
