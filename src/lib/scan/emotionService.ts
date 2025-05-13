
import { EmotionRecord, EmotionResultRecord } from '@/types/emotions';
import { Emotion, EmotionPrediction } from '@/types/emotion';
import { v4 as uuidv4 } from 'uuid';

// Mock database of emotions
let emotionRecords: EmotionRecord[] = [];

// Get all emotions for a user
export const getEmotionsForUser = async (userId: string): Promise<EmotionRecord[]> => {
  return emotionRecords.filter(e => e.user_id === userId);
};

// Get a specific emotion by ID
export const getEmotion = async (emotionId: string): Promise<EmotionRecord | null> => {
  return emotionRecords.find(e => e.id === emotionId) || null;
};

// Add a new emotion record
export const recordEmotion = async (
  userId: string,
  emotionData: Partial<EmotionRecord>
): Promise<EmotionRecord> => {
  const now = new Date().toISOString();
  
  const newEmotion: EmotionRecord = {
    id: uuidv4(),
    user_id: userId,
    date: now,
    emotion: emotionData.emotion || 'neutral',
    name: emotionData.name || emotionData.emotion || 'neutral',
    score: emotionData.score !== undefined ? emotionData.score : 50,
    created_at: now,
    ...emotionData
  };
  
  emotionRecords.push(newEmotion);
  return newEmotion;
};

// Delete an emotion record
export const deleteEmotion = async (emotionId: string): Promise<boolean> => {
  const initialLength = emotionRecords.length;
  emotionRecords = emotionRecords.filter(e => e.id !== emotionId);
  return emotionRecords.length < initialLength;
};

// Update an emotion record
export const updateEmotion = async (
  emotionId: string,
  updates: Partial<EmotionRecord>
): Promise<EmotionRecord | null> => {
  const index = emotionRecords.findIndex(e => e.id === emotionId);
  
  if (index === -1) {
    return null;
  }
  
  const updatedEmotion: EmotionRecord = {
    ...emotionRecords[index],
    ...updates,
  };
  
  emotionRecords[index] = updatedEmotion;
  return updatedEmotion;
};

// Get emotions for a user in a specific date range
export const getEmotionsInDateRange = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<EmotionRecord[]> => {
  return emotionRecords.filter(e => {
    const emotionDate = new Date(e.date);
    return (
      e.user_id === userId &&
      emotionDate >= startDate &&
      emotionDate <= endDate
    );
  });
};

// Predict emotions based on historical data and context
export const predictEmotion = async (
  userId: string,
  context: {
    time?: string;
    activity?: string;
    location?: string;
  }
): Promise<EmotionPrediction> => {
  // In a real app, this would use ML models
  // For this mock, return a simple prediction
  
  // Get the most common emotion for this user
  const userEmotions = await getEmotionsForUser(userId);
  
  if (userEmotions.length === 0) {
    return {
      emotion: 'neutral',
      probability: 0.5,
      triggers: ['Not enough data'],
      recommendations: ['Record more emotions to improve predictions']
    };
  }
  
  // Count emotions
  const emotionCounts: Record<string, number> = {};
  userEmotions.forEach(e => {
    emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1;
  });
  
  // Find the most common emotion
  let mostCommonEmotion = 'neutral';
  let maxCount = 0;
  
  Object.entries(emotionCounts).forEach(([emotion, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommonEmotion = emotion;
    }
  });
  
  // Calculate probability
  const probability = maxCount / userEmotions.length;
  
  return {
    emotion: mostCommonEmotion,
    probability,
    triggers: ['Historical pattern', context.activity || 'Current activity'],
    recommendations: [
      'Take a moment to reflect on your emotions',
      'Consider journaling about your feelings'
    ]
  };
};

// Record an emotion prediction (was it accurate?)
export const recordEmotionPredictionAccuracy = async (
  userId: string,
  predictionId: string,
  wasAccurate: boolean,
  actualEmotion?: string
): Promise<void> => {
  // In a real app, this would update a database
  console.log(`Prediction ${predictionId} was ${wasAccurate ? 'accurate' : 'inaccurate'}`);
  if (actualEmotion) {
    console.log(`Actual emotion was ${actualEmotion}`);
  }
};

// Save a scanned emotion from text, video, or audio
export const saveScannedEmotion = async (
  userId: string,
  emotionData: {
    emotion: string;
    score: number;
    confidence?: number;
    source: string;
    text?: string;
    audio_url?: string;
    emojis?: string;
    name?: string;
    intensity?: number;
  }
): Promise<EmotionRecord> => {
  const now = new Date().toISOString();
  
  const newEmotion: EmotionRecord = {
    id: uuidv4(),
    user_id: userId,
    date: now,
    emotion: emotionData.emotion,
    name: emotionData.name || emotionData.emotion,
    score: emotionData.score,
    text: emotionData.text,
    audio_url: emotionData.audio_url,
    emojis: emotionData.emojis,
    confidence: emotionData.confidence,
    intensity: emotionData.intensity,
    source: emotionData.source
  };
  
  emotionRecords.push(newEmotion);
  return newEmotion;
};

// Generate mock AI feedback for an emotion
export const generateAIFeedback = async (emotion: Partial<EmotionRecord>): Promise<string> => {
  // In a real app, this would call a language model API
  const feedbackTemplates: Record<string, string[]> = {
    happy: [
      "It's great to see you're feeling happy! This positive energy can help you tackle challenges.",
      "Your happiness today is something to cherish. Try to identify what contributed to this feeling."
    ],
    sad: [
      "I notice you're feeling sad. Remember it's okay to experience this emotion - it's part of being human.",
      "Sadness is a natural response. Consider talking to someone you trust about these feelings."
    ],
    angry: [
      "I see you're experiencing anger. Try taking a few deep breaths to help process this emotion.",
      "Anger often points to something important to us. What boundaries might need attention?"
    ],
    anxious: [
      "Anxiety can be challenging. Grounding techniques like focusing on your five senses might help.",
      "Your anxiety is acknowledged. Remember that this feeling will pass with time."
    ],
    neutral: [
      "A neutral emotional state can be a good time for reflection and planning.",
      "Emotional neutrality offers balance. Consider using this energy for mindfulness practice."
    ]
  };
  
  const emotionType = emotion.name?.toLowerCase() || emotion.emotion?.toLowerCase() || 'neutral';
  const templates = feedbackTemplates[emotionType] || feedbackTemplates.neutral;
  const randomIndex = Math.floor(Math.random() * templates.length);
  
  return templates[randomIndex];
};

// Update an emotion with AI feedback
export const addAIFeedbackToEmotion = async (emotionId: string): Promise<EmotionRecord | null> => {
  const emotion = await getEmotion(emotionId);
  
  if (!emotion) {
    return null;
  }
  
  const feedback = await generateAIFeedback(emotion);
  
  return updateEmotion(emotionId, { ai_feedback: feedback });
};

export default {
  getEmotionsForUser,
  getEmotion,
  recordEmotion,
  deleteEmotion,
  updateEmotion,
  getEmotionsInDateRange,
  predictEmotion,
  recordEmotionPredictionAccuracy,
  saveScannedEmotion,
  generateAIFeedback,
  addAIFeedbackToEmotion
};
