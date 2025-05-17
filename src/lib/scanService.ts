
import { v4 as uuid } from 'uuid';
import { EmotionResult } from '@/types/emotion';

// Simulated API call for emotion analysis from text
export async function analyzeEmotion(text: string): Promise<EmotionResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Mock emotion detection logic
  const emotions = ['happy', 'sad', 'calm', 'anxious', 'angry', 'neutral'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  const randomScore = Math.random();
  const randomConfidence = 0.7 + Math.random() * 0.3; // Between 0.7 and 1.0
  
  // Generate a mock feedback based on the emotion
  let feedback = '';
  switch (randomEmotion) {
    case 'happy':
      feedback = "You're expressing joy and positivity. This is great for your wellbeing!";
      break;
    case 'sad':
      feedback = "I'm noticing signs of sadness in your expression. Remember that it's okay to feel this way.";
      break;
    case 'calm':
      feedback = "You appear to be in a calm and balanced emotional state.";
      break;
    case 'anxious':
      feedback = "I detect some anxiety in your message. Taking a few deep breaths might help.";
      break;
    case 'angry':
      feedback = "There seems to be some frustration in your words. Consider addressing what's bothering you.";
      break;
    default:
      feedback = "Your emotional state appears to be neutral at the moment.";
  }
  
  // Return a structured emotion result
  return {
    id: uuid(),
    emotion: randomEmotion,
    score: randomScore,
    confidence: randomConfidence,
    intensity: randomScore * 0.8 + 0.2, // Between 0.2 and 1.0
    feedback,
    text: text,
    timestamp: new Date().toISOString(),
    recommendations: [
      "Try taking a short walk outside",
      "Listen to some calming music",
      "Practice deep breathing for 5 minutes"
    ],
    source: 'text'
  };
}

// Fetch the latest emotion for a user
export async function fetchLatestEmotion(userId: string): Promise<EmotionResult | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would fetch from an API or database
  // For now, return a mock result
  return {
    id: uuid(),
    user_id: userId,
    emotion: 'calm',
    score: 0.85,
    confidence: 0.92,
    intensity: 0.7,
    feedback: "You've been quite calm today. Keep it up!",
    timestamp: new Date().toISOString(),
    source: 'manual'
  };
}

// Save a new emotion entry
export async function createEmotionEntry(data: Partial<EmotionResult>): Promise<EmotionResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would save to an API or database
  // For now, just return the data with a few added fields
  return {
    id: data.id || uuid(),
    user_id: data.user_id || 'unknown',
    emotion: data.emotion || 'neutral',
    score: data.score || 0.5,
    confidence: data.confidence || 0.8,
    intensity: data.intensity || 0.5,
    feedback: data.feedback || "Thank you for logging your emotion.",
    text: data.text || "",
    timestamp: data.timestamp || new Date().toISOString(),
    source: data.source || 'manual'
  };
}
