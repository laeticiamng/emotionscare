
import type { EmotionResult } from '@/types/types';

// —————————————————————————————————
// Fonction : analyzeEmotion
// —————————————————————————————————
export const analyzeEmotion = async (
  text: string, 
  emojis?: string[], 
  audioUrl?: string | null
): Promise<EmotionResult> => {
  // Mock API call for development
  console.log('Analyzing text:', text, 'emojis:', emojis, 'audio:', audioUrl);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock result
  return {
    id: Math.random().toString(36).substring(2, 9),
    emotion: determineEmotion(text, emojis),
    confidence: 0.85,
    intensity: 0.7,
    transcript: text,
    text: text,
    date: new Date().toISOString(),
    emojis: emojis || [],
    ai_feedback: generateAIFeedback(text),
  };
};

// Helper to determine emotion based on text
const determineEmotion = (text: string, emojis?: string[]): string => {
  const lowerText = text.toLowerCase();
  
  // Simple keyword matching
  if (/happy|joy|excited|glad|wonderful|fantastic/.test(lowerText)) return 'joy';
  if (/sad|unhappy|depressed|disappointed|down/.test(lowerText)) return 'sadness';
  if (/angry|mad|frustrated|annoyed/.test(lowerText)) return 'anger';
  if (/scared|afraid|fearful|anxious|worried/.test(lowerText)) return 'fear';
  if (/surprised|amazed|astonished|shocked/.test(lowerText)) return 'surprise';
  if (/disgusted|dislike|gross|repulsed/.test(lowerText)) return 'disgust';
  if (/calm|relaxed|peaceful|serene/.test(lowerText)) return 'calm';
  
  // Check emojis
  if (emojis && emojis.length > 0) {
    if (emojis.some(e => ['😀', '😃', '😄', '😁', '🥰', '😊'].includes(e))) return 'joy';
    if (emojis.some(e => ['😢', '😭', '😞', '😔'].includes(e))) return 'sadness';
    if (emojis.some(e => ['😠', '😡', '🤬'].includes(e))) return 'anger';
    if (emojis.some(e => ['😨', '😱', '😰', '😓'].includes(e))) return 'fear';
    if (emojis.some(e => ['😲', '😮', '😯'].includes(e))) return 'surprise';
  }
  
  return 'neutral';
};

// Generate mock AI feedback
const generateAIFeedback = (text: string): string => {
  const lowerText = text.toLowerCase();
  
  if (/happy|joy|excited|glad/.test(lowerText)) {
    return "Je détecte de la joie dans vos mots. C'est une excellente énergie à cultiver et à partager avec votre entourage.";
  }
  
  if (/sad|unhappy|depressed|disappointed/.test(lowerText)) {
    return "Je perçois de la tristesse dans votre message. N'hésitez pas à parler à quelqu'un de confiance de ce que vous ressentez.";
  }
  
  if (/angry|mad|frustrated|annoyed/.test(lowerText)) {
    return "Je sens de la colère dans vos mots. Prenez quelques respirations profondes et essayez d'identifier précisément ce qui vous irrite.";
  }
  
  return "Votre message reflète votre état émotionnel actuel. La conscience de nos émotions est le premier pas vers le bien-être.";
};

// —————————————————————————————————
// Fonction : saveEmotion
// —————————————————————————————————
export const saveEmotion = async (result: EmotionResult): Promise<boolean> => {
  console.log('Saving emotion:', result);
  
  // In a real app, this would be a call to your backend
  try {
    // Convert to appropriate format if needed
    const payload = {
      ...result,
      // Convert Date to string if needed
      date: typeof result.date === 'object' && result.date instanceof Date 
        ? result.date.toISOString() 
        : result.date,
      // Convert array to string if the API expects it
      emojis: Array.isArray(result.emojis) ? result.emojis.join(',') : result.emojis,
    };
    
    // Mock successful API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Emotion saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving emotion:', error);
    return false;
  }
};

// —————————————————————————————————
// Fonction : analyzeAudioStream
// —————————————————————————————————
export const analyzeAudioStream = async (audioBlob: Blob): Promise<EmotionResult> => {
  console.log('Analyzing audio stream...');
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock result
  return {
    id: Math.random().toString(36).substring(2, 9),
    emotion: ['joy', 'sadness', 'anger', 'fear', 'surprise'][Math.floor(Math.random() * 5)],
    confidence: 0.7 + Math.random() * 0.25,
    text: "Transcript would appear here in a real implementation",
    transcript: "This is a mock transcript from the audio recording",
    date: new Date().toISOString(),
    score: Math.floor(Math.random() * 100),
    feedback: "This is mock feedback based on the analyzed emotion"
  };
};

// —————————————————————————————————
// Fonction : fetchLatestEmotion
// —————————————————————————————————
export const fetchLatestEmotion = async (userId: string): Promise<EmotionResult | null> => {
  console.log('Fetching latest emotion for user:', userId);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock data
  return {
    id: Math.random().toString(36).substring(2, 9),
    emotion: ['joy', 'calm', 'sadness'][Math.floor(Math.random() * 3)],
    score: Math.floor(Math.random() * 10) + 1,
    date: new Date().toISOString(),
    text: "This was my feeling earlier today",
    user_id: userId
  };
};
