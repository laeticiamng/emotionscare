
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const B2COnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      navigate('/b2c/dashboard');
    }
  };
  
  const handleSkip = () => {
    navigate('/b2c/dashboard');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-xl">
        <CardContent className="pt-6">
          <div className="mb-6">
            <Progress value={(step / totalSteps) * 100} />
            <div className="text-right text-sm text-muted-foreground mt-1">
              Étape {step} sur {totalSteps}
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="min-h-[300px]"
            >
              {step === 1 && (
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold">Bienvenue sur EmotionsCare</h2>
                  <p className="text-muted-foreground">
                    Nous allons vous guider à travers quelques questions pour personnaliser votre expérience.
                  </p>
                  <div className="py-8">
                    <div className="mx-auto w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                      <span className="text-3xl">👋</span>
                    </div>
                    <p>Prêt à commencer votre parcours de bien-être émotionnel ?</p>
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Vos objectifs</h2>
                  <p className="text-muted-foreground mb-4">
                    Sélectionnez ce que vous souhaitez améliorer en priorité
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {["Réduire le stress", "Améliorer le sommeil", "Augmenter la concentration", "Gérer les émotions"].map((goal) => (
                      <div key={goal} className="border rounded-lg p-3 text-center cursor-pointer hover:bg-accent transition-colors">
                        {goal}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Vos préférences</h2>
                  <p className="text-muted-foreground mb-4">
                    Quels types de contenus préférez-vous ?
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {["Musique relaxante", "Méditation guidée", "Exercices de respiration", "Visualisations"].map((preference) => (
                      <div key={preference} className="border rounded-lg p-3 text-center cursor-pointer hover:bg-accent transition-colors">
                        {preference}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {step === 4 && (
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold">Prêt à démarrer !</h2>
                  <p className="text-muted-foreground">
                    Merci pour ces informations. Votre espace personnel est maintenant configuré.
                  </p>
                  <div className="py-8">
                    <div className="mx-auto w-24 h-24 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                      <span className="text-3xl">✨</span>
                    </div>
                    <p>Votre parcours de bien-être commence maintenant.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          
          <div className="flex justify-between mt-6 pt-4 border-t">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Précédent
              </Button>
            ) : (
              <Button variant="outline" onClick={handleSkip}>
                Ignorer
              </Button>
            )}
            
            <Button onClick={handleNext}>
              {step < totalSteps ? "Suivant" : "Commencer"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2COnboarding;
