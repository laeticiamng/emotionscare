
import { UserEmotionalData } from './types';

/**
 * Service for managing and analyzing user emotional data
 */
export class EmotionalDataService {
  private userEmotionalData: Map<string, UserEmotionalData> = new Map();

  /**
   * Updates the emotional data for a user
   */
  updateUserEmotionalData(userId: string, data: any): void {
    if (!data || !data.emotion) return;
    
    const { emotion, confidence = 0.8 } = data;
    const emotionData = { 
      emotion: emotion.toLowerCase(),
      confidence,
      timestamp: new Date()
    };
    
    // Récupérer ou initialiser les données de l'utilisateur
    if (!this.userEmotionalData.has(userId)) {
      this.userEmotionalData.set(userId, {
        lastEmotions: [],
        averageScore: 0,
        trends: {}
      });
    }
    
    const userData = this.userEmotionalData.get(userId)!;
    
    // Ajouter la nouvelle émotion
    userData.lastEmotions.push(emotionData);
    
    // Limiter l'historique à 10 émotions
    if (userData.lastEmotions.length > 10) {
      userData.lastEmotions.shift();
    }
    
    // Mettre à jour les tendances
    if (!userData.trends[emotion]) {
      userData.trends[emotion] = 0;
    }
    userData.trends[emotion]++;
    
    // Calculer un score moyen (exemple simple)
    const positiveEmotions = ['joie', 'contentement', 'sérénité'];
    const negativeEmotions = ['tristesse', 'colère', 'anxiété', 'stress'];
    
    let totalScore = 0;
    let count = 0;
    
    userData.lastEmotions.forEach(entry => {
      if (positiveEmotions.includes(entry.emotion)) {
        totalScore += 75 + (entry.confidence * 25);
      } else if (negativeEmotions.includes(entry.emotion)) {
        totalScore += 25 + ((1 - entry.confidence) * 25);
      } else {
        totalScore += 50;
      }
      count++;
    });
    
    userData.averageScore = count > 0 ? totalScore / count : 0;
  }

  /**
   * Retrieves emotional data for a user
   */
  getUserEmotionalData(userId: string): UserEmotionalData | undefined {
    return this.userEmotionalData.get(userId);
  }

  /**
   * Checks if user has a negative emotional trend
   */
  hasNegativeTrend(userId: string): boolean {
    const userData = this.userEmotionalData.get(userId);
    
    if (!userData) return false;
    
    // Vérifier si l'utilisateur a une tendance négative récente
    const negativeEmotions = ['tristesse', 'colère', 'anxiété', 'stress'];
    const recentEmotions = userData.lastEmotions.slice(-3);
    
    return recentEmotions.length >= 3 && 
      recentEmotions.filter(e => negativeEmotions.includes(e.emotion)).length >= 2;
  }
}

export const emotionalDataService = new EmotionalDataService();
