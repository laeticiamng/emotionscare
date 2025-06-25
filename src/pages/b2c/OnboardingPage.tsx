
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const B2COnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const totalSteps = 3;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/b2c/dashboard');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center" data-testid="page-root">
      <div className="w-full max-w-2xl p-4">
        <Card>
          <CardHeader className="text-center">
            <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Bienvenue dans EmotionsCare</CardTitle>
            <Progress value={progress} className="mt-4" />
            <p className="text-sm text-muted-foreground mt-2">
              Étape {currentStep} sur {totalSteps}
            </p>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Découvrez vos outils de bien-être</h3>
                <p className="text-muted-foreground">
                  EmotionsCare vous accompagne dans votre parcours de bien-être émotionnel 
                  avec des outils personnalisés et intelligents.
                </p>
              </div>
            )}

            {currentStep === 2 && (
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Vos données sont protégées</h3>
                <p className="text-muted-foreground">
                  Nous respectons votre vie privée. Toutes vos données sont chiffrées 
                  et vous gardez le contrôle total sur vos informations personnelles.
                </p>
              </div>
            )}

            {currentStep === 3 && (
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Prêt à commencer ?</h3>
                <p className="text-muted-foreground">
                  Votre voyage vers un meilleur bien-être émotionnel commence maintenant. 
                  Explorez nos modules et trouvez ce qui vous convient le mieux.
                </p>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Précédent
              </Button>
              <Button onClick={nextStep} className="flex items-center gap-2">
                {currentStep === totalSteps ? 'Commencer' : 'Suivant'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2COnboardingPage;
