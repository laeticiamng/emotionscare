import { EmotionResult } from '@/types/emotion';

// Simulate API call to analyze text for emotion
export const analyzeText = async (text: string): Promise<string> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return a canned response
  return `The text "${text}" has a positive sentiment.`;
};

// Simulate API call to generate a summary of the journal entry
export const summarizeJournalEntry = async (entry: string): Promise<string> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return a canned response
  return `Summary of journal entry: ${entry.substring(0, 50)}...`;
};

export const analyzeTextEmotion = async (text: string): Promise<EmotionResult> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create a mock result
  const result: EmotionResult = {
    id: `emotion-${Date.now()}`, // Add an ID
    emotion: "joy",
    score: 0.85,
    confidence: 0.82,
    text: text,
    emojis: ["😊", "😀", "🥰"],
    recommendations: [
      "Consider journaling about what made you feel this way",
      "Try to maintain this positive emotion with a gratitude practice",
      "Share your positive feelings with someone close to you"
    ]
  };
  
  return result;
};
