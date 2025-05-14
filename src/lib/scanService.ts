
import { v4 as uuid } from 'uuid';
import { EmotionResult } from '@/types';

// Mock analysis based on text and emojis
export async function analyzeEmotion(text: string, emojis: string[] = []): Promise<EmotionResult> {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Very simple analysis for demo purposes
      const lowerText = text.toLowerCase();
      
      // Simple emotion detection based on keywords
      let emotion = 'neutral';
      let score = 50;

      if (lowerText.includes('heureux') || lowerText.includes('content') || lowerText.includes('joie')) {
        emotion = 'joy';
        score = 80;
      } else if (lowerText.includes('triste') || lowerText.includes('déprimé')) {
        emotion = 'sadness';
        score = 30;
      } else if (lowerText.includes('énervé') || lowerText.includes('colère')) {
        emotion = 'anger';
        score = 65;
      } else if (lowerText.includes('effrayé') || lowerText.includes('peur')) {
        emotion = 'fear';
        score = 45;
      } else if (lowerText.includes('calme') || lowerText.includes('détendu')) {
        emotion = 'calm';
        score = 70;
      }

      // Adjust score based on emoji if present
      if (emojis.length > 0) {
        // Simple emoji mapping
        const emojiMap: Record<string, { emotion: string, value: number }> = {
          '😊': { emotion: 'joy', value: 10 },
          '😃': { emotion: 'joy', value: 15 },
          '😢': { emotion: 'sadness', value: -20 },
          '😠': { emotion: 'anger', value: -15 },
          '😨': { emotion: 'fear', value: -10 },
          '😌': { emotion: 'calm', value: 5 }
        };

        for (const emoji of emojis) {
          if (emojiMap[emoji]) {
            if (emojiMap[emoji].emotion !== emotion) {
              // If emoji suggests a different emotion, consider adjusting the emotion
              if (Math.random() > 0.5) {
                emotion = emojiMap[emoji].emotion;
              }
            }
            score = Math.min(100, Math.max(0, score + emojiMap[emoji].value));
          }
        }
      }

      // Create result
      const result: EmotionResult = {
        id: uuid(),
        emotion,
        score,
        confidence: score / 100,
        intensity: score,
        text,
        date: new Date().toISOString(),
        emojis: emojis.join(''),
        ai_feedback: `Vous semblez ressentir de la ${emotion === 'joy' ? 'joie' : 
          emotion === 'sadness' ? 'tristesse' : 
          emotion === 'anger' ? 'colère' : 
          emotion === 'fear' ? 'peur' : 
          emotion === 'calm' ? 'calme' : 'émotion neutre'} à un niveau ${score > 75 ? 'élevé' : score > 50 ? 'moyen' : 'bas'}.`
      };
      
      resolve(result);
    }, 800); // Simulate API delay
  });
}

// Save emotion to database (mock)
export async function saveEmotion(emotion: EmotionResult): Promise<EmotionResult> {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // In a real app, we would save to a database here
      console.log('Saving emotion:', emotion);
      
      // Ensure required fields exist
      const savedEmotion: EmotionResult = {
        ...emotion,
        id: emotion.id || uuid(),
        date: emotion.date || new Date().toISOString()
      };
      
      resolve(savedEmotion);
    }, 300);
  });
}

// Analyze audio stream (mock)
export async function analyzeAudioStream(audioBlob: Blob): Promise<EmotionResult> {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Create a mock result
      const emotions = ['joy', 'sadness', 'anger', 'fear', 'neutral', 'calm'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const randomScore = Math.floor(Math.random() * 70) + 30; // 30-100
      
      // Create URL for the audio blob
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const result: EmotionResult = {
        id: uuid(),
        emotion: randomEmotion,
        score: randomScore,
        confidence: randomScore / 100,
        intensity: randomScore,
        audio_url: audioUrl,
        transcript: "Transcription simulée de l'audio...",
        date: new Date().toISOString(),
        ai_feedback: `L'analyse de votre voix révèle une tonalité ${randomEmotion === 'joy' ? 'joyeuse' : 
          randomEmotion === 'sadness' ? 'triste' : 
          randomEmotion === 'anger' ? 'en colère' : 
          randomEmotion === 'fear' ? 'inquiète' : 
          randomEmotion === 'calm' ? 'calme' : 'neutre'} à un niveau ${randomScore > 75 ? 'élevé' : randomScore > 50 ? 'moyen' : 'bas'}.`
      };
      
      resolve(result);
    }, 1500);
  });
}

// Create a new emotion entry directly
export async function createEmotionEntry(
  userId: string, 
  emotion: string, 
  intensity: number, 
  text?: string
): Promise<EmotionResult> {
  const entry: EmotionResult = {
    id: uuid(),
    user_id: userId,
    emotion,
    score: intensity,
    intensity,
    confidence: intensity / 100,
    text,
    date: new Date().toISOString()
  };
  
  return saveEmotion(entry);
}

export default {
  analyzeEmotion,
  saveEmotion,
  analyzeAudioStream,
  createEmotionEntry
};
