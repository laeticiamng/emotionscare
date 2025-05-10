import { Emotion, EmotionResult } from '@/types';

// Mock emotion history data
const mockEmotions: Emotion[] = [
  {
    id: '1',
    user_id: '1',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    emotion: 'happy',
    confidence: 0.85,
    score: 75,
    text: 'Having a great day!',
  },
  {
    id: '2',
    user_id: '1',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    emotion: 'anxious',
    confidence: 0.72,
    score: 35,
    text: 'Feeling stressed about the project deadline',
  },
  {
    id: '3',
    user_id: '1',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    emotion: 'calm',
    confidence: 0.9,
    score: 65,
    text: 'Meditation really helps with focusing',
  }
];

// Get emotion history
export const getEmotionHistory = async (): Promise<Emotion[]> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockEmotions);
    }, 800);
  });
};

// Get all emotions for a user
export const getEmotions = async (userId: string): Promise<Emotion[]> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockEmotions.filter(e => e.user_id === userId));
    }, 800);
  });
};

// Create a new emotion entry
export const createEmotionEntry = async (data: Partial<Emotion>): Promise<Emotion> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const newEmotion: Emotion = {
        id: Math.random().toString(36).substring(2, 11),
        user_id: data.user_id || '',
        date: new Date().toISOString(),
        emotion: data.emotion || 'neutral',
        confidence: data.confidence || 0.5,
        score: data.score || 50,
        text: data.text || '',
        // Add any other fields you need
      };
      
      mockEmotions.push(newEmotion);
      resolve(newEmotion);
    }, 800);
  });
};

// Get the latest emotion for a user
export const fetchLatestEmotion = async (userId: string): Promise<Emotion | null> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const userEmotions = mockEmotions.filter(e => e.user_id === userId);
      if (userEmotions.length === 0) {
        resolve(null);
        return;
      }
      
      // Sort by date, newest first
      userEmotions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      resolve(userEmotions[0]);
    }, 800);
  });
};

// Adding the required analyzeEmotion function that was missing
export const analyzeEmotion = async (data: {
  user_id: string,
  emojis?: string,
  text?: string,
  audio_url?: string,
  is_confidential?: boolean,
  share_with_coach?: boolean
}): Promise<EmotionResult> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const emotions = ['happy', 'sad', 'anxious', 'calm', 'excited', 'frustrated', 'neutral'];
      const emotion = emotions[Math.floor(Math.random() * emotions.length)];
      const score = Math.floor(Math.random() * 100);
      
      const result: EmotionResult = {
        id: Math.random().toString(36).substring(2, 11),
        emotion,
        confidence: Math.random() * 0.5 + 0.5, // Between 0.5 and 1.0
        score,
        feedback: `You seem to be feeling ${emotion} today.`,
        recommendations: [
          'Take a break if needed',
          'Try deep breathing exercises',
          'Consider talking to a colleague'
        ]
      };
      
      // Create an emotion entry in our mock database
      createEmotionEntry({
        user_id: data.user_id,
        emotion,
        score,
        text: data.text,
        is_confidential: data.is_confidential
      });
      
      resolve(result);
    }, 1500);
  });
};

// Adding the required analyzeAudioStream function that was missing
export const analyzeAudioStream = async (audioBlob: Blob): Promise<EmotionResult> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const emotions = ['happy', 'sad', 'anxious', 'calm', 'excited', 'frustrated', 'neutral'];
      const emotion = emotions[Math.floor(Math.random() * emotions.length)];
      const score = Math.floor(Math.random() * 100);
      
      const result: EmotionResult = {
        id: Math.random().toString(36).substring(2, 11),
        emotion,
        confidence: Math.random() * 0.5 + 0.5, // Between 0.5 and 1.0
        score,
        text: "Transcribed text from audio would appear here.",
        transcript: "Full transcript would appear here.",
        feedback: `Based on your voice, you seem to be feeling ${emotion}.`,
        recommendations: [
          'Consider expressing yourself through music',
          'Try vocal exercises to release tension',
          'Record and reflect on your emotional state'
        ]
      };
      
      resolve(result);
    }, 2000);
  });
};

// Analyze text function
export const analyzeText = async (text: string): Promise<Emotion> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const emotions = ['happy', 'sad', 'anxious', 'calm', 'excited', 'frustrated', 'neutral'];
      const emotion = emotions[Math.floor(Math.random() * emotions.length)];
      const score = Math.floor(Math.random() * 100);
      
      const result: Emotion = {
        id: Math.random().toString(36).substring(2, 11),
        user_id: '1', // Default user ID
        date: new Date().toISOString(),
        emotion,
        confidence: Math.random() * 0.5 + 0.5, // Between 0.5 and 1.0
        score,
        text
      };
      
      resolve(result);
    }, 1000);
  });
};

// Analyze emojis function
export const analyzeEmojis = async (emojis: string): Promise<Emotion> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const emotions = ['happy', 'sad', 'anxious', 'calm', 'excited', 'frustrated', 'neutral'];
      const emotion = emotions[Math.floor(Math.random() * emotions.length)];
      const score = Math.floor(Math.random() * 100);
      
      const result: Emotion = {
        id: Math.random().toString(36).substring(2, 11),
        user_id: '1', // Default user ID
        date: new Date().toISOString(),
        emotion,
        confidence: Math.random() * 0.5 + 0.5, // Between 0.5 and 1.0
        score,
        text: emojis
      };
      
      resolve(result);
    }, 800);
  });
};

// Analyze audio function
export const analyzeAudio = async (audioUrl: string): Promise<Emotion> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const emotions = ['happy', 'sad', 'anxious', 'calm', 'excited', 'frustrated', 'neutral'];
      const emotion = emotions[Math.floor(Math.random() * emotions.length)];
      const score = Math.floor(Math.random() * 100);
      
      const result: Emotion = {
        id: Math.random().toString(36).substring(2, 11),
        user_id: '1', // Default user ID
        date: new Date().toISOString(),
        emotion,
        confidence: Math.random() * 0.5 + 0.5, // Between 0.5 and 1.0
        score,
        audio_url: audioUrl
      };
      
      resolve(result);
    }, 1500);
  });
};

// Save emotion function
export const saveEmotion = async (emotion: Emotion): Promise<boolean> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      mockEmotions.push(emotion);
      resolve(true);
    }, 500);
  });
};
