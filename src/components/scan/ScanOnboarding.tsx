
import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { logger } from '@/lib/logger';
import { scanAnalytics } from '@/lib/analytics/scanEvents';
import { useScanSettings } from '@/hooks/useScanSettings';

interface OnboardingStep {
  title: string;
  description: string;
  illustration: string;
}

const STEPS: OnboardingStep[] = [
  {
    title: 'Bienvenue sur le Scanner Émotionnel',
    description: 'Mesurez votre état émotionnel en temps réel avec deux modes : curseurs sensoriels ou analyse faciale par caméra.',
    illustration: '🎭',
  },
  {
    title: 'Valence et Arousal',
    description: 'La valence mesure votre ressenti (ombre à lumière), l\'arousal mesure votre niveau d\'activation (calme à énergique). Ensemble, ils décrivent votre état émotionnel.',
    illustration: '📊',
  },
  {
    title: 'Confidentialité renforcée',
    description: 'Vos données restent privées. Vous choisissez si vous souhaitez les enregistrer pour un suivi dans le temps. Aucune image vidéo n\'est jamais stockée.',
    illustration: '🔒',
  },
];

interface ScanOnboardingProps {
  onComplete: () => void;
}

export const ScanOnboarding: React.FC<ScanOnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { completeOnboarding } = useScanSettings();

  useEffect(() => {
    logger.info('[Onboarding] Scan onboarding started', {}, 'UI');
    scanAnalytics.onboardingStarted();
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
    completeOnboarding();
    logger.info('[Onboarding] Scan onboarding completed', {}, 'UI');
    scanAnalytics.onboardingCompleted(STEPS.length);
    onComplete();
  };

  const handleSkip = () => {
    completeOnboarding();
    logger.info('[Onboarding] Scan onboarding skipped', {}, 'UI');
    scanAnalytics.onboardingSkipped(currentStep + 1, STEPS.length);
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

// Hook-based check - used externally
export const useShouldShowOnboarding = () => {
  const { onboardingCompleted, isLoading } = useScanSettings();
  return { shouldShow: !isLoading && !onboardingCompleted, isLoading };
};

// Fallback for non-hook contexts
export const shouldShowOnboarding = (): boolean => {
  return !localStorage.getItem('scan-onboarding-completed');
};
