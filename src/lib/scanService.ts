
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
    userId: data.userId || data.user_id,
    emotion: data.emotion || "neutral",
    intensity: data.intensity || 5,
    confidence: data.confidence || 0.8,
    text: data.text || "",
    emojis: data.emojis || [],
    audioUrl: data.audioUrl || data.audio_url || "",
    timestamp: data.timestamp || new Date().toISOString(),
    ...data
  };
  
  // In a real app, you would save this to a database
  // For now, we just return the created entry
  return emotionEntry;
};

// Analyze text input for emotions
export const analyzeEmotion = async (text: string): Promise<EmotionResult> => {
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

// Save emotion to database
export const saveEmotion = async (emotion: EmotionResult): Promise<EmotionResult> => {
  console.log("Saving emotion:", emotion);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real app, you would save this to a database
  return {
    ...emotion,
    id: emotion.id || `emotion_${Date.now()}`
  };
};

// Analyze audio for emotions
export const analyzeAudioStream = async (audioBlob: Blob): Promise<EmotionResult> => {
  console.log("Analyzing audio stream:", audioBlob);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Mock emotion detection from audio
  return {
    id: `emotion_${Date.now()}`,
    emotion: "calm",
    confidence: 0.75,
    intensity: 6,
    text: "", // No text for audio analysis
    timestamp: new Date().toISOString()
  };
};

// Fetch emotion history for a user
export const fetchEmotionHistory = async (userId: string, limit: number = 10): Promise<EmotionResult[]> => {
  console.log("Fetching emotion history for user:", userId, "with limit:", limit);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Mock emotion history
  const emotions: EmotionResult[] = [
    {
      id: "emotion_1",
      emotion: "joy",
      confidence: 0.85,
      intensity: 8,
      text: "Had a great day today!",
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      userId
    },
    {
      id: "emotion_2",
      emotion: "calm",
      confidence: 0.79,
      intensity: 6,
      text: "Feeling relaxed after meditation",
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      userId
    }
  ];
  
  return emotions;
};
