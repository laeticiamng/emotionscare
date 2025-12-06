import { useState, useEffect, useCallback } from 'react';
import { useAssess } from './useAssess';
import { isAssessmentEnabled, shouldShowAssessment } from '@/lib/assess/features';
import type { Instrument } from '../../../packages/contracts/assess';

interface AssessmentIntegrationOptions {
  instrument: Instrument;
  context?: 'pre' | 'post' | 'weekly' | 'monthly' | 'adhoc';
  autoTrigger?: boolean;
  onBadgeUpdate?: (badge: string, hints: string[]) => void;
  onUIAdaptation?: (adaptations: UIAdaptation[]) => void;
}

interface UIAdaptation {
  type: 'color' | 'content' | 'layout' | 'interaction';
  target: string;
  value: any;
  priority: 'low' | 'medium' | 'high';
}

export function useAssessmentIntegration({
  instrument,
  context = 'adhoc',
  autoTrigger = false,
  onBadgeUpdate,
  onUIAdaptation
}: AssessmentIntegrationOptions) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const [currentBadge, setCurrentBadge] = useState<string | null>(null);
  const [adaptations, setAdaptations] = useState<UIAdaptation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const assess = useAssess({
    onSubmitSuccess: (result) => {
      const hints = result.orchestration.hints;
      const badge = generateBadge(instrument, hints);
      
      setCurrentBadge(badge);
      onBadgeUpdate?.(badge, hints);
      
      // Générer des adaptations UI basées sur les hints
      const uiAdaptations = generateUIAdaptations(hints, instrument);
      setAdaptations(uiAdaptations);
      onUIAdaptation?.(uiAdaptations);
      
      // Sauvegarder pour la prochaine fois
      saveLastAssessment(instrument, badge, hints);
    },
    onError: (error) => {
      console.error('Assessment integration error:', error);
    }
  });

  // Vérifier si l'assessment est activé et doit être affiché
  useEffect(() => {
    const checkAvailability = async () => {
      setIsLoading(true);
      try {
        const enabled = await isAssessmentEnabled(instrument);
        setIsEnabled(enabled);
        
        if (enabled) {
          const lastSubmitted = getLastAssessmentDate(instrument);
          const should = shouldShowAssessment(instrument, lastSubmitted, context);
          setShouldShow(should);
          
          // Récupérer le dernier badge si disponible
          const lastBadge = getLastBadge(instrument);
          if (lastBadge) {
            setCurrentBadge(lastBadge);
          }
        }
      } catch (error) {
        console.error('Error checking assessment availability:', error);
        setIsEnabled(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAvailability();
  }, [instrument, context]);

  // Auto-trigger si configuré
  useEffect(() => {
    if (autoTrigger && isEnabled && shouldShow && !assess.isStarting) {
      triggerAssessment();
    }
  }, [autoTrigger, isEnabled, shouldShow]);

  const triggerAssessment = useCallback(() => {
    if (isEnabled && !assess.isStarting) {
      assess.start(instrument, context);
    }
  }, [isEnabled, assess, instrument, context]);

  const getAdaptation = useCallback((target: string): UIAdaptation | null => {
    return adaptations.find(a => a.target === target) || null;
  }, [adaptations]);

  const getColorAdaptation = useCallback((target: string): string | null => {
    const adaptation = getAdaptation(target);
    return adaptation?.type === 'color' ? adaptation.value : null;
  }, [getAdaptation]);

  const getContentAdaptation = useCallback((target: string): string | null => {
    const adaptation = getAdaptation(target);
    return adaptation?.type === 'content' ? adaptation.value : null;
  }, [getAdaptation]);

  return {
    // État
    isEnabled,
    shouldShow,
    isLoading,
    currentBadge,
    adaptations,
    
    // Actions
    triggerAssessment,
    
    // Helpers
    getAdaptation,
    getColorAdaptation,
    getContentAdaptation,
    
    // Assessment hook
    assess
  };
}

// Utilitaires pour générer des badges et adaptations
function generateBadge(instrument: Instrument, hints: string[]): string {
  const badgeMap: Record<Instrument, Record<string, string>> = {
    WHO5: {
      'care_warm': 'besoin de douceur',
      'care_checkin': 'moment délicat', 
      'care_celebrate': 'belle énergie',
      'default': 'équilibre stable'
    },
    SAM: {
      'mood_support': 'humeur à soutenir',
      'mood_celebrate': 'humeur rayonnante',
      'default': 'état émotionnel neutre'
    },
    STAI6: {
      'calm_support': 'tension présente',
      'calm_grounding': 'besoin d\'ancrage',
      'default': 'calme ressenti'
    },
    SUDS: {
      'distress_monitor': 'tension élevée',
      'distress_support': 'détresse importante',
      'default': 'état tranquille'
    }
  };

  const instrumentBadges = badgeMap[instrument] || {};
  const firstHint = hints[0] || 'default';
  return instrumentBadges[firstHint] || instrumentBadges.default || 'état évalué';
}

function generateUIAdaptations(hints: string[], instrument: Instrument): UIAdaptation[] {
  const adaptations: UIAdaptation[] = [];

  hints.forEach(hint => {
    switch (hint) {
      case 'gentle_tone':
        adaptations.push({
          type: 'color',
          target: 'primary',
          value: 'from-rose-400 to-pink-400',
          priority: 'medium'
        });
        adaptations.push({
          type: 'content',
          target: 'greeting',
          value: 'Comment allez-vous aujourd\'hui ?',
          priority: 'low'
        });
        break;
        
      case 'increase_support':
        adaptations.push({
          type: 'layout',
          target: 'supportCards',
          value: 'priority-high',
          priority: 'high'
        });
        break;
        
      case 'suggest_breathing':
        adaptations.push({
          type: 'content',
          target: 'quickAction',
          value: 'Respirer 60 secondes',
          priority: 'high'
        });
        break;
        
      case 'warm_check_in':
        adaptations.push({
          type: 'color',
          target: 'accent',
          value: 'from-amber-400 to-orange-400',
          priority: 'medium'
        });
        break;
    }
  });

  return adaptations;
}

// Helpers de stockage
function saveLastAssessment(instrument: Instrument, badge: string, hints: string[]) {
  const key = `assess_${instrument}_last`;
  const data = {
    badge,
    hints,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem(key, JSON.stringify(data));
}

function getLastAssessmentDate(instrument: Instrument): string | undefined {
  const key = `assess_${instrument}_last`;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data).timestamp : undefined;
  } catch {
    return undefined;
  }
}

function getLastBadge(instrument: Instrument): string | null {
  const key = `assess_${instrument}_last`;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data).badge : null;
  } catch {
    return null;
  }
}