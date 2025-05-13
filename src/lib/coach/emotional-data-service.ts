
import { supabase } from '@/integrations/supabase/client';
import { EmotionalData, EmotionalTrend } from './types';

export class EmotionalDataService {
  /**
   * Save emotional data to the database
   */
  async saveEmotionalData(data: EmotionalData): Promise<void> {
    try {
      // Use emotions table, which we know exists in the DB
      const { error } = await supabase
        .from('emotions')
        .insert({
          user_id: data.userId,
          date: data.timestamp,
          score: Math.round(data.intensity * 100),
          emojis: this.mapEmotionToEmojis(data.emotion),
          text: data.feedback || undefined,
          ai_feedback: data.feedback
        });
        
      if (error) {
        console.error('Error saving emotional data:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in saveEmotionalData:', error);
      throw error;
    }
  }

  /**
   * Map emotion name to emojis
   */
  private mapEmotionToEmojis(emotion: string): string {
    const emotionToEmoji: Record<string, string> = {
      'happy': '😊',
      'joy': '😄',
      'sad': '😢',
      'angry': '😠',
      'fear': '😨',
      'surprise': '😲',
      'disgust': '🤢',
      'calm': '😌',
      'neutral': '😐',
      'anxiety': '😰',
      'stress': '😓',
      'relaxed': '😌',
      'tired': '😴',
      'excited': '🤩',
      'confident': '😎'
    };
    
    return emotionToEmoji[emotion.toLowerCase()] || '😐';
  }

  /**
   * Get user's emotional data history
   */
  async getUserEmotionalData(userId: string): Promise<EmotionalData[]> {
    try {
      const { data, error } = await supabase
        .from('emotions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });
        
      if (error) {
        console.error('Error fetching emotional data:', error);
        throw error;
      }
      
      return data.map((item: any) => ({
        userId: item.user_id,
        emotion: this.detectEmotionFromScore(item.score),
        intensity: item.score / 100,
        timestamp: item.date,
        feedback: item.ai_feedback,
        source: 'database'
      }));
    } catch (error) {
      console.error('Error in getUserEmotionalData:', error);
      return [];
    }
  }
  
  /**
   * Detect emotion from numerical score
   */
  private detectEmotionFromScore(score: number): string {
    if (score >= 80) return 'happy';
    if (score >= 60) return 'calm';
    if (score >= 40) return 'neutral';
    if (score >= 20) return 'sad';
    return 'anxious';
  }
  
  /**
   * Update user's emotional trend data
   */
  async updateEmotionTrend(userId: string): Promise<void> {
    // Implementation would store the trend calculation
    // Currently just a placeholder
  }
  
  /**
   * Check if user has a negative emotional trend
   */
  async checkNegativeTrend(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('emotions')
        .select('score')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(5);
        
      if (error) {
        console.error('Error checking emotional trend:', error);
        return false;
      }
      
      if (!data || data.length < 3) {
        return false;
      }
      
      // Simple heuristic: If average of last 3 entries is below 40, consider it negative
      const avgScore = data.slice(0, 3).reduce((sum, item) => sum + (item.score || 50), 0) / 3;
      return avgScore < 40;
    } catch (error) {
      console.error('Error in checkNegativeTrend:', error);
      return false;
    }
  }
}
