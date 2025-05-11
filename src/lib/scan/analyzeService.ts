
import { Emotion, EmotionResult } from '@/types/emotion';

// Function to calculate the primary emotion from the text
export const analyzeTextForEmotion = async (text: string): Promise<EmotionResult> => {
  // In a real app, this would be an API call to an ML model
  if (!text) {
    return {
      emotion: "neutral",
      score: 50,
      confidence: 0.6,
      text: text
    };
  }

  // Very basic keyword matching for demonstration
  const keywords = {
    happy: ['happy', 'joy', 'excited', 'pleased', 'delighted'],
    sad: ['sad', 'upset', 'depressed', 'unhappy', 'miserable'],
    angry: ['angry', 'mad', 'annoyed', 'furious', 'irritated'],
    anxious: ['anxious', 'worried', 'nervous', 'tense', 'stressed'],
    calm: ['calm', 'relaxed', 'peaceful', 'tranquil', 'serene']
  };

  const lowercaseText = text.toLowerCase();
  
  // Count occurrences of keywords for each emotion
  const counts: Record<string, number> = {
    happy: 0,
    sad: 0,
    angry: 0,
    anxious: 0,
    calm: 0
  };

  Object.entries(keywords).forEach(([emotion, words]) => {
    words.forEach(word => {
      if (lowercaseText.includes(word)) {
        counts[emotion]++;
      }
    });
  });

  // Find the emotion with the highest count
  let primaryEmotion = "neutral";
  let maxCount = 0;

  Object.entries(counts).forEach(([emotion, count]) => {
    if (count > maxCount) {
      maxCount = count;
      primaryEmotion = emotion;
    }
  });

  // If no emotion keywords are found, default to neutral
  if (maxCount === 0) {
    primaryEmotion = "neutral";
  }

  // Calculate a mock score based on keyword count (between 0 and 100)
  const score = Math.min(maxCount * 20 + 50, 100);
  
  const result: EmotionResult = {
    emotion: primaryEmotion,
    score: score,
    confidence: 0.7,
    text: text,
    primaryEmotion: {
      name: primaryEmotion,
      intensity: score / 100,
      score: score  // Added to match the expected type
    }
  };

  return result;
};

// Function to analyze audio for emotion
export const analyzeAudioForEmotion = async (audioUrl: string): Promise<EmotionResult> => {
  // In a real app, this would be an API call to an ML model
  // Mock implementation for demonstration purposes
  
  // Random emotion generation for demo purposes
  const emotions = ["happy", "sad", "angry", "anxious", "calm", "neutral"];
  const randomIndex = Math.floor(Math.random() * emotions.length);
  const randomEmotion = emotions[randomIndex];
  
  // Random score between 50 and 95
  const randomScore = Math.floor(Math.random() * 45) + 50;
  
  const result: EmotionResult = {
    emotion: randomEmotion,
    score: randomScore,
    confidence: 0.65,
    audio_url: audioUrl, // Added audio_url
    primaryEmotion: {
      name: randomEmotion,
      intensity: randomScore / 100,
      score: randomScore  // Added to match the expected type
    }
  };
  
  return result;
};

// Main function to analyze emotion from text or audio
export const analyzeEmotion = async (data: {
  text?: string;
  audioUrl?: string;
}): Promise<EmotionResult> => {
  if (data.text) {
    return analyzeTextForEmotion(data.text);
  } else if (data.audioUrl) {
    return analyzeAudioForEmotion(data.audioUrl);
  } else {
    throw new Error("No text or audio provided for emotion analysis");
  }
};

export default analyzeEmotion;
