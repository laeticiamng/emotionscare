
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Heart, Brain, Music, BookOpen, Target, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const B2COnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const navigate = useNavigate();

  const goals = [
    { id: 'stress', label: 'Gérer mon stress', icon: Brain },
    { id: 'emotions', label: 'Comprendre mes émotions', icon: Heart },
    { id: 'wellbeing', label: 'Améliorer mon bien-être', icon: Target },
    { id: 'mindfulness', label: 'Pratiquer la pleine conscience', icon: CheckCircle }
  ];

  const interests = [
    { id: 'music', label: 'Musique thérapeutique', icon: Music },
    { id: 'journaling', label: 'Écriture et journal', icon: BookOpen },
    { id: 'coaching', label: 'Coaching personnalisé', icon: Heart },
    { id: 'analytics', label: 'Suivi de mes progrès', icon: Brain }
  ];

  const steps = [
    {
      title: 'Bienvenue sur EmotionsCare',
      description: 'Découvrons ensemble comment nous pouvons vous accompagner'
    },
    {
      title: 'Vos objectifs',
      description: 'Que souhaitez-vous accomplir avec EmotionsCare ?'
    },
    {
      title: 'Vos intérêts',
      description: 'Quelles fonctionnalités vous intéressent le plus ?'
    },
    {
      title: 'Prêt à commencer',
      description: 'Votre profil est configuré, explorons l\'application !'
    }
  ];

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Sauvegarder les préférences et rediriger vers le dashboard
      toast.success('Profil configuré avec succès !');
      navigate('/b2c/dashboard');
    }
  };

  const handleSkip = () => {
    navigate('/b2c/dashboard');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto mb-6 p-4 bg-red-100 dark:bg-red-900/30 rounded-full w-fit">
              <Heart className="h-12 w-12 text-red-500" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Bienvenue !</h3>
              <p className="text-muted-foreground">
                EmotionsCare est votre compagnon pour un bien-être émotionnel optimal. 
                Nous allons personnaliser votre expérience en quelques étapes simples.
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
              <p className="text-green-700 dark:text-green-300 text-sm">
                ✨ Vous bénéficiez de 3 jours d'essai gratuit pour découvrir toutes nos fonctionnalités
              </p>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Vos objectifs</h3>
              <p className="text-muted-foreground">
                Sélectionnez vos objectifs principaux (plusieurs choix possibles)
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {goals.map((goal) => {
                const Icon = goal.icon;
                return (
                  <Button
                    key={goal.id}
                    variant={selectedGoals.includes(goal.id) ? "default" : "outline"}
                    onClick={() => handleGoalToggle(goal.id)}
                    className="p-4 h-auto justify-start"
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {goal.label}
                  </Button>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Vos intérêts</h3>
              <p className="text-muted-foreground">
                Quelles fonctionnalités vous attirent le plus ?
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {interests.map((interest) => {
                const Icon = interest.icon;
                return (
                  <Button
                    key={interest.id}
                    variant={selectedInterests.includes(interest.id) ? "default" : "outline"}
                    onClick={() => handleInterestToggle(interest.id)}
                    className="p-4 h-auto justify-start"
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {interest.label}
                  </Button>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto mb-6 p-4 bg-green-100 dark:bg-green-900/30 rounded-full w-fit">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Tout est prêt !</h3>
              <p className="text-muted-foreground mb-6">
                Votre profil est configuré. Vous pouvez maintenant explorer toutes les fonctionnalités d'EmotionsCare.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg text-left">
                <h4 className="font-medium mb-2">Vos prochaines étapes :</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Scanner vos émotions actuelles</li>
                  <li>• Découvrir votre coach IA personnalisé</li>
                  <li>• Explorer la musique thérapeutique</li>
                  <li>• Commencer votre journal émotionnel</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-red-900 dark:via-slate-800 dark:to-pink-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center space-x-2 mb-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>

            <div className="flex justify-between mt-8">
              <Button
                variant="ghost"
                onClick={handleSkip}
              >
                Passer
              </Button>
              <Button onClick={handleNext}>
                {currentStep === steps.length - 1 ? 'Commencer' : 'Suivant'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2COnboardingPage;
