import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { UserPreferences } from '@/types/preferences';
import { Theme, FontSize, FontFamily } from '@/contexts/ThemeContext';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updateUser, isLoading } = useAuth();
  const { userMode, setUserMode } = useUserMode();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light' as Theme,
    language: 'fr',
    fontSize: 'medium' as FontSize,
    fontFamily: 'inter' as FontFamily,
    notifications: true,
    privacyLevel: 'private',
    soundEnabled: true,
    onboardingCompleted: false,
    dashboardLayout: 'standard'
  });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);

  const handleModeSelect = (mode: string) => {
    // compatible avec les anciens types et les nouveaux
    if (mode === 'personal' || mode === 'b2c' || mode === 'b2b-collaborator' || mode === 'b2b-admin') {
      setUserMode(mode);
      navigate('/onboarding-experience');
    } else {
      toast({
        title: 'Mode non valide',
        description: 'Veuillez sélectionner un mode valide',
        variant: 'destructive'
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const updatedPreferences: UserPreferences = {
        ...preferences,
        onboardingCompleted: true
      };

      await updateUser({
        ...user,
        name,
        onboarded: true,
        preferences: updatedPreferences
      });

      toast({
        title: 'Onboarding terminé',
        description: 'Vos préférences ont été enregistrées'
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder vos préférences',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold text-center mb-6">Bienvenue sur EmotionsCare</h1>
            <p className="text-center mb-8">Comment souhaitez-vous vous présenter ?</p>
            
            <div className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              
              <Button 
                onClick={() => setStep(2)} 
                className="w-full"
                disabled={!name.trim()}
              >
                Continuer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold text-center mb-6">Choisissez votre expérience</h1>
            <p className="text-center mb-8">Comment souhaitez-vous utiliser EmotionsCare ?</p>
            
            <div className="space-y-4">
              <Button 
                onClick={() => handleModeSelect('b2c')}
                className="w-full mb-4"
              >
                Utilisation personnelle
              </Button>
              
              <Button 
                onClick={() => handleModeSelect('b2b-collaborator')}
                className="w-full mb-4"
                variant="outline"
              >
                Au sein de mon entreprise
              </Button>
              
              <Button 
                onClick={() => handleModeSelect('b2b-admin')}
                className="w-full"
                variant="secondary"
              >
                En tant qu'administrateur d'organisation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default OnboardingPage;
