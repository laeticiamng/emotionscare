import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import {
  type EmotionAnalysisResult,
  type EmotionPlanResult,
  type EmotionSessionInput,
} from './emotionSessionSchema';

export interface EmotionSessionRecord {
  id: string;
  user_id: string;
  input_type: string;
  raw_input: string | null;
  voice_file_url: string | null;
  detected_emotions: Array<{ label: string; intensity: number; confidence?: number; valence?: number }>;
  primary_emotion: string | null;
  intensity: number | null;
  valence: number | null;
  arousal: number | null;
  context_tags: string[];
  ai_model_version: string | null;
  processing_time_ms: number | null;
  created_at: string;
}

export interface EmotionRecommendation {
  type: string;
  title?: string;
  description?: string;
  priority?: number;
  [key: string]: unknown;
}

export interface EmotionPlanRecord {
  id: string;
  session_id: string;
  user_id: string;
  plan_type: string;
  recommendations: EmotionRecommendation[];
  status: string;
  created_at: string;
}

export const analyzeEmotionSession = async (
  input: EmotionSessionInput,
): Promise<EmotionAnalysisResult> => {
  const { data, error } = await supabase.functions.invoke('analyze-emotion', {
    body: {
      input_type: input.inputType,
      raw_input: input.text ?? '',
      selected_emotion: input.selectedEmotion ?? null,
      intensity: input.intensity,
      context_tags: input.contextTags ?? [],
    },
  });

  if (error) {
    logger.error('Emotion session analysis error', error, 'AI');
    throw new Error(error.message || 'Erreur lors de l\'analyse IA.');
  }

  return data as EmotionAnalysisResult;
};

export const updatePrimaryEmotion = async (sessionId: string, primaryEmotion: string) => {
  const { error } = await supabase
    .from('emotion_sessions')
    .update({ primary_emotion: primaryEmotion })
    .eq('id', sessionId);

  if (error) {
    logger.error('Emotion session update error', error, 'DB');
    throw new Error(error.message || 'Erreur lors de la mise à jour.');
  }
};

export const generateEmotionPlan = async (
  sessionId: string,
  analysis: EmotionAnalysisResult,
): Promise<EmotionPlanResult> => {
  const { data, error } = await supabase.functions.invoke('generate-plan', {
    body: {
      session_id: sessionId,
      emotion_analysis: {
        primary_emotion: analysis.primaryEmotion,
        valence: analysis.valence,
        arousal: analysis.arousal,
        detected_emotions: analysis.detectedEmotions,
      },
    },
  });

  if (error) {
    logger.error('Emotion plan generation error', error, 'AI');
    throw new Error(error.message || 'Erreur lors de la génération du plan.');
  }

  return data as EmotionPlanResult;
};

export const requestMusicGeneration = async (params: {
  emotion: string;
  target_energy: string;
  duration_seconds: number;
  style_preferences?: string[];
  session_id?: string;
}) => {
  const { data, error } = await supabase.functions.invoke('generate-music', {
    body: params,
  });

  if (error) {
    logger.error('Music generation request failed', error, 'MUSIC');
    throw new Error(error.message || 'Erreur lors du lancement de la musique.');
  }

  return data as { request_id: string; status: string };
};

export const fetchEmotionSessions = async () => {
  const { data: sessions, error } = await supabase
    .from('emotion_sessions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('Emotion session fetch error', error, 'DB');
    throw new Error(error.message || 'Erreur lors du chargement de l\'historique.');
  }

  const sessionIds = (sessions ?? []).map(session => session.id);
  let plans: EmotionPlanRecord[] = [];

  if (sessionIds.length > 0) {
    const { data: planData, error: planError } = await supabase
      .from('emotion_plans')
      .select('*')
      .in('session_id', sessionIds);

    if (planError) {
      logger.error('Emotion plan fetch error', planError, 'DB');
    } else {
      plans = planData as EmotionPlanRecord[];
    }
  }

  return {
    sessions: (sessions ?? []) as EmotionSessionRecord[],
    plans,
  };
};
