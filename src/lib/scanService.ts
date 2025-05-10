
import { Emotion } from '@/types';

// Données de démonstration pour les émotions
const demoEmotions: Emotion[] = [
  {
    id: '1',
    name: 'Joie',
    intensity: 0.8,
    category: 'positive',
    color: '#FFD700',
    icon: '😊',
    date: new Date().toISOString(),
    emotion: 'joy',
    dominant_emotion: 'joy',
    score: 0.8,
    confidence: 0.85,
    text: "J'ai passé une excellente journée aujourd'hui!",
  },
  {
    id: '2',
    name: 'Calme',
    intensity: 0.6,
    category: 'positive',
    color: '#4682B4',
    icon: '😌',
    date: new Date(Date.now() - 86400000).toISOString(), // Hier
    emotion: 'calm',
    dominant_emotion: 'calm',
    score: 0.6,
    confidence: 0.75,
    text: "Je me sens tranquille et serein.",
  },
  {
    id: '3',
    name: 'Stress',
    intensity: 0.4,
    category: 'negative',
    color: '#FF6347',
    icon: '😰',
    date: new Date(Date.now() - 172800000).toISOString(), // Il y a 2 jours
    emotion: 'stress',
    dominant_emotion: 'stress',
    score: 0.4,
    confidence: 0.65,
    text: "Beaucoup de choses à gérer aujourd'hui...",
  }
];

/**
 * Récupère les données émotionnelles d'un utilisateur
 * @param userId - L'ID de l'utilisateur
 */
export const getEmotions = async (userId: string): Promise<Emotion[]> => {
  // Simulation d'une requête API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(demoEmotions);
    }, 500);
  });
};

/**
 * Analyse un texte pour détecter les émotions
 */
export const analyzeText = async (text: string): Promise<Emotion> => {
  // Simulation d'une analyse de texte
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now().toString(),
        name: 'Joie',
        intensity: 0.7,
        category: 'positive',
        color: '#FFD700',
        icon: '😊',
        date: new Date().toISOString(),
        emotion: 'joy',
        dominant_emotion: 'joy',
        score: 0.7,
        confidence: 0.8,
        text: text,
      });
    }, 1000);
  });
};

/**
 * Analyse des émojis pour détecter l'émotion
 */
export const analyzeEmojis = async (emojis: string): Promise<Emotion> => {
  // Simulation d'une analyse d'émojis
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now().toString(),
        name: 'Enthousiasme',
        intensity: 0.8,
        category: 'positive',
        color: '#FFA500',
        icon: '🤩',
        date: new Date().toISOString(),
        emotion: 'enthusiasm',
        dominant_emotion: 'enthusiasm',
        score: 0.8,
        confidence: 0.85,
        emojis: emojis,
      });
    }, 800);
  });
};

/**
 * Analyse audio pour détecter l'émotion
 */
export const analyzeAudio = async (audioUrl: string): Promise<Emotion> => {
  // Simulation d'une analyse audio
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now().toString(),
        name: 'Calme',
        intensity: 0.6,
        category: 'positive',
        color: '#4682B4',
        icon: '😌',
        date: new Date().toISOString(),
        emotion: 'calm',
        dominant_emotion: 'calm',
        score: 0.6,
        confidence: 0.7,
        audio_url: audioUrl,
      });
    }, 1500);
  });
};

/**
 * Sauvegarde une nouvelle émotion
 */
export const saveEmotion = async (emotion: Emotion): Promise<Emotion> => {
  // Simulation de sauvegarde d'émotion
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...emotion,
        id: Date.now().toString(),
      });
    }, 500);
  });
};
