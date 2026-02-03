/**
 * ElevenLabs Text-to-Speech Service
 * Voix ultra-réalistes pour le coach et les méditations
 */

import { supabase } from '@/integrations/supabase/client';

export type WellnessVoice = 
  | 'calm_female' 
  | 'calm_male' 
  | 'energetic_female' 
  | 'energetic_male'
  | 'neutral_female'
  | 'neutral_male'
  | 'meditation'
  | 'breathing';

// IDs des voix ElevenLabs
const VOICE_IDS: Record<WellnessVoice, string> = {
  calm_female: 'EXAVITQu4vr4xnSDxMaL',
  calm_male: 'VR6AewLTigWG4xSOukaG',
  energetic_female: 'jBpfuIE2acCO8z3wKNLl',
  energetic_male: 'TxGEqnHWrfWFTfGW9XjX',
  neutral_female: 'MF3mGyEYCl7XYWbV9V6O',
  neutral_male: 'yoZ06aMxZJJ28mfd3POQ',
  meditation: 'pNInz6obpgDQGcFmaJgB',
  breathing: 'ErXwobaYiN019PkySvjV',
};

export interface TTSOptions {
  voice?: WellnessVoice;
  stability?: number;
  similarityBoost?: number;
  style?: number;
}

export interface TTSResult {
  audioUrl: string;
  audioBlob: Blob;
}

/**
 * Génère un audio à partir de texte avec ElevenLabs
 */
export async function generateSpeech(
  text: string,
  options: TTSOptions = {}
): Promise<TTSResult> {
  const {
    voice = 'calm_female',
    stability = 0.75,
    similarityBoost = 0.75,
    style = 0.5,
  } = options;

  const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
    body: {
      text,
      voice_id: VOICE_IDS[voice],
      voice_settings: {
        stability,
        similarity_boost: similarityBoost,
        style,
        use_speaker_boost: true,
      },
    },
  });

  if (error) {
    throw new Error(`ElevenLabs TTS error: ${error.message}`);
  }

  // Convertir la réponse en Blob audio
  const audioBlob = new Blob([data], { type: 'audio/mpeg' });
  const audioUrl = URL.createObjectURL(audioBlob);

  return { audioUrl, audioBlob };
}

/**
 * Sélectionne automatiquement la voix selon le contexte émotionnel
 */
export function selectVoiceForMood(
  mood: 'calm' | 'stressed' | 'anxious' | 'motivated' | 'neutral',
  gender: 'male' | 'female' = 'female'
): WellnessVoice {
  switch (mood) {
    case 'calm':
    case 'anxious':
      return gender === 'male' ? 'calm_male' : 'calm_female';
    case 'stressed':
      return 'meditation';
    case 'motivated':
      return gender === 'male' ? 'energetic_male' : 'energetic_female';
    default:
      return gender === 'male' ? 'neutral_male' : 'neutral_female';
  }
}

/**
 * Génère des instructions de respiration avec la voix appropriée
 */
export async function generateBreathingInstructions(
  phase: 'inhale' | 'hold' | 'exhale' | 'rest',
  duration: number
): Promise<TTSResult> {
  const instructions: Record<typeof phase, string> = {
    inhale: `Inspirez profondément pendant ${duration} secondes.`,
    hold: `Retenez votre souffle pendant ${duration} secondes.`,
    exhale: `Expirez lentement pendant ${duration} secondes.`,
    rest: `Reposez-vous pendant ${duration} secondes.`,
  };

  return generateSpeech(instructions[phase], { voice: 'breathing' });
}

/**
 * Génère une méditation guidée
 */
export async function generateMeditationGuide(
  script: string
): Promise<TTSResult> {
  return generateSpeech(script, { 
    voice: 'meditation',
    stability: 0.85,
    style: 0.3,
  });
}

export const elevenlabsService = {
  generateSpeech,
  selectVoiceForMood,
  generateBreathingInstructions,
  generateMeditationGuide,
  VOICE_IDS,
};
