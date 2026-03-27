// @ts-nocheck
/**
 * Chargeur YAML pour la configuration emotion-mapping
 * Permet de définir des règles éditables pour le mapping émotions → musique
 */

export interface EmotionRule {
  when: {
    valence?: 'high' | 'low';
    arousal?: 'high' | 'low';
    label?: string;
  };
  set: {
    style: string;
    model: string;
    instrumental: boolean;
    negativeTags?: string;
    styleWeight?: number;
    weirdnessConstraint?: number;
    durationSeconds?: number;
  };
}

export interface EmotionMapping {
  rules: EmotionRule[];
  fallback: {
    style: string;
    model: string;
    instrumental: boolean;
  };
}

// Configuration par défaut (hard-coded pour éviter la dépendance YAML côté client)
export const defaultEmotionMapping: EmotionMapping = {
  rules: [
    {
      when: { valence: 'high', arousal: 'low' },
      set: {
        style: 'lofi neo-soul, touches afro chill, Rhodes + guitare palm-mute, field recordings mer lointaine',
        model: 'V4_5',
        instrumental: true,
        negativeTags: 'aggressive drums, harsh, screech',
        styleWeight: 0.7,
        weirdnessConstraint: 0.3,
        durationSeconds: 150
      }
    },
    {
      when: { valence: 'low', arousal: 'low' },
      set: {
        style: 'ambient minimal, pads chaleureux, reverb ample',
        model: 'V4',
        instrumental: true,
        durationSeconds: 120
      }
    },
    {
      when: { arousal: 'high' },
      set: {
        style: 'organic house soft, percussions feutrées, groove régulier',
        model: 'V4_5',
        instrumental: false,
        negativeTags: 'distortion harsh, clipping',
        durationSeconds: 150
      }
    },
    {
      when: { label: 'nostalgia' },
      set: {
        style: 'retro dream-pop, chorus/tape feel, suites vi–IV–I–V',
        model: 'V4_5',
        instrumental: false,
        durationSeconds: 150
      }
    }
  ],
  fallback: {
    style: 'lofi chill upbeat',
    model: 'V4_5',
    instrumental: true
  }
};

export function applyEmotionMapping(
  valence: number,
  arousal: number,
  dominantEmotion?: string
): EmotionRule['set'] {
  const mapping = defaultEmotionMapping;

  // Convertir les valeurs numériques en catégories
  const valenceCategory = valence > 0.5 ? 'high' : 'low';
  const arousalCategory = arousal > 0.5 ? 'high' : 'low';

  // Chercher une règle correspondante
  for (const rule of mapping.rules) {
    const { when } = rule;
    
    // Vérifier la correspondance
    const valenceMatch = !when.valence || when.valence === valenceCategory;
    const arousalMatch = !when.arousal || when.arousal === arousalCategory;
    const labelMatch = !when.label || when.label === dominantEmotion;

    if (valenceMatch && arousalMatch && labelMatch) {
      return rule.set;
    }
  }

  // Fallback
  return mapping.fallback;
}
