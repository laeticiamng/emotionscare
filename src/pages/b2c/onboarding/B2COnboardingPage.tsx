
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, ArrowLeft, Heart, Brain, Music, Target, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<{ onNext: () => void; onBack: () => void; }>;
}

const WelcomeStep: React.FC<{ onNext: () => void; onBack: () => void; }> = ({ onNext }) => (
  <div className="text-center space-y-6">
    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
      <Heart className="h-10 w-10 text-white" />
    </div>
    <div>
      <h2 className="text-2xl font-bold mb-4">Bienvenue sur EmotionsCare</h2>
      <p className="text-muted-foreground">
        Découvrez une plateforme innovante pour améliorer votre bien-être émotionnel
      </p>
    </div>
    <Button onClick={onNext} className="w-full">
      Commencer
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  </div>
);

const FeaturesStep: React.FC<{ onNext: () => void; onBack: () => void; }> = ({ onNext, onBack }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-center">Nos fonctionnalités</h2>
    <div className="grid grid-cols-1 gap-4">
      <div className="flex items-center space-x-4 p-4 bg-muted/20 rounded-lg">
        <Brain className="h-8 w-8 text-blue-500" />
        <div>
          <h3 className="font-semibold">Scanner émotionnel</h3>
          <p className="text-sm text-muted-foreground">Analysez vos émotions via texte, voix ou expressions</p>
        </div>
      </div>
      <div className="flex items-center space-x-4 p-4 bg-muted/20 rounded-lg">
        <Music className="h-8 w-8 text-purple-500" />
        <div>
          <h3 className="font-semibold">Musicothérapie</h3>
          <p className="text-sm text-muted-foreground">Musiques générées selon votre état émotionnel</p>
        </div>
      </div>
      <div className="flex items-center space-x-4 p-4 bg-muted/20 rounded-lg">
        <Target className="h-8 w-8 text-green-500" />
        <div>
          <h3 className="font-semibold">Coach IA</h3>
          <p className="text-sm text-muted-foreground">Accompagnement personnalisé pour votre bien-être</p>
        </div>
      </div>
    </div>
    <div className="flex space-x-4">
      <Button variant="outline" onClick={onBack} className="flex-1">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>
      <Button onClick={onNext} className="flex-1">
        Continuer
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  </div>
);

const PreferencesStep: React.FC<{ onNext: () => void; onBack: () => void; }> = ({ onNext, onBack }) => {
  const [preferences, setPreferences] = useState({
    notifications: true,
    dailyReminders: false,
    weeklyReports: true
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Vos préférences</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
          <div>
            <h3 className="font-semibold">Notifications</h3>
            <p className="text-sm text-muted-foreground">Recevoir des notifications importantes</p>
          </div>
          <Button
            variant={preferences.notifications ? "default" : "outline"}
            size="sm"
            onClick={() => setPreferences(prev => ({ ...prev, notifications: !prev.notifications }))}
          >
            {preferences.notifications ? "Activé" : "Désactivé"}
          </Button>
        </div>
        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
          <div>
            <h3 className="font-semibold">Rappels quotidiens</h3>
            <p className="text-sm text-muted-foreground">Rappel pour vos analyses quotidiennes</p>
          </div>
          <Button
            variant={preferences.dailyReminders ? "default" : "outline"}
            size="sm"
            onClick={() => setPreferences(prev => ({ ...prev, dailyReminders: !prev.dailyReminders }))}
          >
            {preferences.dailyReminders ? "Activé" : "Désactivé"}
          </Button>
        </div>
        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
          <div>
            <h3 className="font-semibold">Rapports hebdomadaires</h3>
            <p className="text-sm text-muted-foreground">Synthèse de votre évolution</p>
          </div>
          <Button
            variant={preferences.weeklyReports ? "default" : "outline"}
            size="sm"
            onClick={() => setPreferences(prev => ({ ...prev, weeklyReports: !prev.weeklyReports }))}
          >
            {preferences.weeklyReports ? "Activé" : "Désactivé"}
          </Button>
        </div>
      </div>
      <div className="flex space-x-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <Button onClick={onNext} className="flex-1">
          Terminer
          <CheckCircle className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const B2COnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Bienvenue',
      description: 'Introduction à EmotionsCare',
      icon: Heart,
      component: WelcomeStep
    },
    {
      id: 'features',
      title: 'Fonctionnalités',
      description: 'Découvrez nos outils',
      icon: Brain,
      component: FeaturesStep
    },
    {
      id: 'preferences',
      title: 'Préférences',
      description: 'Configurez votre expérience',
      icon: Target,
      component: PreferencesStep
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await updateProfile({
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString()
      });
      toast.success('Configuration terminée !');
      navigate('/b2c/dashboard');
    } catch (error) {
      toast.error('Erreur lors de la finalisation');
    } finally {
      setIsCompleting(false);
    }
  };

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
          <CardHeader className="text-center space-y-4">
            <div className="space-y-2">
              <div className="flex justify-center space-x-2">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Étape {currentStep + 1} sur {steps.length}
              </p>
            </div>
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
                <CurrentStepComponent onNext={handleNext} onBack={handleBack} />
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2COnboardingPage;
