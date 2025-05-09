import { db } from "@/lib/db";
import { Emotion, EmotionResult } from "@/types";
import { v4 as uuidv4 } from 'uuid';

// Function to simulate AI analysis (replace with actual AI call)
const analyzeText = async (text: string): Promise<{ emotion: string; score: number; emojis: string[] }> => {
  // Simulate emotion analysis
  const emotions = ['happy', 'sad', 'neutral', 'angry', 'calm'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  const randomScore = Math.floor(Math.random() * 100);
  const randomEmojis = ['😊', '😢', '😐', '😡', '😌'].sort(() => Math.random() - 0.5).slice(0, 2);

  return {
    emotion: randomEmotion,
    score: randomScore,
    emojis: randomEmojis,
  };
};

// Function to generate AI feedback (replace with actual AI call)
const generateFeedback = async (emotion: string): Promise<string> => {
  // Simulate feedback generation
  const feedbacks = {
    happy: "Votre joie est contagieuse ! Continuez à partager votre positivité.",
    sad: "Il est normal de se sentir triste parfois. Prenez le temps de vous réconforter et de faire des activités que vous aimez.",
    neutral: "Un état neutre est un bon moment pour se recentrer et se concentrer sur vos objectifs.",
    angry: "La colère est une émotion forte. Essayez de trouver des moyens sains de l'exprimer et de la gérer.",
    calm: "La sérénité est précieuse. Profitez de ce moment de calme pour vous détendre et vous ressourcer."
  };

  return feedbacks[emotion] || "Profitez de votre journée !";
};

// Function to process emotion scan
export const processEmotionScan = async (userId: string, text?: string, emojis?: string): Promise<EmotionResult> => {
  // 1. Analyze text if provided
  let analysisResult = { emotion: 'neutral', score: 50, emojis: [] as string[] };
  if (text) {
    analysisResult = await analyzeText(text);
  }

  // 2. Generate feedback based on the emotion
  const feedback = await generateFeedback(analysisResult.emotion);

  // 3. Create a new emotion entry in the database
  const id = uuidv4();
  const date = new Date().toISOString();

  // 4. Return the result
  return {
    id,
    user_id: userId,
    date,
    emotion: analysisResult.emotion,
    confidence: 0.9,
    score: analysisResult.score,
    transcript: text || '',
    text: text || '',
    emojis: analysisResult.emojis,
    feedback,
    ai_feedback: feedback,
    recommendations: [],
    source: 'text'
  };
};

// Get emotion history for a user
export const getEmotionHistory = async (userId: string): Promise<Emotion[]> => {
  // Simulate fetching emotion history from a database
  const mockEmotions = [
    {
      id: '1',
      user_id: userId,
      emotion: 'happy',
      confidence: 0.89,
      date: '2023-11-01T10:00:00Z',
      score: 85,
      text: "Je me sens très heureux aujourd'hui, ma journée a bien commencé.",
      emojis: ['😊', '🌞'],
      ai_feedback: "Votre état de joie est remarquable ! Profitez de cette énergie positive pour accomplir quelque chose qui vous tient à cœur aujourd'hui.",
      source: 'text'
    },
    {
      id: '2',
      user_id: userId,
      emotion: 'anxious',
      confidence: 0.78,
      date: '2023-10-28T15:30:00Z',
      score: 40,
      text: "Je me sens un peu anxieux à propos de ma présentation de demain.",
      emojis: ['😰', '😓'],
      ai_feedback: "L'anxiété est normale avant une présentation importante. Essayez de pratiquer des exercices de respiration et de visualiser un résultat positif.",
      source: 'text'
    }
  ];

  return mockEmotions as Emotion[];
};

// Get latest emotion for a user
export const getLatestEmotion = async (userId: string): Promise<Emotion | null> => {
  const mockEmotions = [
    {
      id: '1',
      user_id: userId,
      emotion: 'happy',
      confidence: 0.89,
      date: '2023-11-01T10:00:00Z',
      score: 85,
      text: "Je me sens très heureux aujourd'hui, ma journée a bien commencé.",
      emojis: ['😊', '🌞'],
      ai_feedback: "Votre état de joie est remarquable ! Profitez de cette énergie positive pour accomplir quelque chose qui vous tient à cœur aujourd'hui.",
      source: 'text'
    },
    {
      id: '2',
      user_id: userId,
      emotion: 'anxious',
      confidence: 0.78,
      date: '2023-10-28T15:30:00Z',
      score: 40,
      text: "Je me sens un peu anxieux à propos de ma présentation de demain.",
      emojis: ['😰', '😓'],
      ai_feedback: "L'anxiété est normale avant une présentation importante. Essayez de pratiquer des exercices de respiration et de visualiser un résultat positif.",
      source: 'text'
    }
  ];

  if (mockEmotions.length > 0) {
    const latestEmotion = mockEmotions.sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime())[0];
    return {
      id: latestEmotion.id,
      user_id: latestEmotion.user_id,
      date: latestEmotion.date,
      score: latestEmotion.score,
      emotion: latestEmotion.emotion,
      confidence: 0.9, // Add required property
      text: latestEmotion.text,
      emojis: Array.isArray(latestEmotion.emojis) ? latestEmotion.emojis : [latestEmotion.emojis], // Ensure emojis is an array
      ai_feedback: latestEmotion.ai_feedback,
      source: latestEmotion.source
    };
  }

  return null;
};
