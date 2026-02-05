import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  options: { value: string; label: string; emoji: string }[];
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'current_feeling',
    title: 'Comment tu te sens aujourd\'hui ?',
    description: 'Choisis l\'émotion qui te correspond le mieux en ce moment.',
    options: [
      { value: 'happy', label: 'Joyeux', emoji: '😊' },
      { value: 'calm', label: 'Calme', emoji: '😌' },
      { value: 'neutral', label: 'Neutre', emoji: '😐' },
      { value: 'sad', label: 'Triste', emoji: '😢' },
      { value: 'anxious', label: 'Anxieux', emoji: '😰' },
      { value: 'angry', label: 'En colère', emoji: '😠' },
    ],
  },
  {
    id: 'motivation',
    title: 'Qu\'est-ce qui t\'amène ?',
    description: 'Quel est le principal défi que tu souhaites relever ?',
    options: [
      { value: 'stress', label: 'Gérer mon stress', emoji: '😤' },
      { value: 'sleep', label: 'Mieux dormir', emoji: '😴' },
      { value: 'anxiety', label: 'Réduire l\'anxiété', emoji: '😟' },
      { value: 'burnout', label: 'Prévenir le burn-out', emoji: '🔥' },
      { value: 'emotions', label: 'Comprendre mes émotions', emoji: '🧠' },
      { value: 'other', label: 'Autre chose', emoji: '✨' },
    ],
  },
  {
    id: 'goal',
    title: 'Ton objectif principal',
    description: 'Qu\'aimerais-tu accomplir avec EmotionsCare ?',
    options: [
      { value: 'calm', label: 'Me calmer rapidement', emoji: '🧘' },
      { value: 'sleep_better', label: 'Améliorer mon sommeil', emoji: '🌙' },
      { value: 'understand', label: 'Mieux me comprendre', emoji: '💡' },
      { value: 'productivity', label: 'Être plus productif', emoji: '🚀' },
      { value: 'relationships', label: 'Améliorer mes relations', emoji: '💕' },
      { value: 'wellbeing', label: 'Bien-être général', emoji: '🌈' },
    ],
  },
];

export interface OnboardingAnswers {
  current_feeling: string;
  motivation: string;
  goal: string;
}

interface DashboardOnboardingProps {
  onComplete: (answers: OnboardingAnswers) => Promise<void>;
  onSkip: () => void;
}

export const DashboardOnboarding: React.FC<DashboardOnboardingProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
  const canContinue = answers[step.id as keyof OnboardingAnswers];

  const handleSelect = (value: string) => {
    setAnswers(prev => ({ ...prev, [step.id]: value }));
  };

  const handleNext = async () => {
    if (!canContinue) return;
    
    if (isLastStep) {
      setIsSubmitting(true);
      try {
        await onComplete(answers as OnboardingAnswers);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center pb-2">
          {/* Progress indicator */}
          <div className="flex justify-center gap-2 mb-4">
            {ONBOARDING_STEPS.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'h-2 w-8 rounded-full transition-colors',
                  index === currentStep
                    ? 'bg-primary'
                    : index < currentStep
                    ? 'bg-primary/60'
                    : 'bg-muted'
                )}
                aria-hidden="true"
              />
            ))}
          </div>
          
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            {step.title}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {step.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-2 gap-3">
                {step.options.map((option) => {
                  const isSelected = answers[step.id as keyof OnboardingAnswers] === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all text-left',
                        'hover:border-primary/50 hover:bg-primary/5',
                        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-card'
                      )}
                      aria-pressed={isSelected}
                    >
                      <div className="text-3xl mb-2">{option.emoji}</div>
                      <div className="font-medium">{option.label}</div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>

        <CardFooter className="flex justify-between pt-4">
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="ghost" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Retour
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onSkip} className="text-muted-foreground">
              Passer
            </Button>
          </div>
          
          <Button 
            onClick={handleNext} 
            disabled={!canContinue || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <motion.div 
                  className="h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                />
                Enregistrement...
              </>
            ) : isLastStep ? (
              <>
                C'est parti !
                <Check className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                Continuer
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DashboardOnboarding;
