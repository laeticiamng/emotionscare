
import { v4 as uuid } from 'uuid';
import { EmotionResult } from '@/types';

/**
 * Analyze text to detect emotion
 * @param text Text to analyze for emotional content
 * @returns Promise with emotion analysis result
 */
export const analyzeEmotion = async (text: string): Promise<EmotionResult> => {
  // In a real implementation, this would call an API like Hume AI
  // For now, we'll implement a simple mock that returns random emotions
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simple emotion keywords detection (very basic mock)
  const emotions = [
    { emotion: 'joy', keywords: ['happy', 'joy', 'great', 'excellent', 'good', 'smile'] },
    { emotion: 'sadness', keywords: ['sad', 'down', 'bad', 'depressed', 'unhappy'] },
    { emotion: 'anger', keywords: ['angry', 'mad', 'upset', 'frustrated', 'annoyed'] },
    { emotion: 'fear', keywords: ['afraid', 'scared', 'worried', 'anxious', 'nervous'] },
    { emotion: 'surprise', keywords: ['surprised', 'shocked', 'unexpected', 'wow'] },
    { emotion: 'calm', keywords: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil'] }
  ];
  
  // Default to neutral if no match
  let detectedEmotion = 'neutral';
  let confidenceScore = 0.5;
  let intensity = 50;
  
  // Simple detection based on keyword presence
  const textLower = text.toLowerCase();
  
  for (const emotionObj of emotions) {
    for (const keyword of emotionObj.keywords) {
      if (textLower.includes(keyword)) {
        detectedEmotion = emotionObj.emotion;
        // Random confidence between 0.7 and 0.95
        confidenceScore = 0.7 + Math.random() * 0.25;
        // Random intensity between 60 and 90
        intensity = 60 + Math.floor(Math.random() * 30);
        break;
      }
    }
  }
  
  // Generate feedback based on detected emotion
  const feedback = generateEmotionFeedback(detectedEmotion);
  
  return {
    id: uuid(),
    date: new Date().toISOString(),
    emotion: detectedEmotion,
    score: Math.round(confidenceScore * 100),
    confidence: confidenceScore,
    intensity,
    text,
    transcript: text,
    feedback
  };
};

/**
 * Save emotion data to storage/database
 * @param emotion Emotion data to save
 * @returns Promise with saved emotion data
 */
export const saveEmotion = async (emotion: EmotionResult): Promise<EmotionResult> => {
  // In a real implementation, this would save to database
  // For now, we'll just simulate a successful save
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Save to localStorage for persistence in the demo
  try {
    const emotions = JSON.parse(localStorage.getItem('emotions') || '[]');
    emotions.push(emotion);
    localStorage.setItem('emotions', JSON.stringify(emotions));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
  
  return emotion;
};

/**
 * Fetch most recent emotion entry for a user
 * @param userId User ID to fetch emotion for
 * @returns Promise with most recent emotion or null if none exists
 */
export const fetchLatestEmotion = async (userId: string): Promise<EmotionResult | null> => {
  // In a real implementation, this would fetch from database
  // For now, we'll return from localStorage if available
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const emotions = JSON.parse(localStorage.getItem('emotions') || '[]');
    const userEmotions = emotions.filter((e: EmotionResult) => e.user_id === userId);
    
    if (userEmotions.length === 0) {
      return null;
    }
    
    // Sort by date descending and get the most recent
    userEmotions.sort((a: EmotionResult, b: EmotionResult) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    return userEmotions[0];
  } catch (error) {
    console.error('Error fetching from localStorage:', error);
    return null;
  }
};

/**
 * Create a new emotion entry
 * @param data Emotion data to save
 * @returns Promise with created emotion
 */
export const createEmotionEntry = async (data: Partial<EmotionResult>): Promise<EmotionResult> => {
  // Ensure required fields
  const emotion: EmotionResult = {
    id: data.id || uuid(),
    date: data.date || new Date().toISOString(),
    emotion: data.emotion || 'neutral',
    score: data.score || 50,
    confidence: data.confidence || 0.5,
    intensity: data.intensity || 50,
    text: data.text || '',
    transcript: data.transcript || '',
    feedback: data.feedback || '',
    user_id: data.user_id || '',
  };
  
  // Save the emotion
  return await saveEmotion(emotion);
};

// Helper function to generate feedback based on emotion
const generateEmotionFeedback = (emotion: string): string => {
  const feedbacks: Record<string, string[]> = {
    joy: [
      "Votre joie est contagieuse ! Profitez de cette énergie positive.",
      "Excellent ! Votre état émotionnel positif peut être partagé avec votre entourage.",
      "Cette joie est précieuse. Pensez à noter ce qui l'a provoquée dans votre journal."
    ],
    sadness: [
      "Je perçois de la tristesse. Prenez un moment pour respirer profondément.",
      "C'est normal de se sentir triste parfois. Soyez bienveillant envers vous-même.",
      "Votre vulnérabilité est une force. Acceptez cette émotion sans jugement."
    ],
    anger: [
      "Votre colère est légitime. Prenez un moment pour vous calmer avant d'agir.",
      "Respirez profondément et essayez d'identifier la source de cette colère.",
      "Transformez cette énergie en action constructive quand vous serez plus calme."
    ],
    fear: [
      "La peur nous protège mais peut parfois nous limiter. Identifiez sa source.",
      "Respirez lentement pour calmer votre système nerveux face à cette peur.",
      "Votre cerveau est en mode protection. Rassurez-le avec des pensées apaisantes."
    ],
    surprise: [
      "La surprise ouvre notre esprit à de nouvelles possibilités !",
      "Cet étonnement montre votre capacité à vous émerveiller.",
      "Profitez de cette émotion qui élargit votre perception."
    ],
    calm: [
      "Votre calme est une ressource précieuse. Savourez cet équilibre.",
      "Cet état de sérénité est idéal pour la réflexion et la créativité.",
      "Votre tranquillité d'esprit favorise des décisions équilibrées."
    ],
    neutral: [
      "Votre état émotionnel semble équilibré. C'est une belle base pour avancer.",
      "Cette neutralité vous permet d'observer les situations avec clarté.",
      "Un état stable est parfois exactement ce dont nous avons besoin."
    ]
  };
  
  const options = feedbacks[emotion] || feedbacks.neutral;
  return options[Math.floor(Math.random() * options.length)];
};
