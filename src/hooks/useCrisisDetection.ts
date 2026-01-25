/**
 * useCrisisDetection - Détection de patterns de crise avec ML et alertes
 * Analyse multi-source: journal, mood, comportement, conversations
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export type CrisisLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

export interface CrisisIndicator {
  source: 'journal' | 'mood' | 'behavior' | 'conversation' | 'assessment';
  indicator: string;
  weight: number;
  detectedAt: string;
}

export interface CrisisState {
  level: CrisisLevel;
  score: number; // 0-100
  indicators: CrisisIndicator[];
  trend: 'improving' | 'stable' | 'declining';
  lastAnalysis: string | null;
  suggestedActions: string[];
}

// Mots-clés pondérés pour détection
const CRISIS_KEYWORDS = {
  critical: {
    words: ['suicide', 'mourir', 'en finir', 'plus la force', 'me faire du mal', 'automutilation'],
    weight: 40,
  },
  high: {
    words: ['désespoir', 'sans espoir', 'inutile', 'fardeau', 'seul au monde', 'personne ne comprend', 'abandonner'],
    weight: 25,
  },
  medium: {
    words: ['épuisé', 'plus envie', 'vide', 'anxieux', 'panique', 'insomnie', 'cauchemars', 'isolé'],
    weight: 15,
  },
  low: {
    words: ['stress', 'fatigué', 'préoccupé', 'nerveux', 'tendu', 'difficile'],
    weight: 8,
  },
};

// Patterns comportementaux à surveiller
const BEHAVIOR_PATTERNS = {
  inactivity: { threshold: 7, weight: 15, description: 'Inactivité prolongée' },
  moodDecline: { threshold: 3, weight: 20, description: 'Baisse d\'humeur continue' },
  nightActivity: { threshold: 3, weight: 10, description: 'Activité nocturne répétée' },
  shortSessions: { threshold: 5, weight: 8, description: 'Sessions très courtes' },
};

const DEFAULT_STATE: CrisisState = {
  level: 'none',
  score: 0,
  indicators: [],
  trend: 'stable',
  lastAnalysis: null,
  suggestedActions: [],
};

export function useCrisisDetection() {
  const { user } = useAuth();
  const [state, setState] = useState<CrisisState>(DEFAULT_STATE);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Analyser un texte pour détecter des signaux
  const analyzeText = useCallback((text: string, source: CrisisIndicator['source']): CrisisIndicator[] => {
    const indicators: CrisisIndicator[] = [];
    const lower = text.toLowerCase();

    for (const [_level, config] of Object.entries(CRISIS_KEYWORDS)) {
      for (const word of config.words) {
        if (lower.includes(word)) {
          indicators.push({
            source,
            indicator: word,
            weight: config.weight,
            detectedAt: new Date().toISOString(),
          });
        }
      }
    }

    return indicators;
  }, []);

  // Analyser les patterns comportementaux
  const analyzeBehavior = useCallback(async (): Promise<CrisisIndicator[]> => {
    if (!user) return [];

    const indicators: CrisisIndicator[] = [];

    try {
      // Vérifier l'inactivité
      const { data: lastActivity } = await supabase
        .from('mood_entries')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastActivity) {
        const daysSinceActivity = Math.floor(
          (Date.now() - new Date(lastActivity.created_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceActivity >= BEHAVIOR_PATTERNS.inactivity.threshold) {
          indicators.push({
            source: 'behavior',
            indicator: BEHAVIOR_PATTERNS.inactivity.description,
            weight: BEHAVIOR_PATTERNS.inactivity.weight,
            detectedAt: new Date().toISOString(),
          });
        }
      }

      // Vérifier la tendance d'humeur
      const { data: moodTrend } = await supabase
        .from('mood_entries')
        .select('score, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(7);

      if (moodTrend && moodTrend.length >= 3) {
        let consecutiveDeclines = 0;
        for (let i = 0; i < moodTrend.length - 1; i++) {
          if (moodTrend[i].score < moodTrend[i + 1].score) {
            consecutiveDeclines++;
          } else {
            break;
          }
        }
        if (consecutiveDeclines >= BEHAVIOR_PATTERNS.moodDecline.threshold) {
          indicators.push({
            source: 'behavior',
            indicator: BEHAVIOR_PATTERNS.moodDecline.description,
            weight: BEHAVIOR_PATTERNS.moodDecline.weight,
            detectedAt: new Date().toISOString(),
          });
        }
      }

      // Vérifier les assessments récents
      const { data: assessments } = await supabase
        .from('assessments')
        .select('instrument, score_json, created_at')
        .eq('user_id', user.id)
        .in('instrument', ['phq9', 'gad7', 'who5'])
        .order('created_at', { ascending: false })
        .limit(5);

      if (assessments) {
        for (const assessment of assessments) {
          const scoreJson = typeof assessment.score_json === 'string' 
            ? JSON.parse(assessment.score_json) 
            : assessment.score_json;
          
          const total = scoreJson?.total || scoreJson?.score || 0;
          
          // PHQ-9 >= 20 ou GAD-7 >= 15 = alerte
          if (assessment.instrument === 'phq9' && total >= 20) {
            indicators.push({
              source: 'assessment',
              indicator: `Score PHQ-9 élevé (${total})`,
              weight: 30,
              detectedAt: assessment.created_at,
            });
          }
          if (assessment.instrument === 'gad7' && total >= 15) {
            indicators.push({
              source: 'assessment',
              indicator: `Score GAD-7 élevé (${total})`,
              weight: 25,
              detectedAt: assessment.created_at,
            });
          }
          // WHO-5 <= 28 = alerte
          if (assessment.instrument === 'who5' && total <= 28) {
            indicators.push({
              source: 'assessment',
              indicator: `Score WHO-5 bas (${total})`,
              weight: 20,
              detectedAt: assessment.created_at,
            });
          }
        }
      }
    } catch (error) {
      logger.error('[CrisisDetection] Behavior analysis error', error as Error, 'CRISIS');
    }

    return indicators;
  }, [user]);

  // Calculer le niveau de crise
  const calculateLevel = useCallback((score: number): CrisisLevel => {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    if (score >= 20) return 'low';
    return 'none';
  }, []);

  // Générer des actions suggérées
  const getSuggestedActions = useCallback((level: CrisisLevel): string[] => {
    switch (level) {
      case 'critical':
        return [
          'Contacter immédiatement un professionnel de santé mentale',
          'Numéro national de prévention du suicide: 3114',
          'Se rendre aux urgences les plus proches',
        ];
      case 'high':
        return [
          'Consulter un psychologue ou psychiatre dans les 48h',
          'Contacter une ligne d\'écoute (3114)',
          'En parler à une personne de confiance',
        ];
      case 'medium':
        return [
          'Planifier un rendez-vous avec un professionnel',
          'Pratiquer des exercices de respiration',
          'Maintenir une routine de sommeil régulière',
        ];
      case 'low':
        return [
          'Continuer les exercices de bien-être',
          'Pratiquer la méditation quotidienne',
          'Tenir un journal émotionnel',
        ];
      default:
        return [];
    }
  }, []);

  // Analyse complète
  const runFullAnalysis = useCallback(async (additionalText?: string): Promise<CrisisState> => {
    if (!user) return DEFAULT_STATE;

    setIsAnalyzing(true);

    try {
      let allIndicators: CrisisIndicator[] = [];

      // Analyser le texte additionnel si fourni
      if (additionalText) {
        allIndicators.push(...analyzeText(additionalText, 'journal'));
      }

      // Analyser les entrées journal récentes
      const { data: journals } = await supabase
        .from('journal_entries')
        .select('content, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (journals) {
        for (const journal of journals) {
          allIndicators.push(...analyzeText(journal.content || '', 'journal'));
        }
      }

      // Analyser les comportements
      const behaviorIndicators = await analyzeBehavior();
      allIndicators.push(...behaviorIndicators);

      // Dédupliquer et calculer le score
      const uniqueIndicators = allIndicators.reduce<CrisisIndicator[]>((acc, ind) => {
        const exists = acc.find(a => a.indicator === ind.indicator && a.source === ind.source);
        if (!exists) acc.push(ind);
        return acc;
      }, []);

      // Score total (max 100)
      const totalWeight = uniqueIndicators.reduce((sum, ind) => sum + ind.weight, 0);
      const score = Math.min(100, totalWeight);
      const level = calculateLevel(score);
      const suggestedActions = getSuggestedActions(level);

      // Déterminer la tendance
      const { data: previousAnalysis } = await supabase
        .from('user_settings')
        .select('value')
        .eq('user_id', user.id)
        .eq('key', 'crisis_history')
        .maybeSingle();

      let trend: CrisisState['trend'] = 'stable';
      if (previousAnalysis?.value) {
        try {
          const history = JSON.parse(previousAnalysis.value);
          const lastScore = history[history.length - 1]?.score || 0;
          if (score > lastScore + 10) trend = 'declining';
          else if (score < lastScore - 10) trend = 'improving';
        } catch {}
      }

      const newState: CrisisState = {
        level,
        score,
        indicators: uniqueIndicators.slice(0, 10),
        trend,
        lastAnalysis: new Date().toISOString(),
        suggestedActions,
      };

      // Sauvegarder l'historique
      await saveCrisisHistory(score, level);

      setState(newState);
      logger.info('[CrisisDetection] Analysis complete', { level, score }, 'CRISIS');

      // Alerter si niveau critique
      if (level === 'critical' || level === 'high') {
        await triggerAlert(newState);
      }

      return newState;
    } catch (error) {
      logger.error('[CrisisDetection] Analysis error', error as Error, 'CRISIS');
      return DEFAULT_STATE;
    } finally {
      setIsAnalyzing(false);
    }
  }, [user, analyzeText, analyzeBehavior, calculateLevel, getSuggestedActions]);

  // Sauvegarder l'historique
  const saveCrisisHistory = useCallback(async (score: number, level: CrisisLevel) => {
    if (!user) return;

    try {
      const { data: existing } = await supabase
        .from('user_settings')
        .select('value')
        .eq('user_id', user.id)
        .eq('key', 'crisis_history')
        .maybeSingle();

      let history: Array<{ score: number; level: string; date: string }> = [];
      if (existing?.value) {
        try { history = JSON.parse(existing.value); } catch {}
      }

      history.push({ score, level, date: new Date().toISOString() });
      history = history.slice(-30); // Garder 30 derniers

      await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          key: 'crisis_history',
          value: JSON.stringify(history),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,key' });
    } catch (error) {
      logger.error('[CrisisDetection] Save history error', error as Error, 'CRISIS');
    }
  }, [user]);

  // Déclencher une alerte
  const triggerAlert = useCallback(async (crisisState: CrisisState) => {
    if (!user) return;

    try {
      await supabase.functions.invoke('crisis-detection', {
        body: {
          action: 'alert',
          userId: user.id,
          crisisState,
        },
      });
      logger.warn('[CrisisDetection] Alert triggered', { level: crisisState.level }, 'CRISIS');
    } catch (error) {
      logger.error('[CrisisDetection] Alert trigger error', error as Error, 'CRISIS');
    }
  }, [user]);

  // Analyse rapide d'un texte (sans sauvegarder)
  const quickAnalyze = useCallback((text: string): { level: CrisisLevel; score: number } => {
    const indicators = analyzeText(text, 'conversation');
    const score = Math.min(100, indicators.reduce((sum, ind) => sum + ind.weight, 0));
    return { level: calculateLevel(score), score };
  }, [analyzeText, calculateLevel]);

  return {
    ...state,
    isAnalyzing,
    runFullAnalysis,
    quickAnalyze,
    analyzeText,
  };
}

export default useCrisisDetection;
