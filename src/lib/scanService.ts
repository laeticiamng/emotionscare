
import { Emotion, EmotionResult, EnhancedEmotionResult } from '@/types';
import { v4 as uuid } from 'uuid';

// Mock data for emotions
const mockEmotionResults: EmotionResult[] = [
  {
    emotion: 'joy',
    score: 0.85,
    confidence: 0.9,
    text: "I feel really happy today!",
    feedback: "You seem to be experiencing joy and satisfaction."
  },
  {
    emotion: 'calm',
    score: 0.75,
    confidence: 0.8,
    text: "I'm feeling relaxed and at ease.",
    feedback: "You're in a peaceful and calm state of mind."
  }
];

// Analyze emotion from text
export const analyzeEmotion = async (text: string): Promise<EmotionResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simple mock emotion detection based on keywords
  if (text.toLowerCase().includes('happy') || text.toLowerCase().includes('joy')) {
    return {
      emotion: 'joy',
      score: 0.85,
      confidence: 0.9,
      text,
      transcript: text,
      feedback: "You seem to be experiencing joy and satisfaction.",
      recommendations: [
        "Try to identify what's making you happy and do more of it.",
        "Share your positive emotions with others to spread happiness."
      ]
    };
  } else if (text.toLowerCase().includes('calm') || text.toLowerCase().includes('peace')) {
    return {
      emotion: 'calm',
      score: 0.75,
      confidence: 0.8,
      text,
      transcript: text,
      feedback: "You're in a peaceful and calm state of mind.",
      recommendations: [
        "Practice mindfulness to maintain this state of calmness.",
        "Consider journaling about what brings you peace."
      ]
    };
  } else if (text.toLowerCase().includes('sad') || text.toLowerCase().includes('upset')) {
    return {
      emotion: 'sadness',
      score: 0.65,
      confidence: 0.7,
      text,
      transcript: text,
      feedback: "You might be feeling down or sad right now.",
      recommendations: [
        "Talk to someone you trust about your feelings.",
        "Try engaging in activities that usually lift your mood."
      ]
    };
  } else {
    return {
      emotion: 'neutral',
      score: 0.5,
      confidence: 0.6,
      text,
      transcript: text,
      feedback: "Your emotional state seems balanced.",
      recommendations: [
        "Continue monitoring your emotions throughout the day.",
        "Reflect on what aspects of your day influenced your mood."
      ]
    };
  }
};

// Save emotion to "database" (mock)
export const saveEmotion = async (emotion: Partial<Emotion>): Promise<Emotion> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Create a complete emotion object with defaults for missing fields
  const completeEmotion: Emotion = {
    id: emotion.id || uuid(),
    user_id: emotion.user_id || 'current-user',
    date: emotion.date || new Date().toISOString(),
    emotion: emotion.emotion || 'neutral',
    sentiment: emotion.sentiment || 5,
    anxiety: emotion.anxiety || 5,
    energy: emotion.energy || 5,
    text: emotion.text || '',
    score: emotion.score || 5,
    intensity: emotion.intensity || 0.5,
    name: emotion.name || emotion.emotion
  };
  
  // In a real app, this would save to a database
  console.log('Emotion saved:', completeEmotion);
  
  return completeEmotion;
};

// Analyze audio stream to detect emotion (mock implementation)
export const analyzeAudioStream = async (audioBlob: Blob): Promise<EmotionResult> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return random mock result for demo purposes
  const randomIndex = Math.floor(Math.random() * mockEmotionResults.length);
  return {
    ...mockEmotionResults[randomIndex],
    id: uuid(),
    transcript: "This is a simulated transcript from audio."
  };
};

// Fetch the latest emotion entry for the current user
export const fetchLatestEmotion = async (userId?: string): Promise<Emotion | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock latest emotion data
  return {
    id: uuid(),
    user_id: userId || 'current-user',
    date: new Date().toISOString(),
    emotion: 'calm',
    name: 'calm',
    sentiment: 7,
    anxiety: 3,
    energy: 6,
    text: "I'm feeling relatively calm and balanced today.",
    score: 7,
    intensity: 0.6
  };
};

// Create a new emotion entry
export const createEmotionEntry = async (data: Partial<Emotion>): Promise<Emotion> => {
  return saveEmotion(data);
};

export default {
  analyzeEmotion,
  saveEmotion,
  analyzeAudioStream,
  fetchLatestEmotion,
  createEmotionEntry
};
