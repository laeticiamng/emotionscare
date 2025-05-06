
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { updateUser } from '@/data/mockUsers';
import { useToast } from '@/hooks/use-toast';

const OnboardingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [selectedFontSize, setSelectedFontSize] = useState('medium');
  const [selectedBackground, setSelectedBackground] = useState('default');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleComplete = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      await updateUser({
        ...user,
        onboarded: true,
        preferences: {
          theme: selectedTheme as 'light' | 'dark' | 'pastel' | 'system',
          fontSize: selectedFontSize as 'small' | 'medium' | 'large',
          backgroundColor: selectedBackground as 'default' | 'blue' | 'mint' | 'coral',
          accentColor: 'blue', // Default accent color
          notifications: {
            email: false,
            push: true,
            sms: false
          }
        }
      });
      
      toast({
        title: "Configuration terminée",
        description: "Vos préférences ont été enregistrées",
      });
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer vos préférences",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {step === 1 && "Bienvenue sur Cocoon"}
            {step === 2 && "Personnalisez votre expérience"}
            {step === 3 && "Dernière étape"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-center">
                Cocoon est votre espace de bien-être personnel.
              </p>
              <div className="flex justify-center">
                <Button onClick={nextStep}>Commencer</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">Thème</p>
                <Tabs 
                  value={selectedTheme} 
                  onValueChange={setSelectedTheme}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="light">Clair</TabsTrigger>
                    <TabsTrigger value="dark">Sombre</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Taille du texte</p>
                <Tabs 
                  value={selectedFontSize} 
                  onValueChange={setSelectedFontSize}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="small">Petit</TabsTrigger>
                    <TabsTrigger value="medium">Moyen</TabsTrigger>
                    <TabsTrigger value="large">Grand</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Couleur d'ambiance</p>
                <Tabs 
                  value={selectedBackground} 
                  onValueChange={setSelectedBackground}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 gap-2">
                    <TabsTrigger value="default">Standard</TabsTrigger>
                    <TabsTrigger value="blue">Bleu</TabsTrigger>
                    <TabsTrigger value="mint">Menthe</TabsTrigger>
                    <TabsTrigger value="coral">Corail</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={prevStep}>Retour</Button>
                <Button onClick={nextStep}>Suivant</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <p className="text-center">
                Merci d'avoir configuré votre profil. Vous êtes prêt à commencer votre parcours de bien-être !
              </p>
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={prevStep}>Retour</Button>
                <Button onClick={handleComplete} disabled={loading}>
                  {loading ? "Chargement..." : "Terminer"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingPage;
