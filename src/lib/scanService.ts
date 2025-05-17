
import { v4 as uuid } from 'uuid';
import { EmotionResult } from '@/types/emotion';

// Mock emotion analysis function
export const analyzeEmotion = async (text: string): Promise<EmotionResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate a random emotion result
  const emotions = ['joy', 'calm', 'anxiety', 'sadness', 'anger', 'fear', 'neutral'];
  const selectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  const score = Math.floor(Math.random() * 50) + 50; // 50-100
  const confidence = (Math.random() * 0.3) + 0.7; // 0.7-1.0
  
  // Emoji mapping
  const emojiMap: Record<string, string> = {
    joy: '😊',
    calm: '😌',
    anxiety: '😰',
    sadness: '😢',
    anger: '😡',
    fear: '😨',
    neutral: '😐'
  };
  
  // Generate feedback based on emotion
  let feedback = '';
  let recommendations: string[] = [];
  
  switch (selectedEmotion) {
    case 'joy':
      feedback = "Vous semblez être dans un état émotionnel positif. C'est une excellente occasion de vous engager dans des activités créatives.";
      recommendations = [
        "Partagez votre joie avec quelqu'un d'autre",
        "Notez ce qui vous rend heureux dans votre journal",
        "Planifiez une activité agréable pour prolonger ce sentiment"
      ];
      break;
    case 'calm':
      feedback = "Vous semblez être dans un état calme et équilibré. C'est un bon moment pour la réflexion et la planification.";
      recommendations = [
        "Pratiquez la méditation pour maintenir ce calme",
        "Prenez des décisions importantes dans cet état d'esprit",
        "Faites une promenade dans la nature"
      ];
      break;
    case 'anxiety':
      feedback = "Je détecte des signes d'anxiété. C'est une réaction normale à des situations stressantes.";
      recommendations = [
        "Pratiquez la respiration profonde pendant 5 minutes",
        "Faites une courte marche à l'extérieur",
        "Écrivez vos préoccupations sur papier"
      ];
      break;
    case 'sadness':
      feedback = "Il semble que vous ressentiez de la tristesse. Prenez soin de vous et n'hésitez pas à chercher du soutien.";
      recommendations = [
        "Parlez à un ami ou un proche de confiance",
        "Écoutez de la musique qui vous réconforte",
        "Accordez-vous un moment pour ressentir vos émotions sans jugement"
      ];
      break;
    default:
      feedback = "Merci de partager votre état émotionnel. Continuer à suivre vos émotions est une excellente pratique pour votre bien-être.";
      recommendations = [
        "Prenez un moment pour réfléchir à votre journée",
        "Hydratez-vous et mangez équilibré",
        "Prenez soin de votre sommeil"
      ];
  }
  
  return {
    id: uuid(),
    emotion: selectedEmotion,
    score,
    confidence,
    emojis: emojiMap[selectedEmotion],
    text,
    feedback,
    recommendations,
    timestamp: new Date().toISOString(),
    intensity: score / 100
  };
};

// Get latest emotion for a user
export const fetchLatestEmotion = async (userId: string): Promise<EmotionResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate a mock result
  return {
    id: uuid(),
    emotion: ['joy', 'calm', 'anxiety', 'sadness'][Math.floor(Math.random() * 4)],
    score: Math.floor(Math.random() * 100),
    confidence: Math.random(),
    timestamp: new Date().toISOString(),
    user_id: userId
  };
};

// Save emotion
export const saveEmotion = async (emotionData: Partial<EmotionResult>): Promise<EmotionResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const completeEmotion: EmotionResult = {
    id: emotionData.id || uuid(),
    emotion: emotionData.emotion || 'neutral',
    score: emotionData.score || 50,
    timestamp: emotionData.timestamp || new Date().toISOString(),
    confidence: emotionData.confidence || 0.8,
    user_id: emotionData.user_id,
    ...emotionData
  };
  
  console.log('Emotion saved:', completeEmotion);
  
  return completeEmotion;
};

// Get emotions for a user within a date range
export const getEmotionsByDateRange = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<EmotionResult[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Generate mock results
  const results: EmotionResult[] = [];
  const emotions = ['joy', 'calm', 'anxiety', 'sadness', 'anger', 'fear', 'neutral'];
  
  // One entry per day in the range
  const daysInRange = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  const numEntries = Math.min(daysInRange, 30); // Max 30 entries
  
  for (let i = 0; i < numEntries; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    results.push({
      id: uuid(),
      emotion: emotions[Math.floor(Math.random() * emotions.length)],
      score: Math.floor(Math.random() * 100),
      confidence: Math.random(),
      timestamp: date.toISOString(),
      user_id: userId
    });
  }
  
  return results;
};

// Get entry by ID
export const getEmotionById = async (id: string): Promise<EmotionResult | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 20% chance of not finding the result
  if (Math.random() < 0.2) {
    return null;
  }
  
  return {
    id,
    emotion: ['joy', 'calm', 'anxiety', 'sadness'][Math.floor(Math.random() * 4)],
    score: Math.floor(Math.random() * 100),
    confidence: Math.random(),
    timestamp: new Date().toISOString(),
    user_id: 'user-123'
  };
};

// Create an emotion entry
export const createEmotionEntry = async (data: Partial<EmotionResult>): Promise<EmotionResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newEmotion: EmotionResult = {
    id: data.id || uuid(),
    emotion: data.emotion || 'neutral',
    score: data.score || 50,
    timestamp: data.timestamp || new Date().toISOString(),
    confidence: data.confidence || 0.8,
    user_id: data.user_id || 'user-123',
    ...data
  };
  
  return newEmotion;
};

export default {
  analyzeEmotion,
  fetchLatestEmotion,
  getEmotionsByDateRange,
  getEmotionById,
  saveEmotion,
  createEmotionEntry
};
