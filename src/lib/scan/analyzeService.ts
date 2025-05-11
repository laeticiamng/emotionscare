
import { v4 as uuidv4 } from 'uuid';
import { Emotion, EmotionResult } from '@/types/emotion';

// Mock function to analyze emotion from text
export async function analyzeEmotionFromText(
  text: string, 
  userId?: string
): Promise<EmotionResult> {
  await new Promise(r => setTimeout(r, 1000)); // Simulate API delay
  
  // Get random emotion for demo purposes
  const emotions = [
    { name: 'joy', score: 0.8, intensity: 0.7 },
    { name: 'sadness', score: 0.6, intensity: 0.5 },
    { name: 'anger', score: 0.7, intensity: 0.8 },
    { name: 'fear', score: 0.5, intensity: 0.6 },
    { name: 'surprise', score: 0.9, intensity: 0.9 },
  ];
  
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  
  // Generate feedback based on emotion
  let feedback = '';
  switch (randomEmotion.name) {
    case 'joy':
      feedback = "Your text shows positive energy. It's great to see you in good spirits!";
      break;
    case 'sadness':
      feedback = "I sense some sadness in your words. Remember it's okay to feel this way.";
      break;
    case 'anger':
      feedback = "There seems to be some frustration in your message. Deep breaths can help manage these feelings.";
      break;
    case 'fear':
      feedback = "I detect some anxiety in your text. Remember that many fears are temporary.";
      break;
    case 'surprise':
      feedback = "Your text shows elements of surprise or astonishment.";
      break;
    default:
      feedback = "Thank you for sharing your thoughts.";
  }
  
  // Generate recommendations
  const recommendations = [
    "Try a 5-minute meditation",
    "Consider journaling about your feelings",
    "Take a short walk outside"
  ];
  
  return {
    id: uuidv4(),
    user_id: userId,
    date: new Date().toISOString(),
    emotion: randomEmotion.name,
    score: randomEmotion.score,
    confidence: 0.8,
    text: text,
    ai_feedback: feedback,
    recommendations,
    primaryEmotion: {
      name: randomEmotion.name,
      intensity: randomEmotion.intensity,
      score: randomEmotion.score
    }
  };
}

// Mock function to analyze emotion from audio
export async function analyzeEmotionFromAudio(
  audioUrl: string,
  userId?: string
): Promise<EmotionResult> {
  await new Promise(r => setTimeout(r, 1500)); // Simulate API delay
  
  // Mock transcript
  const transcript = "This is a simulated transcript from the audio recording.";
  
  // Get random emotion for demo purposes
  const emotions = [
    { name: 'joy', score: 0.8, intensity: 0.7 },
    { name: 'sadness', score: 0.6, intensity: 0.5 },
    { name: 'anger', score: 0.7, intensity: 0.8 },
    { name: 'fear', score: 0.5, intensity: 0.6 },
    { name: 'surprise', score: 0.9, intensity: 0.9 },
  ];
  
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  
  return {
    id: uuidv4(),
    user_id: userId,
    date: new Date().toISOString(),
    emotion: randomEmotion.name,
    score: Math.random() * 0.5 + 0.5, // Random score between 0.5 and 1
    confidence: Math.random() * 0.3 + 0.7, // Random confidence between 0.7 and 1
    transcript,
    audio_url: audioUrl,
    primaryEmotion: {
      name: randomEmotion.name,
      intensity: randomEmotion.intensity,
      score: randomEmotion.score
    }
  };
}

export default {
  analyzeEmotionFromText,
  analyzeEmotionFromAudio
};
