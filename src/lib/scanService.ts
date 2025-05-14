
import type { Emotion, EmotionResult, EmotionPrediction } from '@/types/emotion';

// Analyze emotion based on text input
export const analyzeEmotion = async (text: string): Promise<EmotionResult> => {
  // Mock implementation
  const randomEmotion = ['happy', 'sad', 'neutral', 'anxious', 'excited'][Math.floor(Math.random() * 5)];
  const randomScore = Math.random();
  
  return {
    dominantEmotion: randomEmotion,
    emotions: [
      { name: randomEmotion, score: randomScore, intensity: randomScore * 100, confidence: 0.8 }
    ],
    analysis: `Detected primarily ${randomEmotion} emotion in the text.`,
    recommendations: ['Take a break', 'Listen to calming music', 'Write in your journal'],
    timestamp: new Date().toISOString()
  };
};

// Analyze audio stream for emotions
export const analyzeAudioStream = async (audioBlob: Blob): Promise<EmotionResult> => {
  // Mock implementation
  const randomEmotion = ['happy', 'calm', 'neutral', 'stressed', 'tired'][Math.floor(Math.random() * 5)];
  const randomScore = Math.random();
  
  return {
    dominantEmotion: randomEmotion,
    emotions: [
      { name: randomEmotion, score: randomScore, intensity: randomScore * 100, confidence: 0.75 }
    ],
    analysis: `Voice tone indicates ${randomEmotion} state.`,
    recommendations: ['Practice breathing exercises', 'Take a short walk', 'Listen to uplifting music'],
    timestamp: new Date().toISOString()
  };
};

// Save emotion record
export const saveEmotion = async (emotion: Partial<Emotion>): Promise<Emotion> => {
  // Mock implementation
  return {
    id: Math.random().toString(36).substr(2, 9),
    user_id: emotion.user_id || 'current-user',
    date: new Date().toISOString(),
    emotion: emotion.emotion || 'neutral',
    intensity: emotion.intensity || 50,
    notes: emotion.notes || '',
    sources: emotion.sources || ['manual'],
    context: emotion.context || {}
  };
};

// Fetch emotion history for a user
export const fetchEmotionHistory = async (userId: string, days: number = 30): Promise<Emotion[]> => {
  // Mock implementation
  const history: Emotion[] = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    if (Math.random() > 0.3) { // Some days might not have entries
      history.push({
        id: `history-${i}`,
        user_id: userId,
        date: date.toISOString(),
        emotion: ['happy', 'sad', 'neutral', 'anxious', 'excited'][Math.floor(Math.random() * 5)],
        intensity: Math.floor(Math.random() * 100),
        notes: '',
        sources: ['history'],
        context: {}
      });
    }
  }
  
  return history;
};
