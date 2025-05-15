
import { EmotionResult } from '@/types';
import { v4 as uuid } from 'uuid';

export const analyzeEmotion = async (text: string): Promise<EmotionResult> => {
  // Mock implementation for now - this would call an API in the real implementation
  console.log('Analyzing emotion from text:', text);
  
  const emotions = ['happy', 'sad', 'angry', 'surprised', 'fearful', 'calm', 'excited'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  
  // Return a mocked result
  return {
    id: uuid(),
    emotion: randomEmotion,
    score: Math.floor(Math.random() * 100),
    confidence: Math.random() * 0.5 + 0.5, // Between 0.5 and 1.0
    text: text,
    date: new Date().toISOString(),
    emojis: getEmojisForEmotion(randomEmotion),
    recommendations: getRecommendationsForEmotion(randomEmotion)
  };
};

export const createEmotionEntry = async (emotionData: Partial<EmotionResult>): Promise<EmotionResult> => {
  // Mock implementation for saving to a database
  console.log('Creating emotion entry:', emotionData);
  
  // In a real app, this would save to a database
  // For now, just return the data with an ID
  return {
    ...emotionData,
    id: emotionData.id || uuid(),
    date: emotionData.date || new Date().toISOString(),
    emotion: emotionData.emotion || 'neutral'
  } as EmotionResult;
};

export const fetchLatestEmotion = async (userId: string): Promise<EmotionResult | null> => {
  // Mock implementation for fetching data from a database
  console.log('Fetching latest emotion for user:', userId);
  
  // In a real app, this would fetch from a database
  // For now, return a mock result
  return {
    id: uuid(),
    user_id: userId,
    emotion: 'calm',
    score: 75,
    confidence: 0.85,
    date: new Date().toISOString(),
    emojis: ['😌', '🧘'],
    recommendations: [
      'Take a 5-minute breathing break',
      'Listen to calming music',
      'Go for a short walk outside'
    ]
  };
};

export const saveEmotion = async (emotion: Partial<EmotionResult>): Promise<EmotionResult> => {
  // This just wraps the createEmotionEntry function for backward compatibility
  return createEmotionEntry(emotion);
};

export const fetchEmotionHistory = async (userId: string) => {
  // Mock implementation to simulate fetching emotion history
  console.log('Fetching emotion history for user:', userId);
  
  // This would fetch from a database in a real implementation
  return [
    await fetchLatestEmotion(userId),
    {
      id: uuid(),
      user_id: userId,
      emotion: 'happy',
      score: 85,
      confidence: 0.9,
      date: new Date(Date.now() - 86400000).toISOString(),
      emojis: ['😊', '😁'],
      recommendations: [
        'Share your positive feelings with someone',
        'Use this energy for something creative'
      ]
    }
  ].filter(Boolean);
};

// Helper functions
function getEmojisForEmotion(emotion: string): string[] {
  const emojiMap: Record<string, string[]> = {
    "happy": ['😊', '😁', '🙂'],
    "sad": ['😔', '😢', '😞'],
    "angry": ['😡', '😠', '💢'],
    "surprised": ['😲', '😮', '😯'],
    "fearful": ['😨', '😰', '😱'],
    "calm": ['😌', '🧘', '☺️'],
    "excited": ['🤩', '😃', '🎉'],
    "neutral": ['😐', '😶', '🤔']
  };
  
  return emojiMap[emotion] || ['😐'];
}

function getRecommendationsForEmotion(emotion: string): string[] {
  const recommendationMap: Record<string, string[]> = {
    "happy": [
      'Share your positive feelings with someone',
      'Keep that momentum going with some uplifting music',
      'Use this energy to tackle a challenge'
    ],
    "sad": [
      'Take a moment for self-care',
      'Connect with a supportive friend',
      'Try a guided meditation for emotional healing'
    ],
    "angry": [
      'Take deep breaths to calm your nervous system',
      'Write down what's bothering you',
      'Go for a brisk walk to release tension'
    ],
    "surprised": [
      'Take time to process this unexpected situation',
      'Journal about what surprised you and why',
      'Talk it through with someone you trust'
    ],
    "fearful": [
      'Practice grounding techniques: name 5 things you can see',
      'Remind yourself that you're safe right now',
      'Try a quick breathing exercise'
    ],
    "calm": [
      'Enjoy this peaceful state with some mindfulness',
      'It's a great time for creative thinking',
      'Consider journaling about what brings you peace'
    ],
    "excited": [
      'Channel this energy into something productive',
      'Share your excitement with someone close to you',
      'Set some goals while you're feeling motivated'
    ],
    "neutral": [
      'Check in with your body - how are you feeling physically?',
      'This is a good time for planning and organizing',
      'Consider what would boost your mood a little'
    ]
  };
  
  return recommendationMap[emotion] || [
    'Take a moment to check in with yourself',
    'Practice mindful breathing for a few minutes',
    'Consider what would help you feel better right now'
  ];
}
