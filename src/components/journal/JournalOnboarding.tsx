import { memo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Mic, Tag, Lock, Share2, CheckCircle2 } from 'lucide-react';

interface JournalOnboardingProps {
  onComplete: () => void;
  onDismiss: () => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: typeof Sparkles;
  tip: string;
}

const steps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Bienvenue dans votre journal émotionnel',
    description: 'Un espace sécurisé pour consigner vos pensées, émotions et réflexions quotidiennes.',
    icon: Sparkles,
    tip: 'Écrivez régulièrement pour mieux comprendre vos émotions et suivre votre évolution.',
  },
  {
    id: 'voice',
    title: 'Écriture vocale',
    description: 'Dictez vos notes à voix haute grâce à la reconnaissance vocale intégrée.',
    icon: Mic,
    tip: 'Parfait pour noter vos pensées rapidement pendant vos déplacements.',
  },
  {
    id: 'tags',
    title: 'Organisation avec les tags',
    description: 'Ajoutez des tags à vos notes pour les retrouver facilement et identifier des patterns.',
    icon: Tag,
    tip: 'Exemples: #gratitude, #anxiété, #objectifs, #réflexion',
  },
  {
    id: 'privacy',
    title: 'Confidentialité et sécurité',
    description: 'Vos notes sont chiffrées et entièrement privées. Vous contrôlez ce qui est partagé.',
    icon: Lock,
    tip: 'Seules les notes que vous envoyez explicitement à votre coach sont partagées.',
  },
  {
    id: 'coach',
    title: 'Partage avec votre coach',
    description: 'Partagez des notes spécifiques avec votre coach pour un accompagnement personnalisé.',
    icon: Share2,
    tip: 'Cliquez sur "Envoyer au coach" sur une note pour la partager.',
  },
];

/**
 * Dialogue d'onboarding interactif pour le journal
 */
export const JournalOnboarding = memo<JournalOnboardingProps>(({ onComplete, onDismiss }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const progress = ((currentStep + 1) / steps.length) * 100;
  const step = steps[currentStep];
  const Icon = step.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onDismiss();
  };

  return (
    <Dialog open onOpenChange={handleSkip}>
      <DialogContent className="sm:max-w-[600px]" aria-describedby="onboarding-description">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Découvrez votre journal
          </DialogTitle>
          <DialogDescription id="onboarding-description">
            Étape {currentStep + 1} sur {steps.length}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Progress value={progress} className="h-2" />

          <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-muted/20">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-primary/10">
                  <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
              </div>

              <p className="text-base text-muted-foreground leading-relaxed">
                {step.description}
              </p>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex gap-2">
                  <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-sm mb-1">Astuce</p>
                    <p className="text-sm text-muted-foreground">{step.tip}</p>
                  </div>
                </div>
              </div>

              {currentStep === steps.length - 1 && (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Vous êtes prêt à commencer !</span>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-muted-foreground"
            >
              Passer
            </Button>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevious}>
                  Précédent
                </Button>
              )}
              <Button onClick={handleNext}>
                {currentStep === steps.length - 1 ? 'Commencer' : 'Suivant'}
              </Button>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-primary w-8'
                    : index < currentStep
                    ? 'bg-primary/50'
                    : 'bg-muted'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

JournalOnboarding.displayName = 'JournalOnboarding';
