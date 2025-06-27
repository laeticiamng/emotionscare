
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, CheckCircle, User, Heart, Target, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    name: '',
    preferences: [] as string[],
    goals: [] as string[],
    experience: ''
  });
  const navigate = useNavigate();

  const steps = [
    {
      id: 'welcome',
      title: 'Bienvenue sur EmotionsCare',
      subtitle: 'Votre parcours vers le bien-être commence ici',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'profile',
      title: 'Parlons de vous',
      subtitle: 'Quelques informations pour personnaliser votre expérience',
      icon: User,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'preferences',
      title: 'Vos préférences',
      subtitle: 'Qu\'est-ce qui vous intéresse le plus ?',
      icon: Heart,
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'goals',
      title: 'Vos objectifs',
      subtitle: 'Que souhaitez-vous accomplir ?',
      icon: Target,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'complete',
      title: 'Tout est prêt !',
      subtitle: 'Votre profil est configuré, commençons l\'aventure',
      icon: CheckCircle,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const preferences = [
    { id: 'meditation', name: 'Méditation', emoji: '🧘' },
    { id: 'music', name: 'Musicothérapie', emoji: '🎵' },
    { id: 'vr', name: 'Réalité Virtuelle', emoji: '🥽' },
    { id: 'journal', name: 'Journal', emoji: '📝' },
    { id: 'coach', name: 'Coach IA', emoji: '🤖' },
    { id: 'gamification', name: 'Gamification', emoji: '🎮' }
  ];

  const goals = [
    { id: 'stress', name: 'Réduire le stress', emoji: '😌' },
    { id: 'productivity', name: 'Améliorer la productivité', emoji: '⚡' },
    { id: 'mood', name: 'Stabiliser l\'humeur', emoji: '🌈' },
    { id: 'sleep', name: 'Mieux dormir', emoji: '😴' },
    { id: 'focus', name: 'Améliorer la concentration', emoji: '🎯' },
    { id: 'energy', name: 'Augmenter l\'énergie', emoji: '🔋' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/b2c/dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const togglePreference = (prefId: string) => {
    setUserData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(prefId)
        ? prev.preferences.filter(p => p !== prefId)
        : [...prev.preferences, prefId]
    }));
  };

  const toggleGoal = (goalId: string) => {
    setUserData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className={`w-24 h-24 mx-auto bg-gradient-to-r ${currentStepData.color} rounded-full flex items-center justify-center`}
            >
              <StepIcon className="h-12 w-12 text-white" />
            </motion.div>
            <div className="space-y-4">
              <p className="text-lg text-gray-600">
                EmotionsCare est votre compagnon personnel pour le bien-être émotionnel et mental.
              </p>
              <p className="text-gray-500">
                Nous allons configurer votre profil en quelques étapes simples.
              </p>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${currentStepData.color} rounded-full flex items-center justify-center mb-4`}>
                <StepIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Comment souhaitez-vous qu'on vous appelle ?</label>
                <Input
                  placeholder="Votre prénom"
                  value={userData.name}
                  onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                  className="text-center"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Niveau d'expérience avec le bien-être numérique</label>
                <div className="grid grid-cols-1 gap-2">
                  {['Débutant', 'Intermédiaire', 'Avancé'].map((level) => (
                    <Button
                      key={level}
                      variant={userData.experience === level ? 'default' : 'outline'}
                      onClick={() => setUserData(prev => ({ ...prev, experience: level }))}
                      className="w-full"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${currentStepData.color} rounded-full flex items-center justify-center mb-4`}>
                <StepIcon className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-600">Sélectionnez les fonctionnalités qui vous intéressent (3 minimum)</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {preferences.map((pref) => (
                <motion.div
                  key={pref.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-200 ${
                      userData.preferences.includes(pref.id)
                        ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => togglePreference(pref.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">{pref.emoji}</div>
                      <div className="font-medium text-sm">{pref.name}</div>
                      {userData.preferences.includes(pref.id) && (
                        <CheckCircle className="h-5 w-5 text-blue-600 mx-auto mt-2" />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'goals':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${currentStepData.color} rounded-full flex items-center justify-center mb-4`}>
                <StepIcon className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-600">Choisissez vos objectifs principaux (2-3 recommandés)</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {goals.map((goal) => (
                <motion.div
                  key={goal.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-200 ${
                      userData.goals.includes(goal.id)
                        ? 'bg-orange-50 border-orange-300 ring-2 ring-orange-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => toggleGoal(goal.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">{goal.emoji}</div>
                      <div className="font-medium text-sm">{goal.name}</div>
                      {userData.goals.includes(goal.id) && (
                        <CheckCircle className="h-5 w-5 text-orange-600 mx-auto mt-2" />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className={`w-24 h-24 mx-auto bg-gradient-to-r ${currentStepData.color} rounded-full flex items-center justify-center`}
            >
              <StepIcon className="h-12 w-12 text-white" />
            </motion.div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Félicitations {userData.name} ! 🎉</h3>
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-800">Vos préférences</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userData.preferences.map(prefId => {
                      const pref = preferences.find(p => p.id === prefId);
                      return (
                        <Badge key={prefId} variant="secondary">
                          {pref?.emoji} {pref?.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="font-medium text-orange-800">Vos objectifs</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userData.goals.map(goalId => {
                      const goal = goals.find(g => g.id === goalId);
                      return (
                        <Badge key={goalId} variant="outline">
                          {goal?.emoji} {goal?.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                Votre dashboard personnalisé vous attend avec des recommandations adaptées à vos besoins.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStepData.id) {
      case 'profile':
        return userData.name.trim().length > 0 && userData.experience;
      case 'preferences':
        return userData.preferences.length >= 3;
      case 'goals':
        return userData.goals.length >= 2;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Étape {currentStep + 1} sur {steps.length}</span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className={`text-3xl font-bold bg-gradient-to-r ${currentStepData.color} bg-clip-text text-transparent`}>
              {currentStepData.title}
            </CardTitle>
            <p className="text-gray-600 mt-2">{currentStepData.subtitle}</p>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Précédent
              </Button>
              
              <div className="flex space-x-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2"
              >
                {currentStep === steps.length - 1 ? 'Commencer' : 'Suivant'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;
