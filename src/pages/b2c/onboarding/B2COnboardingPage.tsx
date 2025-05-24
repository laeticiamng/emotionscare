
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Brain, Heart, Music, Users, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const B2COnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    {
      title: "Bienvenue sur EmotionsCare",
      description: "Votre compagnon de bien-être émotionnel alimenté par l'IA",
      icon: Heart,
      content: (
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Découvrez une nouvelle approche du bien-être émotionnel avec nos outils innovants.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Brain className="h-8 w-8 text-blue-500 mb-2" />
              <span className="text-sm font-medium">Scanner d'émotions</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Heart className="h-8 w-8 text-red-500 mb-2" />
              <span className="text-sm font-medium">Coach IA</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Music className="h-8 w-8 text-purple-500 mb-2" />
              <span className="text-sm font-medium">Musique thérapeutique</span>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Users className="h-8 w-8 text-green-500 mb-2" />
              <span className="text-sm font-medium">Journal personnel</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Scanner d'émotions",
      description: "Analysez vos émotions avec précision",
      icon: Brain,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Notre scanner d'émotions utilise l'IA pour analyser votre état émotionnel à travers :
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Analyse textuelle de vos messages
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Reconnaissance d'émojis et expressions
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Analyse vocale de votre humeur
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Suivi de votre évolution émotionnelle
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "Période d'essai gratuite",
      description: "3 jours pour découvrir toutes les fonctionnalités",
      icon: CheckCircle,
      content: (
        <div className="space-y-4">
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
            <h3 className="text-2xl font-bold text-primary mb-2">3 jours gratuits</h3>
            <p className="text-muted-foreground">
              Accès complet à toutes les fonctionnalités premium
            </p>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Scanner d'émotions illimité
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Coach IA personnalisé
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Génération de musique thérapeutique
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Journal avec analyse IA
            </li>
          </ul>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.success('Bienvenue dans votre espace EmotionsCare !');
      navigate('/b2c/dashboard');
    }
  };

  const handleSkip = () => {
    navigate('/b2c/dashboard');
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center p-6">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
            <CardDescription>{currentStepData.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStepData.content}
            
            <div className="flex items-center justify-between mt-8">
              <div className="flex space-x-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-8 rounded ${
                      index <= currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleSkip}>
                  Passer
                </Button>
                <Button onClick={handleNext}>
                  {currentStep === steps.length - 1 ? 'Commencer' : 'Suivant'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2COnboardingPage;
