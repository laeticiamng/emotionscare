
import { EmotionResult } from '@/types';

export const analyzeEmotion = async (text: string): Promise<EmotionResult> => {
  // This is a mock function that simulates API call
  // In production, this would make a call to your emotion analysis API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulating an API response
      const emotionResult: EmotionResult = {
        id: `emotion-${new Date().getTime()}`,
        date: new Date().toISOString(),
        emotion: detectMockEmotion(text),
        confidence: 0.85,
        text: text,
        ai_feedback: generateMockFeedback(text),
        recommendations: generateMockRecommendations(),
        emojis: ['😊', '🙂', '🤔']
      };
      resolve(emotionResult);
    }, 1000); // Simulating 1 second API delay
  });
};

export const analyzeFacialEmotion = async (imageData: string): Promise<EmotionResult> => {
  // This is a mock function that simulates API call for facial emotion detection
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulating an API response
      const emotionResult: EmotionResult = {
        id: `facial-${new Date().getTime()}`,
        date: new Date().toISOString(),
        emotion: mockRandomEmotion(),
        confidence: 0.78,
        ai_feedback: "Votre expression faciale indique une émotion claire.",
        recommendations: generateMockRecommendations(),
      };
      resolve(emotionResult);
    }, 1500); // Simulating 1.5 second API delay
  });
};

export const analyzeVoiceEmotion = async (audioUrl: string): Promise<EmotionResult> => {
  // This is a mock function that simulates API call for voice emotion detection
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulating an API response
      const emotionResult: EmotionResult = {
        id: `voice-${new Date().getTime()}`,
        date: new Date().toISOString(),
        emotion: mockRandomEmotion(),
        confidence: 0.72,
        audio_url: audioUrl,
        transcript: "C'est un exemple de transcription pour cette analyse vocale.",
        ai_feedback: "L'intonation de votre voix révèle votre état émotionnel actuel.",
        recommendations: generateMockRecommendations(),
      };
      resolve(emotionResult);
    }, 2000); // Simulating 2 second API delay
  });
};

// Helper functions for the mock implementations
function detectMockEmotion(text: string): string {
  const text_lower = text.toLowerCase();
  
  if (text_lower.includes('heureux') || text_lower.includes('content') || text_lower.includes('bien')) {
    return 'joie';
  } else if (text_lower.includes('triste') || text_lower.includes('déprimé') || text_lower.includes('mal')) {
    return 'tristesse';
  } else if (text_lower.includes('peur') || text_lower.includes('inquiet') || text_lower.includes('stress')) {
    return 'anxiété';
  } else if (text_lower.includes('colère') || text_lower.includes('énervé') || text_lower.includes('frustré')) {
    return 'colère';
  } else if (text_lower.includes('surpris') || text_lower.includes('choc')) {
    return 'surprise';
  } else {
    return 'neutre';
  }
}

function generateMockFeedback(text: string): string {
  const emotion = detectMockEmotion(text);
  
  switch(emotion) {
    case 'joie':
      return "Votre état de joie est bénéfique pour votre bien-être. Continuez à cultiver ces moments positifs.";
    case 'tristesse':
      return "La tristesse est une émotion naturelle. Prenez le temps de l'accueillir tout en prenant soin de vous.";
    case 'anxiété':
      return "Votre anxiété peut être apaisée par des techniques de respiration et de pleine conscience.";
    case 'colère':
      return "La colère vous signale un besoin non satisfait. Essayez d'identifier ce besoin pour mieux y répondre.";
    case 'surprise':
      return "La surprise peut être une opportunité d'apprentissage et d'ouverture à de nouvelles perspectives.";
    default:
      return "Votre état émotionnel semble équilibré. C'est un bon moment pour pratiquer la pleine conscience.";
  }
}

function generateMockRecommendations(): string[] {
  const allRecommendations = [
    "Pratiquez 5 minutes de respiration profonde",
    "Écoutez une musique relaxante",
    "Faites une courte marche à l'extérieur",
    "Notez 3 choses pour lesquelles vous êtes reconnaissant",
    "Prenez une pause méditative de 2 minutes",
    "Étirez-vous pendant quelques minutes",
    "Buvez un verre d'eau et hydratez-vous",
    "Contactez un ami ou un proche",
    "Écrivez vos pensées dans votre journal",
    "Visualisez un lieu paisible pendant 3 minutes"
  ];
  
  // Select 3 random recommendations
  const shuffled = [...allRecommendations].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

function mockRandomEmotion(): string {
  const emotions = ['joie', 'tristesse', 'anxiété', 'colère', 'surprise', 'neutre', 'calme'];
  return emotions[Math.floor(Math.random() * emotions.length)];
}
