import { memo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, BookOpen, Bell, Sparkles, Check } from 'lucide-react';

interface JournalOnboardingProps {
  onComplete: () => void;
  onDismiss: () => void;
}

const steps = [
  {
    icon: BookOpen,
    title: 'Bienvenue dans votre journal',
    description: 'Votre espace privé pour consigner vos pensées, émotions et réflexions quotidiennes.',
    tip: 'Commencez simplement en écrivant quelques lignes chaque jour.',
  },
  {
    icon: Sparkles,
    title: 'Suggestions d\'écriture',
    description: 'Des prompts inspirants pour vous guider selon 6 catégories : Réflexion, Gratitude, Objectifs, Émotions, Créativité et Pleine conscience.',
    tip: 'Activez les suggestions dans les paramètres pour obtenir de l\'inspiration.',
  },
  {
    icon: Bell,
    title: 'Rappels personnalisés',
    description: 'Configurez des rappels pour maintenir votre habitude d\'écriture. Choisissez l\'heure et les jours qui vous conviennent.',
    tip: 'Un rappel quotidien à la même heure aide à créer une routine.',
  },
];

/**
 * Composant d'onboarding pour les nouveaux utilisateurs du journal
 */
export const JournalOnboarding = memo<JournalOnboardingProps>(({ onComplete, onDismiss }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation d'entrée
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  return (
    <div 
      className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <Card className="w-full max-w-lg relative animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onDismiss}
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </Button>

        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
          <CardDescription className="text-base mt-2">
            {currentStepData.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Astuce */}
          <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
            <p className="text-sm font-medium flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span><strong>Astuce :</strong> {currentStepData.tip}</span>
            </p>
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-primary'
                    : index < currentStep
                    ? 'w-2 bg-primary/50'
                    : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex-1"
              >
                Précédent
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="flex-1 gap-2"
            >
              {isLastStep ? (
                <>
                  <Check className="h-4 w-4" />
                  Commencer
                </>
              ) : (
                'Suivant'
              )}
            </Button>
          </div>

          {/* Skip option */}
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="text-xs text-muted-foreground"
            >
              Passer le tutoriel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

JournalOnboarding.displayName = 'JournalOnboarding';
