
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, User, Target, Bell, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const B2COnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [onboardingData, setOnboardingData] = useState({
    goals: [] as string[],
    notifications: true,
    preferences: {
      sessionFrequency: 'daily',
      reminderTime: '18:00'
    }
  });

  const goals = [
    { id: 'stress', label: 'Gérer le stress', description: 'Techniques de relaxation et gestion du stress' },
    { id: 'sleep', label: 'Améliorer le sommeil', description: 'Méditations et sons apaisants pour dormir' },
    { id: 'anxiety', label: 'Réduire l\'anxiété', description: 'Exercices de respiration et coaching personnalisé' },
    { id: 'mood', label: 'Améliorer l\'humeur', description: 'Suivi émotionnel et conseils positifs' },
    { id: 'focus', label: 'Augmenter la concentration', description: 'Méditations de pleine conscience' },
    { id: 'relationships', label: 'Améliorer les relations', description: 'Conseils pour la communication émotionnelle' }
  ];

  const handleGoalToggle = (goalId: string) => {
    setOnboardingData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(id => id !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    setIsLoading(true);
    try {
      // Ici, vous pourriez sauvegarder les données d'onboarding
      toast.success('Bienvenue dans EmotionsCare ! Votre profil a été configuré.');
      navigate('/b2c/dashboard');
    } catch (error) {
      toast.error('Erreur lors de la configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-full w-fit">
            <Heart className="h-8 w-8 text-red-500" />
          </div>
          <CardTitle className="text-2xl">Bienvenue dans EmotionsCare</CardTitle>
          <CardDescription>
            Commençons par configurer votre profil pour une expérience personnalisée
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Bonjour {user?.name} !</h3>
            <p className="text-muted-foreground">
              Vous avez <strong>3 jours gratuits</strong> pour découvrir toutes nos fonctionnalités.
              Nous allons personnaliser votre expérience en quelques étapes simples.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <User className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h4 className="font-medium">Étape 1</h4>
              <p className="text-sm text-muted-foreground">Définir vos objectifs</p>
            </div>
            <div className="p-4 border rounded-lg">
              <Bell className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h4 className="font-medium">Étape 2</h4>
              <p className="text-sm text-muted-foreground">Configurer les notifications</p>
            </div>
            <div className="p-4 border rounded-lg">
              <Target className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <h4 className="font-medium">Étape 3</h4>
              <p className="text-sm text-muted-foreground">Personnaliser vos préférences</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Quels sont vos objectifs ?</CardTitle>
          <CardDescription>
            Sélectionnez les domaines dans lesquels vous souhaitez progresser
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  onboardingData.goals.includes(goal.id)
                    ? 'border-primary bg-primary/10'
                    : 'border-muted hover:border-primary/50'
                }`}
                onClick={() => handleGoalToggle(goal.id)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={onboardingData.goals.includes(goal.id)}
                    onChange={() => handleGoalToggle(goal.id)}
                  />
                  <div>
                    <h4 className="font-medium">{goal.label}</h4>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Préférences et notifications</CardTitle>
          <CardDescription>
            Configurez votre expérience selon vos habitudes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="frequency">Fréquence des sessions recommandée</Label>
              <select 
                id="frequency"
                className="w-full mt-1 p-2 border rounded-md"
                value={onboardingData.preferences.sessionFrequency}
                onChange={(e) => setOnboardingData(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, sessionFrequency: e.target.value }
                }))}
              >
                <option value="daily">Quotidienne</option>
                <option value="weekly">Hebdomadaire</option>
                <option value="custom">Personnalisée</option>
              </select>
            </div>

            <div>
              <Label htmlFor="reminderTime">Heure de rappel préférée</Label>
              <Input
                id="reminderTime"
                type="time"
                value={onboardingData.preferences.reminderTime}
                onChange={(e) => setOnboardingData(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, reminderTime: e.target.value }
                }))}
                className="mt-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="notifications"
                checked={onboardingData.notifications}
                onCheckedChange={(checked) => setOnboardingData(prev => ({
                  ...prev,
                  notifications: checked as boolean
                }))}
              />
              <Label htmlFor="notifications">
                Recevoir des notifications pour les rappels de bien-être
              </Label>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
              🎉 Votre période d'essai gratuite
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              Profitez de 3 jours gratuits pour explorer toutes les fonctionnalités d'EmotionsCare.
              Aucune carte de crédit requise !
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-red-900 dark:via-slate-800 dark:to-pink-900 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-6">
        {/* Indicateur de progression */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      step < currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contenu de l'étape */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        {/* Boutons de navigation */}
        <div className="flex justify-between max-w-2xl mx-auto">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Précédent
          </Button>

          <Button
            onClick={handleNext}
            disabled={isLoading || (currentStep === 2 && onboardingData.goals.length === 0)}
            className="flex items-center gap-2"
          >
            {currentStep === 3 ? 'Terminer' : 'Suivant'}
            {currentStep < 3 ? <ArrowRight className="h-4 w-4" /> : null}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default B2COnboardingPage;
