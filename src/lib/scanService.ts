
import type { EmotionResult, Emotion } from '@/types/emotion';

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
export const saveEmotion = async (result: EmotionResult | Emotion): Promise<boolean> => {
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
// Fonction : analyzeAudioStream (mock temporaire)
// —————————————————————————————————
export const analyzeAudioStream = async (audioBlob: Blob): Promise<EmotionResult> => {
  // Exemple fictif – à remplacer par un vrai appel API ou WebSocket
  console.log('Analyse audio en cours...', audioBlob);

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    emotion: 'calm',
    confidence: 0.92,
    audio_url: 'https://example.com/audio/streamed',
  };
};

// —————————————————————————————————
// Fonction : convertToEmotionResult
// —————————————————————————————————
export const convertToEmotionResult = (input: any): EmotionResult => {
  return {
    id: input.id || Math.random().toString(36).substring(2, 9),
    emotion: input.emotion || 'neutral',
    confidence: input.confidence || input.score / 100 || 0.5,
    score: input.score || Math.round((input.confidence || 0.5) * 100),
    intensity: input.intensity || input.score || 50,
    transcript: input.transcript || input.text || '',
    text: input.text || input.transcript || '',
    date: input.date || new Date().toISOString(),
    emojis: Array.isArray(input.emojis) ? input.emojis : 
           (typeof input.emojis === 'string' ? [input.emojis] : []),
    ai_feedback: input.ai_feedback || input.feedback || '',
    feedback: input.feedback || input.ai_feedback || '',
    category: input.category || 'general',
    audio_url: input.audio_url || '',
  };
};

// —————————————————————————————————
// Fonction : getUserEmotions
// —————————————————————————————————
export const getUserEmotions = async (userId: string): Promise<Emotion[]> => {
  // Mock API call
  console.log('Fetching emotions for user:', userId);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock data
  return [
    {
      id: '1',
      user_id: userId,
      date: new Date(Date.now() - 86400000).toISOString(), // yesterday
      emotion: 'joy',
      score: 85,
      text: "J'ai passé une excellente journée aujourd'hui !",
      emojis: ['😀', '🥳'],
      category: 'positive',
    },
    {
      id: '2',
      user_id: userId,
      date: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
      emotion: 'calm',
      score: 70,
      text: "Moment de détente après une journée productive",
      emojis: ['😌', '🧘'],
      category: 'positive',
    },
    {
      id: '3',
      user_id: userId,
      date: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      emotion: 'neutral',
      score: 50,
      text: "Rien de spécial à signaler",
      emojis: ['😐'],
      category: 'neutral',
    },
  ];
};
