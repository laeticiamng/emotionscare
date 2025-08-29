import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Heart, Brain, Users, Sparkles, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState({
    goals: [] as string[],
    experience: '',
    preferences: [] as string[],
    notifications: true
  });

  const steps = [
    {
      id: 'welcome',
      title: 'Bienvenue sur EmotionsCare',
      description: 'Votre voyage vers le bien-être émotionnel commence ici',
      icon: Heart
    },
    {
      id: 'goals',
      title: 'Vos Objectifs',
      description: 'Que souhaitez-vous améliorer ?',
      icon: Brain
    },
    {
      id: 'experience',
      title: 'Votre Expérience',
      description: 'Parlez-nous de votre parcours',
      icon: Sparkles
    },
    {
      id: 'preferences',
      title: 'Préférences',
      description: 'Personnalisez votre expérience',
      icon: Users
    }
  ];

  const goals = [
    { id: 'stress', label: 'Gérer le stress', icon: '🧘', description: 'Techniques de relaxation et méditation' },
    { id: 'anxiety', label: 'Réduire l\'anxiété', icon: '💙', description: 'Outils pour calmer l\'esprit' },
    { id: 'confidence', label: 'Confiance en soi', icon: '💪', description: 'Renforcer l\'estime personnelle' },
    { id: 'relationships', label: 'Relations sociales', icon: '👥', description: 'Améliorer les interactions' },
    { id: 'sleep', label: 'Qualité du sommeil', icon: '😴', description: 'Mieux dormir et récupérer' },
    { id: 'energy', label: 'Niveau d\'énergie', icon: '⚡', description: 'Augmenter la vitalité' }
  ];

  const experienceLevels = [
    { id: 'beginner', label: 'Débutant', description: 'Nouveau dans le bien-être mental' },
    { id: 'intermediate', label: 'Intermédiaire', description: 'Quelques expériences passées' },
    { id: 'advanced', label: 'Avancé', description: 'Pratique régulière établie' }
  ];

  const preferences = [
    { id: 'morning', label: 'Sessions matinales', icon: '🌅' },
    { id: 'evening', label: 'Sessions en soirée', icon: '🌙' },
    { id: 'short', label: 'Sessions courtes (5-10min)', icon: '⏱️' },
    { id: 'long', label: 'Sessions longues (20-30min)', icon: '⏰' },
    { id: 'guided', label: 'Guidance vocale', icon: '🎧' },
    { id: 'music', label: 'Avec musique', icon: '🎵' },
    { id: 'vr', label: 'Expériences VR', icon: '🥽' },
    { id: 'community', label: 'Activités communautaires', icon: '👥' }
  ];

  const handleGoalToggle = (goalId: string) => {
    setUserProfile(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(id => id !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const handlePreferenceToggle = (prefId: string) => {
    setUserProfile(prev => ({
      ...prev,
      preferences: prev.preferences.includes(prefId)
        ? prev.preferences.filter(id => id !== prefId)
        : [...prev.preferences, prefId]
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Terminer l'onboarding
      navigate('/app/home');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (steps[currentStep].id) {
      case 'goals':
        return userProfile.goals.length > 0;
      case 'experience':
        return userProfile.experience !== '';
      default:
        return true;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* En-tête avec progression */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">EmotionsCare</h1>
          </div>
          <Progress value={progress} className="w-full mb-4" />
          <p className="text-gray-600">Étape {currentStep + 1} sur {steps.length}</p>
        </div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {React.createElement(steps[currentStep].icon, { className: "w-8 h-8 text-purple-600" })}
              </div>
              <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
              <p className="text-gray-600">{steps[currentStep].description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Étape Bienvenue */}
              {steps[currentStep].id === 'welcome' && (
                <div className="text-center space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Prenez soin de votre bien-être émotionnel
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      EmotionsCare vous accompagne dans votre développement personnel avec des outils 
                      innovants : scan émotionnel IA, réalité virtuelle thérapeutique, musicothérapie 
                      personnalisée et coach virtuel.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl mb-2">🧠</div>
                      <h4 className="font-semibold">IA Avancée</h4>
                      <p className="text-sm text-gray-600">Analyse émotionnelle intelligente</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-3xl mb-2">🥽</div>
                      <h4 className="font-semibold">VR Immersive</h4>
                      <p className="text-sm text-gray-600">Environnements thérapeutiques</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl mb-2">👥</div>
                      <h4 className="font-semibold">Communauté</h4>
                      <p className="text-sm text-gray-600">Soutien et partage</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Étape Objectifs */}
              {steps[currentStep].id === 'goals' && (
                <div className="space-y-4">
                  <p className="text-center text-gray-600 mb-6">
                    Sélectionnez les domaines que vous souhaitez améliorer (plusieurs choix possibles)
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {goals.map((goal) => (
                      <div
                        key={goal.id}
                        onClick={() => handleGoalToggle(goal.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          userProfile.goals.includes(goal.id)
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{goal.icon}</span>
                          <h3 className="font-semibold">{goal.label}</h3>
                          {userProfile.goals.includes(goal.id) && (
                            <Check className="w-5 h-5 text-purple-600 ml-auto" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Étape Expérience */}
              {steps[currentStep].id === 'experience' && (
                <div className="space-y-4">
                  <p className="text-center text-gray-600 mb-6">
                    Quel est votre niveau d'expérience avec les pratiques de bien-être mental ?
                  </p>
                  <div className="space-y-3">
                    {experienceLevels.map((level) => (
                      <div
                        key={level.id}
                        onClick={() => setUserProfile(prev => ({ ...prev, experience: level.id }))}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          userProfile.experience === level.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{level.label}</h3>
                            <p className="text-sm text-gray-600">{level.description}</p>
                          </div>
                          {userProfile.experience === level.id && (
                            <Check className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Étape Préférences */}
              {steps[currentStep].id === 'preferences' && (
                <div className="space-y-4">
                  <p className="text-center text-gray-600 mb-6">
                    Choisissez vos préférences pour personnaliser votre expérience
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {preferences.map((pref) => (
                      <div
                        key={pref.id}
                        onClick={() => handlePreferenceToggle(pref.id)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                          userProfile.preferences.includes(pref.id)
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{pref.icon}</span>
                            <span className="font-medium">{pref.label}</span>
                          </div>
                          {userProfile.preferences.includes(pref.id) && (
                            <Check className="w-4 h-4 text-purple-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Boutons de navigation */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  Précédent
                </Button>
                
                <div className="flex gap-2">
                  {userProfile.goals.length > 0 && (
                    <Badge variant="secondary">
                      {userProfile.goals.length} objectif{userProfile.goals.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                  {userProfile.preferences.length > 0 && (
                    <Badge variant="secondary">
                      {userProfile.preferences.length} préférence{userProfile.preferences.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>

                <Button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Indicateurs d'étapes */}
        <div className="flex justify-center gap-2 mt-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentStep
                  ? 'bg-purple-600'
                  : index < currentStep
                  ? 'bg-purple-400'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;