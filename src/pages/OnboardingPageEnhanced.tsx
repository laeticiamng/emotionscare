import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Brain, 
  Target, 
  Users, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle,
  Star,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const OnboardingPageEnhanced = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      role: '',
      department: ''
    },
    wellbeingGoals: [],
    preferences: {
      workStyle: '',
      stressLevel: '',
      communicationStyle: '',
      learningPreference: ''
    },
    availability: {
      morningCheckins: false,
      lunchBreaks: false,
      afternoonBoosts: false,
      eveningReflection: false
    },
    interests: []
  });

  const steps = [
    {
      id: 'welcome',
      title: 'Bienvenue dans EmotionsCare',
      subtitle: 'Votre parcours vers le bien-être au travail commence ici',
      icon: Heart,
      color: 'from-pink-500 to-red-500'
    },
    {
      id: 'personal',
      title: 'Parlez-nous de vous',
      subtitle: 'Quelques informations pour personnaliser votre expérience',
      icon: Users,
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 'goals',
      title: 'Vos objectifs bien-être',
      subtitle: 'Que souhaitez-vous améliorer en priorité ?',
      icon: Target,
      color: 'from-green-500 to-blue-500'
    },
    {
      id: 'preferences',
      title: 'Vos préférences',
      subtitle: 'Comment préférez-vous travailler et apprendre ?',
      icon: Brain,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'availability',
      title: 'Votre disponibilité',
      subtitle: 'Quand souhaitez-vous recevoir nos notifications ?',
      icon: Zap,
      color: 'from-orange-500 to-yellow-500'
    },
    {
      id: 'interests',
      title: 'Vos centres d\'intérêt',
      subtitle: 'Sélectionnez les activités qui vous motivent',
      icon: Sparkles,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'complete',
      title: 'Félicitations !',
      subtitle: 'Votre profil est configuré, commençons l\'aventure',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const wellbeingGoals = [
    { id: 'stress', label: 'Réduire le stress', icon: '🧘' },
    { id: 'energy', label: 'Augmenter l\'énergie', icon: '⚡' },
    { id: 'focus', label: 'Améliorer la concentration', icon: '🎯' },
    { id: 'relationships', label: 'Renforcer les relations', icon: '🤝' },
    { id: 'creativity', label: 'Stimuler la créativité', icon: '🎨' },
    { id: 'confidence', label: 'Développer la confiance', icon: '💪' }
  ];

  const interests = [
    { id: 'meditation', label: 'Méditation', icon: '🧘‍♀️' },
    { id: 'breathing', label: 'Exercices de respiration', icon: '🌬️' },
    { id: 'music', label: 'Thérapie musicale', icon: '🎵' },
    { id: 'movement', label: 'Mouvement & étirements', icon: '🤸' },
    { id: 'journaling', label: 'Journal émotionnel', icon: '📝' },
    { id: 'social', label: 'Activités sociales', icon: '👥' },
    { id: 'nature', label: 'Contact avec la nature', icon: '🌿' },
    { id: 'art', label: 'Art-thérapie', icon: '🎨' }
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

  const handleGoalToggle = (goalId) => {
    setOnboardingData(prev => ({
      ...prev,
      wellbeingGoals: prev.wellbeingGoals.includes(goalId)
        ? prev.wellbeingGoals.filter(id => id !== goalId)
        : [...prev.wellbeingGoals, goalId]
    }));
  };

  const handleInterestToggle = (interestId) => {
    setOnboardingData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const completeOnboarding = async () => {
    try {
      // Sauvegarder les données d'onboarding
      const { error } = await supabase
        .from('user_onboarding')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          onboarding_data: onboardingData,
          completed: true
        });

      if (error) throw error;

      toast({
        title: "Bienvenue !",
        description: "Votre profil a été configuré avec succès.",
      });

      // Rediriger vers le dashboard
      navigate('/app/home');
    } catch (error) {
      console.error('Erreur onboarding:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder votre profil.",
        variant: "destructive"
      });
    }
  };

  const getCurrentStepProgress = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="text-8xl mb-6"
            >
              🌟
            </motion.div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Bienvenue dans EmotionsCare</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Nous sommes ravis de vous accompagner dans votre parcours vers un meilleur bien-être au travail. 
                Ce questionnaire nous permettra de personnaliser votre expérience.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-8">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <Brain className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-semibold">Personnalisé</h3>
                  <p className="text-sm text-gray-600">Adapté à vos besoins</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-semibold">Objectifs clairs</h3>
                  <p className="text-sm text-gray-600">Progression mesurable</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <Sparkles className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <h3 className="font-semibold">Innovation IA</h3>
                  <p className="text-sm text-gray-600">Recommandations intelligentes</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'personal':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Users className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Parlez-nous de vous</h2>
              <p className="text-gray-600">Ces informations nous aideront à personnaliser votre expérience</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={onboardingData.personalInfo.firstName}
                  onChange={(e) => setOnboardingData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                  }))}
                  placeholder="Votre prénom"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={onboardingData.personalInfo.lastName}
                  onChange={(e) => setOnboardingData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                  }))}
                  placeholder="Votre nom"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Poste</Label>
                <Input
                  id="role"
                  value={onboardingData.personalInfo.role}
                  onChange={(e) => setOnboardingData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, role: e.target.value }
                  }))}
                  placeholder="Votre poste actuel"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Département</Label>
                <Input
                  id="department" 
                  value={onboardingData.personalInfo.department}
                  onChange={(e) => setOnboardingData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, department: e.target.value }
                  }))}
                  placeholder="Votre département"
                />
              </div>
            </div>
          </div>
        );

      case 'goals':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Target className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Vos objectifs bien-être</h2>
              <p className="text-gray-600">Sélectionnez les domaines que vous souhaitez améliorer (plusieurs choix possibles)</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wellbeingGoals.map((goal) => (
                <motion.div
                  key={goal.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    onboardingData.wellbeingGoals.includes(goal.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleGoalToggle(goal.id)}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{goal.icon}</div>
                    <h3 className="font-semibold">{goal.label}</h3>
                    {onboardingData.wellbeingGoals.includes(goal.id) && (
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto mt-2" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <Brain className="h-16 w-16 text-purple-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Vos préférences</h2>
              <p className="text-gray-600">Aidez-nous à comprendre votre style de travail</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-3 block">Style de travail</Label>
                <RadioGroup
                  value={onboardingData.preferences.workStyle}
                  onValueChange={(value) => setOnboardingData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, workStyle: value }
                  }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="collaborative" id="collaborative" />
                    <Label htmlFor="collaborative">Collaboratif - J'aime travailler en équipe</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="independent" id="independent" />
                    <Label htmlFor="independent">Indépendant - Je préfère travailler seul</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mixed" id="mixed" />
                    <Label htmlFor="mixed">Mixte - Ça dépend des projets</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">Niveau de stress habituel</Label>
                <RadioGroup
                  value={onboardingData.preferences.stressLevel}
                  onValueChange={(value) => setOnboardingData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, stressLevel: value }
                  }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low">Faible - Je gère bien la pression</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Modéré - Parfois débordé(e)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">Élevé - Souvent sous pression</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 'availability':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Zap className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Votre disponibilité</h2>
              <p className="text-gray-600">Quand souhaitez-vous recevoir nos notifications et rappels ?</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
                <Checkbox
                  id="morningCheckins"
                  checked={onboardingData.availability.morningCheckins}
                  onCheckedChange={(checked) => setOnboardingData(prev => ({
                    ...prev,
                    availability: { ...prev.availability, morningCheckins: checked }
                  }))}
                />
                <div>
                  <Label htmlFor="morningCheckins" className="font-semibold">Check-in matinal</Label>
                  <p className="text-sm text-gray-600">Notifications vers 9h pour commencer la journée</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <Checkbox
                  id="lunchBreaks"
                  checked={onboardingData.availability.lunchBreaks}
                  onCheckedChange={(checked) => setOnboardingData(prev => ({
                    ...prev,
                    availability: { ...prev.availability, lunchBreaks: checked }
                  }))}
                />
                <div>
                  <Label htmlFor="lunchBreaks" className="font-semibold">Pause déjeuner</Label>
                  <p className="text-sm text-gray-600">Rappels vers 12h30 pour faire une vraie pause</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                <Checkbox
                  id="afternoonBoosts"
                  checked={onboardingData.availability.afternoonBoosts}
                  onCheckedChange={(checked) => setOnboardingData(prev => ({
                    ...prev,
                    availability: { ...prev.availability, afternoonBoosts: checked }
                  }))}
                />
                <div>
                  <Label htmlFor="afternoonBoosts" className="font-semibold">Boost d'après-midi</Label>
                  <p className="text-sm text-gray-600">Exercices énergisants vers 15h</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <Checkbox
                  id="eveningReflection"
                  checked={onboardingData.availability.eveningReflection}
                  onCheckedChange={(checked) => setOnboardingData(prev => ({
                    ...prev,
                    availability: { ...prev.availability, eveningReflection: checked }
                  }))}
                />
                <div>
                  <Label htmlFor="eveningReflection" className="font-semibold">Réflexion du soir</Label>
                  <p className="text-sm text-gray-600">Bilan de la journée vers 18h</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'interests':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Sparkles className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Vos centres d'intérêt</h2>
              <p className="text-gray-600">Sélectionnez les activités qui vous motivent le plus</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {interests.map((interest) => (
                <motion.div
                  key={interest.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    onboardingData.interests.includes(interest.id)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleInterestToggle(interest.id)}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{interest.icon}</div>
                    <h3 className="text-sm font-semibold">{interest.label}</h3>
                    {onboardingData.interests.includes(interest.id) && (
                      <CheckCircle className="h-4 w-4 text-indigo-500 mx-auto mt-2" />
                    )}
                  </div>
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
              transition={{ type: "spring", duration: 0.6 }}
            >
              <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
            </motion.div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Félicitations !</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Votre profil est maintenant configuré. Nous avons tout ce qu'il faut pour vous proposer 
                une expérience personnalisée et vous accompagner dans votre parcours bien-être.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mt-8">
                <div className="p-4 bg-green-50 rounded-lg">
                  <Star className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-semibold">{onboardingData.wellbeingGoals.length} Objectifs</h3>
                  <p className="text-sm text-gray-600">définis pour votre bien-être</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <Heart className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-semibold">{onboardingData.interests.length} Activités</h3>
                  <p className="text-sm text-gray-600">sélectionnées selon vos goûts</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <Zap className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <h3 className="font-semibold">Profil personnalisé</h3>
                  <p className="text-sm text-gray-600">adapté à votre style</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-600">
              Étape {currentStep + 1} sur {steps.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(getCurrentStepProgress())}% terminé
            </span>
          </div>
          <Progress value={getCurrentStepProgress()} className="h-2" />
        </motion.div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="p-8 md:p-12">
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
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-between mt-8"
        >
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              onClick={completeOnboarding}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white flex items-center gap-2"
            >
              Commencer l'aventure
              <Sparkles className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2"
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingPageEnhanced;