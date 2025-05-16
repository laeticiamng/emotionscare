
import { EmotionResult } from '@/types/emotion';

interface ScanOptions {
  type: 'voice' | 'text' | 'facial';
  duration?: number;
  content?: string;
  userId?: string;
}

export const scanService = {
  async processVoiceEmotion(audioBlob: Blob): Promise<EmotionResult> {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const emotions = ['joy', 'neutral', 'calm', 'excitement', 'anxiety', 'sadness', 'frustration'];
      const selectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      
      return {
        id: `voice-${Date.now()}`,
        emotion: selectedEmotion,
        score: Math.random() * 0.6 + 0.4,
        confidence: Math.random() * 0.5 + 0.5,
        timestamp: new Date().toISOString(),
        feedback: generateFeedback(selectedEmotion)
      };
    } catch (error) {
      console.error("Error processing voice emotion:", error);
      throw error;
    }
  },
  
  async processTextEmotion(text: string): Promise<EmotionResult> {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const emotions = ['joy', 'neutral', 'anxiety', 'sadness', 'frustration', 'excitement', 'gratitude'];
      const selectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      
      return {
        id: `text-${Date.now()}`,
        emotion: selectedEmotion,
        score: Math.random() * 0.6 + 0.4,
        confidence: Math.random() * 0.5 + 0.5,
        timestamp: new Date().toISOString(),
        text: text,
        feedback: generateFeedback(selectedEmotion)
      };
    } catch (error) {
      console.error("Error processing text emotion:", error);
      throw error;
    }
  },
  
  async processFacialEmotion(imageBlob: Blob): Promise<EmotionResult> {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const emotions = ['joy', 'neutral', 'surprise', 'sadness', 'anger', 'fear', 'disgust'];
      const selectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      
      return {
        id: `facial-${Date.now()}`,
        emotion: selectedEmotion,
        score: Math.random() * 0.6 + 0.4,
        confidence: Math.random() * 0.5 + 0.5,
        timestamp: new Date().toISOString(),
        feedback: generateFeedback(selectedEmotion)
      };
    } catch (error) {
      console.error("Error processing facial emotion:", error);
      throw error;
    }
  },
  
  async getEmotionalHistory(userId: string, period: string = 'week'): Promise<EmotionResult[]> {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const emotions = ['joy', 'neutral', 'anxiety', 'sadness', 'frustration', 'excitement', 'gratitude'];
      const daysInPeriod = period === 'week' ? 7 : period === 'month' ? 30 : 90;
      
      const history: EmotionResult[] = [];
      const now = new Date();
      
      for (let i = 0; i < daysInPeriod; i++) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        
        const result: EmotionResult = {
          id: `history-${date.getTime()}`,
          emotion: emotions[Math.floor(Math.random() * emotions.length)],
          score: Math.random() * 0.6 + 0.4,
          confidence: Math.random() * 0.5 + 0.5,
          date: date.toISOString().split('T')[0],
          timestamp: date.toISOString()
        };
        
        history.push(result);
      }
      
      return history.sort((a, b) => 
        new Date(a.timestamp as string).getTime() - new Date(b.timestamp as string).getTime()
      );
    } catch (error) {
      console.error("Error fetching emotional history:", error);
      throw error;
    }
  },
  
  async getCurrentEmotion(userId: string): Promise<EmotionResult> {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const emotions = ['joy', 'neutral', 'anxiety', 'sadness', 'frustration', 'excitement', 'gratitude'];
      const selectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      
      return {
        id: `current-${Date.now()}`,
        emotion: selectedEmotion,
        score: Math.random() * 0.6 + 0.4,
        confidence: Math.random() * 0.5 + 0.5,
        timestamp: new Date().toISOString(),
        feedback: generateFeedback(selectedEmotion)
      };
    } catch (error) {
      console.error("Error getting current emotion:", error);
      throw error;
    }
  }
};

function generateFeedback(emotion: string): string {
  const feedbackMap: Record<string, string[]> = {
    joy: [
      "Votre joie est contagieuse ! Continuez à cultiver ces moments positifs.",
      "Vous semblez être dans un excellent état d'esprit. C'est le moment idéal pour des activités créatives."
    ],
    neutral: [
      "Votre état émotionnel est équilibré. C'est un bon moment pour la réflexion ou la planification.",
      "Vous êtes dans un état calme et centré. Idéal pour prendre des décisions réfléchies."
    ],
    anxiety: [
      "Je détecte des signes d'anxiété. Pourquoi ne pas prendre quelques minutes pour respirer profondément ?",
      "Un peu d'inquiétude transparaît. Une courte méditation pourrait vous aider à retrouver votre calme."
    ],
    sadness: [
      "Je perçois une certaine tristesse. N'hésitez pas à parler à un proche ou à pratiquer une activité qui vous fait plaisir.",
      "Un peu de mélancolie se fait sentir. Rappelez-vous que c'est une émotion passagère et prenez soin de vous."
    ],
    frustration: [
      "Une certaine frustration est perceptible. Peut-être pourriez-vous faire une pause et revenir plus tard ?",
      "Je détecte de la frustration. Essayez de décomposer vos défis en petites étapes plus faciles à gérer."
    ],
    excitement: [
      "Votre enthousiasme est palpable ! C'est le moment idéal pour canaliser cette énergie vers vos projets.",
      "Quelle belle énergie ! Profitez de cet élan pour avancer sur ce qui vous passionne."
    ],
    gratitude: [
      "Vous semblez ressentir de la gratitude. C'est une émotion précieuse qui renforce notre bien-être.",
      "Je perçois de la reconnaissance dans votre expression. Continuez à cultiver ce sentiment positif."
    ]
  };
  
  const feedbackOptions = feedbackMap[emotion] || [
    "Merci de partager votre ressenti. Comment puis-je vous aider maintenant ?",
    "J'ai analysé votre émotion. Que souhaitez-vous faire maintenant ?"
  ];
  
  return feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
}
