import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Heart, 
  BookOpen, 
  Music, 
  Wind, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Check,
  X
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  action?: {
    label: string;
    route: string;
  };
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Bienvenue sur EmotionsCare',
    description: 'Votre compagnon de bien-être émotionnel conçu pour les professionnels de santé.',
    icon: <Sparkles className="h-12 w-12 text-primary" />,
    features: [
      'Analyse émotionnelle en temps réel',
      'Exercices de respiration guidés',
      'Journal vocal et texte',
      'Coach IA personnalisé',
    ],
  },
  {
    id: 'scan',
    title: 'Scan Émotionnel',
    description: 'Identifiez votre état émotionnel en quelques secondes grâce à l\'IA.',
    icon: <Brain className="h-12 w-12 text-primary" />,
    features: [
      'Analyse par caméra ou texte',
      'Détection multi-émotions',
      'Historique et tendances',
      'Conseils personnalisés',
    ],
    action: {
      label: 'Essayer le scan',
      route: '/app/scan',
    },
  },
  {
    id: 'breath',
    title: 'Exercices de Respiration',
    description: 'Retrouvez le calme avec des techniques de respiration scientifiquement validées.',
    icon: <Wind className="h-12 w-12 text-primary" />,
    features: [
      'Patterns 4-7-8, Carré, Énergisant',
      'Animation visuelle synchronisée',
      'Suivi de vos streaks',
      'Statistiques détaillées',
    ],
    action: {
      label: 'Commencer à respirer',
      route: '/app/breath',
    },
  },
  {
    id: 'journal',
    title: 'Journal Émotionnel',
    description: 'Exprimez-vous par écrit ou à la voix, et laissez l\'IA enrichir vos réflexions.',
    icon: <BookOpen className="h-12 w-12 text-primary" />,
    features: [
      'Saisie vocale ou texte',
      'Analyse IA automatique',
      'Prompts guidés quotidiens',
      'Export RGPD de vos données',
    ],
    action: {
      label: 'Ouvrir le journal',
      route: '/app/journal',
    },
  },
  {
    id: 'coach',
    title: 'Coach IA Nyvée',
    description: 'Un accompagnement bienveillant et personnalisé, disponible 24h/24.',
    icon: <Heart className="h-12 w-12 text-destructive" />,
    features: [
      'Conversation empathique',
      'Techniques TCC intégrées',
      'Voix naturelle (ElevenLabs)',
      'Mémoire contextuelle',
    ],
    action: {
      label: 'Parler au coach',
      route: '/app/coach',
    },
  },
  {
    id: 'music',
    title: 'Musicothérapie',
    description: 'Des morceaux générés par IA pour accompagner chaque émotion.',
    icon: <Music className="h-12 w-12 text-accent-foreground" />,
    features: [
      'Génération personnalisée',
      'Playlists selon l\'humeur',
      'Ambiances relaxantes',
      'Historique d\'écoute',
    ],
    action: {
      label: 'Explorer la musique',
      route: '/app/music',
    },
  },
];

interface OnboardingTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ 
  onComplete, 
  onSkip 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const step = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, step.id]));
    
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'Escape') {
        onSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <Card className="w-full max-w-2xl mx-4 shadow-2xl">
        <CardHeader className="relative">
          {/* Skip button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="absolute top-4 right-4"
            aria-label="Passer le tutoriel"
          >
            <X className="h-4 w-4 mr-1" />
            Passer
          </Button>

          {/* Progress */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Étape {currentStep + 1} sur {ONBOARDING_STEPS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-2 mb-4">
            {ONBOARDING_STEPS.map((s, index) => (
              <button
                key={s.id}
                onClick={() => handleStepClick(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-primary w-6'
                    : completedSteps.has(s.id)
                    ? 'bg-primary/50'
                    : 'bg-muted'
                }`}
                aria-label={`Aller à l'étape ${index + 1}`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Icon and title */}
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex p-4 rounded-full bg-muted"
                >
                  {step.icon}
                </motion.div>
                
                <div>
                  <CardTitle className="text-2xl">{step.title}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {step.description}
                  </CardDescription>
                </div>
              </div>

              {/* Features list */}
              <ul className="space-y-3">
                {step.features.map((feature, index) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Action button (optional) */}
              {step.action && (
                <div className="text-center pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Navigate to the feature
                      window.location.href = step.action!.route;
                    }}
                  >
                    {step.action.label}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-4 border-t">
            <Button
              variant="ghost"
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
                  <Sparkles className="h-4 w-4 ml-1" />
                </>
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
    </div>
  );
};

export default OnboardingTutorial;
