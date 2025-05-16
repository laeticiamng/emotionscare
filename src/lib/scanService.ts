
import { v4 as uuid } from 'uuid';
import { EmotionResult } from '@/types/emotion';

// Simuler une base de données en mémoire
const emotionDatabase: EmotionResult[] = [];

// Fonction pour enregistrer une émotion
export async function saveEmotion(emotion: EmotionResult): Promise<EmotionResult> {
  // Assurez-vous que l'émotion a un ID et un timestamp
  const completeEmotion = {
    ...emotion,
    id: emotion.id || uuid(),
    timestamp: emotion.timestamp || new Date().toISOString()
  };
  
  // Ajouter à notre "base de données"
  emotionDatabase.push(completeEmotion);
  
  return completeEmotion;
}

// Fonction pour récupérer la dernière émotion
export async function fetchLatestEmotion(userId: string): Promise<EmotionResult | null> {
  // Filtrer par utilisateur et trier par date
  const userEmotions = emotionDatabase
    .filter(e => e.user_id === userId)
    .sort((a, b) => {
      const dateA = new Date(a.timestamp || a.date || '');
      const dateB = new Date(b.timestamp || b.date || '');
      return dateB.getTime() - dateA.getTime();
    });
  
  return userEmotions.length > 0 ? userEmotions[0] : null;
}

// Fonction pour analyser une émotion à partir d'un texte
export async function analyzeEmotion(text: string): Promise<EmotionResult> {
  // Simuler une analyse d'émotion avec un délai
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Liste d'émotions possibles à retourner aléatoirement
  const emotions = ['joy', 'calm', 'focused', 'anxious', 'sad'];
  const emotion = emotions[Math.floor(Math.random() * emotions.length)];
  
  return {
    id: uuid(),
    emotion,
    score: Math.random() * 0.5 + 0.5,
    confidence: Math.random() * 0.3 + 0.7,
    intensity: Math.random(),
    timestamp: new Date().toISOString(),
    text,
    feedback: `Votre texte indique une émotion de type "${emotion}" avec une intensité modérée.`,
    emojis: emotion === 'joy' ? '😊' : emotion === 'calm' ? '😌' : emotion === 'focused' ? '🧠' : 
            emotion === 'anxious' ? '😰' : '😔'
  };
}

// Récupérer l'historique des émotions
export async function fetchEmotionHistory(
  userId: string,
  period: 'day' | 'week' | 'month' | 'year' = 'week',
  limit: number = 50
): Promise<EmotionResult[]> {
  // Filtrer par utilisateur
  const userEmotions = emotionDatabase.filter(e => e.user_id === userId);
  
  // Calculer la date limite selon la période
  const now = new Date();
  let cutoffDate = new Date();
  
  switch (period) {
    case 'day':
      cutoffDate.setDate(now.getDate() - 1);
      break;
    case 'week':
      cutoffDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      cutoffDate.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      cutoffDate.setFullYear(now.getFullYear() - 1);
      break;
  }
  
  // Filtrer par date et limiter le nombre de résultats
  return userEmotions
    .filter(emotion => {
      const emotionDate = new Date(emotion.timestamp || emotion.date || '');
      return emotionDate >= cutoffDate;
    })
    .sort((a, b) => {
      const dateA = new Date(a.timestamp || a.date || '');
      const dateB = new Date(b.timestamp || b.date || '');
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, limit);
}

// Fonction pour analyser les sentiments à partir d'un enregistrement audio
export async function analyzeAudioEmotion(audioBlob: Blob): Promise<EmotionResult> {
  // Simuler une analyse avec un délai
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Liste d'émotions possibles à retourner aléatoirement
  const emotions = ['joy', 'calm', 'focused', 'anxious', 'sad'];
  const emotion = emotions[Math.floor(Math.random() * emotions.length)];
  
  return {
    id: uuid(),
    emotion,
    score: Math.random() * 0.5 + 0.5,
    confidence: Math.random() * 0.3 + 0.7,
    intensity: Math.random(),
    timestamp: new Date().toISOString(),
    feedback: `L'analyse de votre voix révèle une émotion principalement de type "${emotion}".`,
    emojis: emotion === 'joy' ? '😊' : emotion === 'calm' ? '😌' : emotion === 'focused' ? '🧠' : 
            emotion === 'anxious' ? '😰' : '😔'
  };
}
