// Mock implementation of scan service functions
import { Emotion, EmotionResult } from '@/types';

/**
 * Analyzes an audio stream and returns emotion data
 */
export const analyzeAudioStream = async (audioBlob: Blob): Promise<{
  id: string;
  emotion: string;
  score: number;
  confidence: number;
  text?: string;
  transcript?: string;
  feedback?: string;
  recommendations?: string[];
}> => {
  // In a real implementation, this would send audio data to a backend service
  // For now, we'll simulate a delay and return mock data
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const emotions = ['calm', 'joy', 'neutral', 'sadness', 'anxiety'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  const randomScore = Math.floor(Math.random() * 100);
  const randomConfidence = 0.7 + Math.random() * 0.3; // Between 0.7 and 1.0
  
  return {
    id: crypto.randomUUID(),
    emotion: randomEmotion,
    score: randomScore,
    confidence: randomConfidence,
    text: "Mock transcription of audio content",
    transcript: "Sample transcribed content from audio analysis",
    feedback: `You seem to be experiencing ${randomEmotion}. This is a normal emotion that everyone experiences.`,
    recommendations: [
      "Take 5 deep breaths",
      "Go for a short walk",
      "Listen to calming music"
    ]
  };
};

/**
 * Analyzes text for emotional content
 */
export const analyzeText = async (text: string): Promise<{
  emotion: string;
  score: number;
  confidence: number;
}> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple mock algorithm that looks for emotion keywords in text
  const keywords = {
    joy: ['happy', 'joy', 'glad', 'excited', 'pleased'],
    sadness: ['sad', 'unhappy', 'depressed', 'down', 'low'],
    anger: ['angry', 'upset', 'furious', 'annoyed', 'irritated'],
    fear: ['scared', 'afraid', 'anxious', 'worried', 'nervous'],
    calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil'],
    neutral: ['ok', 'fine', 'normal', 'average']
  };
  
  let detectedEmotion = 'neutral';
  let highestMatches = 0;
  
  for (const [emotion, words] of Object.entries(keywords)) {
    const matches = words.filter(word => text.toLowerCase().includes(word)).length;
    if (matches > highestMatches) {
      highestMatches = matches;
      detectedEmotion = emotion;
    }
  }
  
  const textLength = text.split(' ').length;
  const confidence = Math.min(0.5 + (highestMatches * 0.1) + (textLength * 0.005), 0.98);
  
  return {
    emotion: detectedEmotion,
    score: detectedEmotion === 'neutral' ? 50 : 
           (detectedEmotion === 'joy' || detectedEmotion === 'calm') ? 75 : 25,
    confidence
  };
};

/**
 * Process camera feed to detect facial expressions
 */
export const analyzeFacialExpression = async (videoElement: HTMLVideoElement): Promise<{
  emotion: string;
  score: number;
  confidence: number;
}> => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Mock facial analysis result
  return {
    emotion: 'neutral',
    score: 50,
    confidence: 0.85
  };
};

/**
 * Save an emotion to the database
 */
export const saveEmotion = async (emotion: Emotion): Promise<Emotion> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real implementation, this would save to a database
  console.log('Saving emotion:', emotion);
  
  // Return the emotion with an ID if it doesn't have one
  return {
    ...emotion,
    id: emotion.id || crypto.randomUUID()
  };
};

/**
 * Analyze emotion from various inputs (text, audio, etc.)
 */
export const analyzeEmotion = async (data: {
  text?: string;
  emojis?: string;
  audio_url?: string;
  user_id: string;
  is_confidential?: boolean;
  share_with_coach?: boolean;
}): Promise<EmotionResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock emotion analysis result
  const emotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'neutral', 'calm'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  
  return {
    id: crypto.randomUUID(),
    emotion: randomEmotion,
    score: Math.floor(Math.random() * 100),
    confidence: 0.7 + Math.random() * 0.3,
    intensity: Math.floor(Math.random() * 10) + 1,
    text: data.text || '',
    emojis: data.emojis || '',
    feedback: `Based on my analysis, you seem to be feeling ${randomEmotion}. This is perfectly normal.`,
    ai_feedback: `I notice a ${randomEmotion} pattern in your expression. Consider taking a moment for yourself.`,
    user_id: data.user_id,
    timestamp: new Date().toISOString(),
    source: data.audio_url ? 'audio' : 'text'
  };
};
