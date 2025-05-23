
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Heart, Target, Smile, ChevronRight, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OnboardingData {
  goals: string[];
  emotionalNeeds: string;
  preferredActivities: string[];
  personalInfo: {
    age?: number;
    occupation?: string;
  };
}

const B2COnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    goals: [],
    emotionalNeeds: '',
    preferredActivities: [],
    personalInfo: {}
  });

  const totalSteps = 4;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const goals = [
    'Réduire le stress',
    'Améliorer mon humeur',
    'Mieux comprendre mes émotions',
    'Développer la résilience',
    'Améliorer mes relations',
    'Gérer l\'anxiété'
  ];

  const activities = [
    'Méditation guidée',
    'Exercices de respiration',
    'Musicothérapie',
    'Journal émotionnel',
    'Coaching IA',
    'Exercices de pleine conscience'
  ];

  const handleGoalToggle = (goal: string) => {
    setOnboardingData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleActivityToggle = (activity: string) => {
    setOnboardingData(prev => ({
      ...prev,
      preferredActivities: prev.preferredActivities.includes(activity)
        ? prev.preferredActivities.filter(a => a !== activity)
        : [...prev.preferredActivities, activity]
    }));
  };

  const completeOnboarding = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Sauvegarder les données d'onboarding
      const { error } = await supabase
        .from('profiles')
        .update({
          preferences: {
            ...onboardingData,
            onboarded: true,
            trial_end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Onboarding terminé ! Bienvenue sur EmotionsCare');
      navigate('/b2c/dashboard');
    } catch (error) {
      console.error('Onboarding completion error:', error);
      toast.error('Erreur lors de la finalisation de l\'onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Heart className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Bienvenue sur EmotionsCare</h2>
              <p className="text-muted-foreground">
                Nous allons personnaliser votre expérience en quelques étapes simples
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">🎁 Période d'essai gratuite</h3>
              <p className="text-blue-800 text-sm">
                Profitez de 3 jours gratuits pour découvrir toutes nos fonctionnalités premium !
              </p>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Quels sont vos objectifs ?</h2>
              <p className="text-muted-foreground">
                Sélectionnez ce que vous aimeriez améliorer (plusieurs choix possibles)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {goals.map((goal) => (
                <Button
                  key={goal}
                  variant={onboardingData.goals.includes(goal) ? "default" : "outline"}
                  className="h-auto p-4 text-left justify-start"
                  onClick={() => handleGoalToggle(goal)}
                >
                  {onboardingData.goals.includes(goal) && (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  {goal}
                </Button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Smile className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Quelles activités vous intéressent ?</h2>
              <p className="text-muted-foreground">
                Choisissez les outils que vous aimeriez utiliser
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {activities.map((activity) => (
                <Button
                  key={activity}
                  variant={onboardingData.preferredActivities.includes(activity) ? "default" : "outline"}
                  className="h-auto p-4 text-left justify-start"
                  onClick={() => handleActivityToggle(activity)}
                >
                  {onboardingData.preferredActivities.includes(activity) && (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  {activity}
                </Button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Parlez-nous de vous</h2>
              <p className="text-muted-foreground">
                Ces informations nous aident à personnaliser votre expérience
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="age">Âge (optionnel)</Label>
                <Input
                  id="age"
                  type="number"
                  value={onboardingData.personalInfo.age || ''}
                  onChange={(e) => setOnboardingData(prev => ({
                    ...prev,
                    personalInfo: {
                      ...prev.personalInfo,
                      age: parseInt(e.target.value) || undefined
                    }
                  }))}
                  placeholder="Votre âge"
                />
              </div>

              <div>
                <Label htmlFor="occupation">Profession (optionnel)</Label>
                <Input
                  id="occupation"
                  value={onboardingData.personalInfo.occupation || ''}
                  onChange={(e) => setOnboardingData(prev => ({
                    ...prev,
                    personalInfo: {
                      ...prev.personalInfo,
                      occupation: e.target.value
                    }
                  }))}
                  placeholder="Votre profession"
                />
              </div>

              <div>
                <Label htmlFor="needs">Qu'aimeriez-vous améliorer en priorité ? (optionnel)</Label>
                <Textarea
                  id="needs"
                  value={onboardingData.emotionalNeeds}
                  onChange={(e) => setOnboardingData(prev => ({
                    ...prev,
                    emotionalNeeds: e.target.value
                  }))}
                  placeholder="Décrivez vos besoins et attentes..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <CardTitle>Configuration de votre profil</CardTitle>
              <span className="text-sm text-muted-foreground">
                {currentStep + 1} / {totalSteps}
              </span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {renderStep()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Précédent
            </Button>

            <Button
              onClick={nextStep}
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                'Finalisation...'
              ) : currentStep === totalSteps - 1 ? (
                'Terminer'
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

export default B2COnboardingPage;
