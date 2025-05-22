
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart, Globe, Sun } from 'lucide-react';

interface SynthesisOnboardingProps {
  open: boolean;
  onClose: () => void;
}

interface OnboardingStep {
  title: string;
  description: string;
  image: React.ReactNode;
}

const SynthesisOnboarding: React.FC<SynthesisOnboardingProps> = ({ open, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps: OnboardingStep[] = [
    {
      title: "Bienvenue dans la Synthèse 360°",
      description: "Découvrez une vision complète de votre parcours émotionnel à travers trois vues complémentaires.",
      image: (
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg p-8 flex items-center justify-center">
          <div className="flex items-center gap-6">
            <BarChart className="h-12 w-12 text-blue-500" />
            <Globe className="h-12 w-12 text-indigo-500" />
            <Sun className="h-12 w-12 text-purple-500" />
          </div>
        </div>
      )
    },
    {
      title: "Timeline Émotionnelle",
      description: "Visualisez vos émotions au fil du temps, identifiez les moments clés et les tendances de votre parcours.",
      image: (
        <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-6 flex items-center justify-center">
          <BarChart className="h-16 w-16 text-blue-500" />
        </div>
      )
    },
    {
      title: "Carte du Monde Émotionnel",
      description: "Explorez la répartition géographique des émotions collectives et identifiez les tendances globales.",
      image: (
        <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-6 flex items-center justify-center">
          <Globe className="h-16 w-16 text-indigo-500" />
        </div>
      )
    },
    {
      title: "Sanctuaire",
      description: "Un espace de calme et de bien-être pour vous ressourcer et pratiquer des exercices adaptés à votre état émotionnel.",
      image: (
        <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-6 flex items-center justify-center">
          <Sun className="h-16 w-16 text-purple-500" />
        </div>
      )
    }
  ];
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  if (!open) return null;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{steps[currentStep].title}</DialogTitle>
          <DialogDescription>{steps[currentStep].description}</DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="py-4"
          >
            {steps[currentStep].image}
          </motion.div>
        </AnimatePresence>
        
        <Progress 
          value={((currentStep + 1) / steps.length) * 100} 
          className="h-1 my-2"
        />
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Précédent
          </Button>
          <div className="text-xs text-muted-foreground">
            {currentStep + 1} / {steps.length}
          </div>
          <Button onClick={nextStep}>
            {currentStep === steps.length - 1 ? "Terminer" : "Suivant"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SynthesisOnboarding;
