// @ts-nocheck
import { MoodData } from '@/types/mood';

export interface DashboardData {
  moodTrend: MoodData[];
  averageMood: number;
  topEmotions: { name: string; count: number }[];
  recentActivities: {
    id: string;
    type: string;
    title: string;
    timestamp: Date | string;
  }[];
}

/**
 * Fetch user dashboard data
 */
export const fetchDashboardData = async (userId: string): Promise<DashboardData> => {
  // This would normally fetch from an API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock data for demonstration
      resolve({
        moodTrend: generateMockMoodTrend(),
        averageMood: 7.2,
        topEmotions: [
          { name: 'Calm', count: 12 },
          { name: 'Happy', count: 8 },
          { name: 'Focused', count: 6 },
          { name: 'Anxious', count: 4 },
          { name: 'Tired', count: 3 }
        ],
        recentActivities: [
          {
            id: '1',
            type: 'journal',
            title: 'Journal entry created',
            timestamp: new Date(Date.now() - 3600000)
          },
          {
            id: '2',
            type: 'meditation',
            title: 'Completed meditation session',
            timestamp: new Date(Date.now() - 86400000)
          },
          {
            id: '3',
            type: 'mood',
            title: 'Mood tracked',
            timestamp: new Date(Date.now() - 172800000)
          }
        ]
      });
    }, 800);
  });
};

/**
 * Generate mock mood trend data for the past 14 days
 */
function generateMockMoodTrend(): MoodData[] {
  const moodData: MoodData[] = [];
  const now = new Date();
  
  for (let i = 13; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const mood = Math.floor(Math.random() * 5) + 5; // Random 5-10
    const anxiety = Math.floor(Math.random() * 5) + 1; // Random 1-5
    const energy = Math.floor(Math.random() * 8) + 2; // Random 2-10
    
    moodData.push({
      id: `mood-${i}`,
      userId: 'user123',
      date: date.toISOString(),
      mood: mood,
      anxiety: anxiety,
      energy: energy,
      emotions: {
        calm: Math.random(),
        happy: Math.random(),
        tired: Math.random(),
        anxious: Math.random()
      },
      sentiment: mood > 7 ? 'positive' : mood < 5 ? 'negative' : 'neutral'
    });
  }
  
  return moodData;
}
