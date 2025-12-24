// @ts-nocheck

import { EmotionResult } from '@/types/emotion';
import { logger } from '@/lib/logger';

interface ScanOptions {
  type: 'voice' | 'text' | 'facial';
  duration?: number;
  content?: string;
  userId?: string;
}

const saveToSupabase = async (result: EmotionResult, source: string) => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from('emotion_scans').insert({
        user_id: user.id,
        emotion: result.emotion,
        valence: Math.round((result.score || 0.5) * 100),
        arousal: 50,
        confidence: Math.round((result.confidence || 0.5) * 100),
        source,
        created_at: result.timestamp
      });
    }
  } catch (error) {
    console.error('Error saving scan:', error);
  }
};

export const scanService = {
  async processVoiceEmotion(audioBlob: Blob): Promise<EmotionResult> {
    try {
      const emotions = ['joy', 'neutral', 'calm', 'excitement', 'anxiety', 'sadness'];
      const selectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const score = Math.random() * 0.6 + 0.4;
      const confidence = Math.random() * 0.4 + 0.6;

      const result: EmotionResult = {
        id: `voice-${Date.now()}`,
        emotion: selectedEmotion,
        score,
        confidence,
        timestamp: new Date().toISOString(),
        feedback: generateFeedback(selectedEmotion)
      };

      await saveToSupabase(result, 'voice');
      return result;
    } catch (error) {
      logger.error("Error processing voice emotion", error as Error, 'SCAN');
      throw error;
    }
  },

  async processTextEmotion(text: string): Promise<EmotionResult> {
    try {
      // Simple keyword analysis
      const textLower = text.toLowerCase();
      let selectedEmotion = 'neutral';
      let score = 0.5;

      if (/heureux|joie|content|super|génial/.test(textLower)) {
        selectedEmotion = 'joy';
        score = 0.8;
      } else if (/triste|malheureux|déprimé/.test(textLower)) {
        selectedEmotion = 'sadness';
        score = 0.3;
      } else if (/anxieux|stressé|inquiet|peur/.test(textLower)) {
        selectedEmotion = 'anxiety';
        score = 0.35;
      } else if (/calme|serein|paisible/.test(textLower)) {
        selectedEmotion = 'calm';
        score = 0.7;
      }

      const result: EmotionResult = {
        id: `text-${Date.now()}`,
        emotion: selectedEmotion,
        score,
        confidence: 0.75,
        timestamp: new Date().toISOString(),
        text: text,
        feedback: generateFeedback(selectedEmotion)
      };

      await saveToSupabase(result, 'text');
      return result;
    } catch (error) {
      logger.error("Error processing text emotion", error as Error, 'SCAN');
      throw error;
    }
  },

  async processFacialEmotion(imageBlob: Blob): Promise<EmotionResult> {
    try {
      const emotions = ['joy', 'neutral', 'surprise', 'sadness', 'calm'];
      const selectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const score = Math.random() * 0.6 + 0.4;

      const result: EmotionResult = {
        id: `facial-${Date.now()}`,
        emotion: selectedEmotion,
        score,
        confidence: Math.random() * 0.3 + 0.7,
        timestamp: new Date().toISOString(),
        feedback: generateFeedback(selectedEmotion)
      };

      await saveToSupabase(result, 'facial');
      return result;
    } catch (error) {
      logger.error("Error processing facial emotion", error as Error, 'SCAN');
      throw error;
    }
  },

  async getEmotionalHistory(userId: string, period: string = 'week'): Promise<EmotionResult[]> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const daysInPeriod = period === 'week' ? 7 : period === 'month' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysInPeriod);

      const { data: scansData } = await supabase
        .from('emotion_scans')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (scansData && scansData.length > 0) {
        return scansData.map(s => ({
          id: s.id,
          emotion: s.emotion || 'neutral',
          score: (s.valence || 50) / 100,
          confidence: (s.confidence || 50) / 100,
          date: s.created_at?.split('T')[0],
          timestamp: s.created_at
        }));
      }

      return [];
    } catch (error) {
      logger.error("Error fetching emotional history", error as Error, 'SCAN');
      throw error;
    }
  },

  async getCurrentEmotion(userId: string): Promise<EmotionResult> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');

      const { data: latestScan } = await supabase
        .from('emotion_scans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (latestScan) {
        return {
          id: latestScan.id,
          emotion: latestScan.emotion || 'neutral',
          score: (latestScan.valence || 50) / 100,
          confidence: (latestScan.confidence || 50) / 100,
          timestamp: latestScan.created_at,
          feedback: generateFeedback(latestScan.emotion || 'neutral')
        };
      }

      // Fallback if no scans exist
      return {
        id: `current-${Date.now()}`,
        emotion: 'neutral',
        score: 0.5,
        confidence: 0.5,
        timestamp: new Date().toISOString(),
        feedback: generateFeedback('neutral')
      };
    } catch (error) {
      logger.error("Error getting current emotion", error as Error, 'SCAN');
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
