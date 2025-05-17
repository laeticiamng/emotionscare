
import { EmotionResult } from '@/types/emotion';

// Simple mock analysis function - in production this would call an API
export const analyzeEmotion = async (
  text: string,
  userId?: string,
): Promise<EmotionResult> => {
  console.log('Analyzing emotion for text:', text);
  
  // Simple emotion detection algorithm based on keywords
  const emotions = [
    { name: 'happy', keywords: ['happy', 'joy', 'great', 'excellent', 'good', 'love', 'smile'] },
    { name: 'sad', keywords: ['sad', 'unhappy', 'depressed', 'bad', 'terrible', 'crying'] },
    { name: 'angry', keywords: ['angry', 'mad', 'upset', 'annoyed', 'furious', 'hate'] },
    { name: 'anxious', keywords: ['anxious', 'worried', 'nervous', 'stress', 'tense', 'afraid'] },
    { name: 'calm', keywords: ['calm', 'peaceful', 'relaxed', 'chill', 'quiet', 'serene'] }
  ];
  
  const lowercaseText = text.toLowerCase();
  let detectedEmotion = 'neutral';
  let highestScore = 0;
  
  // Find emotion with highest keyword matches
  emotions.forEach(emotion => {
    const score = emotion.keywords.reduce((count, keyword) => {
      return count + (lowercaseText.includes(keyword) ? 1 : 0);
    }, 0);
    
    if (score > highestScore) {
      highestScore = score;
      detectedEmotion = emotion.name;
    }
  });
  
  // If no keywords matched, default is neutral
  const confidence = highestScore > 0 ? Math.min(0.5 + (highestScore * 0.1), 0.95) : 0.5;
  
  // Wait to simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const result: EmotionResult = {
    id: `emotion-${Date.now()}`,
    user_id: userId || 'anonymous',
    emotion: detectedEmotion,
    score: confidence,
    confidence: confidence,
    intensity: confidence * 10,
    timestamp: new Date().toISOString(),
    text: text,
    emojis: getEmojiForEmotion(detectedEmotion),
    date: new Date().toISOString()
  };
  
  return result;
};

// Helper function to get emoji for emotion
function getEmojiForEmotion(emotion: string): string {
  switch (emotion.toLowerCase()) {
    case 'happy':
      return '😊';
    case 'sad':
      return '😢';
    case 'angry':
      return '😠';
    case 'anxious':
      return '😰';
    case 'calm':
      return '😌';
    default:
      return '😐';
  }
}
