
import { EmotionResult } from '@/types/emotion';

/**
 * Saves emotion scan results
 */
export const saveEmotion = async (result: EmotionResult): Promise<EmotionResult> => {
  // This would typically save to a database via API
  // For now, we'll just return the result with an ID
  console.log('Saving emotion result:', result);
  
  return {
    ...result,
    id: result.id || `emotion-${Date.now()}`,
    timestamp: result.timestamp || new Date().toISOString()
  };
};

/**
 * Fetches emotion history for a user
 */
export const fetchEmotionHistory = async (userId?: string): Promise<EmotionResult[]> => {
  // This would typically fetch from a database via API
  // For now, we'll return mock data
  return [
    {
      id: 'emotion-1',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      emotion: 'happy',
      score: 0.85,
      intensity: 0.7,
      confidence: 0.9,
      emojis: ['😀', '😊'],
      text: "I'm feeling great today!",
      transcript: "I'm feeling great today!"
    },
    {
      id: 'emotion-2',
      date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      emotion: 'sad',
      score: 0.6,
      intensity: 0.5,
      confidence: 0.85,
      emojis: ['😢', '😔'],
      text: "I've been better",
      transcript: "I've been better"
    },
    {
      id: 'emotion-3',
      date: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      emotion: 'neutral',
      score: 0.5,
      intensity: 0.3,
      confidence: 0.7,
      emojis: ['😐'],
      text: "Just another day",
      transcript: "Just another day"
    }
  ];
};

/**
 * Analyzes text to determine emotion
 */
export const analyzeTextEmotion = async (text: string): Promise<EmotionResult> => {
  // This would typically call an NLP API
  // For now, we'll return mock data based on keywords
  
  // Simple keyword matching
  const emotions = {
    happy: ['happy', 'good', 'great', 'excellent', 'joy', 'wonderful'],
    sad: ['sad', 'depressed', 'unhappy', 'miserable', 'down'],
    angry: ['angry', 'mad', 'furious', 'annoyed', 'irritated'],
    anxious: ['anxious', 'worried', 'nervous', 'stress', 'concerned'],
    calm: ['calm', 'peaceful', 'relaxed', 'serene', 'content']
  };
  
  const textLower = text.toLowerCase();
  let detectedEmotion = 'neutral';
  let highestCount = 0;
  
  for (const [emotion, keywords] of Object.entries(emotions)) {
    const count = keywords.filter(keyword => textLower.includes(keyword)).length;
    if (count > highestCount) {
      highestCount = count;
      detectedEmotion = emotion;
    }
  }
  
  const confidence = highestCount > 0 ? Math.min(0.5 + highestCount * 0.1, 0.95) : 0.5;
  
  return {
    id: `emotion-${Date.now()}`,
    date: new Date().toISOString(),
    timestamp: new Date().toISOString(),
    emotion: detectedEmotion,
    score: confidence,
    intensity: Math.random() * 0.5 + 0.25, // Random intensity between 0.25 and 0.75
    confidence,
    emojis: detectedEmotion === 'happy' ? ['😀', '😊'] : 
            detectedEmotion === 'sad' ? ['😢', '😔'] :
            detectedEmotion === 'angry' ? ['😡', '😠'] :
            detectedEmotion === 'anxious' ? ['😰', '😨'] :
            detectedEmotion === 'calm' ? ['😌', '😊'] : ['😐'],
    text,
    transcript: text
  };
};

/**
 * Analyzes voice audio to determine emotion
 */
export const analyzeVoiceEmotion = async (audioBlob: Blob): Promise<EmotionResult> => {
  // This would typically call a voice analysis API
  // For now, we'll return mock data
  
  const emotions = ['happy', 'sad', 'angry', 'anxious', 'calm', 'neutral'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  const confidence = Math.random() * 0.3 + 0.65; // Random confidence between 0.65 and 0.95
  
  return {
    id: `emotion-${Date.now()}`,
    date: new Date().toISOString(),
    timestamp: new Date().toISOString(),
    emotion: randomEmotion,
    score: confidence,
    intensity: Math.random() * 0.5 + 0.25, // Random intensity between 0.25 and 0.75
    confidence,
    emojis: randomEmotion === 'happy' ? ['😀', '😊'] : 
            randomEmotion === 'sad' ? ['😢', '😔'] :
            randomEmotion === 'angry' ? ['😡', '😠'] :
            randomEmotion === 'anxious' ? ['😰', '😨'] :
            randomEmotion === 'calm' ? ['😌', '😊'] : ['😐'],
    text: "Voice analysis result",
    transcript: "Voice analysis transcript would appear here in a real application"
  };
};

/**
 * Analyzes facial expression to determine emotion
 */
export const analyzeFacialEmotion = async (imageBlob: Blob): Promise<EmotionResult> => {
  // This would typically call a facial analysis API
  // For now, we'll return mock data
  
  const emotions = ['happy', 'sad', 'angry', 'surprised', 'disgusted', 'fearful', 'neutral'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  const confidence = Math.random() * 0.3 + 0.65; // Random confidence between 0.65 and 0.95
  
  return {
    id: `emotion-${Date.now()}`,
    date: new Date().toISOString(),
    timestamp: new Date().toISOString(),
    emotion: randomEmotion,
    score: confidence,
    intensity: Math.random() * 0.5 + 0.25, // Random intensity between 0.25 and 0.75
    confidence,
    emojis: randomEmotion === 'happy' ? ['😀', '😊'] : 
            randomEmotion === 'sad' ? ['😢', '😔'] :
            randomEmotion === 'angry' ? ['😡', '😠'] :
            randomEmotion === 'surprised' ? ['😮', '😲'] :
            randomEmotion === 'disgusted' ? ['🤢', '😖'] :
            randomEmotion === 'fearful' ? ['😨', '😱'] : ['😐'],
  };
};
