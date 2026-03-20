import { v4 as uuid } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface EmotionAnalysisResult {
  emotion: string;
  score: number;
}

// Analyze text emotions using the Supabase edge function
export async function analyzeTextEmotion(text: string): Promise<EmotionAnalysisResult[]> {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-emotion', {
      body: { text, analysisType: 'text' },
    });

    if (error) {
      logger.error('Edge function analyze-emotion returned an error', { error }, 'emotion-service');
      return [{ emotion: 'neutral', score: 0.5 }];
    }

    if (data && Array.isArray(data.emotions)) {
      return data.emotions.map((e: any) => ({
        emotion: e.emotion ?? 'neutral',
        score: typeof e.score === 'number' ? e.score : 0.5,
      }));
    }

    if (data && typeof data.emotion === 'string') {
      return [{ emotion: data.emotion, score: typeof data.score === 'number' ? data.score : 0.5 }];
    }

    logger.warn('Unexpected response shape from analyze-emotion', { data }, 'emotion-service');
    return [{ emotion: 'neutral', score: 0.5 }];
  } catch (err) {
    logger.error('Failed to call analyze-emotion edge function', { err }, 'emotion-service');
    return [{ emotion: 'neutral', score: 0.5 }];
  }
}

// Analyze facial emotions using the Supabase edge function
export async function analyzeFacialEmotion(imageData: string): Promise<EmotionAnalysisResult[]> {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-emotion', {
      body: { image: imageData, analysisType: 'facial' },
    });

    if (error) {
      logger.error('Edge function analyze-emotion (facial) returned an error', { error }, 'emotion-service');
      return [{ emotion: 'neutral', score: 0.5 }];
    }

    if (data && Array.isArray(data.emotions)) {
      return data.emotions.map((e: any) => ({
        emotion: e.emotion ?? 'neutral',
        score: typeof e.score === 'number' ? e.score : 0.5,
      }));
    }

    if (data && typeof data.emotion === 'string') {
      return [{ emotion: data.emotion, score: typeof data.score === 'number' ? data.score : 0.5 }];
    }

    logger.warn('Unexpected response shape from analyze-emotion (facial)', { data }, 'emotion-service');
    return [{ emotion: 'neutral', score: 0.5 }];
  } catch (err) {
    logger.error('Failed to call analyze-emotion edge function (facial)', { err }, 'emotion-service');
    return [{ emotion: 'neutral', score: 0.5 }];
  }
}

export async function createEmotionReport(emotionData: any) {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-emotion', {
      body: { emotionData, analysisType: 'report' },
    });

    if (error) {
      logger.error('Edge function analyze-emotion (report) returned an error', { error }, 'emotion-service');
    }

    if (data && data.id) {
      return data;
    }

    // Build a minimal report from available data without mock content
    return {
      id: uuid(),
      date: new Date().toISOString(),
      dominantEmotion: emotionData.emotion || 'neutral',
      intensity: emotionData.score ? emotionData.score / 100 : 0.5,
      feedback: generateFeedbackForEmotion(emotionData.emotion || 'neutral'),
      recommendations: generateRecommendationsForEmotion(emotionData.emotion || 'neutral'),
    };
  } catch (err) {
    logger.error('Failed to create emotion report', { err }, 'emotion-service');
    return {
      id: uuid(),
      date: new Date().toISOString(),
      dominantEmotion: 'neutral',
      intensity: 0.5,
      feedback: '',
      recommendations: [],
    };
  }
}

function generateFeedbackForEmotion(emotion: string): string {
  const feedbacks: Record<string, string[]> = {
    'happy': [
      'Votre bonne humeur est une ressource précieuse. Profitez-en pour accomplir des tâches créatives.',
      'Ce sentiment positif peut être partagé avec votre équipe pour créer un environnement de travail dynamique.'
    ],
    'sad': [
      'Il est normal de se sentir triste parfois. Prenez un moment pour identifier la source de cette émotion.',
      'Une courte pause pourrait vous aider à retrouver un meilleur équilibre émotionnel.'
    ],
    'angry': [
      'La colère peut être canalisée de façon constructive. Essayez de prendre du recul avant d\'agir.',
      'Quelques respirations profondes pourraient vous aider à diminuer l\'intensité de cette émotion.'
    ],
    'calm': [
      'Cet état d\'esprit est idéal pour la concentration. C\'est le moment parfait pour les tâches qui demandent de la précision.',
      'Votre calme est précieux. Utilisez-le pour résoudre des problèmes complexes.'
    ],
    'stressed': [
      'Le stress est un signal qu\'il ne faut pas ignorer. Une courte pause pourrait vous aider.',
      'Essayez de décomposer vos tâches en étapes plus petites pour réduire la sensation d\'être dépassé.'
    ],
    'neutral': [
      'Votre état émotionnel équilibré est idéal pour prendre des décisions réfléchies.',
      'C\'est un bon moment pour planifier votre journée ou votre semaine.'
    ]
  };

  const emotionFeedbacks = feedbacks[emotion.toLowerCase()] || feedbacks['neutral'];
  return emotionFeedbacks[Math.floor(Math.random() * emotionFeedbacks.length)];
}

function generateRecommendationsForEmotion(emotion: string): string[] {
  const recommendations: Record<string, string[]> = {
    'happy': [
      'Partagez votre énergie positive avec vos collègues',
      'Profitez de cette dynamique pour avancer sur des projets créatifs',
      'Écoutez une playlist énergique pour maintenir cet élan'
    ],
    'sad': [
      'Prenez une courte pause de 5 minutes pour vous recentrer',
      'Parlez à un collègue ou ami de confiance',
      'Essayez notre exercice de respiration guidée'
    ],
    'angry': [
      'Faites une courte marche pour vous changer les idées',
      'Essayez notre session de respiration profonde de 3 minutes',
      'Reportez les décisions importantes à plus tard si possible'
    ],
    'calm': [
      'C\'est le moment idéal pour les tâches demandant de la concentration',
      'Envisagez de bloquer ce temps pour avancer sur un projet important',
      'Notre playlist "Focus" pourrait vous aider à maintenir cet état'
    ],
    'stressed': [
      'Essayez notre session de micro-méditation de 2 minutes',
      'Réorganisez votre liste de tâches par priorité',
      'Une courte pause en extérieur pourrait vous aider à vous ressourcer'
    ],
    'neutral': [
      'C\'est un bon moment pour planifier votre journée',
      'Essayez une session de brainstorming sur un projet en cours',
      'Notre playlist "Inspiration douce" pourrait stimuler légèrement votre créativité'
    ]
  };

  return recommendations[emotion.toLowerCase()] || recommendations['neutral'];
}
