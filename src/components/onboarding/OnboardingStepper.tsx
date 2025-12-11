// @ts-nocheck
import React from 'react';
import { Check, Circle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface Step {
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface OnboardingStepperProps {
  currentStep: number;
  totalSteps?: number;
  steps?: Step[];
  variant?: 'default' | 'compact' | 'vertical';
  showLabels?: boolean;
  showProgress?: boolean;
  onStepClick?: (step: number) => void;
  allowNavigation?: boolean;
}

const defaultSteps: Step[] = [
  { label: 'Bienvenue', description: 'Découvrez EmotionsCare' },
  { label: 'Profil', description: 'Configurez votre compte' },
  { label: 'Objectifs', description: 'Définissez vos objectifs' },
  { label: 'Préférences', description: 'Personnalisez l\'expérience' },
  { label: 'Notifications', description: 'Configurez les alertes' },
  { label: 'Terminé', description: 'Prêt à commencer !' },
];

export const OnboardingStepper: React.FC<OnboardingStepperProps> = ({ 
  currentStep, 
  totalSteps,
  steps = defaultSteps,
  variant = 'default',
  showLabels = true,
  showProgress = true,
  onStepClick,
  allowNavigation = false,
}) => {
  const stepsToUse = totalSteps ? Array.from({ length: totalSteps }, (_, i) => ({ 
    label: `Étape ${i + 1}`, 
    description: '' 
  })) : steps;
  
  const progress = ((currentStep - 1) / (stepsToUse.length - 1)) * 100;

  const handleStepClick = (stepNum: number) => {
    if (allowNavigation && onStepClick && stepNum <= currentStep) {
      onStepClick(stepNum);
    }
  };

  if (variant === 'compact') {
    return (
      <TooltipProvider>
        <nav aria-label="Progression de l'accueil" className="mb-6">
          <div className="flex items-center justify-center gap-2">
            {stepsToUse.map((step, index) => {
              const stepNum = index + 1;
              const isCompleted = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;
              
              return (
                <Tooltip key={stepNum}>
                  <TooltipTrigger asChild>
                    <motion.button
                      type="button"
                      onClick={() => handleStepClick(stepNum)}
                      disabled={!allowNavigation || stepNum > currentStep}
                      className={cn(
                        "w-3 h-3 rounded-full transition-all",
                        isCompleted && "bg-primary",
                        isCurrent && "bg-primary/50 ring-2 ring-primary ring-offset-2",
                        !isCompleted && !isCurrent && "bg-muted",
                        allowNavigation && stepNum <= currentStep && "cursor-pointer hover:scale-125"
                      )}
                      whileHover={allowNavigation && stepNum <= currentStep ? { scale: 1.3 } : {}}
                      aria-current={isCurrent ? 'step' : undefined}
                      aria-label={`${step.label}${isCompleted ? ' (complété)' : isCurrent ? ' (actuel)' : ''}`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{step.label}</p>
                    {step.description && (
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
          {showProgress && (
            <p className="text-center text-xs text-muted-foreground mt-2">
              Étape {currentStep} sur {stepsToUse.length}
            </p>
          )}
        </nav>
      </TooltipProvider>
    );
  }

  if (variant === 'vertical') {
    return (
      <TooltipProvider>
        <nav aria-label="Progression de l'accueil" className="mb-8">
          <ol className="space-y-4">
            {stepsToUse.map((step, index) => {
              const stepNum = index + 1;
              const isCompleted = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;
              
              return (
                <motion.li 
                  key={stepNum}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <motion.button
                    type="button"
                    onClick={() => handleStepClick(stepNum)}
                    disabled={!allowNavigation || stepNum > currentStep}
                    className={cn(
                      "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                      isCompleted && "bg-primary text-primary-foreground",
                      isCurrent && "bg-primary/20 text-primary border-2 border-primary",
                      !isCompleted && !isCurrent && "bg-muted text-muted-foreground",
                      allowNavigation && stepNum <= currentStep && "cursor-pointer hover:scale-110"
                    )}
                    whileHover={allowNavigation && stepNum <= currentStep ? { scale: 1.1 } : {}}
                    whileTap={allowNavigation && stepNum <= currentStep ? { scale: 0.95 } : {}}
                    aria-current={isCurrent ? 'step' : undefined}
                  >
                    <AnimatePresence mode="wait">
                      {isCompleted ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check className="w-5 h-5" />
                        </motion.div>
                      ) : isCurrent ? (
                        <motion.div
                          key="current"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <Sparkles className="w-5 h-5" />
                        </motion.div>
                      ) : (
                        <span key="number">{stepNum}</span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                  
                  <div className={cn(
                    "pt-2 transition-opacity",
                    !isCurrent && !isCompleted && "opacity-50"
                  )}>
                    <p className={cn(
                      "font-medium",
                      isCurrent && "text-primary"
                    )}>
                      {step.label}
                    </p>
                    {step.description && (
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </nav>
      </TooltipProvider>
    );
  }

  // Default horizontal variant
  return (
    <TooltipProvider>
      <nav aria-label="Progression de l'accueil" className="mb-8">
        {/* Progress bar */}
        {showProgress && (
          <div className="mb-4">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <p className="text-center text-xs text-muted-foreground mt-2">
              {Math.round(progress)}% complété
            </p>
          </div>
        )}

        <ol className="flex items-center justify-center space-x-2">
          {stepsToUse.map((step, index) => {
            const stepNum = index + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            
            return (
              <li key={stepNum} className="flex items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      type="button"
                      onClick={() => handleStepClick(stepNum)}
                      disabled={!allowNavigation || stepNum > currentStep}
                      className={cn(
                        "w-10 h-10 rounded-full flex flex-col items-center justify-center text-sm font-medium transition-all",
                        isCompleted && "bg-primary text-primary-foreground",
                        isCurrent && "bg-primary/20 text-primary border-2 border-primary",
                        !isCompleted && !isCurrent && "bg-muted text-muted-foreground",
                        allowNavigation && stepNum <= currentStep && "cursor-pointer hover:scale-110"
                      )}
                      whileHover={allowNavigation && stepNum <= currentStep ? { scale: 1.1 } : {}}
                      whileTap={allowNavigation && stepNum <= currentStep ? { scale: 0.95 } : {}}
                      aria-current={isCurrent ? 'step' : undefined}
                      aria-label={`${step.label}${isCompleted ? ' (complété)' : isCurrent ? ' (actuel)' : ''}`}
                    >
                      <AnimatePresence mode="wait">
                        {isCompleted ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ type: 'spring', stiffness: 500 }}
                          >
                            <Check className="w-5 h-5" />
                          </motion.div>
                        ) : isCurrent ? (
                          <motion.div
                            key="current"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                            >
                              {step.icon || stepNum}
                            </motion.div>
                          </motion.div>
                        ) : (
                          <motion.span
                            key="number"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            {stepNum}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{step.label}</p>
                    {step.description && (
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    )}
                  </TooltipContent>
                </Tooltip>
                
                {index < stepsToUse.length - 1 && (
                  <motion.div 
                    className={cn(
                      "w-8 h-0.5 ml-2 transition-colors",
                      isCompleted ? "bg-primary" : "bg-muted"
                    )}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: index * 0.1 }}
                  />
                )}
              </li>
            );
          })}
        </ol>

        {/* Labels below (optional) */}
        {showLabels && (
          <div className="flex justify-between mt-4 px-4">
            {stepsToUse.map((step, index) => {
              const stepNum = index + 1;
              const isCurrent = stepNum === currentStep;
              
              return (
                <motion.div
                  key={stepNum}
                  className={cn(
                    "text-center flex-1",
                    !isCurrent && "opacity-50"
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isCurrent ? 1 : 0.5, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <p className={cn(
                    "text-xs font-medium truncate",
                    isCurrent && "text-primary"
                  )}>
                    {step.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}
      </nav>
    </TooltipProvider>
  );
};

export default OnboardingStepper;
