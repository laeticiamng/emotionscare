// @ts-nocheck
/**
 * Routeur et générateur de musique antalgique EmotionsCare
 * Utilise les edge functions Supabase (pas de clé API côté client)
 */
import type { HumeEmotionScore } from './humeClient';
import type { SunoGenerateRequest } from './sunoClient';
import { EMOTIONSCARE_PRESETS } from './presets';
import type { EmotionsCarePreset } from './presets';

export interface EmotionInput {
  name: string;
  score: number;
  valence?: number;
  arousal?: number;
}

export interface AnalgesicPreset {
  presetTag: string;
  tempo: number;
  instrumental: boolean;
  extraPrompt: string;
}

export const ANALGESIC_ROUTER = (emo: EmotionInput): AnalgesicPreset => {
  const { name, valence = 0, arousal = 0.5 } = emo;

  // Douleur/tristesse - Effet calmant direct
  if (name === "pain" || name === "disgust" || name === "sad") {
    return {
      presetTag: "serene peaceful",
      tempo: 65,
      instrumental: true,
      extraPrompt: "field-recording pluie légère, piano doux reverb, drone basse respirante"
    };
  }

  // Colère/frustration - Redirection positive
  if (name === "anger" || (arousal > 0.7 && valence < -0.2)) {
    return {
      presetTag: "hopeful uplifting",
      tempo: 72,
      instrumental: false,
      extraPrompt: "cordes chaleureuses, voix douce féminine, paroles en français rassurantes"
    };
  }

  // Anxiété/peur - Stabilisation nerveuse
  if (name === "anxious" || name === "fear" || arousal > 0.6) {
    return {
      presetTag: "lonely isolated",
      tempo: 60,
      instrumental: true,
      extraPrompt: "pads respirants, bruits roses, pas de percussions marquées"
    };
  }

  // Cas neutre/positif - Maintien optimiste
  return {
    presetTag: "optimistic uplifting",
    tempo: 80,
    instrumental: false,
    extraPrompt: "guitare acoustique douce, ambiance chaleureuse"
  };
};

export async function generateAnalgesicTrack(
  text: string,
  language: "Français" | "English" = "Français",
  callBackUrl?: string
): Promise<{ taskId: string; preset: AnalgesicPreset; emotions: EmotionInput[] }> {

  try {
    // 1. Analyser les émotions via edge function (pas de clé API côté client)
    const { HumeClient } = await import('./humeClient');
    const hume = new HumeClient();
    const rawEmotions = await hume.detectEmotion(text);

    // Convertir vers EmotionInput
    const mainEmotion: EmotionInput = {
      name: rawEmotions[0]?.name || "neutral",
      score: rawEmotions[0]?.score || 0.5,
      valence: 0,
      arousal: rawEmotions[0]?.score || 0.5
    };

    // 2. Router vers preset antalgique
    const analgesicPreset = ANALGESIC_ROUTER(mainEmotion);

    // 3. Trouver le preset correspondant
    const preset = EMOTIONSCARE_PRESETS.find((p: EmotionsCarePreset) => p.tag === analgesicPreset.presetTag);
    if (!preset) {
      throw new Error(`Preset ${analgesicPreset.presetTag} introuvable`);
    }

    // 4. Construire le prompt thérapeutique
    const therapeuticPrompt = `${language} | ${preset.style} | mood ${preset.tag} | ${analgesicPreset.extraPrompt} | tempo ${analgesicPreset.tempo} BPM`;

    // 5. Générer avec Suno via edge function (pas de clé API côté client)
    const { SunoApiClient } = await import('./sunoClient');
    const suno = new SunoApiClient();

    const musicResponse = await suno.generateMusic({
      prompt: therapeuticPrompt,
      style: preset.style,
      title: `${preset.tag} relief`,
      customMode: true,
      instrumental: analgesicPreset.instrumental,
      model: "V4_5",
      callBackUrl: callBackUrl || ""
    });

    return {
      taskId: musicResponse.taskId,
      preset: analgesicPreset,
      emotions: [mainEmotion]
    };

  } catch (error) {
    throw new Error(`Génération antalgique échouée: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}
