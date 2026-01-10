// @ts-nocheck

// Parcours thérapeutique progressif EmotionsCare
import { supabase } from '@/integrations/supabase/client';
import { EmotionInput, ANALGESIC_ROUTER } from './analgesic';
import { PRESETS } from './presets';

export interface TherapeuticStep {
  preset: string;
  tempo: number;
  duration: number; // en secondes
  description: string;
}

export interface TherapeuticSequence {
  steps: TherapeuticStep[];
  totalDuration: number;
  startEmotion: string;
  targetEmotion: string;
}

// Définir les chemins thérapeutiques par émotion de départ
const THERAPEUTIC_PATHS: Record<string, string[]> = {
  sad: ["sad melancholic", "bittersweet nostalgic", "hopeful uplifting", "joyful upbeat"],
  anger: ["angry frustrated", "bittersweet nostalgic", "hopeful uplifting", "optimistic uplifting"],
  fear: ["fearful anxious", "lonely isolated", "hopeful uplifting", "confident empowered"],
  anxious: ["anxious worried", "serene peaceful", "hopeful uplifting", "joyful upbeat"],
  pain: ["serene peaceful", "bittersweet nostalgic", "hopeful uplifting", "optimistic uplifting"],
  neutral: ["serene peaceful", "hopeful uplifting", "joyful upbeat", "optimistic uplifting"]
};

export function createTherapeuticSequence(startEmotion: string): TherapeuticSequence {
  const emotionKey = startEmotion.toLowerCase();
  const path = THERAPEUTIC_PATHS[emotionKey] || THERAPEUTIC_PATHS.neutral;
  
  const steps: TherapeuticStep[] = path.map((presetTag, index) => ({
    preset: presetTag,
    tempo: 65 + (index * 5), // Progression 65→80 BPM
    duration: index === 0 ? 30 : 60, // Première étape courte, puis 60s chacune
    description: getStepDescription(presetTag, index)
  }));
  
  return {
    steps,
    totalDuration: steps.reduce((sum, step) => sum + step.duration, 0),
    startEmotion: path[0],
    targetEmotion: path[path.length - 1]
  };
}

function getStepDescription(presetTag: string, stepIndex: number): string {
  const descriptions = [
    "Accueil et reconnaissance de l'émotion",
    "Transition douce vers l'apaisement",
    "Émergence de l'espoir et du réconfort",
    "Ancrage dans un état positif stable"
  ];
  return descriptions[stepIndex] || "Étape thérapeutique";
}

export async function generateTherapeuticSequence(
  text: string,
  language: "Français" | "English" = "Français",
  callBackUrl?: string
): Promise<{ taskId: string; sequence: TherapeuticSequence }> {
  
  try {
    // 1. Détecter l'émotion de départ via Edge Function
    const { data: emotionData, error: emotionError } = await supabase.functions.invoke('hume-analysis', {
      body: { text, analysisType: 'text' }
    });
    
    if (emotionError) {
      throw new Error(`Emotion detection failed: ${emotionError.message}`);
    }
    
    const startEmotion = emotionData?.emotions?.[0]?.name || "neutral";
    
    // 2. Créer la séquence thérapeutique
    const sequence = createTherapeuticSequence(startEmotion);
    
    // 3. Trouver le premier preset
    const firstStep = sequence.steps[0];
    const firstPreset = PRESETS.find(p => p.tag === firstStep.preset);
    
    if (!firstPreset) {
      throw new Error(`Preset ${firstStep.preset} introuvable`);
    }
    
    // 4. Prompt pour séquence évolutive
    const sequencePrompt = `${language} | parcours thérapeutique évolutif | ${firstPreset.style} | mood progression ${sequence.startEmotion} vers ${sequence.targetEmotion} | tempo ${firstStep.tempo} BPM progressif | durée ${sequence.totalDuration}s`;
    
    // 5. Générer la musique via Edge Function Suno
    const { data: musicData, error: musicError } = await supabase.functions.invoke('suno-music', {
      body: {
        prompt: sequencePrompt,
        style: firstPreset.style,
        title: `Parcours thérapeutique: ${sequence.startEmotion} → ${sequence.targetEmotion}`,
        customMode: true,
        instrumental: true,
        model: "V4_5",
        callBackUrl: callBackUrl || ""
      }
    });
    
    if (musicError) {
      throw new Error(`Music generation failed: ${musicError.message}`);
    }
    
    return {
      taskId: musicData?.taskId || musicData?.task_id || `task-${Date.now()}`,
      sequence
    };
    
  } catch (error) {
    throw new Error(`Génération séquence échouée: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}
