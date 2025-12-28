// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface SunoGenerateRequest {
  customMode: boolean;
  instrumental: boolean;
  title: string;
  style: string;
  prompt?: string;
  model: string;
  negativeTags?: string;
  vocalGender?: 'm' | 'f' | null;
  styleWeight?: number;
  weirdnessConstraint?: number;
  audioWeight?: number;
  durationSeconds?: number;
  callBackUrl: string;
}

export interface SunoExtendRequest {
  audioId: string;
  continueAt: number;
  model: string;
  callBackUrl: string;
}

export interface SunoAddVocalsRequest {
  audioId: string;
  prompt: string;
  model: string;
  callBackUrl: string;
}

export async function generateMusic(request: SunoGenerateRequest) {
  try {
    const { data, error } = await supabase.functions.invoke('suno-music', {
      body: {
        action: 'generate',
        prompt: request.prompt,
        mood: request.style?.split(' ')[0] || 'calm',
        style: request.style,
        title: request.title,
        instrumental: request.instrumental
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error('Error generating music', error as Error, 'MUSIC');
    throw error;
  }
}

export async function extendMusic(request: SunoExtendRequest) {
  try {
    const { data, error } = await supabase.functions.invoke('suno-music-extend', {
      body: request
    });

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error('Error extending music', error as Error, 'MUSIC');
    throw error;
  }
}

export async function addVocals(request: SunoAddVocalsRequest) {
  try {
    const { data, error } = await supabase.functions.invoke('suno-add-vocals', {
      body: request
    });

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error('Error adding vocals', error as Error, 'MUSIC');
    throw error;
  }
}
