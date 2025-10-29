// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { logger } from '@/lib/logger';

const ONBOARDING_STORAGE_KEY = 'scan-onboarding-completed';

interface OnboardingStep {
  title: string;
  description: string;
  illustration: string;
}

const STEPS: OnboardingStep[] = [
  {
    title: 'Bienvenue sur le Scanner Émotionnel',
    description: 'Découvrez comment mesurer votre état émotionnel en temps réel, de manière simple et respectueuse de votre vie privée.',
    illustration: '🎭',
  },
  {
    title: 'Deux modes de scan',
    description: 'Utilisez les curseurs sensoriels pour un ajustement manuel, ou activez la caméra pour une analyse automatique de vos micro-expressions faciales.',
    illustration: '🎚️',
  },
  {
    title: 'Valence et Arousal',
    description: 'La valence mesure votre ressenti (ombre à lumière), l\'arousal mesure votre niveau d\'activation (calme à énergique). Ensemble, ils décrivent votre état émotionnel.',
    illustration: '📊',
  },
  {
    title: 'Confidentialité garantie',
    description: 'Vos données restent privées. Vous choisissez si vous souhaitez les enregistrer pour un suivi dans le temps. Aucune image vidéo n\'est jamais stockée.',
    illustration: '🔒',
  },
];

interface ScanOnboardingProps {
  onComplete: () => void;
}

export const ScanOnboarding: React.FC<ScanOnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    logger.info('[Onboarding] Scan onboarding started', {}, 'UI');
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    logger.info('[Onboarding] Scan onboarding completed', {}, 'UI');
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    logger.info('[Onboarding] Scan onboarding skipped', {}, 'UI');
    onComplete();
  };

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-2xl">{step.title}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSkip}
              aria-label="Fermer le tutoriel"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <div className="text-8xl">{step.illustration}</div>
          </div>
          <p className="text-center text-muted-foreground leading-relaxed">
            {step.description}
          </p>
          <div className="flex justify-center gap-2">
            {STEPS.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Précédent
          </Button>
          <Button onClick={handleNext}>
            {isLastStep ? (
              <>
                Commencer
                <Check className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                Suivant
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export const shouldShowOnboarding = (): boolean => {
  return !localStorage.getItem(ONBOARDING_STORAGE_KEY);
};
