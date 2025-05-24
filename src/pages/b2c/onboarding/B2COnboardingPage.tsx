
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, Target, Music, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const B2COnboardingPage: React.FC = () => {
  const { 
    currentStep, 
    nextStep, 
    previousStep, 
    handleResponse, 
    completeOnboarding,
    userResponses 
  } = useOnboarding();
  const navigate = useNavigate();

  const steps = [
    {
      id: 'welcome',
      title: 'Bienvenue sur EmotionsCare',
      icon: Heart,
      content: (
        <div className="text-center space-y-6">
          <Heart className="h-16 w-16 text-primary mx-auto" />
          <div>
            <h2 className="text-2xl font-bold mb-2">Bienvenue dans votre parcours de bien-être</h2>
            <p className="text-gray-600">
              EmotionsCare vous accompagne dans la découverte et l'amélioration de votre bien-être émotionnel.
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              Ce processus ne prendra que quelques minutes et nous aidera à personnaliser votre expérience.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'goals',
      title: 'Vos objectifs',
      icon: Target,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Target className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Quels sont vos objectifs ?</h2>
            <p className="text-gray-600">Sélectionnez ce qui vous intéresse le plus :</p>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {[
              'Mieux comprendre mes émotions',
              'Réduire mon stress',
              'Améliorer mon humeur',
              'Développer ma résilience',
              'Créer de nouvelles habitudes positives'
            ].map((goal) => (
              <button
                key={goal}
                onClick={() => handleResponse('selectedGoals', 
                  userResponses.selectedGoals?.includes(goal) 
                    ? userResponses.selectedGoals.filter((g: string) => g !== goal)
                    : [...(userResponses.selectedGoals || []), goal]
                )}
                className={`p-4 text-left border rounded-lg transition-colors ${
                  userResponses.selectedGoals?.includes(goal)
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{goal}</span>
                  {userResponses.selectedGoals?.includes(goal) && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'preferences',
      title: 'Préférences musicales',
      icon: Music,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Music className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Vos préférences musicales</h2>
            <p className="text-gray-600">Choisissez les styles qui vous apaisent :</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {[
              'Classique',
              'Jazz',
              'Ambient',
              'Nature',
              'Méditation',
              'Lo-fi'
            ].map((style) => (
              <button
                key={style}
                onClick={() => handleResponse('musicPreferences', 
                  userResponses.musicPreferences?.includes(style)
                    ? userResponses.musicPreferences.filter((s: string) => s !== style)
                    : [...(userResponses.musicPreferences || []), style]
                )}
                className={`p-4 text-center border rounded-lg transition-colors ${
                  userResponses.musicPreferences?.includes(style)
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      nextStep();
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    const success = await completeOnboarding();
    if (success) {
      navigate('/b2c/dashboard');
    }
  };

  return (
    <>
      <Helmet>
        <title>Configuration initiale - EmotionsCare</title>
        <meta name="description" content="Configurez votre expérience EmotionsCare" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <Card>
            <CardHeader>
              <div className="space-y-4">
                <Progress value={progress} className="w-full" />
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Étape {currentStep + 1} sur {steps.length}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {currentStepData.content}
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={previousStep}
                  disabled={currentStep === 0}
                >
                  Précédent
                </Button>
                
                <Button onClick={handleNext}>
                  {currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default B2COnboardingPage;
