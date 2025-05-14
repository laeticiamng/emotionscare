
import { EmotionalData } from '@/types/emotion';

class EmotionalDataService {
  // Collection d'émotions utilisateur (dans une vraie implémentation, cela viendrait d'une base de données)
  private emotions: EmotionalData[] = [];

  /**
   * Récupère toutes les données émotionnelles pour un utilisateur spécifique
   */
  async getEmotions(userId: string): Promise<EmotionalData[]> {
    return this.emotions.filter(e => e.user_id === userId || e.userId === userId);
  }

  /**
   * Récupère les données émotionnelles récentes pour un utilisateur spécifique
   */
  async getRecentEmotions(userId: string, limit: number = 10): Promise<EmotionalData[]> {
    return this.emotions
      .filter(e => e.user_id === userId || e.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  /**
   * Ajoute une nouvelle entrée émotionnelle pour un utilisateur
   */
  async addEmotion(emotionData: Partial<EmotionalData>): Promise<EmotionalData> {
    const newEmotion: EmotionalData = {
      id: crypto.randomUUID(),
      emotion: emotionData.emotion || 'neutral',
      intensity: emotionData.intensity || 5,
      timestamp: new Date().toISOString(),
      user_id: emotionData.user_id || emotionData.userId || '',
      context: emotionData.context,
      source: emotionData.source || 'manual'
    };

    this.emotions.push(newEmotion);
    return newEmotion;
  }

  /**
   * Récupère l'émotion la plus récente pour un utilisateur
   */
  async getLatestEmotion(userId: string): Promise<EmotionalData | null> {
    const userEmotions = this.emotions.filter(e => e.user_id === userId || e.userId === userId);
    if (!userEmotions.length) return null;

    return userEmotions.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
  }

  /**
   * Met à jour les données émotionnelles
   */
  async updateEmotion(id: string, emotionData: Partial<EmotionalData>): Promise<EmotionalData | null> {
    const index = this.emotions.findIndex(e => e.id === id);
    if (index === -1) return null;

    const updatedEmotion: EmotionalData = {
      ...this.emotions[index],
      ...emotionData,
      // Assurer que ces champs restent inchangés
      id: this.emotions[index].id,
      userId: this.emotions[index].userId || this.emotions[index].user_id,
      user_id: this.emotions[index].user_id || this.emotions[index].userId,
      timestamp: this.emotions[index].timestamp
    };

    this.emotions[index] = updatedEmotion;
    return updatedEmotion;
  }
  
  /**
   * Met à jour la tendance émotionnelle (stub pour compatibilité)
   */
  async updateEmotionTrend(userId: string): Promise<any> {
    console.log(`Mise à jour de la tendance émotionnelle pour l'utilisateur ${userId}`);
    return { trend: 'stable' };
  }
  
  /**
   * Vérifie les tendances négatives (stub pour compatibilité)
   */
  async checkNegativeTrend(userId: string): Promise<boolean> {
    return false;
  }
}

export const calculateEmotionalStats = (emotions: EmotionalData[]) => {
  // Implementation simplifiée
  return {
    mostFrequent: 'calm',
    averageIntensity: 5,
    positivePercentage: 60,
    negativePercentage: 20,
    neutralPercentage: 20,
    trend: 'stable'
  };
};

// Export du singleton
export const emotionalDataService = new EmotionalDataService();

// Export par défaut pour compatibilité
export default emotionalDataService;
