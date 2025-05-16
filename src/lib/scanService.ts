
import { v4 as uuid } from 'uuid';
import { EmotionResult } from '@/types/emotion';

// Mock emotion analysis service
export const analyzeEmotion = async (text: string): Promise<EmotionResult> => {
  // In a real implementation, this would call an API
  // For demo purposes, we'll simulate a response

  // Await to simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Basic emotion detection based on keywords
  const lowerText = text.toLowerCase();
  
  let emotion = 'neutral';
  let score = 0.5;
  let confidence = 0.5;

  if (lowerText.includes('heureu') || lowerText.includes('conte') || lowerText.includes('joie')) {
    emotion = 'happy';
    score = 0.8;
    confidence = 0.85;
  } else if (lowerText.includes('triste') || lowerText.includes('déçu') || lowerText.includes('déprimé')) {
    emotion = 'sad';
    score = 0.7;
    confidence = 0.82;
  } else if (lowerText.includes('calm') || lowerText.includes('serein') || lowerText.includes('apais')) {
    emotion = 'calm';
    score = 0.9;
    confidence = 0.9;
  } else if (lowerText.includes('colère') || lowerText.includes('énerv') || lowerText.includes('frustr')) {
    emotion = 'angry';
    score = 0.75;
    confidence = 0.8;
  } else if (lowerText.includes('peur') || lowerText.includes('inqui') || lowerText.includes('anxi')) {
    emotion = 'anxious';
    score = 0.65;
    confidence = 0.75;
  } else if (lowerText.includes('fatigu') || lowerText.includes('épuis')) {
    emotion = 'tired';
    score = 0.6;
    confidence = 0.7;
  } else if (lowerText.includes('surpri') || lowerText.includes('étonn')) {
    emotion = 'surprised';
    score = 0.55;
    confidence = 0.6;
  }

  return {
    id: uuid(),
    user_id: 'current-user',
    date: new Date().toISOString(),
    emotion,
    score: Math.round(score * 100),
    confidence,
    intensity: score,
    text,
    feedback: '',
    transcript: text,
  };
};

// Mock emotion saving service
export const saveEmotion = async (emotion: EmotionResult): Promise<void> => {
  // In a real implementation, this would save to a database
  console.log('Saving emotion:', emotion);
  
  // Simulate successful save with delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return;
};

// Get emotion history for a user
export const getEmotionHistory = async (userId: string, limit: number = 10): Promise<EmotionResult[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock data
  return [
    {
      id: '1',
      user_id: userId,
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      emotion: 'happy',
      score: 85,
      confidence: 0.85,
      intensity: 0.85,
      text: 'Je me sens vraiment bien aujourd\'hui !',
    },
    {
      id: '2',
      user_id: userId,
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      emotion: 'calm',
      score: 90,
      confidence: 0.9,
      intensity: 0.9,
      text: 'Journée tranquille, très sereine',
    },
    {
      id: '3',
      user_id: userId,
      date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      emotion: 'frustrated',
      score: 65,
      confidence: 0.7,
      intensity: 0.65,
      text: 'Un peu stressé par la charge de travail',
    }
  ];
};

// Get emotion average for a user
export const getEmotionAverage = async (userId: string, period: string = '7d'): Promise<{ emotion: string; score: number }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Return mock data
  return {
    emotion: 'balanced',
    score: 75
  };
};
