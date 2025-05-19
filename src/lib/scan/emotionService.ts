
import { EmotionPrediction } from '@/types/emotion';

// Fix the type mismatch issues
export const analyzeEmotion = () => {
  // Replace the string emotion with object that includes name property
  const emotion = { 
    name: 'joy',
    intensity: 70,
    confidence: 0.8,
    score: 75
  };
  
  // Use properties from the emotion object
  console.log(`Detected emotion: ${emotion.name} with intensity: ${emotion.intensity}`);
  
  // Return a properly formatted EmotionPrediction
  const prediction: EmotionPrediction = {
    emotion: emotion.name,
    probability: 0.85,
    confidence: emotion.confidence,
    score: emotion.score,
    timestamp: new Date().toISOString(),
    source: 'emotion-service'
  };
  
  return prediction;
};
