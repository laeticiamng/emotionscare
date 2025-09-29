
import { EmotionResult, EmotionScanOptions } from '@/types/emotions';

export const analyzeEmotion = async (options: EmotionScanOptions): Promise<EmotionResult> => {
  // Simulate emotion analysis
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    id: Date.now().toString(),
    userId: 'user-1',
    timestamp: new Date(),
    overallMood: 'positive',
    emotions: [
      { emotion: 'happy', confidence: 0.8, intensity: 0.7 }
    ],
    dominantEmotion: 'happy',
    confidence: 0.8,
    source: options.type,
    recommendations: ['Continuez à maintenir cette énergie positive']
  };
};

export const enhancedAnalyzeService = {
  analyzeEmotion,
  analyzeTextEmotion: analyzeEmotion,
  processVideo: async (videoBlob: Blob) => {
    return analyzeEmotion({ type: 'video', data: videoBlob });
  },
  processAudio: async (audioBlob: Blob) => {
    return analyzeEmotion({ type: 'audio', data: audioBlob });
  }
};
