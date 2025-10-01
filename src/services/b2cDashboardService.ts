// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';

/**
 * Service pour centraliser les appels du dashboard particulier
 */
export interface AnalyzeEmotionPayload {
  emojis?: string[];
  text?: string;
  audio_url?: string;
}

export interface AnalyzeEmotionResult {
  score?: number;
  ai_feedback: string;
}

export interface JournalAnalysisResult {
  ai_feedback: string;
}

export interface CoachResponse {
  response: string;
}

export const b2cDashboardService = {
  async analyzeEmotion(payload: AnalyzeEmotionPayload): Promise<AnalyzeEmotionResult> {
    const { data, error } = await supabase.functions.invoke('analyze-emotion', {
      body: payload,
    });
    if (error) throw error;
    return data as AnalyzeEmotionResult;
  },

  async analyzeJournal(content: string, journalId?: string): Promise<JournalAnalysisResult> {
    const { data, error } = await supabase.functions.invoke('analyze-journal', {
      body: { content, journal_id: journalId },
    });
    if (error) throw error;
    return data as JournalAnalysisResult;
  },

  async sendCoachMessage(prompt: string, emotion?: string): Promise<CoachResponse> {
    const { data, error } = await supabase.functions.invoke('coach-ai', {
      body: { action: 'get_recommendation', prompt, emotion },
    });
    if (error) throw error;
    return data as CoachResponse;
  },

  async generateMusicRecommendation(emotion: string): Promise<CoachResponse> {
    const { data, error } = await supabase.functions.invoke('coach-ai', {
      body: { action: 'generate_music', emotion },
    });
    if (error) throw error;
    return data as CoachResponse;
  },
};

export default b2cDashboardService;
