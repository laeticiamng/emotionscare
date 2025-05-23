
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Heart, Music, Target, CheckCircle } from 'lucide-react';

const B2COnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      navigate('/b2c/dashboard');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center space-y-6"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              <Brain className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold">Bienvenue sur EmotionsCare</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Votre parcours bien-être commence ici. Nous allons personnaliser votre expérience 
              pour qu'elle corresponde parfaitement à vos besoins.
            </p>
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center space-y-6"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <Heart className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">Votre état émotionnel</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Comment vous sentez-vous généralement ? Cette information nous aide 
              à adapter nos recommandations à votre profil émotionnel.
            </p>
          </motion.div>
        );
      
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center space-y-6"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
              <Music className="h-10 w-10 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold">Vos préférences</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Quels types d'activités de bien-être vous intéressent le plus ? 
              Musique, méditation, coaching, journal personnel...
            </p>
          </motion.div>
        );
      
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center space-y-6"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">Tout est prêt !</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Votre profil est configuré. Vous pouvez maintenant accéder à votre 
              espace personnel et commencer votre parcours bien-être.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                🎉 Vous bénéficiez de 3 jours d'essai gratuit pour découvrir toutes nos fonctionnalités !
              </p>
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold">EmotionsCare</span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Étape {step} sur {totalSteps}
              </p>
              <Progress value={(step / totalSteps) * 100} className="w-full" />
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {renderStep()}
            
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
              >
                Précédent
              </Button>
              <Button onClick={nextStep}>
                {step === totalSteps ? 'Commencer' : 'Suivant'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2COnboardingPage;
