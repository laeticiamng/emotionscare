
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Heart, 
  Brain, 
  Music, 
  Scan,
  Gift,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

const B2COnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    goals: [] as string[],
    interests: [] as string[],
    experience: ''
  });
  const navigate = useNavigate();
  const { updateProfile } = useAuth();

  const steps = [
    {
      title: '🎉 Bienvenue dans EmotionsCare !',
      description: 'Votre voyage vers le bien-être commence maintenant',
      component: WelcomeStep
    },
    {
      title: '🎯 Vos objectifs',
      description: 'Que souhaitez-vous améliorer ?',
      component: GoalsStep
    },
    {
      title: '💫 Vos centres d\'intérêt',
      description: 'Quelles activités vous attirent ?',
      component: InterestsStep
    },
    {
      title: '✨ Finalisation',
      description: 'Votre profil est prêt !',
      component: CompletionStep
    }
  ];

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
    try {
      await updateProfile({
        onboarding_completed: true,
        preferences: preferences
      });
      toast.success('Profil configuré avec succès !');
      navigate('/b2c/dashboard');
    } catch (error) {
      toast.error('Erreur lors de la configuration');
    }
  };

  function WelcomeStep() {
    return (
      <div className="text-center space-y-6">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
          <Sparkles className="h-12 w-12 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bienvenue dans EmotionsCare !
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
            Nous sommes ravis de vous accompagner dans votre parcours de bien-être émotionnel.
          </p>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <Gift className="h-5 w-5" />
              <span className="font-medium">3 jours d'essai gratuit activés !</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function GoalsStep() {
    const goals = [
      { id: 'stress', label: 'Réduire le stress', icon: Heart },
      { id: 'sleep', label: 'Améliorer le sommeil', icon: Brain },
      { id: 'focus', label: 'Augmenter la concentration', icon: Scan },
      { id: 'mood', label: 'Stabiliser l\'humeur', icon: Music },
      { id: 'confidence', label: 'Renforcer la confiance', icon: Sparkles },
      { id: 'relationships', label: 'Améliorer les relations', icon: Heart }
    ];

    const toggleGoal = (goalId: string) => {
      setPreferences(prev => ({
        ...prev,
        goals: prev.goals.includes(goalId)
          ? prev.goals.filter(g => g !== goalId)
          : [...prev.goals, goalId]
      }));
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Quels sont vos objectifs ?</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Sélectionnez ce que vous aimeriez améliorer (plusieurs choix possibles)
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <div
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                preferences.goals.includes(goal.id)
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <goal.icon className={`h-6 w-6 ${
                  preferences.goals.includes(goal.id) ? 'text-blue-600' : 'text-slate-400'
                }`} />
                <span className="font-medium">{goal.label}</span>
                {preferences.goals.includes(goal.id) && (
                  <CheckCircle className="h-5 w-5 text-blue-600 ml-auto" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function InterestsStep() {
    const interests = [
      'Méditation',
      'Musicothérapie',
      'Exercices de respiration',
      'Journal émotionnel',
      'Coaching personnel',
      'Relaxation guidée'
    ];

    const toggleInterest = (interest: string) => {
      setPreferences(prev => ({
        ...prev,
        interests: prev.interests.includes(interest)
          ? prev.interests.filter(i => i !== interest)
          : [...prev.interests, interest]
      }));
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Vos centres d'intérêt</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Quelles activités vous attirent le plus ?
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {interests.map((interest) => (
            <Button
              key={interest}
              variant={preferences.interests.includes(interest) ? 'default' : 'outline'}
              onClick={() => toggleInterest(interest)}
              className="justify-start"
            >
              {preferences.interests.includes(interest) && (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              {interest}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  function CompletionStep() {
    return (
      <div className="text-center space-y-6">
        <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-12 w-12 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4 text-green-600">
            Parfait ! Votre profil est configuré
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
            Nous avons personnalisé votre expérience en fonction de vos préférences.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h3 className="font-bold mb-3">Votre parcours personnalisé :</h3>
            <ul className="text-left space-y-2 text-sm">
              <li>• Recommandations adaptées à vos objectifs</li>
              <li>• Contenus personnalisés selon vos intérêts</li>
              <li>• Suivi de votre progression</li>
              <li>• Accès à tous nos modules premium</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center space-x-2 mb-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
            <CardTitle className="text-xl">
              Étape {currentStep + 1} sur {steps.length}
            </CardTitle>
            <CardDescription>
              {steps[currentStep].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[400px] flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1"
              >
                <CurrentStepComponent />
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-between pt-6 mt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Précédent
              </Button>
              
              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={completeOnboarding}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  Commencer l'expérience
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={nextStep}>
                  Suivant
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2COnboardingPage;
