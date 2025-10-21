// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import sunoRequestSchema from '../../schemas/suno-request.schema.json';
import { applyEmotionMapping } from '@/lib/yaml-loader';
import { logger } from '@/lib/logger';

interface EmotionState {
  valence?: number;
  arousal?: number;
  labels?: string[];
  dominantEmotion?: string;
}

interface UserContext {
  preferredGenres?: string[];
  moodHistory?: any[];
}

export async function buildSunoRequest(
  emotionState: EmotionState,
  userContext?: UserContext
) {
  // Appliquer le mapping YAML si on a les valeurs nécessaires
  let mappingConfig;
  if (emotionState.valence !== undefined && emotionState.arousal !== undefined) {
    mappingConfig = applyEmotionMapping(
      emotionState.valence,
      emotionState.arousal,
      emotionState.dominantEmotion
    );
  }

  const systemPrompt = `Tu es un orchestrateur musical expert. À partir d'un état émotionnel, produis un JSON STRICT conforme au schéma SunoRequest.
  
Règles importantes :
- customMode: true pour génération personnalisée
- instrumental: true par défaut (pas de paroles)
- style: description musicale détaillée (instruments, ambiance, tempo)
- model: utilise V4_5 par défaut
- title: court et évocateur (max 80 caractères)
- durationSeconds: entre 30 et 180 secondes
- negativeTags: éléments à éviter dans la musique
- Ne renvoie QUE le JSON, aucun texte additionnel.`;

  const userPrompt = `État émotionnel : ${JSON.stringify(emotionState)}
Contexte utilisateur : ${JSON.stringify(userContext || {})}

Génère une configuration musicale Suno adaptée à cet état émotionnel.`;

  try {
    const { data, error } = await supabase.functions.invoke('openai-structured-output', {
      body: {
        systemPrompt,
        userPrompt,
        schema: sunoRequestSchema,
        schemaName: 'SunoRequest'
      }
    });

    if (error) throw error;
    
    return data.result;
  } catch (error) {
    logger.error('Error building Suno request', error as Error, 'MUSIC');
    
    // Fallback configuration
    return {
      customMode: true,
      instrumental: true,
      title: "Harmonie Émotionnelle",
      style: "lofi chill upbeat, piano doux, pads atmosphériques",
      model: "V4_5",
      negativeTags: "aggressive, harsh, distortion",
      styleWeight: 0.7,
      weirdnessConstraint: 0.3,
      durationSeconds: 120,
      callBackUrl: `${window.location.origin}/api/music/callback`
    };
  }
}
