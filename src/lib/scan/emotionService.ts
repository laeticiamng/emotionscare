
import { v4 as uuidv4 } from 'uuid';
import { Emotion, EmotionResult } from '@/types';

// Emotions we can detect
const DETECTABLE_EMOTIONS = [
  'happy', 'sad', 'angry', 'stressed', 
  'calm', 'excited', 'bored', 'tired',
  'anxious', 'content', 'frustrated', 'surprised'
];

// Emojis mapped to emotions
const EMOTION_EMOJIS: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  stressed: '😫',
  calm: '😌',
  excited: '😃',
  bored: '😒',
  tired: '😴',
  anxious: '😰',
  content: '🙂',
  frustrated: '😤',
  surprised: '😲',
  neutral: '😐'
};

// Mock function to analyze text and detect emotion
export const detectEmotion = async (text: string): Promise<EmotionResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple keyword matching for demo purposes
  let detectedEmotion = 'neutral';
  let maxOccurrences = 0;
  
  for (const emotion of DETECTABLE_EMOTIONS) {
    const regex = new RegExp(`\\b${emotion}\\b`, 'gi');
    const matches = text.match(regex);
    
    if (matches && matches.length > maxOccurrences) {
      maxOccurrences = matches.length;
      detectedEmotion = emotion;
    }
  }
  
  // Calculate confidence based on text length and keyword matches
  const confidence = Math.min(0.5 + (maxOccurrences * 0.1), 0.95);
  
  // Calculate score (0-1 scale)
  const score = confidence * (Math.random() * 0.3 + 0.7); // Between 0.7*confidence and confidence
  
  // Generate feedback based on detected emotion
  const feedback = generateFeedback(detectedEmotion);
  
  // Create emoji string (not array)
  const emoji = EMOTION_EMOJIS[detectedEmotion] || '😐';
  
  return {
    id: uuidv4(),
    emotion: detectedEmotion,
    confidence,
    score: Math.round(score * 10),
    intensity: confidence * 0.8,
    feedback,
    text,
    emojis: emoji,
    source: 'text-analysis',
    primaryEmotion: {
      name: detectedEmotion,
      score
    }
  };
};

// Mock function to analyze audio and detect emotion
export const detectEmotionFromAudio = async (audioBlob: Blob): Promise<EmotionResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Randomly select an emotion (for demo purposes)
  const emotion = DETECTABLE_EMOTIONS[Math.floor(Math.random() * DETECTABLE_EMOTIONS.length)];
  
  // Generate random confidence
  const confidence = 0.7 + Math.random() * 0.25; // Between 0.7 and 0.95
  
  // Calculate score
  const score = Math.max(3, Math.min(9, Math.round(confidence * 10)));
  
  // Generate feedback
  const feedback = generateFeedback(emotion);
  
  // Generate transcript (this would normally come from speech-to-text)
  const transcript = "Ceci est une transcription simulée de votre audio. Dans une application réelle, vos paroles seraient transcrites ici.";
  
  // Create emoji string (not array)
  const emoji = EMOTION_EMOJIS[emotion] || '😐';
  
  return {
    id: uuidv4(),
    emotion,
    confidence,
    score,
    intensity: confidence * 0.8,
    feedback,
    text: transcript,
    transcript,
    emojis: emoji,
    source: 'audio-analysis',
    primaryEmotion: {
      name: emotion,
      score: confidence
    }
  };
};

// Get historical emotions for a user
export const getEmotionHistory = async (userId: string): Promise<Emotion[]> => {
  // In a real app, this would fetch from an API or database
  // For now, we'll return mock data
  const mockHistory: Emotion[] = [
    {
      id: '1',
      user_id: userId,
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      emotion: 'happy',
      name: 'happy',
      category: 'positive',
      score: 8,
      confidence: 0.9,
      emojis: '😊',
      text: "J'ai eu une journée très productive !",
      source: 'journal',
      intensity: 0.8
    },
    {
      id: '2',
      user_id: userId,
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      emotion: 'stressed',
      name: 'stressed',
      category: 'negative',
      score: 3,
      confidence: 0.8,
      emojis: '😫',
      text: "Beaucoup de deadlines cette semaine...",
      source: 'text-analysis',
      intensity: 0.7
    },
    {
      id: '3',
      user_id: userId,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      emotion: 'calm',
      name: 'calm',
      category: 'positive',
      score: 6,
      confidence: 0.75,
      emojis: '😌',
      text: "La méditation m'aide beaucoup.",
      source: 'audio-analysis',
      intensity: 0.5
    }
  ];
  
  return mockHistory;
};

// Save a new emotion entry
export const saveEmotion = async (emotion: Partial<Emotion>): Promise<Emotion> => {
  // In a real app, this would send to an API
  const newEmotion: Emotion = {
    id: emotion.id || uuidv4(),
    user_id: emotion.user_id || 'unknown-user',
    date: emotion.date || new Date(),
    score: emotion.score || 5,
    emotion: emotion.emotion || 'neutral',
    name: emotion.name || emotion.emotion || 'neutral',
    confidence: emotion.confidence || 0.5,
    emojis: emotion.emojis || '😐',
    text: emotion.text || '',
    source: emotion.source || 'manual-entry',
    intensity: emotion.intensity || 0.5,
    category: emotion.category || 'emotion'
  };
  
  // Simulate API success
  return newEmotion;
};

// Helper function to generate feedback based on emotion
const generateFeedback = (emotion: string): string => {
  const feedbacks: Record<string, string[]> = {
    happy: [
      "C'est génial de vous voir heureux ! Continuez ainsi !",
      "La joie est contagieuse ! Partagez-la avec quelqu'un aujourd'hui.",
      "Excellent ! Prenez un moment pour apprécier ce sentiment positif."
    ],
    sad: [
      "Je remarque que vous vous sentez triste. C'est normal de se sentir ainsi parfois.",
      "La tristesse est une émotion temporaire. Prenez soin de vous aujourd'hui.",
      "Peut-être qu'une activité que vous aimez pourrait vous aider à vous sentir mieux."
    ],
    angry: [
      "Je perçois de la colère. Essayez de prendre quelques respirations profondes.",
      "La colère peut être canalisée positivement. Peut-être une activité physique ?",
      "Prenez un moment pour identifier ce qui vous met en colère et voyez si vous pouvez l'aborder."
    ],
    stressed: [
      "Le stress que vous ressentez est normal. Essayez une courte méditation.",
      "Prenez 5 minutes pour vous détendre. Votre bien-être est important.",
      "Listez ce qui vous stresse et voyez ce que vous pouvez contrôler ou non."
    ],
    calm: [
      "Vous semblez calme et centré. C'est un excellent état d'esprit !",
      "La tranquillité d'esprit est précieuse. Profitez de ce moment.",
      "Votre calme peut être contagieux pour votre entourage."
    ]
  };
  
  const defaultFeedbacks = [
    "Merci de partager votre état émotionnel. Comment puis-je vous aider aujourd'hui ?",
    "Je suis là pour vous accompagner, quelles que soient vos émotions.",
    "Votre bien-être émotionnel est important. Prenez soin de vous."
  ];
  
  const possibleFeedbacks = feedbacks[emotion] || defaultFeedbacks;
  return possibleFeedbacks[Math.floor(Math.random() * possibleFeedbacks.length)];
};

// Export the service
export default {
  detectEmotion,
  detectEmotionFromAudio,
  getEmotionHistory,
  saveEmotion
};
