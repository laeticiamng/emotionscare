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

// Fonctions manquantes pour l'analyse audio
export const analyzeAudioStream = async (audioBlob: Blob): Promise<EmotionResult> => {
  // Simulation d'un délai d'analyse
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  // Simuler un résultat d'analyse
  const emotions = ['joy', 'sadness', 'anger', 'fear', 'calm', 'neutral'];
  const randomIndex = Math.floor(Math.random() * emotions.length);
  const emotion = emotions[randomIndex];
  
  // Générer un score en fonction de l'émotion
  let score = 5;
  if (emotion === 'joy') score = Math.floor(Math.random() * 3) + 7; // 7-9
  else if (emotion === 'sadness') score = Math.floor(Math.random() * 3) + 2; // 2-4
  else if (emotion === 'anger') score = Math.floor(Math.random() * 3) + 3; // 3-5
  else if (emotion === 'fear') score = Math.floor(Math.random() * 3) + 2; // 2-4
  else if (emotion === 'calm') score = Math.floor(Math.random() * 3) + 7; // 7-9
  else score = Math.floor(Math.random() * 3) + 4; // 4-6
  
  return {
    id: `emotion-${Date.now()}`,
    emotion,
    score,
    confidence: parseFloat((Math.random() * 0.3 + 0.6).toFixed(2)), // 0.6-0.9
    transcript: "Transcription simulée de l'audio...", // Simule une transcription
    feedback: `Basé sur votre ton de voix, vous semblez ressentir de la ${
      emotion === 'joy' ? 'joie' : 
      emotion === 'sadness' ? 'tristesse' : 
      emotion === 'anger' ? 'colère' : 
      emotion === 'fear' ? 'peur' : 
      emotion === 'calm' ? 'sérénité' : 'neutralité'
    }.`,
    date: new Date().toISOString(),
    recommendations: [
      "Prenez quelques respirations profondes",
      "Essayez une courte session de méditation",
      "Écoutez une musique qui vous détend"
    ]
  };
};

// Fonction pour créer une entrée d'émotion
export const createEmotionEntry = async (params: {
  user_id: string;
  text?: string;
  emojis?: string;
  audio_url?: string;
}): Promise<Emotion> => {
  // Simuler une analyse de l'émotion
  const analysis: EmotionResult = {
    emotion: 'calm',
    score: 7,
    confidence: 0.85,
    feedback: "Vous semblez calme aujourd'hui.",
    date: new Date().toISOString()
  };
  
  // Simuler la sauvegarde d'une émotion
  const savedEmotion: Emotion = {
    id: `em-${Date.now()}`,
    user_id: params.user_id,
    date: new Date(),
    emotion: analysis.emotion,
    score: analysis.score,
    text: params.text || '',
    emojis: params.emojis || '',
    audio_url: params.audio_url || null,
    ai_feedback: analysis.feedback || '',
    created_at: new Date().toISOString(),
    name: analysis.emotion,
    category: "emotion",
    confidence: analysis.confidence || 0.5,
    intensity: 0.7
  };
  
  // Simuler un délai d'attente
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return savedEmotion;
};

// Fonction pour récupérer la dernière émotion
export const fetchLatestEmotion = async (userId: string): Promise<Emotion | null> => {
  // Simuler un délai d'attente
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Retourner une fausse dernière émotion
  return {
    id: `em-latest-${Date.now()}`,
    user_id: userId,
    date: new Date(),
    emotion: 'calm',
    score: 7,
    text: "Je me sens plutôt bien aujourd'hui.",
    emojis: "😊",
    audio_url: null,
    ai_feedback: "Vous semblez être dans un état émotionnel calme et positif.",
    created_at: new Date().toISOString(),
    name: "calm",
    category: "emotion",
    confidence: 0.85,
    intensity: 0.7
  };
};
