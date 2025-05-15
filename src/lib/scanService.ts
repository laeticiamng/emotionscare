
import { v4 as uuidv4 } from 'uuid';
import { EmotionResult } from '@/types';

// Mock implementation of emotion analysis
export const analyzeEmotion = async (text: string): Promise<EmotionResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple emotion keywords detection
  const emotions = {
    happy: ["happy", "joyful", "excited", "great", "content", "pleased", "delighted", "cheerful"],
    sad: ["sad", "depressed", "unhappy", "disappointed", "upset", "down", "miserable", "gloomy"],
    angry: ["angry", "frustrated", "annoyed", "irritated", "mad", "furious", "outraged", "upset"],
    anxious: ["anxious", "worried", "nervous", "stressed", "concerned", "uneasy", "apprehensive", "fearful"],
    calm: ["calm", "relaxed", "peaceful", "serene", "tranquil", "composed", "collected", "centered"],
    neutral: ["neutral", "okay", "fine", "normal", "average"],
  };
  
  // Convert to lowercase for case-insensitive matching
  const lowercaseText = text.toLowerCase();
  
  // Find emotion matches
  const matchCounts: Record<string, number> = {};
  
  Object.entries(emotions).forEach(([emotion, keywords]) => {
    matchCounts[emotion] = keywords.filter(keyword => 
      lowercaseText.includes(keyword)
    ).length;
  });
  
  // Find the emotion with the highest match count
  let detectedEmotion = "neutral";
  let highestCount = 0;
  
  Object.entries(matchCounts).forEach(([emotion, count]) => {
    if (count > highestCount) {
      highestCount = count;
      detectedEmotion = emotion;
    }
  });
  
  // Default to neutral if no matches
  if (highestCount === 0) {
    detectedEmotion = "neutral";
  }
  
  // Calculate confidence level (simplified)
  const confidence = Math.min(highestCount * 0.2 + 0.5, 0.95);
  
  return {
    id: uuidv4(),
    emotion: detectedEmotion,
    score: Math.round(confidence * 100),
    confidence,
    text,
    transcript: text,
    timestamp: new Date().toISOString(),
    feedback: `Based on your text, you seem to be feeling ${detectedEmotion}.`,
    ai_feedback: `Your emotional state appears to be ${detectedEmotion}, with a confidence score of ${Math.round(confidence * 100)}%.`,
  };
};

// Function to save emotion to database
export const saveEmotion = async (emotion: EmotionResult): Promise<EmotionResult> => {
  // Simulate API call
  console.log("Saving emotion to database:", emotion);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real implementation, this would save to a database
  // For now just return the emotion with an added ID if it doesn't have one
  return {
    ...emotion,
    id: emotion.id || uuidv4(),
    timestamp: emotion.timestamp || new Date().toISOString(),
  };
};

// Function to fetch emotion history
export const fetchEmotionsHistory = async (
  userId: string, 
  options: { limit?: number; period?: string } = {}
): Promise<EmotionResult[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock data
  return Array.from({ length: options.limit || 10 }).map((_, index) => {
    const emotions = ['happy', 'sad', 'angry', 'anxious', 'calm', 'neutral'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const date = new Date();
    date.setDate(date.getDate() - index);
    
    return {
      id: uuidv4(),
      user_id: userId,
      emotion: randomEmotion,
      score: Math.floor(Math.random() * 40) + 60, // 60-100
      confidence: (Math.floor(Math.random() * 40) + 60) / 100, // 0.6-1.0
      date: date.toISOString(),
      timestamp: date.toISOString(),
      text: `Mock emotion entry ${index + 1}`,
      feedback: `This is mock feedback for ${randomEmotion}`,
    };
  });
};

// Alias for compatibility
export const getEmotionsHistory = fetchEmotionsHistory;
