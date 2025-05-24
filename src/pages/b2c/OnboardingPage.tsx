
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, Music, Target, Sparkles } from 'lucide-react';

interface OnboardingData {
  goals: string[];
  musicPreferences: {
    genres: string[];
    tempo: number;
  };
  notifications: boolean;
}

const B2COnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    goals: [],
    musicPreferences: {
      genres: [],
      tempo: 50,
    },
    notifications: true,
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalSteps = 3;

  const goals = [
    { id: 'stress', label: 'Réduire le stress', icon: '🧘‍♀️' },
    { id: 'sleep', label: 'Améliorer le sommeil', icon: '😴' },
    { id: 'focus', label: 'Augmenter la concentration', icon: '🎯' },
    { id: 'mood', label: 'Améliorer l\'humeur', icon: '😊' },
    { id: 'anxiety', label: 'Gérer l\'anxiété', icon: '🌱' },
    { id: 'productivity', label: 'Être plus productif', icon: '⚡' },
  ];

  const musicGenres = [
    { id: 'ambient', label: 'Ambient' },
    { id: 'classical', label: 'Classique' },
    { id: 'nature', label: 'Sons de la nature' },
    { id: 'meditation', label: 'Méditation' },
    { id: 'electronic', label: 'Électronique douce' },
    { id: 'acoustic', label: 'Acoustique' },
  ];

  const handleGoalToggle = (goalId: string) => {
    setOnboardingData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(id => id !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const handleGenreToggle = (genreId: string) => {
    setOnboardingData(prev => ({
      ...prev,
      musicPreferences: {
        ...prev.musicPreferences,
        genres: prev.musicPreferences.genres.includes(genreId)
          ? prev.musicPreferences.genres.filter(id => id !== genreId)
          : [...prev.musicPreferences.genres, genreId]
      }
    }));
  };

  const handleTempoChange = (value: number[]) => {
    setOnboardingData(prev => ({
      ...prev,
      musicPreferences: {
        ...prev.musicPreferences,
        tempo: value[0]
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Update user profile with onboarding data
      const { error } = await supabase
        .from('profiles')
        .update({
          preferences: {
            ...onboardingData,
            onboarding_completed: true,
          }
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Onboarding terminé !",
        description: "Votre profil a été configuré avec succès.",
      });

      navigate('/b2c/dashboard');
    } catch (error) {
      console.error('Erreur lors de la finalisation de l\'onboarding:', error);
      toast({
        title: "Erreur",
        description: "Impossible de finaliser l'onboarding",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true; // Welcome step
      case 2:
        return onboardingData.goals.length > 0;
      case 3:
        return onboardingData.musicPreferences.genres.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl mb-4">Configuration de votre profil</CardTitle>
          
          {/* Progress Stepper */}
          <div className="flex justify-center mb-6">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    i + 1 <= currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {i + 1 < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                {i < totalSteps - 1 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      i + 1 < currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            {/* Step 1: Welcome */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center space-y-6"
              >
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Bienvenue sur EmotionsCare !</h3>
                <p className="text-muted-foreground">
                  Nous allons personnaliser votre expérience en quelques étapes simples.
                  Cela ne prendra que 2 minutes.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    ✨ Votre essai gratuit de 3 jours est déjà activé !
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 2: Goals */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Vos objectifs</h3>
                  <p className="text-muted-foreground">
                    Quels sont vos principaux objectifs de bien-être ? (Sélectionnez-en au moins un)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {goals.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => handleGoalToggle(goal.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        onboardingData.goals.includes(goal.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{goal.icon}</span>
                        <span className="font-medium">{goal.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Music Preferences */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Music className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Préférences musicales</h3>
                  <p className="text-muted-foreground">
                    Aidez-nous à personnaliser votre musique de bien-être
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      Types de musique préférés
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {musicGenres.map((genre) => (
                        <button
                          key={genre.id}
                          onClick={() => handleGenreToggle(genre.id)}
                          className={`p-3 rounded-lg border-2 transition-all text-left ${
                            onboardingData.musicPreferences.genres.includes(genre.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-muted hover:border-primary/50'
                          }`}
                        >
                          <span className="font-medium">{genre.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      Tempo préféré: {onboardingData.musicPreferences.tempo < 30 ? 'Lent' : 
                        onboardingData.musicPreferences.tempo < 70 ? 'Modéré' : 'Énergique'}
                    </Label>
                    <Slider
                      value={[onboardingData.musicPreferences.tempo]}
                      onValueChange={handleTempoChange}
                      max={100}
                      min={0}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Relaxant</span>
                      <span>Énergisant</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Retour
            </Button>
            
            <Button
              onClick={nextStep}
              disabled={!canProceed() || isLoading}
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                  />
                  Finalisation...
                </>
              ) : currentStep === totalSteps ? (
                'Terminer'
              ) : (
                'Suivant'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2COnboardingPage;
