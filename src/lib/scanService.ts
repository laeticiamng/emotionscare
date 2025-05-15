
import { Emotion, EmotionResult } from "@/types";

// Create a new emotion entry based on user input
export const createEmotionEntry = async (data: Partial<Emotion>): Promise<Emotion> => {
  // Simulation of API call to create emotion entry
  console.log("Creating emotion entry with data:", data);
  
  // Generate a unique ID
  const id = `emotion_${Date.now()}`;
  
  // Create emotion entry with default values and provided data
  const emotionEntry: Emotion = {
    id,
    date: data.date || new Date().toISOString(),
    user_id: data.user_id,
    emotion: data.emotion || "neutral",
    intensity: data.intensity || 5,
    confidence: data.confidence || 0.8,
    text: data.text || "",
    emojis: data.emojis || "",
    audio_url: data.audio_url || "",
    timestamp: data.timestamp || new Date().toISOString(),
    ...data
  };
  
  // In a real app, you would save this to a database
  // For now, we just return the created entry
  return emotionEntry;
};

// Fetch the latest emotion for a given user
export const fetchLatestEmotion = async (userId: string): Promise<Emotion | null> => {
  console.log("Fetching latest emotion for user:", userId);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Simulate a response
  const mockEmotion: Emotion = {
    id: `emotion_${Date.now()}`,
    user_id: userId,
    date: new Date().toISOString(),
    emotion: "calm",
    intensity: 7,
    confidence: 0.85,
    text: "I'm feeling pretty good today.",
    emojis: "😌",
    timestamp: new Date().toISOString()
  };
  
  return mockEmotion;
};

// Analyze text input for emotions
export const analyzeEmotionFromText = async (text: string): Promise<EmotionResult> => {
  console.log("Analyzing emotion from text:", text);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simple mock algorithm to detect emotion based on keywords
  let emotion = "neutral";
  let confidence = 0.7;
  
  if (text.toLowerCase().includes("happy") || text.toLowerCase().includes("joy")) {
    emotion = "joy";
    confidence = 0.85;
  } else if (text.toLowerCase().includes("sad") || text.toLowerCase().includes("down")) {
    emotion = "sadness";
    confidence = 0.82;
  } else if (text.toLowerCase().includes("angry") || text.toLowerCase().includes("mad")) {
    emotion = "anger";
    confidence = 0.9;
  } else if (text.toLowerCase().includes("anxious") || text.toLowerCase().includes("worry")) {
    emotion = "anxiety";
    confidence = 0.75;
  } else if (text.toLowerCase().includes("calm") || text.toLowerCase().includes("peaceful")) {
    emotion = "calm";
    confidence = 0.8;
  }
  
  // Return the detected emotion
  return {
    emotion,
    confidence,
    intensity: 5,
    text,
    timestamp: new Date().toISOString()
  };
};

// Analyze audio input for emotions
export const analyzeEmotionFromAudio = async (audioUrl: string): Promise<EmotionResult> => {
  console.log("Analyzing emotion from audio:", audioUrl);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Mock response for audio analysis
  return {
    emotion: "calm",
    confidence: 0.72,
    intensity: 4,
    audioUrl,
    timestamp: new Date().toISOString()
  };
};

// Get emotion recommendations based on detected emotion
export const getEmotionRecommendations = async (emotion: string): Promise<string[]> => {
  console.log("Getting recommendations for emotion:", emotion);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Mock recommendations based on emotion
  const recommendationsByEmotion: Record<string, string[]> = {
    joy: [
      "Share your positive energy with others",
      "Journal about what made you happy today",
      "Try a gratitude meditation"
    ],
    sadness: [
      "Talk to someone you trust about how you feel",
      "Practice self-compassion meditation",
      "Listen to uplifting music"
    ],
    anger: [
      "Take deep breaths and count to 10",
      "Go for a brisk walk outside",
      "Write down your thoughts to process them"
    ],
    anxiety: [
      "Practice box breathing (4-4-4-4 pattern)",
      "Ground yourself with the 5-4-3-2-1 technique",
      "Listen to calming nature sounds"
    ],
    calm: [
      "Maintain this state with mindfulness practice",
      "Journal about what helps you stay balanced",
      "Consider creative activities that bring you joy"
    ],
    neutral: [
      "Check in with your body for any physical sensations",
      "Practice mindful breathing for 5 minutes",
      "Consider what you'd like to accomplish today"
    ]
  };
  
  return recommendationsByEmotion[emotion.toLowerCase()] || recommendationsByEmotion.neutral;
};
