/**
 * ScanService - Service de scan émotionnel
 * Utilise les Edge Functions Supabase pour l'analyse
 */

import { supabase } from '@/integrations/supabase/client';
import { EmotionResult } from '@/types/emotion';
import { logger } from '@/lib/logger';

interface ScanOptions {
  type: 'voice' | 'text' | 'facial';
  duration?: number;
  content?: string;
  userId?: string;
}

/**
 * Convertit un Blob en base64
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Génère un feedback basé sur l'émotion détectée
 */
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
    ],
    calm: [
      "Vous êtes dans un état de calme profond. Excellent pour la concentration.",
      "Votre sérénité transparaît. C'est le moment idéal pour des activités de réflexion."
    ],
    fear: [
      "Je perçois une certaine appréhension. Prenez un moment pour respirer et vous recentrer.",
      "Un peu de crainte se manifeste. Rappelez-vous que vous avez les ressources pour faire face."
    ],
    anger: [
      "Je détecte de la colère. Essayez un exercice de respiration pour vous apaiser.",
      "Une certaine irritation transparaît. Accordez-vous une pause avant de réagir."
    ]
  };
  
  const feedbackOptions = feedbackMap[emotion.toLowerCase()] || [
    "Merci de partager votre ressenti. Comment puis-je vous aider maintenant ?",
    "J'ai analysé votre émotion. Que souhaitez-vous faire maintenant ?"
  ];
  
  return feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
}

export const scanService = {
  /**
   * Analyse l'émotion vocale via Edge Function
   */
  async processVoiceEmotion(audioBlob: Blob): Promise<EmotionResult> {
    try {
      const base64Audio = await blobToBase64(audioBlob);
      
      const { data, error } = await supabase.functions.invoke('hume-analysis', {
        body: {
          audioData: base64Audio,
          analysisType: 'voice'
        }
      });

      if (error) {
        logger.error("Voice emotion API error", error, 'SCAN');
        throw error;
      }

      const analysis = data?.analysis || {};
      const emotion = analysis.dominant_emotion || 'neutral';
      
      return {
        id: `voice-${Date.now()}`,
        emotion,
        score: analysis.confidence_score || 0.7,
        confidence: analysis.confidence_score || 0.7,
        timestamp: new Date().toISOString(),
        feedback: generateFeedback(emotion),
        source: 'voice'
      };
    } catch (error) {
      logger.error("Error processing voice emotion", error as Error, 'SCAN');
      throw error;
    }
  },
  
  /**
   * Analyse l'émotion textuelle via Edge Function
   */
  async processTextEmotion(text: string): Promise<EmotionResult> {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-emotion', {
        body: {
          input_type: 'text',
          raw_input: text,
          intensity: 5,
          context_tags: []
        }
      });

      if (error) {
        logger.error("Text emotion API error", error, 'SCAN');
        throw error;
      }

      const emotion = data?.primaryEmotion || 'neutral';
      
      return {
        id: `text-${Date.now()}`,
        emotion,
        score: Math.abs(data?.valence || 0.5),
        confidence: 0.85,
        timestamp: new Date().toISOString(),
        text,
        feedback: generateFeedback(emotion),
        valence: data?.valence,
        arousal: data?.arousal,
        source: 'text'
      };
    } catch (error) {
      logger.error("Error processing text emotion", error as Error, 'SCAN');
      throw error;
    }
  },
  
  /**
   * Analyse l'émotion faciale via Edge Function
   */
  async processFacialEmotion(imageBlob: Blob): Promise<EmotionResult> {
    try {
      const base64Image = await blobToBase64(imageBlob);
      
      const { data, error } = await supabase.functions.invoke('hume-analysis', {
        body: {
          imageBase64: base64Image,
          analysisType: 'facial'
        }
      });

      if (error) {
        logger.error("Facial emotion API error", error, 'SCAN');
        throw error;
      }

      const analysis = data?.analysis || {};
      const emotion = analysis.dominant_emotion || 'neutral';
      
      return {
        id: `facial-${Date.now()}`,
        emotion,
        score: analysis.confidence_score || 0.75,
        confidence: analysis.confidence_score || 0.75,
        timestamp: new Date().toISOString(),
        feedback: generateFeedback(emotion),
        source: 'facial'
      };
    } catch (error) {
      logger.error("Error processing facial emotion", error as Error, 'SCAN');
      throw error;
    }
  },
  
  /**
   * Récupère l'historique émotionnel depuis Supabase
   */
  async getEmotionalHistory(userId: string, period: string = 'week'): Promise<EmotionResult[]> {
    try {
      const daysMap: Record<string, number> = {
        week: 7,
        month: 30,
        quarter: 90
      };
      const days = daysMap[period] || 7;
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('emotion_scans')
        .select('*')
        .eq('user_id', userId)
        .gte('scanned_at', startDate.toISOString())
        .order('scanned_at', { ascending: true });

      if (error) {
        logger.error("Error fetching emotion history", error, 'SCAN');
        throw error;
      }

      return (data || []).map(scan => ({
        id: scan.id,
        emotion: scan.emotion || 'neutral',
        score: scan.confidence || 0.5,
        confidence: scan.confidence || 0.5,
        timestamp: scan.scanned_at,
        date: scan.scanned_at?.split('T')[0],
        source: scan.source || 'unknown',
        feedback: generateFeedback(scan.emotion || 'neutral')
      }));
    } catch (error) {
      logger.error("Error fetching emotional history", error as Error, 'SCAN');
      return [];
    }
  },
  
  /**
   * Récupère l'émotion actuelle de l'utilisateur
   */
  async getCurrentEmotion(userId: string): Promise<EmotionResult | null> {
    try {
      const { data, error } = await supabase
        .from('emotion_scans')
        .select('*')
        .eq('user_id', userId)
        .order('scanned_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        logger.error("Error fetching current emotion", error, 'SCAN');
        throw error;
      }

      if (!data) return null;

      return {
        id: data.id,
        emotion: data.emotion || 'neutral',
        score: data.confidence || 0.5,
        confidence: data.confidence || 0.5,
        timestamp: data.scanned_at,
        source: data.source || 'unknown',
        feedback: generateFeedback(data.emotion || 'neutral')
      };
    } catch (error) {
      logger.error("Error getting current emotion", error as Error, 'SCAN');
      return null;
    }
  },

  /**
   * Sauvegarde un résultat de scan émotionnel
   */
  async saveScanResult(result: EmotionResult, userId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('emotion_scans')
        .insert({
          user_id: userId,
          emotion: result.emotion,
          confidence: result.confidence || result.score,
          source: result.source || 'unknown',
          valence: result.valence,
          arousal: result.arousal,
          transcription: result.text,
          scanned_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) {
        logger.error("Error saving scan result", error, 'SCAN');
        throw error;
      }

      return data?.id || null;
    } catch (error) {
      logger.error("Error saving scan result", error as Error, 'SCAN');
      return null;
    }
  },

  /**
   * Analyse multimodale (voix + texte combinés)
   */
  async processMultimodalEmotion(
    audioBlob?: Blob,
    text?: string,
    imageBlob?: Blob
  ): Promise<EmotionResult> {
    try {
      const results: EmotionResult[] = [];

      if (audioBlob) {
        const voiceResult = await this.processVoiceEmotion(audioBlob);
        results.push(voiceResult);
      }

      if (text && text.trim().length > 0) {
        const textResult = await this.processTextEmotion(text);
        results.push(textResult);
      }

      if (imageBlob) {
        const facialResult = await this.processFacialEmotion(imageBlob);
        results.push(facialResult);
      }

      if (results.length === 0) {
        throw new Error('No input provided for analysis');
      }

      // Fusionner les résultats
      const emotionCounts: Record<string, number> = {};
      let totalConfidence = 0;

      results.forEach(r => {
        emotionCounts[r.emotion] = (emotionCounts[r.emotion] || 0) + (r.confidence || 0.5);
        totalConfidence += r.confidence || 0.5;
      });

      const dominantEmotion = Object.entries(emotionCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';

      return {
        id: `multimodal-${Date.now()}`,
        emotion: dominantEmotion,
        score: totalConfidence / results.length,
        confidence: totalConfidence / results.length,
        timestamp: new Date().toISOString(),
        feedback: generateFeedback(dominantEmotion),
        source: 'multimodal'
      };
    } catch (error) {
      logger.error("Error in multimodal analysis", error as Error, 'SCAN');
      throw error;
    }
  }
};

export default scanService;
