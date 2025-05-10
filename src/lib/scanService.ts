import { Emotion, EmotionResult } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// For demo purposes only - In a real app this would call an API
export const analyzeEmotion = async (data: {
  user_id: string,
  emojis?: string,
  text?: string,
  audio_url?: string | null,
  is_confidential?: boolean,
  share_with_coach?: boolean
}): Promise<EmotionResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Very simple logic for demo purposes
  // In a real app, this would use a proper emotion analysis API
  let emotion = 'neutral';
  let score = 50;
  let confidence = 0.7;
  let feedback = '';
  
  if (data.emojis) {
    if (data.emojis.includes('😊') || data.emojis.includes('😄')) {
      emotion = 'happy';
      score = 80;
      confidence = 0.9;
    } else if (data.emojis.includes('😢') || data.emojis.includes('😭')) {
      emotion = 'sad';
      score = 30;
      confidence = 0.85;
    } else if (data.emojis.includes('😡') || data.emojis.includes('😠')) {
      emotion = 'angry';
      score = 20;
      confidence = 0.8;
    }
  }
  
  if (data.text) {
    const text = data.text.toLowerCase();
    if (text.includes('happy') || text.includes('great') || text.includes('awesome')) {
      emotion = 'happy';
      score = Math.max(score, 75);
      confidence = Math.max(confidence, 0.8);
    } else if (text.includes('sad') || text.includes('depressed') || text.includes('unhappy')) {
      emotion = 'sad';
      score = Math.min(score, 35);
      confidence = Math.max(confidence, 0.8);
    } else if (text.includes('angry') || text.includes('mad') || text.includes('furious')) {
      emotion = 'angry';
      score = Math.min(score, 25);
      confidence = Math.max(confidence, 0.8);
    } else if (text.includes('calm') || text.includes('peaceful') || text.includes('relaxed')) {
      emotion = 'calm';
      score = 65;
      confidence = 0.75;
    }
    
    // Generate simple feedback
    if (emotion === 'happy') {
      feedback = "C'est merveilleux de vous voir dans un état d'esprit positif! Continuez à cultiver cette énergie positive.";
    } else if (emotion === 'sad') {
      feedback = "Je remarque que vous semblez traverser un moment difficile. N'hésitez pas à prendre soin de vous et à parler à quelqu'un si nécessaire.";
    } else if (emotion === 'angry') {
      feedback = "La colère que vous ressentez est une émotion normale. Essayez quelques respirations profondes et peut-être une courte méditation pour vous apaiser.";
    } else if (emotion === 'calm') {
      feedback = "Votre calme est précieux, c'est un état d'esprit à cultiver. Continuez à pratiquer la pleine conscience.";
    }
  }
  
  // Create result object with all properties that might be needed
  return {
    id: uuidv4(),
    emotion,
    score,
    confidence,
    feedback,
    recommendations: generateRecommendations(emotion),
    date: new Date().toISOString(),
    user_id: data.user_id,
    text: data.text,
    emojis: data.emojis,
    audio_url: data.audio_url || undefined
  };
};

// Analyze audio and return an emotion result
export const analyzeAudioStream = async (audioBlob: Blob): Promise<EmotionResult> => {
  // In a real app, this would send the audio to a speech-to-text and emotion analysis API
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Create mock transcript and results
  const transcript = "Je me sens plutôt bien aujourd'hui malgré la charge de travail.";
  const emotion = 'calm';
  const score = 65;
  const confidence = 0.7;
  
  return {
    id: uuidv4(),
    emotion,
    score,
    confidence,
    transcript,
    feedback: "Votre voix semble calme et mesurée, ce qui suggère un état d'esprit équilibré. Continuez à prendre des moments de pause pour maintenir cette sérénité.",
    recommendations: [
      "Continuez à pratiquer des exercices de respiration",
      "Prenez de courtes pauses régulières pendant votre travail",
      "Écoutez une musique apaisante en fin de journée"
    ]
  };
};

// Get emotion history for a user or all users
export const getEmotions = async (userId?: string): Promise<Emotion[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would fetch from a database
  // For now, return mock data
  const mockEmotions: Emotion[] = [
    {
      id: '1',
      user_id: userId || 'user-1',
      date: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
      emotion: 'happy',
      dominant_emotion: 'happy',
      name: 'happy',
      category: 'positive',
      score: 80,
      confidence: 0.9,
      text: "Je me sens très motivé après la réunion d'équipe!",
      emojis: '😊😄',
      intensity: 0.7
    },
    {
      id: '2',
      user_id: userId || 'user-1',
      date: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
      emotion: 'stressed',
      dominant_emotion: 'stressed',
      name: 'stressed',
      category: 'negative',
      score: 30,
      confidence: 0.85,
      text: "Trop de deadlines cette semaine, je suis un peu dépassé.",
      emojis: '😓',
      ai_feedback: "Vous semblez être sous pression. Essayez de prioriser vos tâches et n'hésitez pas à déléguer si possible.",
      intensity: 0.6
    }
  ];
  
  return mockEmotions;
};

// Save a new emotion scan
export const saveEmotionScan = async (emotion: Emotion): Promise<Emotion> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would save to a database
  return {
    ...emotion,
    id: emotion.id || uuidv4(),
    date: emotion.date || new Date().toISOString(),
    name: emotion.name || emotion.emotion || 'neutral',
    category: emotion.category || 'emotion',
    intensity: emotion.intensity || 0.5
  };
};

// Save a realtime emotion scan result
export const saveRealtimeEmotionScan = async (result: EmotionResult): Promise<EmotionResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would save to a database
  return result;
};

// Nouvelles fonctions pour résoudre les erreurs
export const createEmotionEntry = async (data: Partial<Emotion>): Promise<Emotion> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const newEmotion: Emotion = {
    id: data.id || uuidv4(),
    user_id: data.user_id || 'unknown',
    date: data.date || new Date().toISOString(),
    name: data.name || data.emotion || 'neutral',
    category: data.category || 'emotion',
    intensity: data.intensity || 0.5,
    emotion: data.emotion || 'neutral',
    dominant_emotion: data.dominant_emotion || data.emotion || 'neutral',
    score: data.score || 50,
    confidence: data.confidence || 0.5,
    text: data.text || '',
    emojis: data.emojis || '',
    ai_feedback: data.ai_feedback || ''
  };
  
  return newEmotion;
};

export const fetchLatestEmotion = async (userId: string): Promise<Emotion | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock data
  return {
    id: uuidv4(),
    user_id: userId,
    date: new Date().toISOString(),
    name: 'calm',
    category: 'positive',
    intensity: 0.7,
    emotion: 'calm',
    dominant_emotion: 'calm',
    score: 65,
    confidence: 0.8,
    text: "Je me sens calme après ma séance de méditation",
    emojis: '😌',
    ai_feedback: "La méditation régulière vous aide à maintenir votre équilibre émotionnel. Continuez ainsi!"
  };
};

// Helper function to generate recommendations based on emotion
function generateRecommendations(emotion: string): string[] {
  switch(emotion) {
    case 'happy':
      return [
        "Partagez votre joie avec quelqu'un",
        "Notez ce moment dans un journal de gratitude",
        "Utilisez cette énergie positive pour un projet créatif"
      ];
    case 'sad':
      return [
        "Accordez-vous un moment pour ressentir cette émotion sans jugement",
        "Parlez à un ami ou un professionnel",
        "Faites une activité qui vous apporte du réconfort"
      ];
    case 'angry':
      return [
        "Faites une courte méditation de 5 minutes",
        "Pratiquez quelques exercices physiques pour libérer la tension",
        "Écrivez ce que vous ressentez pour évacuer l'émotion"
      ];
    case 'calm':
      return [
        "Continuez vos pratiques de pleine conscience",
        "Planifiez votre journée de demain sans stress",
        "Profitez d'une activité relaxante en soirée"
      ];
    default:
      return [
        "Prenez un moment pour vous reconnecter à vos sensations",
        "Hydratez-vous et faites une courte pause",
        "Essayez quelques respirations profondes"
      ];
  }
}
