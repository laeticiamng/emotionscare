
import { MoodData } from '@/types/emotion';

// Update the generator to use the correct properties
export const generateMockMoodData = (days = 30): MoodData[] => {
  const data: MoodData[] = [];
  const emotions = ['happy', 'sad', 'neutral', 'angry', 'surprised', 'fearful'];
  
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - (days - i));
    
    data.push({
      id: `mood-${i}`,
      emotion: emotions[Math.floor(Math.random() * emotions.length)],
      intensity: Math.random() * 0.6 + 0.2, // Between 0.2 and 0.8
      timestamp: date.toISOString(), // Use timestamp instead of date
      userId: 'user-1',
      source: 'daily-check-in'
    });
  }
  
  return data;
};
