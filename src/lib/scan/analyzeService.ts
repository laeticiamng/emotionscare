
import { EmotionPrediction, EmotionAnalysis } from '@/types/mood';

// Analyze audio and extract emotions
export const analyzeAudio = async (audioBlob: Blob): Promise<EmotionAnalysis> => {
  // In a real application, this would call an API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock data - in production this would come from your API
      const mockEmotions: EmotionPrediction[] = [
        { emotion: 'calm', probability: 0.72, intensity: 0.68, score: 72 },
        { emotion: 'happy', probability: 0.15, intensity: 0.22, score: 15 },
        { emotion: 'anxious', probability: 0.08, intensity: 0.12, score: 8 },
        { emotion: 'sad', probability: 0.05, intensity: 0.08, score: 5 }
      ];
      
      resolve({
        dominant: mockEmotions[0],
        emotions: mockEmotions,
        sentiment: 'positive',
        intensityScore: 0.68,
        audioQuality: 0.95,
        confidence: 0.82
      });
    }, 1500);
  });
};

// Generate a prediction based on text input
export const analyzeText = async (text: string): Promise<EmotionAnalysis> => {
  // This would normally call an API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create mock data
      const emotions: Record<string, number> = {
        happy: 0.2,
        sad: 0.1,
        angry: 0.05,
        surprised: 0.02,
        calm: 0.63
      };
      
      // Convert to emotion prediction format
      const emotionPredictions: EmotionPrediction[] = Object.entries(emotions).map(([emotion, probability]) => ({
        emotion,
        probability,
        intensity: probability * 0.9,
        score: probability * 100,
        category: getCategoryForEmotion(emotion)
      }));
      
      // Sort by probability descending
      emotionPredictions.sort((a, b) => b.probability - a.probability);
      
      resolve({
        dominant: emotionPredictions[0],
        emotions: emotionPredictions,
        sentiment: getSentiment(emotionPredictions),
        intensityScore: calculateIntensity(emotionPredictions),
        confidence: 0.85
      });
    }, 800);
  });
};

// Analyze facial expression
export const analyzeFacial = async (imageBlob: Blob): Promise<EmotionAnalysis> => {
  // This would call a facial analysis API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock facial emotion data
      const emotions: EmotionPrediction[] = [
        { emotion: 'neutral', probability: 0.65, intensity: 0.5, score: 65 },
        { emotion: 'happiness', probability: 0.25, intensity: 0.7, score: 25 },
        { emotion: 'surprise', probability: 0.08, intensity: 0.4, score: 8 },
        { emotion: 'sadness', probability: 0.02, intensity: 0.2, score: 2 }
      ];
      
      resolve({
        dominant: emotions[0],
        emotions: emotions,
        sentiment: 'neutral',
        intensityScore: 0.5,
        confidence: 0.78
      });
    }, 1200);
  });
};

// Combine multiple emotion sources
export const combineEmotionSources = (
  audio?: EmotionAnalysis,
  facial?: EmotionAnalysis,
  text?: EmotionAnalysis
): EmotionAnalysis => {
  if (!audio && !facial && !text) {
    throw new Error("No emotion sources provided");
  }
  
  // Use available sources or create empty arrays
  const audioEmotions = audio?.emotions || [];
  const facialEmotions = facial?.emotions || [];
  const textEmotions = text?.emotions || [];
  
  // Get all unique emotion names
  const emotionNames = new Set<string>();
  [...audioEmotions, ...facialEmotions, ...textEmotions].forEach(e => 
    emotionNames.add(e.emotion)
  );
  
  // Combine all emotions with weighted averaging
  const combinedEmotions: EmotionPrediction[] = [];
  emotionNames.forEach(name => {
    const audioEmotion = audioEmotions.find(e => e.emotion === name);
    const facialEmotion = facialEmotions.find(e => e.emotion === name);
    const textEmotion = textEmotions.find(e => e.emotion === name);
    
    // Weights for different sources
    const audioWeight = audio ? 0.4 : 0;
    const facialWeight = facial ? 0.4 : 0;
    const textWeight = text ? 0.2 : 0;
    
    // Normalize weights
    const totalWeight = audioWeight + facialWeight + textWeight;
    
    // Calculate weighted average
    const probability = (
      (audioEmotion?.probability || 0) * audioWeight +
      (facialEmotion?.probability || 0) * facialWeight +
      (textEmotion?.probability || 0) * textWeight
    ) / totalWeight;
    
    const intensity = (
      (audioEmotion?.intensity || 0) * audioWeight +
      (facialEmotion?.intensity || 0) * facialWeight +
      (textEmotion?.intensity || 0) * textWeight
    ) / totalWeight;
    
    combinedEmotions.push({
      emotion: name,
      probability,
      intensity,
      score: probability * 100,
      category: getCategoryForEmotion(name)
    });
  });
  
  // Sort by probability
  combinedEmotions.sort((a, b) => b.probability - a.probability);
  
  return {
    dominant: combinedEmotions[0],
    emotions: combinedEmotions,
    sentiment: getSentiment(combinedEmotions),
    intensityScore: calculateIntensity(combinedEmotions),
    confidence: calculateConfidence(audio, facial, text),
  };
};

// Helper functions
function getCategoryForEmotion(emotion: string): string {
  const categories: Record<string, string[]> = {
    'positive': ['happy', 'joy', 'content', 'excited', 'pleased', 'calm', 'serene'],
    'negative': ['sad', 'angry', 'fearful', 'disgusted', 'anxious', 'stressed'],
    'neutral': ['neutral', 'surprised', 'confused']
  };
  
  for (const [category, emotions] of Object.entries(categories)) {
    if (emotions.includes(emotion.toLowerCase())) {
      return category;
    }
  }
  
  return 'neutral';
}

function getSentiment(emotions: EmotionPrediction[]): string {
  // Simple calculation based on top emotions
  const positiveEmotions = emotions
    .filter(e => getCategoryForEmotion(e.emotion) === 'positive')
    .reduce((sum, e) => sum + e.probability, 0);
  
  const negativeEmotions = emotions
    .filter(e => getCategoryForEmotion(e.emotion) === 'negative')
    .reduce((sum, e) => sum + e.probability, 0);
  
  if (positiveEmotions > negativeEmotions * 1.5) {
    return 'positive';
  } else if (negativeEmotions > positiveEmotions * 1.2) {
    return 'negative';
  } else {
    return 'neutral';
  }
}

function calculateIntensity(emotions: EmotionPrediction[]): number {
  // Weight intensity by probability
  if (!emotions.length) return 0;
  
  return emotions.reduce((sum, e) => sum + (e.intensity || 0) * e.probability, 0) / 
         emotions.reduce((sum, e) => sum + e.probability, 0);
}

function calculateConfidence(
  audio?: EmotionAnalysis, 
  facial?: EmotionAnalysis, 
  text?: EmotionAnalysis
): number {
  // More sources = higher base confidence
  let baseConfidence = 0.5;
  let sourcesCount = 0;
  
  if (audio) {
    baseConfidence += 0.15;
    sourcesCount++;
  }
  
  if (facial) {
    baseConfidence += 0.15;
    sourcesCount++;
  }
  
  if (text) {
    baseConfidence += 0.1;
    sourcesCount++;
  }
  
  // Average the confidence from each source
  const avgSourceConfidence = sourcesCount ? 
    (
      (audio?.confidence || 0.5) + 
      (facial?.confidence || 0.5) + 
      (text?.confidence || 0.5)
    ) / sourcesCount : 0.5;
  
  // Combine base confidence with source confidence
  return Math.min(0.95, (baseConfidence * 0.4) + (avgSourceConfidence * 0.6));
}
