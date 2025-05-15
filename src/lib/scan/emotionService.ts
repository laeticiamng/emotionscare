import { Emotion, EmotionPrediction, EmotionResult } from '@/types/emotion';

// Define EmotionRecord type for local use in this file
interface EmotionRecord {
  id: string;
  user_id: string;
  date: string;
  emotion: string;
  score: number;
  text?: string;
  emojis?: string;
  audio_url?: string;
  ai_feedback?: string;
  created_at: string;
  confidence?: number;
  intensity?: number;
}

// Mock data for emotions history
const mockEmotionHistory: EmotionRecord[] = [
  {
    id: '1',
    user_id: '123',
    date: '2025-05-12T09:30:00Z',
    emotion: 'happiness',
    score: 0.85,
    text: 'Feeling great today',
    created_at: '2025-05-12T09:30:00Z',
    confidence: 0.92,
    intensity: 0.85
  },
  {
    id: '2',
    user_id: '123',
    date: '2025-05-11T14:20:00Z',
    emotion: 'calmness',
    score: 0.75,
    text: 'Peaceful afternoon',
    created_at: '2025-05-11T14:20:00Z',
    confidence: 0.88,
    intensity: 0.75
  }
];

/**
 * Get emotions history for a user
 */
export const getEmotionsHistory = async (userId: string): Promise<Emotion[]> => {
  // Simulate API call
  return mockEmotionHistory.map(record => ({
    name: record.emotion,
    score: record.score,
    intensity: record.intensity,
    confidence: record.confidence
  }));
};

/**
 * Save an emotion scan result
 */
export const saveEmotionScan = async (userId: string, result: EmotionResult): Promise<boolean> => {
  // In a real app, this would be an API call
  console.log('Saving emotion scan for user', userId, result);
  
  // Add to mock data for now
  const emotionName = result.dominantEmotion?.name || 'neutral';
  const intensity = result.dominantEmotion?.intensity || result.intensity || 0.5;
  
  mockEmotionHistory.unshift({
    id: Math.random().toString(36).substr(2, 9),
    user_id: userId,
    date: new Date().toISOString(),
    emotion: emotionName,
    score: intensity,
    text: result.text || undefined,
    created_at: new Date().toISOString(),
    confidence: result.confidence,
    intensity: intensity
  });
  
  return true;
};

/**
 * Get emotion predictions for a user based on past data
 */
export const getEmotionPredictions = async (userId: string): Promise<EmotionPrediction[]> => {
  // In a real app, this would be an API call with an ML model
  // For now, return static predictions based on mock data
  const predictions: EmotionPrediction[] = [
    {
      emotion: 'happiness',
      probability: 0.75,
      triggers: ['Morning exercise', 'Good weather'],
      recommendations: ['Continue your morning routine', 'Spend time outdoors']
    },
    {
      emotion: 'anxiety',
      probability: 0.45,
      triggers: ['Work deadlines', 'Traffic'],
      recommendations: ['Take short breaks', 'Practice breathing exercises']
    }
  ];
  
  return predictions;
};

/**
 * Gets the emotional trend over time
 */
export const getEmotionalTrend = async (userId: string, days = 7): Promise<any> => {
  // In a real app, this would calculate trends from actual data
  // For now, return mock trend data
  const now = new Date();
  const data = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.random() * 100,
      emotion: Math.random() > 0.5 ? 'happiness' : 'calmness',
      intensity: Math.random()
    });
  }
  
  return data;
};

/**
 * Process text to detect emotions
 */
export const processTextEmotion = async (text: string): Promise<EmotionResult> => {
  // In a real app, this would call an emotion API
  // For now, simulate processing with random results
  
  // Choose a random emotion
  const emotions = ['happiness', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'neutral'];
  const randomIndex = Math.floor(Math.random() * emotions.length);
  const emotion = emotions[randomIndex];
  
  // Generate random intensity and confidence
  const intensity = Math.random() * 0.7 + 0.3; // Between 0.3 and 1.0
  const confidence = Math.random() * 0.3 + 0.7; // Between 0.7 and 1.0
  
  // Create result object
  const result: EmotionResult = {
    emotions: [
      { name: emotion, intensity, confidence, score: intensity }
    ],
    dominantEmotion: { name: emotion, intensity, confidence, score: intensity },
    score: intensity,
    confidence,
    intensity,
    text,
    timestamp: new Date().toISOString(),
    source: 'text'
  };
  
  return result;
};

/**
 * Predict emotion from text
 */
export const predictEmotion = (text: string): Promise<EmotionPrediction> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create a prediction with all required fields
      resolve({
        predictedEmotion: 'joy',
        emotion: 'joy',
        probability: 0.85,
        confidence: 0.85, // Adding the required confidence field
        triggers: ['positive event', 'achievement'],
        recommendations: ['celebrate', 'share with friends']
      });
    }, 500);
  });
};
