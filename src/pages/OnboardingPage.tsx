import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, User, Sparkles, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/choose-mode');
    }
  };

  const handleSkip = () => {
    navigate('/choose-mode');
  };

  const steps = [
    {
      title: "Bienvenue sur EmotionsCare",
      icon: <Sparkles className="h-8 w-8 text-purple-600" />,
      content: "Découvrez votre plateforme de bien-être émotionnel alimentée par l'IA."
    },
    {
      title: "Votre profil émotionnel",
      icon: <User className="h-8 w-8 text-blue-600" />,
      content: "Nous analyserons vos émotions pour personnaliser votre expérience."
    },
    {
      title: "Modules disponibles",
      icon: <Target className="h-8 w-8 text-green-600" />,
      content: "Musicothérapie, VR, Coach IA, Journal et bien plus encore."
    },
    {
      title: "Prêt à commencer !",
      icon: <CheckCircle className="h-8 w-8 text-emerald-600" />,
      content: "Votre parcours de bien-être émotionnel commence maintenant."
    }
  ];

  const currentStepData = steps[currentStep - 1];

  return (
    <main data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Étape {currentStep} sur {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>

        {/* Main Card */}
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-muted/50">
                {currentStepData.icon}
              </div>
            </div>
            <CardTitle className="text-2xl mb-2">
              {currentStepData.title}
            </CardTitle>
            <p className="text-muted-foreground text-lg">
              {currentStepData.content}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step Indicators */}
            <div className="flex justify-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index + 1 <= currentStep
                      ? 'bg-primary'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {/* Features Preview for step 3 */}
            {currentStep === 3 && (
              <div className="grid grid-cols-2 gap-2">
                <Badge variant="outline" className="p-2">🎵 Musicothérapie</Badge>
                <Badge variant="outline" className="p-2">🥽 Réalité Virtuelle</Badge>
                <Badge variant="outline" className="p-2">🤖 Coach IA</Badge>
                <Badge variant="outline" className="p-2">📝 Journal</Badge>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleSkip}
                className="flex-1"
              >
                Passer
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1"
              >
                {currentStep === totalSteps ? 'Commencer' : 'Suivant'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Text */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Vous pourrez modifier ces paramètres à tout moment dans vos préférences.
        </p>
      </div>
    </main>
  );
};

export default OnboardingPage;