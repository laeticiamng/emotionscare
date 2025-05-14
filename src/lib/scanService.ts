
// Mock implementation of scan service functions

/**
 * Analyzes an audio stream and returns emotion data
 */
export const analyzeAudioStream = async (stream: MediaStream): Promise<{
  emotion: string;
  score: number;
  confidence: number;
}> => {
  // In a real implementation, this would send audio data to a backend service
  // For now, we'll simulate a delay and return mock data
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const emotions = ['calm', 'joy', 'neutral', 'sadness', 'anxiety'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  const randomScore = Math.floor(Math.random() * 100);
  const randomConfidence = 0.7 + Math.random() * 0.3; // Between 0.7 and 1.0
  
  return {
    emotion: randomEmotion,
    score: randomScore,
    confidence: randomConfidence
  };
};

/**
 * Analyzes text for emotional content
 */
export const analyzeText = async (text: string): Promise<{
  emotion: string;
  score: number;
  confidence: number;
}> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple mock algorithm that looks for emotion keywords in text
  const keywords = {
    joy: ['happy', 'joy', 'glad', 'excited', 'pleased'],
    sadness: ['sad', 'unhappy', 'depressed', 'down', 'low'],
    anger: ['angry', 'upset', 'furious', 'annoyed', 'irritated'],
    fear: ['scared', 'afraid', 'anxious', 'worried', 'nervous'],
    calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil'],
    neutral: ['ok', 'fine', 'normal', 'average']
  };
  
  let detectedEmotion = 'neutral';
  let highestMatches = 0;
  
  for (const [emotion, words] of Object.entries(keywords)) {
    const matches = words.filter(word => text.toLowerCase().includes(word)).length;
    if (matches > highestMatches) {
      highestMatches = matches;
      detectedEmotion = emotion;
    }
  }
  
  const textLength = text.split(' ').length;
  const confidence = Math.min(0.5 + (highestMatches * 0.1) + (textLength * 0.005), 0.98);
  
  return {
    emotion: detectedEmotion,
    score: detectedEmotion === 'neutral' ? 50 : 
           (detectedEmotion === 'joy' || detectedEmotion === 'calm') ? 75 : 25,
    confidence
  };
};

/**
 * Process camera feed to detect facial expressions
 */
export const analyzeFacialExpression = async (videoElement: HTMLVideoElement): Promise<{
  emotion: string;
  score: number;
  confidence: number;
}> => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Mock facial analysis result
  return {
    emotion: 'neutral',
    score: 50,
    confidence: 0.85
  };
};
