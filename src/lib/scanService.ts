
import { EmotionResult, Emotion } from '@/types';

// Type pour les paramètres d'analyse d'émotion
interface AnalyzeEmotionParams {
  user_id: string;
  text?: string;
  emojis?: string;
  audio_url?: string;
  is_confidential?: boolean;
  share_with_coach?: boolean;
}

// Type pour sauvegarder une émotion
interface SaveEmotionParams {
  user_id: string;
  date: string;
  emotion: string;
  score: number;
  text?: string;
  emojis?: string;
  audio_url?: string;
  ai_feedback?: string;
}

// Fonction simulée pour analyser les émotions
export const analyzeEmotion = async (params: AnalyzeEmotionParams): Promise<EmotionResult> => {
  // Simulation d'un délai d'analyse
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Détermination de l'émotion basée sur les entrées
  let emotion = 'neutral';
  let score = 5;
  let feedback = '';
  
  // Analyse basée sur le texte
  if (params.text) {
    const lowerText = params.text.toLowerCase();
    
    if (lowerText.includes('heureux') || lowerText.includes('content') || lowerText.includes('joie')) {
      emotion = 'joy';
      score = 8;
    } else if (lowerText.includes('triste') || lowerText.includes('malheureux') || lowerText.includes('déprimé')) {
      emotion = 'sadness';
      score = 3;
    } else if (lowerText.includes('énervé') || lowerText.includes('colère') || lowerText.includes('frustré')) {
      emotion = 'anger';
      score = 4;
    } else if (lowerText.includes('peur') || lowerText.includes('anxieux') || lowerText.includes('inquiet')) {
      emotion = 'fear';
      score = 2;
    } else if (lowerText.includes('calme') || lowerText.includes('serein') || lowerText.includes('paisible')) {
      emotion = 'calm';
      score = 7;
    }
    
    feedback = `Basé sur votre description, vous semblez ressentir de la ${emotion === 'joy' ? 'joie' : 
      emotion === 'sadness' ? 'tristesse' : 
      emotion === 'anger' ? 'colère' : 
      emotion === 'fear' ? 'peur' : 
      emotion === 'calm' ? 'sérénité' : 'neutralité'}.`;
  }
  
  // Analyse basée sur les emoji
  if (params.emojis) {
    if (params.emojis.includes('😊') || params.emojis.includes('😃')) {
      emotion = 'joy';
      score = Math.max(score, 8);
    } else if (params.emojis.includes('😔') || params.emojis.includes('😢')) {
      emotion = 'sadness';
      score = Math.min(score, 3);
    } else if (params.emojis.includes('😡') || params.emojis.includes('😤')) {
      emotion = 'anger';
      score = 2;
    } else if (params.emojis.includes('😰') || params.emojis.includes('😨')) {
      emotion = 'fear';
      score = 2;
    } else if (params.emojis.includes('😌') || params.emojis.includes('☺️')) {
      emotion = 'calm';
      score = 9;
    }
    
    feedback += ' Les emojis utilisés reflètent cette émotion.';
  }
  
  // Résultat simulé de l'analyse
  return {
    emotion,
    score,
    confidence: 0.85,
    feedback,
    date: new Date().toISOString(),
    ai_feedback: `Je détecte une émotion dominante de ${emotion} avec une intensité de ${score}/10. ${feedback}`
  };
};

// Fonction simulée pour sauvegarder une émotion
export const saveEmotion = async (params: SaveEmotionParams): Promise<Emotion> => {
  // Simulation d'un délai de sauvegarde
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  // Simule la sauvegarde et retourne une émotion formatée
  const savedEmotion: Emotion = {
    id: `em-${Date.now()}`,
    user_id: params.user_id,
    date: params.date,
    emotion: params.emotion,
    score: params.score,
    text: params.text || '',
    emojis: params.emojis || '',
    audio_url: params.audio_url || null,
    ai_feedback: params.ai_feedback || '',
    created_at: new Date().toISOString()
  };
  
  // Stockage local pour simulation
  const storedEmotions = localStorage.getItem('emotions') || '[]';
  const emotions = JSON.parse(storedEmotions);
  emotions.push(savedEmotion);
  localStorage.setItem('emotions', JSON.stringify(emotions));
  
  return savedEmotion;
};

// Fonction simulée pour récupérer l'historique des émotions
export const fetchEmotionHistory = async (userId: string): Promise<Emotion[]> => {
  // Simulation d'un délai de chargement
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Récupération depuis le stockage local
  const storedEmotions = localStorage.getItem('emotions') || '[]';
  const emotions = JSON.parse(storedEmotions);
  
  // Filtrer pour l'utilisateur spécifié
  return emotions.filter((e: Emotion) => e.user_id === userId);
};

// Fonction pour supprimer une émotion
export const deleteEmotion = async (emotionId: string): Promise<void> => {
  // Simulation d'un délai pour la suppression
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Récupération depuis le stockage local
  const storedEmotions = localStorage.getItem('emotions') || '[]';
  let emotions = JSON.parse(storedEmotions);
  
  // Filtrer pour supprimer l'émotion
  emotions = emotions.filter((e: Emotion) => e.id !== emotionId);
  
  // Mise à jour du stockage local
  localStorage.setItem('emotions', JSON.stringify(emotions));
};
