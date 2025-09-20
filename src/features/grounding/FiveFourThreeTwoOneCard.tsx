import { useEffect, useMemo, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type GroundingStep = {
  key: string;
  title: string;
  instruction: string;
};

export interface FiveFourThreeTwoOneCardProps {
  className?: string;
  onComplete?: () => void;
}

const steps: GroundingStep[] = [
  {
    key: 'vision',
    title: 'Ancrage visuel',
    instruction: 'Observe autour de toi cinq éléments familiers et laisse-les te rassurer.',
  },
  {
    key: 'touch',
    title: 'Contact rassurant',
    instruction: 'Choisis quatre sensations tactiles douces qui soutiennent ton calme.',
  },
  {
    key: 'sound',
    title: 'Écoute attentive',
    instruction: 'Identifie trois murmures ou sons réconfortants présents dans ton espace.',
  },
  {
    key: 'scent',
    title: 'Souffle aromatique',
    instruction: 'Invite deux fragrances ou souvenirs olfactifs agréables à revenir.',
  },
  {
    key: 'breath',
    title: 'Respiration nourrissante',
    instruction:
      'Prends une inspiration profonde, puis note une saveur, une sensation ou une respiration qui te soutient.',
  },
];

const ordinalLabels = ['une', 'deux', 'trois', 'quatre', 'cinq'];

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(media.matches);

    const listener = (event: MediaQueryListEvent) => {
      setReduced(event.matches);
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  return reduced;
};

const FiveFourThreeTwoOneCard = ({ className, onComplete }: FiveFourThreeTwoOneCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  const currentStep = steps[currentIndex];

  const progressLabel = useMemo(() => {
    const current = ordinalLabels[currentIndex];
    const total = ordinalLabels[ordinalLabels.length - 1];
    return `Étape ${current} sur ${total}`;
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentIndex((index) => index + 1);
      return;
    }

    onComplete?.();
  };

  return (
    <Card
      className={cn(
        'border-indigo-500/60 bg-indigo-900/50 text-indigo-50 shadow-lg backdrop-blur',
        'focus-within:ring-2 focus-within:ring-indigo-200/70',
        reducedMotion ? 'transition-none' : 'transition duration-500 ease-out',
        className
      )}
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-indigo-50">Carte d’ancrage sensoriel</CardTitle>
        <CardDescription
          aria-live="polite"
          role="status"
          className="text-sm text-indigo-200"
          data-testid="grounding-progress"
        >
          {progressLabel}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-indigo-100" aria-live="polite" data-testid="grounding-title">
            {currentStep.title}
          </p>
          <p className="text-sm leading-relaxed text-indigo-100/90" aria-live="polite" data-testid="grounding-instruction">
            {currentStep.instruction}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
          >
            Revenir
          </Button>
          <Button type="button" onClick={handleNext}>
            {currentIndex === steps.length - 1 ? 'Terminer' : 'Continuer'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FiveFourThreeTwoOneCard;
