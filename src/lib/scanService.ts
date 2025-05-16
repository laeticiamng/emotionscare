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
 * Creates a new emotion entry
 */
export const createEmotionEntry = async (data: Partial<EmotionResult>): Promise<EmotionResult> => {
  console.log('Creating emotion entry:', data);
  
  // In a real implementation, this would send the data to an API
  // For now, we'll just return the data with some defaults
  const emotionResult: EmotionResult = {
    id: data.id || `emotion-${Date.now()}`,
    emotion: data.emotion || 'neutral',
    score: data.score || 0.5,
    confidence: data.confidence || 0.5,
    intensity: data.intensity || 0.5,
    emojis: data.emojis || [],
    date: data.date || new Date().toISOString(),
    timestamp: data.timestamp || new Date().toISOString(),
    text: data.text || '',
    feedback: data.feedback || '',
    user_id: data.user_id
  };
  
  return emotionResult;
};

/**
 * Fetches the latest emotion for a user
 */
export const fetchLatestEmotion = async (userId: string): Promise<EmotionResult | null> => {
  console.log('Fetching latest emotion for user:', userId);
  
  // This would typically fetch from a database via API
  // For now, return mock data
  return {
    id: `emotion-${Date.now() - 3600000}`,
    date: new Date().toISOString(),
    timestamp: new Date().toISOString(),
    emotion: 'calm',
    score: 0.75,
    confidence: 0.8,
    intensity: 0.6,
    emojis: ['😌'],
    text: "I'm feeling pretty relaxed today",
    feedback: "You seem to be in a balanced emotional state. Consider maintaining this calm with some light music or meditation.",
    user_id: userId
  };
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
    feedback: `Analysis indicates a ${detectedEmotion} emotional state.`
  };
};

/**
 * General emotion analysis entry point that calls the appropriate analysis method
 */
export const analyzeEmotion = async (input: string | Blob): Promise<EmotionResult> => {
  // Determine the type of input and direct to appropriate analysis function
  if (typeof input === 'string') {
    return analyzeTextEmotion(input);
  } else if (input instanceof Blob) {
    if (input.type.startsWith('audio/')) {
      return analyzeVoiceEmotion(input);
    } else if (input.type.startsWith('image/')) {
      return analyzeFacialEmotion(input);
    }
  }
  
  // Default response if input type couldn't be determined
  return {
    id: `emotion-${Date.now()}`,
    date: new Date().toISOString(),
    timestamp: new Date().toISOString(),
    emotion: 'neutral',
    score: 0.5,
    confidence: 0.5,
    intensity: 0.5,
    emojis: ['😐'],
    text: 'Unable to determine emotion from input',
    feedback: 'We couldn\'t analyze your emotion based on the provided input.'
  };
};

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
    feedback: "Voice analysis transcript would appear here in a real application"
  };
};

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
    feedback: `Facial analysis indicates a ${randomEmotion} emotional state.`
  };
};
