
import { EmotionResult } from '@/types';

/**
 * Analyze text to detect emotions
 * @param text Text to analyze for emotion detection
 * @returns Promise that resolves to an EmotionResult object
 */
export const analyzeEmotion = async (text: string): Promise<EmotionResult> => {
  try {
    console.log('Analyzing emotion from text:', text);
    
    // Mock implementation - in a real app this would call an AI service
    const emotions = ['happy', 'sad', 'anxious', 'calm', 'neutral', 'excited'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const confidence = 0.7 + (Math.random() * 0.25);
    
    // Mock recommendations based on emotion
    const recommendations = getRecommendationsForEmotion(randomEmotion);
    
    // Mock emojis
    const emojis = getEmojisForEmotion(randomEmotion);
    
    return {
      emotion: randomEmotion,
      confidence,
      text,
      emojis,
      recommendations,
      feedback: `I detect mostly ${randomEmotion} emotion in your text. Try some of the recommended activities to enhance your wellbeing.`,
      date: new Date().toISOString(),
      id: `emotion-${Date.now()}`,
      triggers: ['work stress', 'daily routine']
    };
  } catch (error) {
    console.error('Error analyzing emotion:', error);
    throw error;
  }
};

/**
 * Generate mock recommendations based on emotion
 */
const getRecommendationsForEmotion = (emotion: string): string[] => {
  const recommendations: Record<string, string[]> = {
    happy: [
      'Share your positive energy with others',
      'Journal about what made you happy',
      'Set new goals while in this positive mindset'
    ],
    sad: [
      'Take a short walk outside',
      'Listen to uplifting music',
      'Connect with a friend or family member'
    ],
    anxious: [
      'Try deep breathing exercises',
      'Practice mindfulness meditation',
      'Write down your worries and prioritize them'
    ],
    calm: [
      'Maintain this state with light reading',
      'Use this state for creative activities',
      'Practice gratitude journaling'
    ],
    neutral: [
      'Consider activities that spark joy',
      'Try something new today',
      'Reflect on your goals and progress'
    ],
    excited: [
      'Channel this energy into productive tasks',
      'Share your excitement with others',
      'Document your ideas while inspired'
    ]
  };
  
  return recommendations[emotion] || [
    'Practice mindfulness meditation',
    'Take a short break',
    'Journal about your feelings'
  ];
};

/**
 * Generate emojis based on emotion
 */
const getEmojisForEmotion = (emotion: string): string[] => {
  const emojiMap: Record<string, string[]> = {
    happy: ['😊', '😄', '🥳'],
    sad: ['😢', '😔', '🥺'],
    anxious: ['😰', '😨', '😬'],
    calm: ['😌', '🧘‍♂️', '🧘‍♀️'],
    neutral: ['😐', '🤔', '😶'],
    excited: ['🤩', '😃', '🎉']
  };
  
  return emojiMap[emotion] || ['😊'];
};
