
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const Onboarding: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const totalSteps = 3;
  
  const completeOnboarding = async () => {
    setLoading(true);
    
    try {
      if (user) {
        await updateUser({
          ...user,
          onboarded: true
        });
      }
      
      toast({
        title: "Onboarding terminé",
        description: "Bienvenue sur EmotionsCare"
      });
      
      navigate('/choose-mode');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de finaliser l'onboarding",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Bienvenue sur EmotionsCare</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="flex gap-2">
              {[...Array(totalSteps)].map((_, i) => (
                <div 
                  key={i}
                  className={`h-2 w-8 rounded-full ${i < step ? 'bg-primary' : 'bg-muted'}`}
                />
              ))}
            </div>
          </div>
          
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">À propos de vous</h3>
              <p>Nous allons vous guider à travers les premières étapes pour configurer votre profil.</p>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Vos objectifs</h3>
              <p>Quels sont vos objectifs en matière de bien-être émotionnel ?</p>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Vous êtes prêt !</h3>
              <p>Votre profil est prêt. Vous pouvez maintenant explorer l'application.</p>
            </div>
          )}
          
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={step === 1}
            >
              Retour
            </Button>
            <Button onClick={nextStep} disabled={loading}>
              {step === totalSteps ? 'Terminer' : 'Suivant'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
