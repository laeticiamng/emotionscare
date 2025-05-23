
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Check, ArrowRight, Smile, Brain, Heart } from 'lucide-react';

const steps = [
  {
    id: 'welcome',
    title: 'Bienvenue sur EmotionsCare',
    description: 'Nous sommes ravis de vous accompagner dans votre parcours de bien-être émotionnel.',
    icon: <Smile className="h-8 w-8 text-primary" />
  },
  {
    id: 'objectives',
    title: 'Vos objectifs',
    description: 'Définissez vos objectifs de bien-être émotionnel pour une expérience personnalisée.',
    icon: <Brain className="h-8 w-8 text-primary" />
  },
  {
    id: 'complete',
    title: 'Vous êtes prêt !',
    description: 'Votre profil est configuré et vous pouvez maintenant explorer l\'application.',
    icon: <Heart className="h-8 w-8 text-primary" />
  }
];

const B2COnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    setIsLoading(true);
    
    try {
      // Simuler l'enregistrement des préférences d'onboarding
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Configuration terminée', {
        description: 'Bienvenue dans votre espace personnel !'
      });
      
      navigate('/b2c/dashboard');
    } catch (error) {
      console.error('Erreur lors de la finalisation de l\'onboarding:', error);
      toast.error('Une erreur est survenue', {
        description: 'Impossible de finaliser votre configuration.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="border shadow-lg">
          <CardHeader className="text-center pt-8">
            <div className="mx-auto rounded-full bg-primary/10 p-4 mb-4">
              {currentStepData.icon}
            </div>
            <CardTitle className="text-2xl font-bold">{currentStepData.title}</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <div 
                    key={index}
                    className={`h-2 w-10 rounded-full transition-colors ${index <= currentStep ? 'bg-primary' : 'bg-muted'}`}
                  />
                ))}
              </div>
            </div>
            
            <p className="text-center text-muted-foreground">
              {currentStepData.description}
            </p>
            
            {currentStep === 0 && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium mb-2">Bonjour {user?.name || 'utilisateur'} !</p>
                <p className="text-sm text-muted-foreground">
                  Nous allons vous guider à travers quelques étapes rapides pour personnaliser votre expérience.
                </p>
              </div>
            )}
            
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Réduire mon stress quotidien</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Améliorer ma gestion émotionnelle</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Développer ma pleine conscience</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Mieux comprendre mes émotions</span>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="flex items-center justify-center py-8">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-purple-600 animate-pulse blur-sm"></div>
                  <div className="relative bg-background rounded-full p-4">
                    <Check className="h-10 w-10 text-primary" />
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handlePreviousStep}
                disabled={currentStep === 0 || isLoading}
              >
                Retour
              </Button>
              
              <Button
                type="button"
                onClick={handleNextStep}
                disabled={isLoading}
                className="space-x-2"
              >
                {isLoading ? (
                  "Chargement..."
                ) : currentStep === steps.length - 1 ? (
                  <>
                    <span>Terminer</span>
                    <Check className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>Suivant</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2COnboarding;
