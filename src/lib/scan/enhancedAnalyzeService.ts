
import { EmotionResult, EmotionScanParams } from '@/types/emotions';

export const analyzeEmotion = async (params: EmotionScanParams): Promise<EmotionResult> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock emotion analysis result
  const mockResult: EmotionResult = {
    id: Date.now().toString(),
    userId: 'current-user',
    timestamp: new Date(),
    overallMood: 'positive',
    emotions: [
      { emotion: 'joie', confidence: 0.8, intensity: 0.7 },
      { emotion: 'sérénité', confidence: 0.6, intensity: 0.5 },
      { emotion: 'confiance', confidence: 0.7, intensity: 0.6 },
    ],
    dominantEmotion: 'joie',
    confidence: 0.8,
    source: params.type,
    recommendations: [
      'Votre état émotionnel est très positif',
      'Continuez vos bonnes habitudes',
      'Pensez à partager cette énergie positive',
    ],
    metadata: {
      inputLength: params.text?.length || 0,
      processingTime: 1500,
      analysisMethod: 'enhanced_ml',
    },
  };

  return mockResult;
};

export const analyzeSentiment = async (text: string): Promise<{ sentiment: string; confidence: number }> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    sentiment: 'positive',
    confidence: 0.85,
  };
};
