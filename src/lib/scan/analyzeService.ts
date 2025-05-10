
import { v4 as uuidv4 } from 'uuid';
import { EmotionResult } from '@/types';

// Simple emotions with positive/negative categorization
const EMOTIONS_MAP: Record<string, { name: string; score: number; isPositive: boolean }> = {
  happy: { name: 'happy', score: 80, isPositive: true },
  joyful: { name: 'joyful', score: 85, isPositive: true },
  excited: { name: 'excited', score: 75, isPositive: true },
  content: { name: 'content', score: 70, isPositive: true },
  neutral: { name: 'neutral', score: 50, isPositive: false },
  sad: { name: 'sad', score: 30, isPositive: false },
  anxious: { name: 'anxious', score: 25, isPositive: false },
  stressed: { name: 'stressed', score: 20, isPositive: false },
  angry: { name: 'angry', score: 15, isPositive: false },
  frustrated: { name: 'frustrated', score: 25, isPositive: false },
  calm: { name: 'calm', score: 60, isPositive: true },
  relaxed: { name: 'relaxed', score: 65, isPositive: true }
};

// Mock analyze function to simulate emotion detection
export async function analyzeEmotion(text: string): Promise<EmotionResult> {
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time

  // Simple analysis: check for keywords in the text
  const emotions = Object.keys(EMOTIONS_MAP);
  let detectedEmotion = 'neutral';
  let maxScore = 0;
  
  emotions.forEach(emotion => {
    if (text.toLowerCase().includes(emotion)) {
      const emotionData = EMOTIONS_MAP[emotion];
      if (emotionData.score > maxScore) {
        detectedEmotion = emotion;
        maxScore = emotionData.score;
      }
    }
  });

  const emotionData = EMOTIONS_MAP[detectedEmotion];
  
  // Simulate a feedback response
  const feedback = emotionData.isPositive
    ? `Great to see you're feeling ${detectedEmotion}! Keep up those positive emotions.`
    : `I notice you're feeling ${detectedEmotion}. Consider trying some relaxation techniques or doing something enjoyable to lift your mood.`;

  return {
    emotion: detectedEmotion,
    score: emotionData.score / 10, // Convert to 0-10 scale
    confidence: 0.7 + Math.random() * 0.2, // Random confidence between 0.7 and 0.9
    feedback,
    recommendations: [
      'Practice deep breathing for 5 minutes',
      'Take a short walk outside',
      'Listen to your favorite music'
    ],
    transcript: text,
    primaryEmotion: {
      name: detectedEmotion,
      score: emotionData.score / 100
    },
    intensity: Math.random() * 0.7 + 0.3 // Random intensity between 0.3 and 1.0
  };
}

// Analyze audio data to determine emotion
export async function analyzeAudioEmotion(audioData: Blob): Promise<EmotionResult> {
  // This is a mock function since we can't actually analyze audio
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
  
  // Randomly select an emotion for demonstration purposes
  const emotions = Object.keys(EMOTIONS_MAP);
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  const emotionData = EMOTIONS_MAP[randomEmotion];
  
  return {
    id: uuidv4(),
    transcript: "Voici une transcription simulée de l'audio. Dans une application réelle, ce serait le texte converti de votre enregistrement.",
    emotion: randomEmotion,
    confidence: 0.7 + Math.random() * 0.2,
    score: emotionData.score / 10, // Convert to 0-10 scale
    feedback: emotionData.isPositive
      ? `D'après votre voix, vous semblez ${randomEmotion}. C'est une émotion positive!`
      : `D'après votre voix, vous semblez ${randomEmotion}. Prenez un moment pour prendre soin de vous.`,
    recommendations: [
      'Prenez quelques respirations profondes',
      'Buvez un verre d\'eau',
      'Écoutez votre chanson préférée'
    ],
    primaryEmotion: {
      name: randomEmotion,
      score: emotionData.score / 100
    },
    intensity: Math.random() * 0.7 + 0.3 // Random intensity between 0.3 and 1.0
  };
}

export default {
  analyzeEmotion,
  analyzeAudioEmotion
};
