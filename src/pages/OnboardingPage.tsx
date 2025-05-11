
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/use-toast';
import { FontFamily, FontSize, ThemeName, UserPreferences } from '@/types/user';

const steps = [
  { id: 'welcome', title: 'Bienvenue', description: 'Bienvenue sur notre plateforme de bien-être émotionnel' },
  { id: 'preferences', title: 'Préférences', description: 'Personnalisez votre expérience' },
  { id: 'goals', title: 'Objectifs', description: 'Définissez vos objectifs de bien-être' },
  { id: 'complete', title: 'Terminé', description: 'Vous êtes prêt à commencer' },
];

const OnboardingPage: React.FC = () => {
  const { user, updateUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light' as ThemeName,
    language: 'fr',
    fontSize: 'medium' as FontSize,
    fontFamily: 'inter' as FontFamily,
    notifications: true,
  });
  
  const [goals, setGoals] = useState<string[]>([
    'Réduire le stress',
    'Améliorer le sommeil'
  ]);

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        // Update the user profile with onboarding information
        if (user) {
          await updateUser({
            onboarded: true,
            preferences: {
              ...user.preferences,
              ...preferences
            }
          });
        }
        
        toast({
          title: "Onboarding terminé",
          description: "Votre profil a été mis à jour avec succès."
        });
        
        navigate('/dashboard');
      } catch (error) {
        console.error("Error completing onboarding:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la mise à jour de votre profil.",
          variant: "destructive"
        });
      }
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'welcome':
        return (
          <div className="space-y-4">
            <p>Nous sommes ravis de vous accueillir sur notre plateforme dédiée au bien-être émotionnel.</p>
            <p>Suivez ces quelques étapes pour personnaliser votre expérience.</p>
          </div>
        );
      case 'preferences':
        return (
          <div className="space-y-4">
            {/* Préférences UI - simplifié pour l'exemple */}
            <p>Choisissez vos préférences d'interface pour une expérience personnalisée.</p>
          </div>
        );
      case 'goals':
        return (
          <div className="space-y-4">
            <p>Quels sont vos objectifs de bien-être ?</p>
            {/* Sélection d'objectifs - simplifié pour l'exemple */}
          </div>
        );
      case 'complete':
        return (
          <div className="space-y-4 text-center">
            <p className="text-xl">Félicitations !</p>
            <p>Votre profil est configuré et vous êtes prêt à commencer votre parcours de bien-être.</p>
          </div>
        );
      default:
        return <p>Étape inconnue</p>;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Précédent
          </Button>
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingPage;
