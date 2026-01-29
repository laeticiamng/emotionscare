/**
 * useImplicitAssessment - Hook pour intégrer les évaluations de façon implicite
 * 
 * Les évaluations psychométriques sont intégrées de manière ludique et naturelle
 * dans l'expérience utilisateur, sans jamais donner l'impression d'une évaluation formelle.
 * 
 * Stratégie:
 * - WHO-5: Intégré dans le check-in quotidien (5 questions sur le bien-être)
 * - GAD-7: Questions dispersées dans les sessions coach lors de discussions sur l'anxiété
 * - PHQ-9: Intégré dans le journal (réflexions sur l'humeur des 2 dernières semaines)
 * - STAI-6: Questions intégrées avant/après méditation
 * - PSS-10: Intégré dans les exercices de respiration (niveau de stress ressenti)
 * - ISI: Questions sur le sommeil dans le check-in du matin
 * - BRS: Intégré dans les défis de résilience
 */

import { useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export type ImplicitAssessmentType = 
  | 'wellbeing'      // WHO-5 style
  | 'anxiety'        // GAD-7 style  
  | 'mood'           // PHQ-9 style
  | 'stress'         // PSS-10 / STAI-6 style
  | 'sleep'          // ISI style
  | 'resilience';    // BRS style

export interface ImplicitQuestion {
  id: string;
  text: string;
  context: string; // Contexte ludique pour la question
  emoji?: string;
  options: {
    label: string;
    value: number;
    emoji?: string;
  }[];
}

// Questions implicites par type - formulées de façon conversationnelle
const IMPLICIT_QUESTIONS: Record<ImplicitAssessmentType, ImplicitQuestion[]> = {
  wellbeing: [
    {
      id: 'wb1',
      text: 'Comment te sens-tu en ce moment ?',
      context: 'Juste un petit check-in avec toi-même',
      emoji: '💭',
      options: [
        { label: 'Pas top du tout', value: 0, emoji: '😔' },
        { label: 'Bof', value: 1, emoji: '😕' },
        { label: 'Ça va', value: 2, emoji: '😐' },
        { label: 'Plutôt bien', value: 3, emoji: '🙂' },
        { label: 'Super bien', value: 4, emoji: '😊' },
      ],
    },
    {
      id: 'wb2',
      text: 'As-tu eu des moments de calme et de détente ?',
      context: 'Pense à ces derniers jours',
      emoji: '🌿',
      options: [
        { label: 'Jamais', value: 0, emoji: '😣' },
        { label: 'Rarement', value: 1, emoji: '😕' },
        { label: 'Parfois', value: 2, emoji: '😐' },
        { label: 'Souvent', value: 3, emoji: '🙂' },
        { label: 'Tout le temps', value: 4, emoji: '😌' },
      ],
    },
    {
      id: 'wb3',
      text: 'Te sens-tu plein d\'énergie ?',
      context: 'Comment est ton niveau d\'énergie ?',
      emoji: '⚡',
      options: [
        { label: 'Épuisé(e)', value: 0, emoji: '😩' },
        { label: 'Fatigué(e)', value: 1, emoji: '😴' },
        { label: 'Normal', value: 2, emoji: '😐' },
        { label: 'En forme', value: 3, emoji: '💪' },
        { label: 'Plein d\'énergie', value: 4, emoji: '🔥' },
      ],
    },
  ],
  anxiety: [
    {
      id: 'anx1',
      text: 'Ressens-tu des tensions ou du stress ?',
      context: 'Écoute ton corps un instant',
      emoji: '🫁',
      options: [
        { label: 'Très tendu(e)', value: 3, emoji: '😰' },
        { label: 'Assez tendu(e)', value: 2, emoji: '😟' },
        { label: 'Un peu', value: 1, emoji: '😐' },
        { label: 'Détendu(e)', value: 0, emoji: '😌' },
      ],
    },
    {
      id: 'anx2',
      text: 'Arrives-tu à te relaxer facilement ?',
      context: 'Quand tu veux te détendre...',
      emoji: '🧘',
      options: [
        { label: 'Impossible', value: 3, emoji: '😫' },
        { label: 'Difficile', value: 2, emoji: '😕' },
        { label: 'Ça dépend', value: 1, emoji: '😐' },
        { label: 'Facilement', value: 0, emoji: '😊' },
      ],
    },
  ],
  mood: [
    {
      id: 'mood1',
      text: 'Comment décrirais-tu ton humeur générale ?',
      context: 'Pas de bonne ou mauvaise réponse',
      emoji: '🌈',
      options: [
        { label: 'Très basse', value: 3, emoji: '😢' },
        { label: 'Plutôt basse', value: 2, emoji: '😔' },
        { label: 'Neutre', value: 1, emoji: '😐' },
        { label: 'Positive', value: 0, emoji: '😊' },
      ],
    },
    {
      id: 'mood2',
      text: 'Trouves-tu du plaisir dans tes activités ?',
      context: 'Les choses qui te plaisent habituellement',
      emoji: '✨',
      options: [
        { label: 'Pas du tout', value: 3, emoji: '😶' },
        { label: 'Moins qu\'avant', value: 2, emoji: '😕' },
        { label: 'Comme d\'habitude', value: 1, emoji: '😐' },
        { label: 'Beaucoup', value: 0, emoji: '😄' },
      ],
    },
  ],
  stress: [
    {
      id: 'stress1',
      text: 'Quel est ton niveau de stress en ce moment ?',
      context: 'Sur une échelle de calme à très stressé',
      emoji: '📊',
      options: [
        { label: 'Calme', value: 0, emoji: '😌' },
        { label: 'Légèrement stressé', value: 1, emoji: '😐' },
        { label: 'Modérément stressé', value: 2, emoji: '😟' },
        { label: 'Très stressé', value: 3, emoji: '😰' },
      ],
    },
  ],
  sleep: [
    {
      id: 'sleep1',
      text: 'Comment as-tu dormi dernièrement ?',
      context: 'Pense à tes nuits récentes',
      emoji: '🌙',
      options: [
        { label: 'Très mal', value: 3, emoji: '😫' },
        { label: 'Pas très bien', value: 2, emoji: '😔' },
        { label: 'Correctement', value: 1, emoji: '😐' },
        { label: 'Très bien', value: 0, emoji: '😴' },
      ],
    },
    {
      id: 'sleep2',
      text: 'Te sens-tu reposé(e) au réveil ?',
      context: 'Quand tu te lèves le matin',
      emoji: '☀️',
      options: [
        { label: 'Épuisé(e)', value: 3, emoji: '😩' },
        { label: 'Fatigué(e)', value: 2, emoji: '😴' },
        { label: 'Ça dépend', value: 1, emoji: '😐' },
        { label: 'Reposé(e)', value: 0, emoji: '🌟' },
      ],
    },
  ],
  resilience: [
    {
      id: 'res1',
      text: 'Comment rebondis-tu face aux difficultés ?',
      context: 'Quand quelque chose ne va pas',
      emoji: '🔄',
      options: [
        { label: 'Très difficile', value: 0, emoji: '😔' },
        { label: 'J\'ai du mal', value: 1, emoji: '😕' },
        { label: 'Je m\'adapte', value: 2, emoji: '😐' },
        { label: 'Je rebondis vite', value: 3, emoji: '💪' },
      ],
    },
  ],
};

interface ImplicitAssessmentState {
  isActive: boolean;
  type: ImplicitAssessmentType | null;
  currentQuestionIndex: number;
  answers: Record<string, number>;
  questions: ImplicitQuestion[];
}

export function useImplicitAssessment() {
  const { toast } = useToast();
  const [state, setState] = useState<ImplicitAssessmentState>({
    isActive: false,
    type: null,
    currentQuestionIndex: 0,
    answers: {},
    questions: [],
  });

  /**
   * Démarre une évaluation implicite
   * Retourne une question à poser de façon naturelle dans le contexte
   */
  const startImplicitAssessment = useCallback((type: ImplicitAssessmentType) => {
    const questions = IMPLICIT_QUESTIONS[type];
    if (!questions || questions.length === 0) return null;

    setState({
      isActive: true,
      type,
      currentQuestionIndex: 0,
      answers: {},
      questions,
    });

    return questions[0];
  }, []);

  /**
   * Enregistre une réponse et retourne la question suivante ou null si terminé
   */
  const answerQuestion = useCallback((questionId: string, value: number): ImplicitQuestion | null => {
    setState(prev => {
      const newAnswers = { ...prev.answers, [questionId]: value };
      const nextIndex = prev.currentQuestionIndex + 1;
      
      if (nextIndex >= prev.questions.length) {
        // Évaluation terminée - on pourrait envoyer les résultats ici
        return {
          ...prev,
          isActive: false,
          answers: newAnswers,
          currentQuestionIndex: nextIndex,
        };
      }

      return {
        ...prev,
        answers: newAnswers,
        currentQuestionIndex: nextIndex,
      };
    });

    // Retourner la prochaine question
    const nextIndex = state.currentQuestionIndex + 1;
    if (nextIndex < state.questions.length) {
      return state.questions[nextIndex];
    }
    return null;
  }, [state.currentQuestionIndex, state.questions]);

  /**
   * Obtient une question aléatoire d'un type donné
   * Utile pour intégrer une question de façon spontanée
   */
  const getRandomQuestion = useCallback((type: ImplicitAssessmentType): ImplicitQuestion | null => {
    const questions = IMPLICIT_QUESTIONS[type];
    if (!questions || questions.length === 0) return null;
    return questions[Math.floor(Math.random() * questions.length)];
  }, []);

  /**
   * Calcule un score simplifié basé sur les réponses
   * Retourne un niveau de 0 à 4 (bien à préoccupant)
   */
  const calculateSimpleScore = useCallback((): { level: number; message: string } => {
    const values = Object.values(state.answers);
    if (values.length === 0) return { level: 2, message: 'Pas assez de données' };

    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    
    if (avg <= 0.5) return { level: 0, message: 'Tu as l\'air d\'aller bien 😊' };
    if (avg <= 1.5) return { level: 1, message: 'Ça va globalement 🙂' };
    if (avg <= 2) return { level: 2, message: 'Quelques tensions mais c\'est normal' };
    if (avg <= 2.5) return { level: 3, message: 'Prends soin de toi 💙' };
    return { level: 4, message: 'N\'hésite pas à te faire accompagner' };
  }, [state.answers]);

  const currentQuestion = state.isActive && state.currentQuestionIndex < state.questions.length
    ? state.questions[state.currentQuestionIndex]
    : null;

  const reset = useCallback(() => {
    setState({
      isActive: false,
      type: null,
      currentQuestionIndex: 0,
      answers: {},
      questions: [],
    });
  }, []);

  return {
    isActive: state.isActive,
    type: state.type,
    currentQuestion,
    answers: state.answers,
    progress: state.questions.length > 0 
      ? state.currentQuestionIndex / state.questions.length 
      : 0,
    startImplicitAssessment,
    answerQuestion,
    getRandomQuestion,
    calculateSimpleScore,
    reset,
  };
}

export default useImplicitAssessment;
