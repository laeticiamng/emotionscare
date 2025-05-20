
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Confetti } from '@/components/ui/confetti';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
}

const steps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Bienvenue sur EmotionsCare',
    description: 'Nous allons vous guider pour personnaliser votre expérience.'
  },
  {
    id: 'personalization',
    title: 'Personnalisation',
    description: 'Dites-nous en plus sur vos préférences.'
  },
  {
    id: 'goals',
    title: 'Vos objectifs',
    description: 'Qu\'espérez-vous accomplir avec EmotionsCare ?'
  },
  {
    id: 'complete',
    title: 'C\'est prêt !',
    description: 'Votre espace personnel est configuré.'
  }
];

const B2COnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [mood, setMood] = useState<string>('balanced');
  const [goal, setGoal] = useState<string>('stress');
  const [reminderTime, setReminderTime] = useState<string>('09:00');
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const completeOnboarding = async () => {
    setLoading(true);
    
    try {
      if (user && updateUser) {
        // Save user preferences
        await updateUser({
          ...user,
          preferences: {
            ...user.preferences,
            onboarded: true,
            mood,
            goal,
            reminderTime
          }
        });
      }
      
      setShowConfetti(true);
      
      // Small delay to show the completion page with confetti
      setTimeout(() => {
        toast({
          title: "Configuration terminée",
          description: "Votre espace personnel est prêt !",
        });
        navigate('/b2c/dashboard');
      }, 3000);
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos préférences. Veuillez réessayer.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };
  
  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      completeOnboarding();
    } else {
      nextStep();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {showConfetti && <Confetti duration={3000} />}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Progress bar */}
        <div className="flex gap-2 mb-6 justify-center">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index <= currentStep ? 'bg-primary w-10' : 'bg-muted w-6'
              }`}
            ></div>
          ))}
        </div>
        
        <Card className="border-none shadow-xl">
          <CardHeader className="pb-4 space-y-1">
            <CardTitle className="text-2xl text-center">
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription className="text-center">
              {steps[currentStep].description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="flex justify-center">
                      <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <Check className="h-16 w-16 text-primary" />
                        </motion.div>
                      </div>
                    </div>
                    
                    <p className="text-center">
                      Nous sommes ravis de vous accueillir, <span className="font-semibold">{user?.name?.split(' ')[0]}</span>.
                      <br />Quelques étapes rapides pour personnaliser votre expérience.
                    </p>
                  </div>
                )}
                
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label>Quelle est votre humeur habituelle ?</Label>
                      <RadioGroup 
                        value={mood} 
                        onValueChange={setMood}
                        className="grid grid-cols-1 gap-4"
                      >
                        {[
                          { value: 'energetic', label: 'Énergique et dynamique' },
                          { value: 'balanced', label: 'Équilibrée et stable' },
                          { value: 'calm', label: 'Calme et posée' },
                          { value: 'variable', label: 'Variable selon les jours' }
                        ].map((item) => (
                          <div key={item.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={item.value} id={item.value} />
                            <Label htmlFor={item.value}>{item.label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <Label htmlFor="reminderTime">À quelle heure préférez-vous recevoir des rappels ?</Label>
                      <Input 
                        type="time" 
                        id="reminderTime" 
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}
                
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <Label>Quel est votre objectif principal ?</Label>
                      <RadioGroup 
                        value={goal} 
                        onValueChange={setGoal}
                        className="grid grid-cols-1 gap-4 mt-4"
                      >
                        {[
                          { value: 'stress', label: 'Réduire le stress et l\'anxiété' },
                          { value: 'sleep', label: 'Améliorer mon sommeil' },
                          { value: 'focus', label: 'Augmenter ma concentration' },
                          { value: 'balance', label: 'Trouver un meilleur équilibre émotionnel' },
                          { value: 'happiness', label: 'Cultiver plus de joie au quotidien' }
                        ].map((item) => (
                          <div key={item.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={item.value} id={item.value} />
                            <Label htmlFor={item.value}>{item.label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                )}
                
                {currentStep === 3 && (
                  <div className="space-y-6 text-center">
                    <div className="flex justify-center">
                      <div className="w-32 h-32 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <Check className="h-16 w-16 text-green-500 dark:text-green-400" />
                        </motion.div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-xl font-medium">Configuration terminée !</p>
                      <p>
                        Votre espace personnel est prêt. 
                        <br />Nous avons personnalisé l'expérience selon vos préférences.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
          
          <CardFooter className="flex justify-between pt-0">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 0 || loading}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={loading}
            >
              {currentStep === steps.length - 1 ? (
                loading ? 'Finalisation...' : 'Terminer'
              ) : (
                <>
                  Suivant
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2COnboardingPage;
