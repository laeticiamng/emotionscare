// @ts-nocheck

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart } from 'lucide-react';

interface SynthesisOnboardingProps {
  open: boolean;
  onClose: () => void;
}

const SynthesisOnboarding: React.FC<SynthesisOnboardingProps> = ({ open, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: "Bienvenue dans la Synthèse",
      description: "Découvrez une vision complète de votre parcours émotionnel."
    },
    {
      title: "Timeline Émotionnelle",
      description: "Visualisez vos émotions au fil du temps."
    },
    {
      title: "Carte du Monde Émotionnel",
      description: "Explorez la répartition géographique des émotions."
    },
    {
      title: "Sanctuaire",
      description: "Un espace de calme et de bien-être pour vous ressourcer."
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

        <div className="py-4 flex justify-center">
          <BarChart className="h-12 w-12 text-blue-500" />
        </div>
        
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
