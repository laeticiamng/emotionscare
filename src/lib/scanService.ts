
import { v4 as uuid } from 'uuid';
import { EmotionResult } from '@/types/emotion';

// Fonction pour récupérer la dernière émotion enregistrée pour un utilisateur
export const fetchLatestEmotion = async (userId: string): Promise<EmotionResult | null> => {
  // Dans une vraie application, ceci ferait un appel à une API ou une base de données
  console.log(`Fetching latest emotion for user: ${userId}`);
  
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Retourner des données simulées
  return {
    id: uuid(),
    user_id: userId,
    date: new Date().toISOString(),
    score: 75,
    emojis: '😊',
    text: 'Je me sens bien aujourd\'hui',
    primary_emotion: 'joy',
    emotions: {
      joy: 0.75,
      calm: 0.15,
      sadness: 0.05,
      anxiety: 0.03,
      anger: 0.02
    }
  };
};

// Fonction pour créer une nouvelle entrée d'émotion
export const createEmotionEntry = async (data: Partial<EmotionResult>): Promise<EmotionResult> => {
  // Dans une vraie application, ceci enregistrerait les données dans une base de données
  console.log('Creating new emotion entry:', data);
  
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Compléter les données si nécessaire et retourner l'entrée créée
  const completedData: EmotionResult = {
    id: data.id || uuid(),
    user_id: data.user_id || '',
    date: data.date || new Date().toISOString(),
    score: data.score !== undefined ? data.score : 50,
    emojis: data.emojis || '😐',
    text: data.text || '',
    primary_emotion: data.primary_emotion || 'neutral',
    emotions: data.emotions || {
      joy: 0.2,
      calm: 0.2,
      sadness: 0.2,
      anxiety: 0.2,
      anger: 0.2
    }
  };
  
  return completedData;
};
