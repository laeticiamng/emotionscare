
// Routeur et générateur de musique antalgique EmotionsCare
import { HumeEmotionScore } from './humeClient';
import { SunoApiClient, SunoGenerateRequest } from './sunoClient';
import { PRESETS } from './presets';

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
  
  console.log(`🎵 EmotionsCare Antalgique: Génération pour texte: "${text.slice(0, 50)}..."`);
  
  try {
    // 1. Analyser les émotions avec Hume AI
    const humeApiKey = process.env.HUME_API_KEY;
    if (!humeApiKey) {
      throw new Error('HUME_API_KEY not configured');
    }
    
    const { HumeClient } = await import('./humeClient');
    const hume = new HumeClient(humeApiKey);
    const rawEmotions = await hume.detectEmotion(text);
    
    // Convertir vers EmotionInput
    const mainEmotion: EmotionInput = {
      name: rawEmotions[0]?.name || "neutral",
      score: rawEmotions[0]?.score || 0.5,
      valence: 0, // À calculer si disponible
      arousal: rawEmotions[0]?.score || 0.5
    };
    
    console.log(`🎭 Émotion principale détectée: ${mainEmotion.name} (${mainEmotion.score.toFixed(2)})`);
    
    // 2. Router vers preset antalgique
    const analgesicPreset = ANALGESIC_ROUTER(mainEmotion);
    console.log(`💊 Preset antalgique sélectionné: "${analgesicPreset.presetTag}"`);
    
    // 3. Trouver le preset correspondant
    const preset = PRESETS.find(p => p.tag === analgesicPreset.presetTag);
    if (!preset) {
      throw new Error(`Preset ${analgesicPreset.presetTag} introuvable`);
    }
    
    // 4. Construire le prompt thérapeutique
    const therapeuticPrompt = `${language} | ${preset.style} | mood ${preset.tag} | ${analgesicPreset.extraPrompt} | tempo ${analgesicPreset.tempo} BPM`;
    
    console.log(`📝 Prompt thérapeutique: "${therapeuticPrompt}"`);
    
    // 5. Générer avec Suno
    const sunoApiKey = process.env.SUNO_API_KEY;
    if (!sunoApiKey) {
      throw new Error('SUNO_API_KEY not configured');
    }
    
    const suno = new SunoApiClient(sunoApiKey);
    
    const musicResponse = await suno.generateMusic({
      prompt: therapeuticPrompt,
      style: preset.style,
      title: `${preset.tag} relief`,
      customMode: true,
      instrumental: analgesicPreset.instrumental,
      model: "V4_5",
      callBackUrl: callBackUrl || ""
    });
    
    console.log(`✅ Track antalgique généré - Task ID: ${musicResponse.taskId}`);
    
    return {
      taskId: musicResponse.taskId,
      preset: analgesicPreset,
      emotions: [mainEmotion]
    };
    
  } catch (error) {
    console.error('❌ EmotionsCare Antalgique: Erreur de génération:', error);
    throw new Error(`Génération antalgique échouée: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}
