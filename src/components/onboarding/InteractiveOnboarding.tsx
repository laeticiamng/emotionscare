// @ts-nocheck

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Sparkles, 
  Target, 
  Heart, 
  Brain,
  Users,
  Zap,
  Crown,
  Star,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  icon: React.ElementType;
  interactive?: boolean;
  required?: boolean;
  validation?: () => boolean;
  tips?: string[];
}

interface OnboardingProps {
  steps: OnboardingStep[];
  onComplete: (userData: any) => void;
  onSkip?: () => void;
  allowSkip?: boolean;
  theme?: 'default' | 'medical' | 'wellness';
}

/**
 * Système d'onboarding interactif et personnalisé
 */
export const InteractiveOnboarding: React.FC<OnboardingProps> = ({
  steps,
  onComplete,
  onSkip,
  allowSkip = true,
  theme = 'default'
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [userData, setUserData] = useState<Record<string, any>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();
  
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Audio pour l'ambiance (optionnel)
  useEffect(() => {
    if (theme === 'wellness' && audioRef.current) {
      audioRef.current.volume = 0.3;
    }
  }, [theme]);

  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;
  const currentStepData = steps[currentStep];

  const handleNext = useCallback(async () => {
    if (isAnimating) return;
    
    const step = steps[currentStep];
    
    // Validation de l'étape si nécessaire
    if (step.validation && !step.validation()) {
      toast({
        title: "Étape incomplète",
        description: "Veuillez compléter tous les champs requis avant de continuer.",
        variant: "destructive"
      });
      return;
    }

    setIsAnimating(true);
    setCompletedSteps(prev => new Set([...prev, currentStep]));

    // Animation de transition
    setTimeout(() => {
      if (isLastStep) {
        handleComplete();
      } else {
        setCurrentStep(prev => prev + 1);
      }
      setIsAnimating(false);
    }, 300);
  }, [currentStep, steps, isLastStep, isAnimating, toast]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0 && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  }, [currentStep, isAnimating]);

  const handleComplete = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => {
      onComplete(userData);
      toast({
        title: "🎉 Configuration terminée !",
        description: "Bienvenue dans votre espace personnalisé EmotionsCare.",
      });
    }, 1000);
  }, [userData, onComplete, toast]);

  const handleSkip = useCallback(() => {
    if (allowSkip && onSkip) {
      onSkip();
    }
  }, [allowSkip, onSkip]);

  const updateUserData = useCallback((key: string, value: any) => {
    setUserData(prev => ({ ...prev, [key]: value }));
  }, []);

  // Thèmes personnalisés
  const getThemeClasses = () => {
    const themes = {
      default: 'bg-gradient-to-br from-blue-50 to-indigo-100',
      medical: 'bg-gradient-to-br from-green-50 to-teal-100',
      wellness: 'bg-gradient-to-br from-purple-50 to-pink-100'
    };
    return themes[theme];
  };

  const getThemeIcon = () => {
    const icons = {
      default: Sparkles,
      medical: Heart,
      wellness: Brain
    };
    return icons[theme];
  };

  const ThemeIcon = getThemeIcon();

  return (
    <div className={`min-h-screen ${getThemeClasses()} flex items-center justify-center p-4`}>
      {/* Audio d'ambiance */}
      {theme === 'wellness' && (
        <audio ref={audioRef} loop>
          <source src="/audio/gentle-ambient.mp3" type="audio/mpeg" />
        </audio>
      )}

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: -10,
                rotation: 0,
                opacity: 1
              }}
              animate={{
                y: window.innerHeight + 10,
                rotation: 360 * 3,
                opacity: 0
              }}
              transition={{
                duration: 3,
                delay: Math.random() * 2,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}

      <motion.div 
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header avec progress */}
        <div className="mb-8 text-center">
          <motion.div
            className="flex items-center justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
          >
            <div className="p-4 rounded-full bg-primary/10">
              <ThemeIcon className="w-8 h-8 text-primary" />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-3xl font-bold text-foreground mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Configuration personnalisée
          </motion.h1>
          
          <motion.p 
            className="text-muted-foreground mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Personnalisons votre expérience EmotionsCare
          </motion.p>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Étape {currentStep + 1} sur {steps.length}</span>
              <span>{Math.round(progress)}% complété</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Stepper visual */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <motion.div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full
                    transition-all duration-300
                    ${index <= currentStep 
                      ? 'bg-primary text-primary-foreground shadow-lg' 
                      : 'bg-muted text-muted-foreground'
                    }
                    ${index === currentStep ? 'ring-4 ring-primary/30' : ''}
                  `}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: index === currentStep ? 1.1 : 1, 
                    opacity: 1 
                  }}
                  transition={{ delay: index * 0.1 }}
                >
                  {completedSteps.has(index) ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </motion.div>
                
                {index < steps.length - 1 && (
                  <motion.div
                    className={`
                      w-8 h-1 rounded-full transition-colors duration-300
                      ${index < currentStep ? 'bg-primary' : 'bg-muted'}
                    `}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: index < currentStep ? 1 : 0.3 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Contenu de l'étape */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            ref={el => stepRefs.current[currentStep] = el}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-2xl border-0 bg-background/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <currentStepData.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                
                <CardTitle className="text-2xl font-bold">
                  {currentStepData.title}
                </CardTitle>
                
                <p className="text-muted-foreground mt-2">
                  {currentStepData.description}
                </p>

                {currentStepData.required && (
                  <Badge variant="secondary" className="w-fit mx-auto mt-2">
                    <Star className="w-3 h-3 mr-1" />
                    Étape requise
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Contenu interactif de l'étape */}
                <div className="min-h-[200px]">
                  {React.cloneElement(currentStepData.content as React.ReactElement, {
                    userData,
                    updateUserData,
                    onNext: handleNext
                  })}
                </div>

                {/* Tips si disponibles */}
                {currentStepData.tips && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      Conseils
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {currentStepData.tips.map((tip, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-2"
                        >
                          <span className="text-primary mt-1">•</span>
                          {tip}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div 
          className="flex justify-between items-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div>
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={isAnimating}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            {allowSkip && !isLastStep && (
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-muted-foreground"
              >
                Passer pour l'instant
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              disabled={isAnimating || (currentStepData.required && currentStepData.validation && !currentStepData.validation())}
              className="flex items-center gap-2 min-w-[120px]"
            >
              {isAnimating ? (
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  {isLastStep ? 'Terminer' : 'Continuer'}
                  {!isLastStep && <ChevronRight className="w-4 h-4" />}
                  {isLastStep && <Crown className="w-4 h-4" />}
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Audio controls pour le theme wellness */}
        {theme === 'wellness' && (
          <AudioControls audioRef={audioRef} />
        )}
      </motion.div>
    </div>
  );
};

// Composant de contrôle audio
interface AudioControlsProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioControls: React.FC<AudioControlsProps> = ({ audioRef }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.div
      className="fixed bottom-4 left-4 flex gap-2"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={togglePlay}
        className="bg-background/80 backdrop-blur-sm"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={toggleMute}
        className="bg-background/80 backdrop-blur-sm"
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </Button>
    </motion.div>
  );
};

// Étapes d'exemple pour EmotionsCare
export const createEmotionsCareOnboarding = (): OnboardingStep[] => [
  {
    id: 'welcome',
    title: 'Bienvenue dans EmotionsCare',
    description: 'Découvrez une plateforme innovante pour votre bien-être émotionnel',
    icon: Heart,
    content: <WelcomeStep />,
    tips: [
      'Prenez votre temps pour explorer chaque fonctionnalité',
      'Vos données sont sécurisées et privées',
      'Vous pourrez modifier ces réglages plus tard'
    ]
  },
  {
    id: 'profile',
    title: 'Votre profil',
    description: 'Parlez-nous de vous pour personnaliser votre expérience',
    icon: Users,
    content: <ProfileStep />,
    required: true,
    validation: () => true, // Implémentation spécifique
    tips: [
      'Ces informations nous aident à personnaliser vos recommandations',
      'Vous pouvez modifier votre profil à tout moment'
    ]
  },
  {
    id: 'preferences',
    title: 'Vos préférences',
    description: 'Configurez vos préférences de bien-être et notifications',
    icon: Brain,
    content: <PreferencesStep />,
    interactive: true,
    tips: [
      'Choisissez les modules qui vous intéressent le plus',
      'Les notifications vous aideront à maintenir vos habitudes'
    ]
  }
];

// Composants d'étapes (exemples)
const WelcomeStep: React.FC = () => (
  <div className="text-center space-y-4">
    <motion.div
      className="text-6xl"
      animate={{ rotate: [0, 10, -10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      🌟
    </motion.div>
    <p className="text-lg">
      Prêt à commencer votre voyage vers un meilleur bien-être ?
    </p>
  </div>
);

const ProfileStep: React.FC = () => (
  <div className="space-y-4">
    {/* Formulaire de profil */}
    <p>Étape de configuration du profil...</p>
  </div>
);

const PreferencesStep: React.FC = () => (
  <div className="space-y-4">
    {/* Sélection de préférences */}
    <p>Étape de configuration des préférences...</p>
  </div>
);