/**
 * QuestionnaireScanner - Scanner émotionnel en 7 questions
 * Interface intuitive avec sliders et émojis
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ScannerAnswers {
  physical_state: number;
  energy_level: number;
  emotional_state: string[];
  sleep_quality: number;
  physical_tension: number;
  negative_thoughts: number;
  social_support: number;
}

interface Question {
  id: keyof ScannerAnswers;
  title: string;
  type: 'slider' | 'multi-choice';
  minLabel?: string;
  maxLabel?: string;
  options?: { value: string; label: string; emoji: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'physical_state',
    title: 'Comment te sens-tu physiquement ?',
    type: 'slider',
    minLabel: 'Très mal',
    maxLabel: 'En pleine forme',
  },
  {
    id: 'energy_level',
    title: 'Quel est ton niveau d\'énergie ?',
    type: 'slider',
    minLabel: 'Épuisé(e)',
    maxLabel: 'Énergique',
  },
  {
    id: 'emotional_state',
    title: 'Comment décrirais-tu ton état émotionnel ?',
    type: 'multi-choice',
    options: [
      { value: 'serene', label: 'Serein(e)', emoji: '😌' },
      { value: 'stressed', label: 'Stressé(e)', emoji: '😰' },
      { value: 'sad', label: 'Triste', emoji: '😢' },
      { value: 'angry', label: 'En colère', emoji: '😠' },
      { value: 'anxious', label: 'Anxieux(se)', emoji: '😟' },
      { value: 'joyful', label: 'Joyeux(se)', emoji: '😊' },
      { value: 'tired', label: 'Fatigué(e)', emoji: '😴' },
      { value: 'neutral', label: 'Neutre', emoji: '😐' },
    ],
  },
  {
    id: 'sleep_quality',
    title: 'As-tu bien dormi ?',
    type: 'slider',
    minLabel: 'Très mal',
    maxLabel: 'Excellemment',
  },
  {
    id: 'physical_tension',
    title: 'Ressens-tu des tensions physiques ?',
    type: 'slider',
    minLabel: 'Aucune',
    maxLabel: 'Très fortes',
  },
  {
    id: 'negative_thoughts',
    title: 'As-tu eu des pensées négatives récurrentes ?',
    type: 'slider',
    minLabel: 'Pas du tout',
    maxLabel: 'Beaucoup',
  },
  {
    id: 'social_support',
    title: 'Te sens-tu soutenu(e) par ton entourage ?',
    type: 'slider',
    minLabel: 'Pas du tout',
    maxLabel: 'Très soutenu(e)',
  },
];

interface QuestionnaireScannerProps {
  onComplete: (answers: ScannerAnswers) => Promise<void>;
  isSubmitting?: boolean;
}

export const QuestionnaireScanner: React.FC<QuestionnaireScannerProps> = ({
  onComplete,
  isSubmitting = false,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<ScannerAnswers>>({
    physical_state: 5,
    energy_level: 5,
    emotional_state: [],
    sleep_quality: 5,
    physical_tension: 5,
    negative_thoughts: 5,
    social_support: 5,
  });

  const question = QUESTIONS[currentStep];
  const isLastStep = currentStep === QUESTIONS.length - 1;
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  const canContinue = () => {
    if (question.type === 'multi-choice') {
      return (answers.emotional_state?.length || 0) > 0;
    }
    return true;
  };

  const handleSliderChange = (value: number[]) => {
    setAnswers(prev => ({ ...prev, [question.id]: value[0] }));
  };

  const handleMultiChoiceToggle = (value: string) => {
    const current = answers.emotional_state || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setAnswers(prev => ({ ...prev, emotional_state: updated }));
  };

  const handleNext = async () => {
    if (isLastStep) {
      await onComplete(answers as ScannerAnswers);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const getSliderEmoji = (value: number): string => {
    if (value <= 2) return '😟';
    if (value <= 4) return '😕';
    if (value <= 6) return '😐';
    if (value <= 8) return '🙂';
    return '😊';
  };

  // Pour les questions inversées (tension, pensées négatives)
  const isInvertedQuestion = question.id === 'physical_tension' || question.id === 'negative_thoughts';
  const getInvertedEmoji = (value: number): string => {
    if (value <= 2) return '😊';
    if (value <= 4) return '🙂';
    if (value <= 6) return '😐';
    if (value <= 8) return '😕';
    return '😟';
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader className="pb-2">
        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-4">
          <motion.div
            className="bg-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Question {currentStep + 1}/{QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <CardTitle className="text-xl text-center">{question.title}</CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {question.type === 'slider' ? (
              <div className="space-y-6">
                {/* Emoji indicator */}
                <div className="text-center">
                  <span className="text-6xl">
                    {isInvertedQuestion 
                      ? getInvertedEmoji(answers[question.id] as number || 5)
                      : getSliderEmoji(answers[question.id] as number || 5)
                    }
                  </span>
                  <p className="text-2xl font-bold mt-2">
                    {answers[question.id] as number || 5}/10
                  </p>
                </div>

                {/* Slider */}
                <div className="px-4">
                  <Slider
                    value={[answers[question.id] as number || 5]}
                    onValueChange={handleSliderChange}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>{question.minLabel}</span>
                    <span>{question.maxLabel}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {question.options?.map((option) => {
                  const isSelected = answers.emotional_state?.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleMultiChoiceToggle(option.value)}
                      className={cn(
                        'p-3 rounded-xl border-2 transition-all',
                        'hover:border-primary/50 hover:bg-primary/5',
                        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-card'
                      )}
                      aria-pressed={isSelected}
                    >
                      <div className="text-3xl mb-1">{option.emoji}</div>
                      <div className="text-xs font-medium">{option.label}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canContinue() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyse...
              </>
            ) : isLastStep ? (
              'Voir mes résultats'
            ) : (
              <>
                Suivant
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionnaireScanner;
