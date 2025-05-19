
import { EmotionPrediction, EmotionResult } from '@/types/emotion';
import { v4 as uuidv4 } from 'uuid';

export async function predictEmotion(text: string): Promise<EmotionPrediction> {
  // Ceci est une implémentation simulée qui serait normalement un appel API
  const emotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'neutral'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  const randomProbability = Math.random() * 0.5 + 0.5; // Entre 0.5 et 1.0
  
  // Introduire un délai simulé
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    emotion: randomEmotion,
    probability: randomProbability,
    timestamp: new Date().toISOString(),
    source: 'text',
    score: randomProbability,
  };
}

export async function analyzeAudio(audioBlob: Blob): Promise<EmotionResult> {
  // Ceci est une implémentation simulée
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const emotions = ['joy', 'sadness', 'calm', 'anxious', 'energetic'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  
  return {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    emotion: randomEmotion,
    confidence: 0.8,
    intensity: 0.7,
    source: 'audio'
  };
}

export async function analyzeWords(text: string): Promise<EmotionResult> {
  // Implémentation simulée
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Analyse très basique basée sur des mots-clés
  let emotion = 'neutral';
  let confidence = 0.6;
  
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('happy') || lowerText.includes('good') || lowerText.includes('joy')) {
    emotion = 'joy';
    confidence = 0.85;
  } else if (lowerText.includes('sad') || lowerText.includes('unhappy') || lowerText.includes('depressed')) {
    emotion = 'sadness';
    confidence = 0.8;
  } else if (lowerText.includes('angry') || lowerText.includes('frustrat') || lowerText.includes('annoy')) {
    emotion = 'anger';
    confidence = 0.9;
  } else if (lowerText.includes('fear') || lowerText.includes('afraid') || lowerText.includes('scared')) {
    emotion = 'fear';
    confidence = 0.85;
  }
  
  return {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    emotion,
    confidence,
    intensity: confidence * 0.8,
    source: 'text'
  };
}
