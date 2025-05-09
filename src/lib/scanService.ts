
import { Emotion, EmotionResult } from '@/types';
import { mockEmotions } from '@/data/mockEmotions';

// Create a new emotion entry from user input
export async function createEmotionEntry(data: { 
  user_id: string; 
  text?: string;
  emojis?: string;
  audio_url?: string; 
}): Promise<Emotion> {
  // Create a mock emotion entry based on the provided data
  const newEmotion: Emotion = {
    id: `temp-${Date.now()}`,
    user_id: data.user_id,
    emotion: data.text ? 'neutral' : 'happy', // Default or based on text analysis
    confidence: 0.8,
    date: new Date().toISOString(),
    text: data.text,
    score: 75,
    emojis: data.emojis ? [data.emojis] : ['😊'],
    ai_feedback: "Merci pour votre contribution. Votre bien-être est important."
  };
  
  console.log('Created new emotion entry:', newEmotion);
  return newEmotion;
}

// Analyze emotion based on text or audio
export async function analyzeEmotion(data: {
  user_id: string;
  text?: string;
  audio_url?: string;
}): Promise<EmotionResult> {
  // Simulate an analysis
  const randomEmotions = ['happy', 'calm', 'anxious', 'stressed', 'neutral'];
  const emotion = randomEmotions[Math.floor(Math.random() * randomEmotions.length)];
  const confidence = 0.7 + Math.random() * 0.3; // Between 0.7 and 1.0
  const score = Math.floor(Math.random() * 100);
  
  return {
    user_id: data.user_id,
    emotion,
    confidence,
    score,
    text: data.text,
    transcript: data.text,
    ai_feedback: `Notre analyse détecte que vous vous sentez plutôt ${emotion} aujourd'hui.`,
    emojis: emotion === 'happy' ? ['😊', '🙂'] : 
            emotion === 'calm' ? ['😌', '🧘‍♀️'] :
            emotion === 'anxious' ? ['😰', '😓'] :
            emotion === 'stressed' ? ['😖', '😣'] : ['😐', '🙂']
  };
}

// Analyze audio stream for real-time emotion detection
export async function analyzeAudioStream(audioChunk: Blob): Promise<{
  emotion: string;
  confidence: number;
}> {
  // Simulate real-time analysis
  const emotions = ['neutral', 'happy', 'calm', 'anxious'];
  const emotion = emotions[Math.floor(Math.random() * emotions.length)];
  const confidence = 0.6 + Math.random() * 0.4; // Random value between 0.6 and 1.0
  
  await new Promise(resolve => setTimeout(resolve, 200)); // Simulate processing time
  
  return {
    emotion,
    confidence
  };
}

// Save real-time emotion scan results
export async function saveRealtimeEmotionScan(data: {
  user_id: string;
  emotion: string;
  confidence: number;
  audio_url?: string;
}): Promise<Emotion> {
  const newEmotion: Emotion = {
    id: `realtime-${Date.now()}`,
    user_id: data.user_id,
    emotion: data.emotion,
    confidence: data.confidence,
    date: new Date().toISOString(),
    score: Math.floor(data.confidence * 100),
    emojis: data.emotion === 'happy' ? ['😊'] : 
            data.emotion === 'calm' ? ['😌'] :
            data.emotion === 'anxious' ? ['😰'] : ['😐'],
    ai_feedback: `Analyse en temps réel: votre état émotionnel est ${data.emotion}.`
  };
  
  return newEmotion;
}

export async function fetchLatestEmotion(userId: string): Promise<Emotion | null> {
  // Get latest emotion from mock data
  const userEmotions = mockEmotions
    .filter(e => e.user_id === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return userEmotions[0] || null;
}

export async function fetchEmotionHistory(): Promise<Emotion[]> {
  // Return all mock emotions as history
  return Promise.resolve(mockEmotions);
}

// For backwards compatibility
export async function getLatestEmotion(userId: string): Promise<Emotion | null> {
  return fetchLatestEmotion(userId);
}

export async function getEmotionHistory(): Promise<Emotion[]> {
  return fetchEmotionHistory();
}

export async function getEmotions(userId?: string): Promise<Emotion[]> {
  if (userId) {
    return mockEmotions.filter(emotion => emotion.user_id === userId);
  }
  return mockEmotions;
}
