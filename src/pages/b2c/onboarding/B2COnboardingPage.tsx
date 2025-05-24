
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Target, Users, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const B2COnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState({
    goals: [] as string[],
    bio: '',
    preferences: {
      notifications: true,
      weeklyReports: true,
      emotionalCheckins: true
    }
  });
  
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const totalSteps = 3;
  
  const emotionalGoals = [
    { id: 'stress', label: 'Gérer le stress', icon: '🧘' },
    { id: 'anxiety', label: 'Réduire l\'anxiété', icon: '😌' },
    { id: 'mood', label: 'Améliorer l\'humeur', icon: '😊' },
    { id: 'sleep', label: 'Mieux dormir', icon: '😴' },
    { id: 'focus', label: 'Améliorer la concentration', icon: '🎯' },
    { id: 'relationships', label: 'Relations interpersonnelles', icon: '❤️' }
  ];

  const handleGoalToggle = (goalId: string) => {
    setOnboardingData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId) 
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const handlePreferenceChange = (preference: string, value: boolean) => {
    setOnboardingData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: value
      }
    }));
  };

  const completeOnboarding = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          preferences: {
            ...onboardingData.preferences,
            goals: onboardingData.goals,
            bio: onboardingData.bio
          }
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast.success('Bienvenue sur EmotionsCare ! Votre profil est maintenant configuré.');
      navigate('/b2c/dashboard');
    } catch (error) {
      toast.error('Erreur lors de la finalisation');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Heart className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Bienvenue sur EmotionsCare</h2>
              <p className="text-muted-foreground">
                Découvrons ensemble vos objectifs de bien-être émotionnel
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {emotionalGoals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => handleGoalToggle(goal.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-accent ${
                    onboardingData.goals.includes(goal.id) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{goal.icon}</div>
                    <div className="text-sm font-medium">{goal.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Parlez-nous de vous</h2>
              <p className="text-muted-foreground">
                Ces informations nous aideront à personnaliser votre expérience
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Décrivez brièvement votre situation actuelle (optionnel)
                </label>
                <Textarea
                  placeholder="Ex: Je traverse une période stressante au travail et j'aimerais apprendre à mieux gérer mes émotions..."
                  value={onboardingData.bio}
                  onChange={(e) => setOnboardingData(prev => ({ ...prev, bio: e.target.value }))}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Users className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Préférences de notifications</h2>
              <p className="text-muted-foreground">
                Configurez comment vous souhaitez être accompagné
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notifications"
                  checked={onboardingData.preferences.notifications}
                  onCheckedChange={(checked) => handlePreferenceChange('notifications', checked as boolean)}
                />
                <label htmlFor="notifications" className="text-sm font-medium">
                  Recevoir des rappels de check-in émotionnel
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="weeklyReports"
                  checked={onboardingData.preferences.weeklyReports}
                  onCheckedChange={(checked) => handlePreferenceChange('weeklyReports', checked as boolean)}
                />
                <label htmlFor="weeklyReports" className="text-sm font-medium">
                  Recevoir un rapport hebdomadaire de progression
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emotionalCheckins"
                  checked={onboardingData.preferences.emotionalCheckins}
                  onCheckedChange={(checked) => handlePreferenceChange('emotionalCheckins', checked as boolean)}
                />
                <label htmlFor="emotionalCheckins" className="text-sm font-medium">
                  Suggestions personnalisées basées sur mon humeur
                </label>
              </div>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-primary">Essai gratuit de 3 jours</p>
                  <p className="text-muted-foreground">
                    Vous bénéficiez de 3 jours d'accès complet gratuit à toutes les fonctionnalités d'EmotionsCare.
                  </p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900 dark:via-slate-800 dark:to-purple-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex space-x-2">
                {[...Array(totalSteps)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-8 rounded-full transition-colors ${
                      i < currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
            <CardTitle>Configuration de votre profil</CardTitle>
            <CardDescription>
              Étape {currentStep} sur {totalSteps}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Précédent
              </Button>
              
              <Button onClick={nextStep} disabled={isLoading}>
                {currentStep === totalSteps ? (
                  isLoading ? 'Finalisation...' : 'Commencer'
                ) : (
                  <>
                    Suivant
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2COnboardingPage;
