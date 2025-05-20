
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { DEFAULT_ONBOARDING_STEPS } from '@/data/onboardingSteps';
import { OnboardingStep } from '@/types/onboarding';
import { Button } from '@/components/ui/button';
import { useUserMode } from '@/contexts/UserModeContext';
import { useOnboarding } from '@/contexts/OnboardingContext';

interface OnboardingModalProps {
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  const { userMode } = useUserMode();
  const [steps, setSteps] = useState<OnboardingStep[]>(DEFAULT_ONBOARDING_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleQuizAnswer = (stepId: string, selectedAnswerId: string) => {
    setResponses(prev => ({
      ...prev,
      [stepId]: selectedAnswerId
    }));
  };

  const isQuizAnswerCorrect = (stepId: string, answerId: string | null) => {
    if (!currentStep.quiz) return false;
    
    const selectedOption = currentStep.quiz.options.find(opt => opt.id === answerId);
    return selectedOption?.isCorrect || false;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-md relative overflow-hidden"
      >
        {/* Progress bar */}
        <div 
          className="h-1 bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
        
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-2 top-2 rounded-full"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Fermer</span>
        </Button>
        
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-2">{currentStep.title}</h2>
              <p className="text-muted-foreground mb-6">{currentStep.description}</p>
              
              {/* Step content based on type */}
              {currentStep.type === 'info' && currentStep.content && (
                <div className="mb-6 p-4 bg-muted rounded-md">
                  {currentStep.content}
                </div>
              )}
              
              {currentStep.type === 'quiz' && currentStep.quiz && (
                <div className="mb-6 space-y-3">
                  <p className="font-medium">{currentStep.quiz.question}</p>
                  
                  <div className="space-y-2">
                    {currentStep.quiz.options.map(option => {
                      const isSelected = responses[currentStep.id] === option.id;
                      const isCorrect = option.isCorrect;
                      
                      // Only show correctness if an answer is selected
                      const showCorrectness = responses[currentStep.id] !== undefined;
                      
                      return (
                        <button
                          key={option.id}
                          className={`w-full text-left p-3 rounded-md border transition-all ${
                            isSelected
                              ? isCorrect
                                ? "border-green-500 bg-green-100 dark:bg-green-900/20"
                                : "border-red-500 bg-red-100 dark:bg-red-900/20"
                              : "border-muted hover:border-primary"
                          }`}
                          onClick={() => handleQuizAnswer(currentStep.id, option.id)}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option.text}</span>
                            
                            {showCorrectness && isSelected && (
                              <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                                {isCorrect ? "✓" : "✗"}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Step actions */}
              <div className="flex justify-between mt-6">
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={currentStepIndex === 0}
                >
                  Précédent
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  {currentStepIndex + 1} / {steps.length}
                </div>
                
                <Button 
                  onClick={handleNext}
                  disabled={
                    // Disable next button if quiz answer is required but not correct
                    currentStep.type === 'quiz' && 
                    currentStep.isRequired &&
                    (!responses[currentStep.id] || !isQuizAnswerCorrect(currentStep.id, responses[currentStep.id]))
                  }
                >
                  {currentStepIndex === steps.length - 1 ? 'Terminer' : 'Suivant'}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingModal;
