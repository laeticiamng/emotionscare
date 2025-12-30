/**
 * Tutorial d'onboarding Ambition Arcade
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Target, Zap, Trophy, Flame, ArrowRight, 
  CheckCircle, Sparkles, X 
} from 'lucide-react';

interface OnboardingTutorialProps {
  onComplete: () => void;
  onSkip?: () => void;
}

const STEPS = [
  {
    icon: Target,
    title: 'Créez vos objectifs',
    description: 'Définissez des ambitions claires que vous souhaitez atteindre. L\'IA peut vous aider à les structurer en quêtes.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Zap,
    title: 'Complétez des quêtes',
    description: 'Chaque objectif est divisé en quêtes réalisables. Gagnez de l\'XP à chaque quête accomplie.',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    icon: Trophy,
    title: 'Collectez des artefacts',
    description: 'Débloquez des artefacts rares en terminant vos objectifs. Plus la difficulté est haute, plus ils sont précieux.',
    color: 'text-info',
    bgColor: 'bg-info/10',
  },
  {
    icon: Flame,
    title: 'Maintenez votre streak',
    description: 'Restez régulier pour construire votre streak. Les bonus de milestone récompensent votre constance.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
];

export const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ 
  onComplete, 
  onSkip 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const step = STEPS[currentStep];
  const Icon = step.icon;
  const isLast = currentStep === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-md shadow-2xl border-primary/20">
        <CardContent className="p-6">
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-semibold">Bienvenue !</span>
            </div>
            {onSkip && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={onSkip}
                aria-label="Passer le tutoriel"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Progress */}
          <Progress value={progress} className="h-1 mb-6" />

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className={`w-20 h-20 mx-auto rounded-full ${step.bgColor} flex items-center justify-center mb-6`}
              >
                <Icon className={`w-10 h-10 ${step.color}`} />
              </motion.div>

              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground mb-6">{step.description}</p>

              {/* Step indicators */}
              <div className="flex justify-center gap-2 mb-6">
                {STEPS.map((_, idx) => (
                  <motion.div
                    key={idx}
                    initial={false}
                    animate={{
                      width: idx === currentStep ? 24 : 8,
                      backgroundColor: idx <= currentStep 
                        ? 'hsl(var(--primary))' 
                        : 'hsl(var(--muted))'
                    }}
                    className="h-2 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                onClick={handlePrev}
                className="flex-1"
              >
                Précédent
              </Button>
            )}
            <Button 
              onClick={handleNext}
              className="flex-1 gap-2"
            >
              {isLast ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Commencer
                </>
              ) : (
                <>
                  Suivant
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OnboardingTutorial;
