/**
 * Feature: Grounding
 * Techniques d'ancrage et exercices de présence
 */

// ============================================================================
// COMPONENTS
// ============================================================================
export { default as FiveFourThreeTwoOneCard } from './FiveFourThreeTwoOneCard';
export { GroundingSessionPlayer } from './components/GroundingSessionPlayer';
export { GroundingTechniqueCard } from './components/GroundingTechniqueCard';
export { GroundingProgressDashboard } from './components/GroundingProgressDashboard';
// ============================================================================
// TYPES
// ============================================================================
export interface GroundingSession {
  id: string;
  user_id: string;
  technique_id: string;
  started_at: string;
  completed_at?: string;
  duration_seconds: number;
  anxiety_before?: number;
  anxiety_after?: number;
  notes?: string;
}

export interface GroundingTechnique {
  id: string;
  name: string;
  description: string;
  steps: GroundingStep[];
  duration_minutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
  category: GroundingCategory;
}

export interface GroundingStep {
  order: number;
  instruction: string;
  duration_seconds?: number;
  sense?: 'sight' | 'sound' | 'touch' | 'smell' | 'taste';
  count?: number;
}

export type GroundingCategory = 
  | '5-4-3-2-1'
  | 'body-scan'
  | 'object-focus'
  | 'breath-anchor'
  | 'safe-place';

export interface GroundingProgress {
  total_sessions: number;
  techniques_mastered: string[];
  favorite_technique: string;
  avg_anxiety_reduction: number;
  streak_days: number;
}

// ============================================================================
// DEFAULT TECHNIQUES
// ============================================================================
export const DEFAULT_GROUNDING_TECHNIQUES: GroundingTechnique[] = [
  {
    id: '5-4-3-2-1',
    name: 'Technique 5-4-3-2-1',
    description: 'Ancrage sensoriel progressif utilisant les 5 sens',
    steps: [
      { order: 1, instruction: 'Nommez 5 choses que vous voyez', sense: 'sight', count: 5 },
      { order: 2, instruction: 'Nommez 4 choses que vous pouvez toucher', sense: 'touch', count: 4 },
      { order: 3, instruction: 'Nommez 3 choses que vous entendez', sense: 'sound', count: 3 },
      { order: 4, instruction: 'Nommez 2 choses que vous sentez', sense: 'smell', count: 2 },
      { order: 5, instruction: 'Nommez 1 chose que vous goûtez', sense: 'taste', count: 1 },
    ],
    duration_minutes: 5,
    difficulty: 'beginner',
    benefits: ['Réduit l\'anxiété', 'Ramène au présent', 'Calme les pensées'],
    category: '5-4-3-2-1',
  },
  {
    id: 'body-scan-quick',
    name: 'Body Scan Rapide',
    description: 'Parcours rapide des sensations corporelles',
    steps: [
      { order: 1, instruction: 'Portez attention à vos pieds', duration_seconds: 30 },
      { order: 2, instruction: 'Remontez vers vos jambes', duration_seconds: 30 },
      { order: 3, instruction: 'Observez votre abdomen', duration_seconds: 30 },
      { order: 4, instruction: 'Sentez votre poitrine', duration_seconds: 30 },
      { order: 5, instruction: 'Détendez vos épaules et bras', duration_seconds: 30 },
      { order: 6, instruction: 'Relâchez votre visage', duration_seconds: 30 },
    ],
    duration_minutes: 3,
    difficulty: 'beginner',
    benefits: ['Reconnexion au corps', 'Détente musculaire', 'Présence'],
    category: 'body-scan',
  },
  {
    id: 'safe-place',
    name: 'Lieu Sûr',
    description: 'Visualisation d\'un endroit apaisant et sécurisant',
    steps: [
      { order: 1, instruction: 'Fermez les yeux et respirez profondément', duration_seconds: 30 },
      { order: 2, instruction: 'Imaginez un lieu où vous vous sentez en sécurité', duration_seconds: 60 },
      { order: 3, instruction: 'Observez les détails visuels de ce lieu', duration_seconds: 45 },
      { order: 4, instruction: 'Écoutez les sons apaisants', duration_seconds: 45 },
      { order: 5, instruction: 'Ressentez la sécurité et le calme', duration_seconds: 60 },
    ],
    duration_minutes: 4,
    difficulty: 'intermediate',
    benefits: ['Sentiment de sécurité', 'Réduction du stress', 'Ressource interne'],
    category: 'safe-place',
  },
];

// ============================================================================
// HOOKS
// ============================================================================
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useGroundingSession() {
  const { user } = useAuth();
  const [currentTechnique, setCurrentTechnique] = useState<GroundingTechnique | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [anxietyBefore, setAnxietyBefore] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);

  const startSession = useCallback((techniqueId: string, anxiety?: number) => {
    const technique = DEFAULT_GROUNDING_TECHNIQUES.find(t => t.id === techniqueId);
    if (!technique) return;

    setCurrentTechnique(technique);
    setCurrentStep(0);
    setIsActive(true);
    setAnxietyBefore(anxiety ?? null);
    setStartTime(new Date().toISOString());
  }, []);

  const nextStep = useCallback(() => {
    if (!currentTechnique) return;
    
    if (currentStep < currentTechnique.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentTechnique, currentStep]);

  const completeSession = useCallback(async (anxietyAfter?: number) => {
    if (!user?.id || !currentTechnique || !startTime) {
      setIsActive(false);
      return;
    }

    const completedAt = new Date().toISOString();
    const duration = Math.round((new Date(completedAt).getTime() - new Date(startTime).getTime()) / 1000);

    try {
      await supabase.from('activity_sessions').insert({
        user_id: user.id,
        activity_id: currentTechnique.id,
        started_at: startTime,
        completed_at: completedAt,
        duration_seconds: duration,
        mood_before: anxietyBefore,
        mood_after: anxietyAfter,
        completed: true,
        metadata: { type: 'grounding', technique: currentTechnique.name },
      });
    } catch (error) {
      console.error('Error saving grounding session:', error);
    }

    setIsActive(false);
    setCurrentTechnique(null);
    setCurrentStep(0);
    setAnxietyBefore(null);
    setStartTime(null);
  }, [user?.id, currentTechnique, startTime, anxietyBefore]);

  const cancelSession = useCallback(() => {
    setIsActive(false);
    setCurrentTechnique(null);
    setCurrentStep(0);
    setAnxietyBefore(null);
    setStartTime(null);
  }, []);

  return {
    techniques: DEFAULT_GROUNDING_TECHNIQUES,
    currentTechnique,
    currentStep,
    currentStepData: currentTechnique?.steps[currentStep] || null,
    isActive,
    progress: currentTechnique 
      ? ((currentStep + 1) / currentTechnique.steps.length) * 100 
      : 0,
    startSession,
    nextStep,
    completeSession,
    cancelSession,
  };
}

export function useGroundingProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<GroundingProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchProgress = async () => {
      setLoading(true);
      
      const { data } = await supabase
        .from('activity_sessions')
        .select('*')
        .eq('user_id', user.id)
        .contains('metadata', { type: 'grounding' });

      if (data && data.length > 0) {
        const techniqueCounts: Record<string, number> = {};
        let totalReduction = 0;
        let reductionCount = 0;

        data.forEach(s => {
          const technique = s.activity_id;
          techniqueCounts[technique] = (techniqueCounts[technique] || 0) + 1;
          
          if (s.mood_before && s.mood_after) {
            totalReduction += s.mood_before - s.mood_after;
            reductionCount++;
          }
        });

        const favorite = Object.entries(techniqueCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || '';
        const mastered = Object.entries(techniqueCounts)
          .filter(([, count]) => count >= 5)
          .map(([id]) => id);

        setProgress({
          total_sessions: data.length,
          techniques_mastered: mastered,
          favorite_technique: favorite,
          avg_anxiety_reduction: reductionCount > 0 ? Math.round(totalReduction / reductionCount) : 0,
          streak_days: 0,
        });
      }
      
      setLoading(false);
    };

    fetchProgress();
  }, [user?.id]);

  return { progress, loading };
}

// ============================================================================
// SERVICE
// ============================================================================

export const groundingService = {
  getTechniques: () => DEFAULT_GROUNDING_TECHNIQUES,
  
  getTechniqueById: (id: string) => 
    DEFAULT_GROUNDING_TECHNIQUES.find(t => t.id === id),
  
  getTechniquesByCategory: (category: GroundingCategory) =>
    DEFAULT_GROUNDING_TECHNIQUES.filter(t => t.category === category),
  
  getBeginnerTechniques: () =>
    DEFAULT_GROUNDING_TECHNIQUES.filter(t => t.difficulty === 'beginner'),
};
