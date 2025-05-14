
import { Emotion, EmotionResult } from '@/types';

export const analyzeEmotion = async (data: any): Promise<EmotionResult> => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Return mock response
    const mockResult: EmotionResult = {
      id: `emotion-${Date.now()}`,
      user_id: data.user_id,
      emotion: 'calm',
      score: 7.5,
      text: data.text || '',
      emojis: data.emojis || '😌',
      transcript: data.text || '',
      feedback: "Vous semblez être dans un état calme et détendu. C'est un excellent moment pour la réflexion ou la méditation.",
      ai_feedback: "Vous semblez être dans un état calme et détendu. C'est un excellent moment pour la réflexion ou la méditation.",
      confidence: 0.85,
      intensity: 0.65,
      source: data.audio_url ? 'audio' : (data.emojis ? 'manual' : 'text')
    };
    
    return mockResult;
  } catch (error) {
    console.error("Error analyzing emotion:", error);
    throw new Error("Failed to analyze emotion");
  }
};

export const saveEmotion = async (emotion: Emotion): Promise<Emotion> => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Return the emotion with an ID if it doesn't have one
    return {
      ...emotion,
      id: emotion.id || `emotion-${Date.now()}`
    };
  } catch (error) {
    console.error("Error saving emotion:", error);
    throw new Error("Failed to save emotion");
  }
};

export const getEmotionHistory = async (userId: string, limit = 10): Promise<Emotion[]> => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Return mock history
    const mockHistory: Emotion[] = Array.from({ length: limit }).map((_, index) => ({
      id: `emotion-${Date.now() - index * 86400000}`,
      user_id: userId,
      date: new Date(Date.now() - index * 86400000).toISOString(),
      emotion: index % 3 === 0 ? 'joy' : (index % 3 === 1 ? 'calm' : 'neutral'),
      score: 5 + Math.floor(Math.random() * 5),
      emojis: index % 3 === 0 ? '😊' : (index % 3 === 1 ? '😌' : '😐'),
      text: "Entry from emotional journal",
      is_confidential: false,
      share_with_coach: true
    }));
    
    return mockHistory;
  } catch (error) {
    console.error("Error fetching emotion history:", error);
    throw new Error("Failed to fetch emotion history");
  }
};
