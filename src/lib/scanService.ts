
import { EmotionResult } from '@/types/emotion';

export const analyzeEmotion = async (text: string): Promise<EmotionResult> => {
  // This would be an API call to your emotion analysis service
  // For now, we'll simulate a response
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock emotions based on keywords in the text
  const emotions = [
    { emotion: 'happy', keywords: ['joy', 'happy', 'excited', 'great', 'wonderful', 'amazing'] },
    { emotion: 'sad', keywords: ['sad', 'unhappy', 'depressed', 'down', 'upset', 'terrible'] },
    { emotion: 'angry', keywords: ['angry', 'mad', 'frustrated', 'annoyed', 'irritated'] },
    { emotion: 'fear', keywords: ['afraid', 'scared', 'anxious', 'worried', 'terrified'] },
    { emotion: 'neutral', keywords: ['neutral', 'ok', 'fine', 'alright', 'normal'] },
    { emotion: 'calm', keywords: ['calm', 'relaxed', 'peaceful', 'tranquil', 'serene'] },
  ];
  
  // Default emotion
  let detectedEmotion = 'neutral';
  let highestMatchCount = 0;
  
  // Simple keyword matching
  const lowercasedText = text.toLowerCase();
  emotions.forEach(emotionData => {
    const matchCount = emotionData.keywords.filter(keyword => 
      lowercasedText.includes(keyword)
    ).length;
    
    if (matchCount > highestMatchCount) {
      highestMatchCount = matchCount;
      detectedEmotion = emotionData.emotion;
    }
  });
  
  // Generate a random score between 50-100 to simulate confidence level
  const randomScore = Math.floor(Math.random() * 50) + 50;
  
  return {
    emotion: detectedEmotion,
    score: randomScore,
    intensity: randomScore,
    date: new Date().toISOString(),
    timestamp: new Date().toISOString(),
    triggers: ['detected from text'],
    recommendations: ['Take a moment to acknowledge your feelings']
  };
};

export const fetchEmotionHistory = async (userId: string): Promise<EmotionResult[]> => {
  // This would be an API call to fetch emotion history for a user
  // For now, we'll simulate a response
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate mock data for the past 7 days
  const history: EmotionResult[] = [];
  const emotions = ['happy', 'sad', 'angry', 'fear', 'neutral', 'calm'];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const randomScore = Math.floor(Math.random() * 50) + 50;
    
    history.push({
      emotion: randomEmotion,
      score: randomScore,
      intensity: randomScore,
      date: date.toISOString(),
      timestamp: date.toISOString()
    });
  }
  
  return history;
};
