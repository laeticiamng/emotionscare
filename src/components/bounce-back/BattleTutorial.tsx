/**
 * BattleTutorial - Guide d'onboarding pour nouveaux utilisateurs
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Heart, 
  Zap, 
  Target, 
  ChevronRight, 
  ChevronLeft,
  X,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface BattleTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

const TUTORIAL_STEPS = [
  {
    icon: Shield,
    title: 'Bienvenue dans Bounce-Back Battle !',
    description: 'Entraînez votre résilience émotionnelle en affrontant des vagues de stimuli stressants virtuels.',
    tips: [
      'Un environnement sûr pour pratiquer la gestion du stress',
      'Développez des réflexes de coping efficaces',
      'Suivez votre progression au fil du temps'
    ],
    color: 'text-primary'
  },
  {
    icon: Zap,
    title: 'Les Stimuli',
    description: 'Des notifications, emails et deadlines virtuelles apparaissent pendant la bataille.',
    tips: [
      '📧 Emails urgents - Cliquez pour les gérer calmement',
      '🔔 Notifications - Apprenez à les prioriser',
      '⏰ Deadlines - Restez calme sous pression'
    ],
    color: 'text-warning'
  },
  {
    icon: Heart,
    title: 'Le Calm Boost',
    description: 'Vous disposez de 2 "Calm Boosts" par bataille pour une pause de 20 secondes.',
    tips: [
      'Utilisez-le quand le stress monte',
      'Profitez pour respirer profondément',
      'La bataille reprend automatiquement après'
    ],
    color: 'text-info'
  },
  {
    icon: Target,
    title: 'Marquez des points',
    description: 'Gérez rapidement les stimuli pour accumuler des combos et maximiser votre score.',
    tips: [
      'Réponse rapide = bonus de combo',
      'Mode Challenge = x2 XP',
      'Complétez le debrief pour des conseils personnalisés'
    ],
    color: 'text-success'
  },
  {
    icon: Sparkles,
    title: 'Prêt à commencer !',
    description: 'Choisissez votre mode et lancez votre première bataille.',
    tips: [
      '🟢 Rapide (1m30) - Parfait pour débuter',
      '🔵 Standard (3 min) - Équilibré',
      '🟣 Zen (4 min) - Rythme calme',
      '🔴 Challenge (5 min) - Pour les experts'
    ],
    color: 'text-primary'
  }
];

export const BattleTutorial: React.FC<BattleTutorialProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const step = TUTORIAL_STEPS[currentStep];
  const Icon = step.icon;
  const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full relative">
        {/* Skip button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={onSkip}
          aria-label="Passer le tutoriel"
        >
          <X className="w-4 h-4" />
        </Button>

        <CardHeader>
          <Progress value={progress} className="h-1 mb-4" aria-label={`Étape ${currentStep + 1} sur ${TUTORIAL_STEPS.length}`} />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
                className={`p-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-4`}
              >
                <Icon className={`w-10 h-10 ${step.color}`} aria-hidden="true" />
              </motion.div>
              
              <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
              <CardDescription className="text-base">{step.description}</CardDescription>
            </motion.div>
          </AnimatePresence>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            <motion.ul
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3 mb-6"
            >
              {step.tips.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>{tip}</span>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>

          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </Button>
            
            <div className="flex gap-1">
              {TUTORIAL_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <Button onClick={handleNext} className="gap-1">
              {isLastStep ? 'Commencer' : 'Suivant'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
