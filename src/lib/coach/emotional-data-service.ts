
import { v4 as uuidv4 } from 'uuid';
import { EmotionalData } from '@/types/emotional-data';
import { EmotionResult } from '@/types/emotional-data';

// Service pour gérer les données émotionnelles
class EmotionalDataService {
  private data: EmotionalData[] = [];

  // Récupérer toutes les données pour un utilisateur
  async getUserEmotionalData(userId: string): Promise<EmotionalData[]> {
    return this.data.filter(item => item.user_id === userId);
  }

  // Ajouter une nouvelle entrée émotionnelle
  async addEmotionalData(data: Omit<EmotionalData, 'id'>): Promise<EmotionalData> {
    const newEntry: EmotionalData = {
      id: uuidv4(),
      ...data,
    };
    
    this.data.push(newEntry);
    return newEntry;
  }

  // Analyser les données émotionnelles récentes
  async analyzeRecentEmotions(userId: string): Promise<EmotionResult> {
    // Simulation d'analyse
    return {
      emotion: 'calm',
      score: 75,
      confidence: 0.85,
      intensity: 3,
      recommendations: [
        'Continuez vos exercices de méditation',
        'Prenez des pauses régulières',
        'Maintenez une routine de sommeil saine'
      ]
    };
  }

  // Obtenir la dernière entrée émotionnelle
  async getLatestEmotionalData(userId: string): Promise<EmotionalData | null> {
    const userEntries = await this.getUserEmotionalData(userId);
    if (userEntries.length === 0) return null;
    
    // Trie par horodatage (plus récent en premier)
    return userEntries.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
  }
}

export const emotionalDataService = new EmotionalDataService();
export default emotionalDataService;
