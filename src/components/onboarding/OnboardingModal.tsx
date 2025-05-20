
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import OnboardingQuizStep from './OnboardingQuizStep';
import OnboardingFormStep from './OnboardingFormStep';

interface OnboardingModalProps {
  onClose?: () => void;
  showSkip?: boolean;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  onClose,
  showSkip = true
}) => {
  const {
    steps,
    currentStepIndex,
    currentStep,
    isComplete,
    nextStep,
    previousStep,
    goToStep,
    completeOnboarding,
    userResponses
  } = useOnboarding();
  
  const [isAnimating, setIsAnimating] = useState(false);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  
  useEffect(() => {
    // Suivre l'avancement pour les analytics
    console.log(`Viewing step ${currentStepIndex + 1}/${steps.length}: ${currentStep?.title}`);
  }, [currentStepIndex, steps.length, currentStep]);
  
  if (!currentStep) return null;
  
  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          key={`onboarding-step-${currentStepIndex}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 20 }}
          className="w-full max-w-2xl"
          onAnimationStart={() => setIsAnimating(true)}
          onAnimationComplete={() => setIsAnimating(false)}
        >
          <Card className="overflow-hidden shadow-xl border-primary/20">
            {/* Header with progress bar */}
            <CardHeader className="pb-2 relative">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">{currentStep.title}</CardTitle>
                {onClose && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute top-2 right-2"
                    aria-label="Fermer la formation"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <CardDescription>{currentStep.description}</CardDescription>
              <Progress value={progress} className="mt-2 h-1" aria-label={`Progression: ${Math.round(progress)}%`} />
              <div className="text-xs text-muted-foreground mt-1">
                Étape {currentStepIndex + 1} sur {steps.length}
              </div>
            </CardHeader>

            {/* Content based on step type */}
            <CardContent className="pt-4 pb-6 min-h-[200px]">
              {currentStep.type === 'quiz' && currentStep.quiz && (
                <OnboardingQuizStep 
                  question={currentStep.quiz.question}
                  options={currentStep.quiz.options}
                  stepId={currentStep.id}
                />
              )}
              
              {currentStep.type === 'form' && currentStep.form && (
                <OnboardingFormStep
                  fields={currentStep.form.fields}
                  stepId={currentStep.id}
                />
              )}
              
              {(currentStep.type === 'info' || currentStep.type === 'welcome') && (
                <div className="prose dark:prose-invert max-w-none">
                  {currentStep.content || currentStep.description}
                </div>
              )}
              
              {currentStep.type === 'completion' && (
                <div className="text-center p-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                    transition={{ delay: 0.3, type: "spring", damping: 10 }}
                    className="inline-block mb-4"
                  >
                    <CheckCircle size={60} className="text-green-500 mx-auto" />
                  </motion.div>
                  <p className="text-lg mt-4">Vous avez terminé votre formation !</p>
                </div>
              )}
            </CardContent>

            {/* Navigation buttons */}
            <CardFooter className="flex justify-between pt-2 border-t">
              <div>
                {currentStepIndex > 0 && (
                  <Button
                    variant="ghost"
                    onClick={previousStep}
                    disabled={isAnimating}
                    className="flex items-center gap-1"
                    aria-label="Précédent"
                  >
                    <ChevronLeft size={16} /> Précédent
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                {showSkip && !currentStep.isRequired && currentStepIndex < steps.length - 1 && (
                  <Button
                    variant="outline"
                    onClick={nextStep}
                    disabled={isAnimating}
                    aria-label="Passer cette étape"
                  >
                    Passer
                  </Button>
                )}
                
                {currentStepIndex < steps.length - 1 ? (
                  <Button
                    onClick={nextStep}
                    disabled={
                      isAnimating || 
                      (currentStep.type === 'quiz' && currentStep.quiz && 
                        !userResponses[currentStep.id])
                    }
                    className="flex items-center gap-1"
                    aria-label="Suivant"
                  >
                    Suivant <ChevronRight size={16} />
                  </Button>
                ) : (
                  <Button
                    onClick={completeOnboarding}
                    disabled={isAnimating}
                    className="bg-green-600 hover:bg-green-700"
                    aria-label="Terminer"
                  >
                    Terminer
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OnboardingModal;
