
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { toast } from 'sonner';

const B2COnboarding: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { userMode, setUserMode } = useUserMode();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(0);
  const [emotion, setEmotion] = useState<string>('');
  const [intensity, setIntensity] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirection si non authentifié ou mauvais mode
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/b2c/login');
    } else if (!isLoading && userMode !== 'b2c') {
      setUserMode('b2c');
    }
  }, [isLoading, isAuthenticated, userMode, navigate, setUserMode]);
  
  // Étapes de l'onboarding
  const steps = [
    {
      title: 'Bienvenue sur EmotionsCare',
      content: (
        <div className="space-y-4 text-center">
          <p className="text-lg">
            Merci de nous rejoindre, {user?.name || 'Utilisateur'} !
          </p>
          <p>
            Nous allons vous guider à travers quelques étapes pour personnaliser votre expérience.
          </p>
        </div>
      )
    },
    {
      title: 'Comment vous sentez-vous aujourd\'hui ?',
      content: (
        <div className="space-y-6">
          <RadioGroup value={emotion} onValueChange={setEmotion} className="grid grid-cols-2 gap-4">
            {['Joyeux', 'Calme', 'Inquiet', 'Triste', 'Énergique', 'Fatigué'].map((e) => (
              <div key={e} className="flex items-center space-x-2">
                <RadioGroupItem value={e} id={`emotion-${e}`} />
                <Label htmlFor={`emotion-${e}`} className="cursor-pointer">{e}</Label>
              </div>
            ))}
          </RadioGroup>
          {emotion && (
            <div className="space-y-2 pt-4">
              <Label>Intensité de votre {emotion.toLowerCase()}</Label>
              <div className="flex items-center space-x-4">
                <span>Faible</span>
                <Slider
                  value={[intensity]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(vals) => setIntensity(vals[0])}
                  className="flex-1"
                />
                <span>Forte</span>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                {intensity}/10
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Vos préférences',
      content: (
        <div className="space-y-4">
          <p className="mb-4">
            Notre application peut vous proposer du contenu selon vos préférences. Qu'est-ce qui vous intéresse le plus ?
          </p>
          
          <RadioGroup defaultValue="bien-etre" className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bien-etre" id="pref-bien-etre" />
              <Label htmlFor="pref-bien-etre">Bien-être quotidien</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="relaxation" id="pref-relaxation" />
              <Label htmlFor="pref-relaxation">Relaxation et méditation</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="therapie" id="pref-therapie" />
              <Label htmlFor="pref-therapie">Thérapie émotionnelle</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sommeil" id="pref-sommeil" />
              <Label htmlFor="pref-sommeil">Amélioration du sommeil</Label>
            </div>
          </RadioGroup>
        </div>
      )
    }
  ];
  
  const nextStep = () => {
    if (step === 1 && !emotion) {
      toast.error('Veuillez sélectionner une émotion');
      return;
    }
    
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };
  
  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  
  const completeOnboarding = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulation d'une requête pour enregistrer les données d'onboarding
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Configuration terminée !');
      navigate('/b2c/dashboard');
    } catch (error) {
      console.error('Erreur lors de la finalisation de l\'onboarding', error);
      toast.error('Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{steps[step].title}</CardTitle>
          <CardDescription>
            Étape {step + 1} sur {steps.length}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {steps[step].content}
          </motion.div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep} 
            disabled={step === 0 || isSubmitting}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Précédent
          </Button>
          
          <Button 
            onClick={nextStep} 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finalisation...
              </>
            ) : step < steps.length - 1 ? (
              <>
                Suivant <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              'Terminer'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default B2COnboarding;
