
import { EmotionResult } from '@/types/emotion';

// Analyze audio stream and return emotion data
export async function analyzeAudioStream(audioBlob: Blob): Promise<EmotionResult> {
  try {
    // Mock implementation for demo purposes
    // In a real app, this would call an API endpoint
    console.log('Analyzing audio stream of size', audioBlob.size);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      id: crypto.randomUUID(),
      emotion: ['calm', 'happy', 'focused', 'anxious', 'excited'][Math.floor(Math.random() * 5)],
      confidence: Math.random() * 0.5 + 0.5, // 0.5-1.0
      score: Math.floor(Math.random() * 100),
      intensity: Math.random() * 0.8 + 0.2, // 0.2-1.0
      transcript: "Ce que j'ai ressenti aujourd'hui était plutôt positif, malgré quelques challenges.",
      text: "Ce que j'ai ressenti aujourd'hui était plutôt positif, malgré quelques challenges.",
      feedback: "Vous semblez être dans un bon état émotionnel aujourd'hui.",
      ai_feedback: "Votre émotion principale est positive. Continuez à observer ces moments.",
      recommendations: [
        "Prenez 5 minutes pour noter ce qui a contribué à cette émotion",
        "Pratiquez une courte méditation de gratitude"
      ]
    };
  } catch (error) {
    console.error('Error analyzing audio:', error);
    throw new Error('Failed to analyze audio stream');
  }
}

// Create emotion entry in the database
export async function createEmotionEntry(data: {
  user_id: string;
  date: string;
  text?: string;
  emojis?: string;
  audio_url?: string;
  is_confidential?: boolean;
  share_with_coach?: boolean;
}): Promise<EmotionResult> {
  try {
    // Mock implementation for demo purposes
    console.log('Creating emotion entry:', data);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a mock emotion result
    return {
      id: crypto.randomUUID(),
      user_id: data.user_id,
      date: data.date,
      emotion: ['calm', 'happy', 'focused', 'anxious', 'excited'][Math.floor(Math.random() * 5)],
      confidence: Math.random() * 0.5 + 0.5,
      score: Math.floor(Math.random() * 100),
      intensity: Math.random() * 0.8 + 0.2,
      text: data.text || "",
      transcript: data.text || "",
      ai_feedback: "Votre émotion a été enregistrée avec succès.",
      recommendations: [
        "Continuez à pratiquer la pleine conscience",
        "Essayez une séance de relaxation"
      ]
    };
  } catch (error) {
    console.error('Error creating emotion entry:', error);
    throw new Error('Failed to create emotion entry');
  }
}

// Fetch the most recent emotion for a user
export async function fetchLatestEmotion(userId: string): Promise<EmotionResult | null> {
  try {
    // Mock implementation for demo purposes
    console.log('Fetching latest emotion for user:', userId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return a mock emotion or null
    const shouldHaveEmotion = Math.random() > 0.2; // 80% chance to have an emotion
    
    if (shouldHaveEmotion) {
      return {
        id: crypto.randomUUID(),
        user_id: userId,
        date: new Date().toISOString(),
        emotion: ['calm', 'happy', 'focused', 'anxious', 'excited'][Math.floor(Math.random() * 5)],
        confidence: Math.random() * 0.5 + 0.5,
        score: Math.floor(Math.random() * 100),
        intensity: Math.random() * 0.8 + 0.2,
        text: "Dernière émotion enregistrée",
        ai_feedback: "Voici votre dernière émotion enregistrée."
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching latest emotion:', error);
    return null;
  }
}
