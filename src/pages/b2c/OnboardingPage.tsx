
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const B2COnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const totalSteps = 3;

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      navigate('/b2c/dashboard');
    }
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Bienvenue sur EmotionsCare</CardTitle>
          <CardDescription>Configurons votre profil en quelques étapes</CardDescription>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Étape 1: Votre bien-être émotionnel</h3>
              <p>EmotionsCare vous aide à comprendre et améliorer votre état émotionnel grâce à l'intelligence artificielle.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl mb-2">🧠</div>
                  <h4 className="font-medium">Scan Émotionnel</h4>
                  <p className="text-sm text-muted-foreground">Analysez vos émotions en temps réel</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl mb-2">🎵</div>
                  <h4 className="font-medium">Musicothérapie</h4>
                  <p className="text-sm text-muted-foreground">Musique adaptée à votre humeur</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl mb-2">🤖</div>
                  <h4 className="font-medium">Coach IA</h4>
                  <p className="text-sm text-muted-foreground">Accompagnement personnalisé</p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Étape 2: Vos préférences</h3>
              <p>Personnalisez votre expérience selon vos besoins</p>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg text-left">
                  <h4 className="font-medium mb-2">Notifications</h4>
                  <p className="text-sm text-muted-foreground">Recevez des rappels pour vos sessions de bien-être</p>
                </div>
                <div className="p-4 border rounded-lg text-left">
                  <h4 className="font-medium mb-2">Confidentialité</h4>
                  <p className="text-sm text-muted-foreground">Vos données restent privées et sécurisées</p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Étape 3: Vous êtes prêt !</h3>
              <p>Félicitations ! Votre profil est configuré.</p>
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-muted-foreground">
                Vous pouvez maintenant accéder à votre tableau de bord et commencer votre parcours de bien-être émotionnel.
              </p>
            </div>
          )}

          <div className="flex justify-between">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Précédent
              </Button>
            )}
            <div className="flex-1" />
            <Button onClick={nextStep}>
              {step === totalSteps ? 'Accéder au tableau de bord' : 'Suivant'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2COnboardingPage;
