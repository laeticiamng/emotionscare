
import { EmotionResult } from '@/types/emotion';

export const analyzeEmotion = async (text: string): Promise<EmotionResult> => {
  // This would typically be an API call to analyze text
  // For demonstration, we'll return a mock result
  console.log("Analyzing text:", text);
  
  // Simple keyword-based analysis for demo purposes
  const lowerText = text.toLowerCase();
  let emotion = 'neutral';
  let score = 0.5;
  let confidence = 0.7;
  
  if (lowerText.includes('happy') || lowerText.includes('joy') || lowerText.includes('excited')) {
    emotion = 'joy';
    score = 0.8;
    confidence = 0.85;
  } else if (lowerText.includes('sad') || lowerText.includes('depressed') || lowerText.includes('unhappy')) {
    emotion = 'sadness';
    score = 0.7;
    confidence = 0.8;
  } else if (lowerText.includes('angry') || lowerText.includes('furious') || lowerText.includes('mad')) {
    emotion = 'anger';
    score = 0.75;
    confidence = 0.82;
  } else if (lowerText.includes('afraid') || lowerText.includes('scared') || lowerText.includes('fear')) {
    emotion = 'fear';
    score = 0.65;
    confidence = 0.75;
  } else if (lowerText.includes('disgusted') || lowerText.includes('gross')) {
    emotion = 'disgust';
    score = 0.6;
    confidence = 0.7;
  } else if (lowerText.includes('surprised') || lowerText.includes('shocked')) {
    emotion = 'surprise';
    score = 0.7;
    confidence = 0.75;
  } else if (lowerText.includes('calm') || lowerText.includes('peaceful') || lowerText.includes('relaxed')) {
    emotion = 'calm';
    score = 0.9;
    confidence = 0.9;
  }
  
  // Wait a bit to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    emotion,
    score,
    confidence,
    text,
    emojis: [getEmojiForEmotion(emotion)],
    recommendations: getRecommendationsForEmotion(emotion)
  };
};

// Helper function to get emoji for emotion
const getEmojiForEmotion = (emotion: string): string => {
  const emojiMap: Record<string, string> = {
    joy: '😊',
    sadness: '😢',
    anger: '😠',
    fear: '😨',
    disgust: '🤢',
    surprise: '😮',
    neutral: '😐',
    calm: '😌'
  };
  
  return emojiMap[emotion] || '😐';
};

// Helper function to get recommendations based on emotion
const getRecommendationsForEmotion = (emotion: string): string[] => {
  const recommendationsMap: Record<string, string[]> = {
    joy: [
      'Partagez votre bonheur avec un proche',
      'Notez ce qui vous rend heureux dans votre journal',
      'Écoutez une playlist joyeuse pour prolonger ce sentiment'
    ],
    sadness: [
      'Prenez un moment pour respirer profondément',
      'Contactez un ami ou un proche',
      'Écoutez une musique apaisante'
    ],
    anger: [
      'Faites une pause et éloignez-vous de la situation',
      'Pratiquez des exercices de respiration',
      'Écrivez ce qui vous met en colère pour l\'extérioriser'
    ],
    fear: [
      'Nommez précisément ce qui vous fait peur',
      'Pratiquez une méditation guidée de 5 minutes',
      'Rappelez-vous des moments où vous avez surmonté vos craintes'
    ],
    disgust: [
      'Concentrez-vous sur quelque chose d\'agréable',
      'Changez d\'environnement si possible',
      'Écoutez une musique qui vous plaît'
    ],
    surprise: [
      'Prenez le temps d\'assimiler cette nouvelle information',
      'Notez vos réflexions dans votre journal',
      'Discutez de cette surprise avec quelqu\'un de confiance'
    ],
    neutral: [
      'C\'est un bon moment pour planifier votre journée',
      'Essayez une activité qui stimule votre créativité',
      'Prenez un moment pour vous reconnecter avec vos objectifs'
    ],
    calm: [
      'Savourez ce moment de tranquillité',
      'C\'est un bon moment pour pratiquer la pleine conscience',
      'Notez dans votre journal ce qui contribue à votre sérénité'
    ]
  };
  
  return recommendationsMap[emotion] || recommendationsMap.neutral;
};
