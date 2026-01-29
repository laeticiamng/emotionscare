/**
 * useAssessmentFlow - Hook pour les questionnaires d'évaluation
 * Corrige: assessments: 0 questionnaires complétés
 */

import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export type AssessmentType = 'PHQ9' | 'GAD7' | 'PSS' | 'WEMWBS' | 'custom';

export interface AssessmentQuestion {
  id: string;
  text: string;
  options: { value: number; label: string }[];
}

export interface AssessmentResult {
  id: string;
  user_id: string;
  type: AssessmentType;
  score: number;
  max_score: number;
  interpretation: string;
  answers: Record<string, number>;
  completed_at: string;
}

// Standard questionnaires
const QUESTIONNAIRES: Record<AssessmentType, { title: string; questions: AssessmentQuestion[] }> = {
  PHQ9: {
    title: 'Patient Health Questionnaire (PHQ-9)',
    questions: [
      { id: 'phq1', text: 'Peu d\'intérêt ou de plaisir à faire les choses', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Plusieurs jours' }, { value: 2, label: 'Plus de la moitié du temps' }, { value: 3, label: 'Presque tous les jours' }] },
      { id: 'phq2', text: 'Se sentir triste, déprimé ou désespéré', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Plusieurs jours' }, { value: 2, label: 'Plus de la moitié du temps' }, { value: 3, label: 'Presque tous les jours' }] },
      { id: 'phq3', text: 'Difficultés à s\'endormir, sommeil interrompu ou trop dormir', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Plusieurs jours' }, { value: 2, label: 'Plus de la moitié du temps' }, { value: 3, label: 'Presque tous les jours' }] },
      { id: 'phq4', text: 'Se sentir fatigué ou avoir peu d\'énergie', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Plusieurs jours' }, { value: 2, label: 'Plus de la moitié du temps' }, { value: 3, label: 'Presque tous les jours' }] },
      { id: 'phq5', text: 'Peu d\'appétit ou manger trop', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Plusieurs jours' }, { value: 2, label: 'Plus de la moitié du temps' }, { value: 3, label: 'Presque tous les jours' }] },
    ],
  },
  GAD7: {
    title: 'Generalized Anxiety Disorder (GAD-7)',
    questions: [
      { id: 'gad1', text: 'Se sentir nerveux, anxieux ou sur les nerfs', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Plusieurs jours' }, { value: 2, label: 'Plus de la moitié du temps' }, { value: 3, label: 'Presque tous les jours' }] },
      { id: 'gad2', text: 'Incapable d\'arrêter de s\'inquiéter ou de contrôler ses inquiétudes', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Plusieurs jours' }, { value: 2, label: 'Plus de la moitié du temps' }, { value: 3, label: 'Presque tous les jours' }] },
      { id: 'gad3', text: 'S\'inquiéter trop à propos de différentes choses', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Plusieurs jours' }, { value: 2, label: 'Plus de la moitié du temps' }, { value: 3, label: 'Presque tous les jours' }] },
      { id: 'gad4', text: 'Avoir du mal à se détendre', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Plusieurs jours' }, { value: 2, label: 'Plus de la moitié du temps' }, { value: 3, label: 'Presque tous les jours' }] },
      { id: 'gad5', text: 'Être si agité qu\'il est difficile de rester tranquille', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Plusieurs jours' }, { value: 2, label: 'Plus de la moitié du temps' }, { value: 3, label: 'Presque tous les jours' }] },
    ],
  },
  PSS: {
    title: 'Perceived Stress Scale (PSS-10)',
    questions: [
      { id: 'pss1', text: 'Avez-vous été affecté par quelque chose d\'inattendu ?', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Presque jamais' }, { value: 2, label: 'Parfois' }, { value: 3, label: 'Assez souvent' }, { value: 4, label: 'Très souvent' }] },
      { id: 'pss2', text: 'Avez-vous senti que vous étiez incapable de contrôler les choses importantes ?', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Presque jamais' }, { value: 2, label: 'Parfois' }, { value: 3, label: 'Assez souvent' }, { value: 4, label: 'Très souvent' }] },
      { id: 'pss3', text: 'Vous êtes-vous senti nerveux ou stressé ?', options: [{ value: 0, label: 'Jamais' }, { value: 1, label: 'Presque jamais' }, { value: 2, label: 'Parfois' }, { value: 3, label: 'Assez souvent' }, { value: 4, label: 'Très souvent' }] },
    ],
  },
  WEMWBS: {
    title: 'Warwick-Edinburgh Mental Well-being Scale',
    questions: [
      { id: 'wem1', text: 'Je me suis senti optimiste quant à l\'avenir', options: [{ value: 1, label: 'Jamais' }, { value: 2, label: 'Rarement' }, { value: 3, label: 'Parfois' }, { value: 4, label: 'Souvent' }, { value: 5, label: 'Toujours' }] },
      { id: 'wem2', text: 'Je me suis senti utile', options: [{ value: 1, label: 'Jamais' }, { value: 2, label: 'Rarement' }, { value: 3, label: 'Parfois' }, { value: 4, label: 'Souvent' }, { value: 5, label: 'Toujours' }] },
      { id: 'wem3', text: 'Je me suis senti détendu', options: [{ value: 1, label: 'Jamais' }, { value: 2, label: 'Rarement' }, { value: 3, label: 'Parfois' }, { value: 4, label: 'Souvent' }, { value: 5, label: 'Toujours' }] },
    ],
  },
  custom: {
    title: 'Évaluation personnalisée',
    questions: [],
  },
};

export function useAssessmentFlow() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get questionnaire by type
  const getQuestionnaire = useCallback((type: AssessmentType) => {
    return QUESTIONNAIRES[type];
  }, []);

  // Answer a question
  const answerQuestion = useCallback((questionId: string, value: number) => {
    setCurrentAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

  // Calculate score and interpretation
  const calculateResult = useCallback((type: AssessmentType, answers: Record<string, number>) => {
    const score = Object.values(answers).reduce((sum, val) => sum + val, 0);
    const questionnaire = QUESTIONNAIRES[type];
    const maxScore = questionnaire.questions.length * (type === 'WEMWBS' ? 5 : type === 'PSS' ? 4 : 3);

    let interpretation = '';
    const percentage = (score / maxScore) * 100;

    if (type === 'PHQ9' || type === 'GAD7') {
      if (score <= 4) interpretation = 'Minimal';
      else if (score <= 9) interpretation = 'Léger';
      else if (score <= 14) interpretation = 'Modéré';
      else if (score <= 19) interpretation = 'Modérément sévère';
      else interpretation = 'Sévère';
    } else if (type === 'WEMWBS') {
      if (percentage >= 70) interpretation = 'Bien-être élevé';
      else if (percentage >= 50) interpretation = 'Bien-être moyen';
      else interpretation = 'Bien-être faible';
    } else {
      if (percentage <= 30) interpretation = 'Faible';
      else if (percentage <= 60) interpretation = 'Modéré';
      else interpretation = 'Élevé';
    }

    return { score, maxScore, interpretation };
  }, []);

  // Submit assessment
  const submitAssessment = useCallback(async (type: AssessmentType): Promise<AssessmentResult | null> => {
    if (!isAuthenticated || !user?.id) {
      toast({ title: 'Erreur', description: 'Vous devez être connecté', variant: 'destructive' });
      return null;
    }

    if (Object.keys(currentAnswers).length === 0) {
      toast({ title: 'Erreur', description: 'Veuillez répondre aux questions', variant: 'destructive' });
      return null;
    }

    setIsSubmitting(true);

    try {
      const { score, maxScore, interpretation } = calculateResult(type, currentAnswers);

      const assessmentData = {
        user_id: user.id,
        type,
        score,
        max_score: maxScore,
        interpretation,
        answers: currentAnswers,
        completed_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('assessment_sessions')
        .insert({
          user_id: user.id,
          instrument: type,
          answers: currentAnswers,
          completed_at: new Date().toISOString(),
          metadata: { score, maxScore, interpretation },
        })
        .select()
        .single();

      if (error) throw error;

      // Clear answers after submission
      setCurrentAnswers({});

      toast({
        title: '✅ Évaluation terminée',
        description: `Score: ${score}/${maxScore} - ${interpretation}`,
      });

      logger.info(`Completed assessment ${type}: ${score}/${maxScore}`, 'ASSESSMENT');

      return {
        id: data.id,
        user_id: user.id,
        type,
        score,
        max_score: maxScore,
        interpretation,
        answers: currentAnswers,
        completed_at: data.completed_at,
      };
    } catch (err) {
      logger.error(`Failed to submit assessment: ${err}`, 'ASSESSMENT');
      toast({ title: 'Erreur', description: 'Impossible de soumettre l\'évaluation', variant: 'destructive' });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [isAuthenticated, user?.id, currentAnswers, calculateResult, toast]);

  // Get assessment history
  const getHistory = useCallback(async (type?: AssessmentType): Promise<AssessmentResult[]> => {
    if (!isAuthenticated || !user?.id) return [];

    try {
      let query = supabase
        .from('assessment_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(20);

      if (type) {
        query = query.eq('instrument', type);
      }

      const { data } = await query;

      return (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        type: item.instrument as AssessmentType,
        score: (item.metadata as any)?.score || 0,
        max_score: (item.metadata as any)?.maxScore || 0,
        interpretation: (item.metadata as any)?.interpretation || '',
        answers: item.answers as Record<string, number>,
        completed_at: item.completed_at || item.created_at,
      }));
    } catch (err) {
      logger.error(`Failed to fetch assessment history: ${err}`, 'ASSESSMENT');
      return [];
    }
  }, [isAuthenticated, user?.id]);

  return {
    currentAnswers,
    isSubmitting,
    getQuestionnaire,
    answerQuestion,
    submitAssessment,
    getHistory,
    resetAnswers: () => setCurrentAnswers({}),
  };
}

export default useAssessmentFlow;
