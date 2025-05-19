
import { MoodData } from '@/types/emotion';
import { EmotionPrediction } from '@/types/emotion';

export interface DashboardStats {
  trends: { label: string; value: number }[];
  moodData: MoodData[];
  recommendations: string[];
  achievements: { title: string; date: string; icon: string }[];
  insights: string[];
}

export const getDashboardStats = async (userId: string): Promise<DashboardStats> => {
  // Mock API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock dashboard data
  return {
    trends: [
      { label: 'Happy', value: 25 },
      { label: 'Calm', value: 30 },
      { label: 'Focused', value: 20 },
      { label: 'Stressed', value: 15 },
      { label: 'Tired', value: 10 },
    ],
    moodData: generateMockMoodData(),
    recommendations: [
      'Try a 5-minute meditation session',
      'Listen to calm music playlist',
      'Take a short walk outside',
      'Practice deep breathing for 2 minutes'
    ],
    achievements: [
      { title: 'First scan completed', date: '2023-01-15', icon: 'award' },
      { title: 'Week streak', date: '2023-01-22', icon: 'flame' },
      { title: 'Mood improvement', date: '2023-01-28', icon: 'trending-up' },
    ],
    insights: [
      'Your focus improves in the morning hours',
      'Meditation sessions help reduce your stress levels',
      'You tend to feel more energetic after outdoor activities'
    ]
  };
};

// Helper to generate mock mood data
function generateMockMoodData(): MoodData[] {
  const data: MoodData[] = [];
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Create properly typed MoodData
    const entry: MoodData = {
      id: `mood-${i}`,
      userId: 'user123',
      date: date.toISOString().split('T')[0],
      emotion: selectRandomMood(),
      intensity: Math.random() * 100,
      timestamp: date.toISOString(),
      sentiment: Math.random() * 2 - 1, // -1 to 1
      mood: selectRandomMood(),
      energy: Math.random() * 100,
      anxiety: Math.random() * 100,
      score: Math.random() * 100,
    };
    
    data.push(entry);
  }
  
  return data;
}

function selectRandomMood(): string {
  const moods = ['happy', 'calm', 'sad', 'anxious', 'focused', 'tired', 'energetic'];
  return moods[Math.floor(Math.random() * moods.length)];
}

export const getEmotionPredictions = async (userId: string): Promise<EmotionPrediction[]> => {
  // Mock API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Mock emotion predictions
  return [
    { 
      emotion: 'focused',
      probability: 0.85,
      timestamp: new Date().toISOString(),
      source: 'activity-pattern'
    },
    { 
      emotion: 'relaxed',
      probability: 0.72,
      timestamp: new Date(Date.now() + 3600000).toISOString(),
      source: 'time-pattern'
    }
  ];
};
