
import { Emotion } from '@/types/emotions';

// Mock emotions data
export const mockEmotions: Emotion[] = [
  {
    id: "emo-1",
    date: new Date(2025, 4, 15).toISOString(),
    emotion: "joy",
    score: 85,
    user_id: "user-123",
  },
  {
    id: "emo-2",
    date: new Date(2025, 4, 14).toISOString(),
    emotion: "calm",
    score: 72,
    user_id: "user-123",
  },
  {
    id: "emo-3",
    date: new Date(2025, 4, 13).toISOString(),
    emotion: "anxiety",
    score: 45,
    user_id: "user-123",
  },
  {
    id: "emo-4",
    date: new Date(2025, 4, 12).toISOString(),
    emotion: "sadness",
    score: 30,
    user_id: "user-123",
  }
];

// Function to get mock emotions for a specific user
export const getUserEmotions = (userId: string = "user-123") => {
  return mockEmotions.filter(emotion => emotion.user_id === userId);
};

// Get emotions by date range
export const getEmotionsByDateRange = (
  startDate: Date, 
  endDate: Date, 
  userId: string = "user-123"
) => {
  return mockEmotions.filter(emotion => {
    const emotionDate = new Date(emotion.date);
    return (
      emotion.user_id === userId &&
      emotionDate >= startDate &&
      emotionDate <= endDate
    );
  });
};

// Get the latest emotion
export const getLatestEmotion = (userId: string = "user-123") => {
  const userEmotions = getUserEmotions(userId);
  return userEmotions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
};
