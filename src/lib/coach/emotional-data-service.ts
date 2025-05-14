
import { Emotion, EmotionalData } from "@/types/emotion";

export const getEmotionalTrends = async (userId: string, period: string = "week") => {
  console.log(`Getting emotional trends for user ${userId} over ${period}`);
  return [];
};

export const getRecentEmotions = async (userId: string, limit: number = 5) => {
  console.log(`Getting ${limit} recent emotions for user ${userId}`);
  return [];
};

export const recordEmotion = async (data: EmotionalData) => {
  console.log(`Recording emotion for user ${data.userId}`, data);
  return { id: "mock-emotion", ...data };
};
