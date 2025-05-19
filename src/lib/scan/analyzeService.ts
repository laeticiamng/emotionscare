import { Emotion, EmotionResult } from '@/types/emotion';

// Function to calculate the primary emotion from the text
export const analyzeTextForEmotion = async (text: string): Promise<EmotionResult> => {
  // In a real app, this would be an API call to an ML model
  if (!text) {
    return {
      emotions: [{ name: "neutral", intensity: 0.5, score: 50 }],
      dominantEmotion: { name: "neutral", intensity: 0.5, score: 50 },
      score: 50,
      confidence: 0.6,
      text: text
    };
  }

  // Very basic keyword matching for demonstration
  const keywords = {
    happy: ['happy', 'joy', 'excited', 'pleased', 'delighted'],
    sad: ['sad', 'upset', 'depressed', 'unhappy', 'miserable'],
    angry: ['angry', 'mad', 'annoyed', 'furious', 'irritated'],
    anxious: ['anxious', 'worried', 'nervous', 'tense', 'stressed'],
    calm: ['calm', 'relaxed', 'peaceful', 'tranquil', 'serene']
  };

  const lowercaseText = text.toLowerCase();
  
  // Count occurrences of keywords for each emotion
  const counts: Record<string, number> = {
    happy: 0,
    sad: 0,
    angry: 0,
    anxious: 0,
    calm: 0
  };

  Object.entries(keywords).forEach(([emotion, words]) => {
    words.forEach(word => {
      if (lowercaseText.includes(word)) {
        counts[emotion]++;
      }
    });
  });

  // Find the emotion with the highest count
  let primaryEmotion = "neutral";
  let maxCount = 0;

  Object.entries(counts).forEach(([emotion, count]) => {
    if (count > maxCount) {
      maxCount = count;
      primaryEmotion = emotion;
    }
  });

  // If no emotion keywords are found, default to neutral
  if (maxCount === 0) {
    primaryEmotion = "neutral";
  }

  // Calculate a mock score based on keyword count (between 0 and 100)
  const score = Math.min(maxCount * 20 + 50, 100);
  
  const emotions = [
    { name: primaryEmotion, intensity: score / 100, score: score },
    { name: "neutral", intensity: 0.2, score: 20 }
  ];
  
  const result: EmotionResult = {
    emotions,
    dominantEmotion: { name: primaryEmotion, intensity: score / 100, score: score },
    score: score,
    confidence: 0.7,
    text: text,
    emotion: primaryEmotion // For backward compatibility
  };

  return result;
};

// Function to analyze audio for emotion
export const analyzeAudioForEmotion = async (audioUrl: string): Promise<EmotionResult> => {
  // In a real app, this would be an API call to an ML model
  // Mock implementation for demonstration purposes
  
  // Random emotion generation for demo purposes
  const emotions = ["happy", "sad", "angry", "anxious", "calm", "neutral"];
  const randomIndex = Math.floor(Math.random() * emotions.length);
  const randomEmotion = emotions[randomIndex];
  
  // Random score between 50 and 95
  const randomScore = Math.floor(Math.random() * 45) + 50;
  
  const emotionItems = [
    { name: randomEmotion, intensity: randomScore / 100, score: randomScore },
    { name: "neutral", intensity: 0.2, score: 20 }
  ];
  
  const result: EmotionResult = {
    emotions: emotionItems,
    dominantEmotion: { name: randomEmotion, intensity: randomScore / 100, score: randomScore },
    score: randomScore,
    confidence: 0.65,
    audio_url: audioUrl,
    emotion: randomEmotion // For backward compatibility
  };
  
  return result;
};

// Main function to analyze emotion from text or audio
export const analyzeEmotion = async (data: {
  text?: string;
  audioUrl?: string;
}): Promise<EmotionResult> => {
  if (data.text) {
    return analyzeTextForEmotion(data.text);
  } else if (data.audioUrl) {
    return analyzeAudioForEmotion(data.audioUrl);
  } else {
    throw new Error("No text or audio provided for emotion analysis");
  }
};

// Function to analyze text for emotion
export const analyzeTextEmotion = async (text: string): Promise<EmotionAnalysis> => {
  // Simulation d'analyse de texte
  return {
    name: text.toLowerCase().includes('happy') ? 'joy' : 
           text.toLowerCase().includes('sad') ? 'sadness' : 'neutral',
    intensity: 0.7,
    score: 0.85
  };
};

// Function to analyze audio for emotion
export const analyzeAudioEmotion = async (audioFile: File): Promise<Record<string, number>> => {
  // Ici nous simulons l'analyse - dans une vraie implémentation, nous enverrions
  // le fichier à une API d'analyse audio
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Convertir le tableau d'analyses en Record<string, number>
  const emotions: EmotionAnalysis[] = [
    { name: 'joy', intensity: 0.7, score: 0.8 },
    { name: 'neutral', intensity: 0.2, score: 0.15 },
    { name: 'surprise', intensity: 0.1, score: 0.05 }
  ];
  
  // Convertir en Record<string, number>
  return emotions.reduce((acc, emotion) => {
    acc[emotion.name] = emotion.score;
    return acc;
  }, {} as Record<string, number>);
};

// Function to analyze image for emotion
export const analyzeImageEmotion = async (imageFile: File): Promise<Record<string, number>> => {
  // Ici nous simulons l'analyse - dans une vraie implémentation, nous enverrions
  // l'image à une API d'analyse faciale
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Convertir le tableau d'analyses en Record<string, number>
  const emotions: EmotionAnalysis[] = [
    { name: 'neutral', intensity: 0.5, score: 0.6 },
    { name: 'joy', intensity: 0.4, score: 0.3 },
    { name: 'surprise', intensity: 0.1, score: 0.1 }
  ];
  
  // Convertir en Record<string, number>
  return emotions.reduce((acc, emotion) => {
    acc[emotion.name] = emotion.score;
    return acc;
  }, {} as Record<string, number>);
};

export default analyzeEmotion;
