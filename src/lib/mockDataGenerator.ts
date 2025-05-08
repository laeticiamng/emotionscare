import { MoodData } from '@/types';

// Function to generate random data for the mood chart
export const generateMockMoodData = (days: number): MoodData[] => {
  const getRandomValue = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
  };

  const moodData: MoodData[] = [];
  for (let i = 0; i < days; i++) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - i);
    
    const isoDate = currentDate.toISOString().split('T')[0];
    
    moodData.push({
      date: isoDate,
      originalDate: currentDate.toISOString(), // Add the originalDate property
      value: getRandomValue(40, 95),
      sentiment: getRandomValue(-1, 1),
      anxiety: getRandomValue(0, 10),
      energy: getRandomValue(0, 10),
    });
  }

  return moodData;
};
