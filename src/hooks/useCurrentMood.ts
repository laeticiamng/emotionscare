import { useState, useEffect, useCallback } from 'react';
import { useClinicalAssessment } from './useClinicalAssessment';

export interface MoodState {
  valence: number; // -4 à +4 (SAM transformé)
  arousal: number; // 1 à 9 (SAM direct)
  lastUpdated: Date | null;
  source: 'sam' | 'inferred' | 'default';
}

export interface MoodContextualizer {
  adjustCardOrder: (cards: any[], mood: MoodState) => any[];
  getNudgeTone: (mood: MoodState) => 'gentle' | 'neutral' | 'energizing';
  getRecommendedModule: (mood: MoodState) => string | null;
}

const DEFAULT_MOOD: MoodState = {
  valence: 0,
  arousal: 5,
  lastUpdated: null,
  source: 'default'
};

export const useCurrentMood = (userId?: string) => {
  const [mood, setMood] = useState<MoodState>(DEFAULT_MOOD);
  const { getClinicalSignal } = useClinicalAssessment();

  // Charger l'humeur depuis les signaux cliniques
  const loadCurrentMood = useCallback(async () => {
    if (!userId) return;

    try {
      const samSignal = await getClinicalSignal(userId, 'mood');
      
      if (samSignal?.metadata?.score) {
        // Transformer le score SAM en valence/arousal
        const valenceRaw = samSignal.metadata.responses?.sam_valence || 5;
        const arousalRaw = samSignal.metadata.responses?.sam_arousal || 5;
        
        setMood({
          valence: valenceRaw - 5, // Convertir 1-9 en -4 à +4
          arousal: arousalRaw,
          lastUpdated: new Date(samSignal.created_at),
          source: 'sam'
        });
      }
    } catch (error) {
      console.error('Error loading mood:', error);
    }
  }, [userId, getClinicalSignal]);

  useEffect(() => {
    loadCurrentMood();
  }, [loadCurrentMood]);

  // Publier un événement mood.updated pour tous les modules
  const publishMoodUpdate = useCallback((newMood: MoodState) => {
    const event = new CustomEvent('mood.updated', {
      detail: newMood
    });
    window.dispatchEvent(event);
  }, []);

  const updateMood = useCallback((valence: number, arousal: number, source: 'sam' | 'inferred' = 'inferred') => {
    const newMood: MoodState = {
      valence,
      arousal,
      lastUpdated: new Date(),
      source
    };
    
    setMood(newMood);
    publishMoodUpdate(newMood);
  }, [publishMoodUpdate]);

  // Contextualizer pour adapter l'interface selon l'humeur
  const contextualizer: MoodContextualizer = {
    adjustCardOrder: (cards: any[], currentMood: MoodState) => {
      // Si valence basse, prioriser les modules apaisants
      if (currentMood.valence < -1) {
        const soothing = ['nyvee', 'breathwork', 'music'];
        return cards.sort((a, b) => {
          const aIndex = soothing.indexOf(a.id);
          const bIndex = soothing.indexOf(b.id);
          if (aIndex !== -1 && bIndex === -1) return -1;
          if (aIndex === -1 && bIndex !== -1) return 1;
          return 0;
        });
      }
      
      // Si arousal élevé, prioriser les modules de décharge
      if (currentMood.arousal > 7) {
        const discharge = ['flash-glow', 'vr-breath', 'bubble-beat'];
        return cards.sort((a, b) => {
          const aIndex = discharge.indexOf(a.id);
          const bIndex = discharge.indexOf(b.id);
          if (aIndex !== -1 && bIndex === -1) return -1;
          if (aIndex === -1 && bIndex !== -1) return 1;
          return 0;
        });
      }
      
      return cards; // Ordre normal
    },

    getNudgeTone: (currentMood: MoodState) => {
      if (currentMood.valence < -1 || currentMood.arousal > 7) {
        return 'gentle'; // Ton doux si stress/négativité
      }
      if (currentMood.valence > 1 && currentMood.arousal > 5) {
        return 'energizing'; // Ton dynamique si positif et énergique
      }
      return 'neutral'; // Ton neutre par défaut
    },

    getRecommendedModule: (currentMood: MoodState) => {
      // Logique de recommandation basée sur valence/arousal
      if (currentMood.valence < -2 && currentMood.arousal > 6) {
        return 'nyvee'; // Anxiété/stress élevé
      }
      if (currentMood.valence < 0 && currentMood.arousal < 3) {
        return 'music'; // Tristesse/fatigue
      }
      if (currentMood.arousal > 7) {
        return 'flash-glow'; // Arousal très élevé
      }
      if (currentMood.valence > 2) {
        return 'journal'; // Humeur positive, capturer le moment
      }
      
      return null; // Pas de recommandation spécifique
    }
  };

  return {
    mood,
    updateMood,
    contextualizer,
    isStale: mood.lastUpdated ? Date.now() - mood.lastUpdated.getTime() > 2 * 60 * 60 * 1000 : true, // 2h
    reload: loadCurrentMood
  };
};