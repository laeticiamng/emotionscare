
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { Heart, Target, Bell, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const B2COnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    notifications: true,
    reminderTime: '09:00',
    goals: [] as string[],
    interests: [] as string[]
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  const steps = [
    {
      title: 'Bienvenue sur EmotionsCare',
      description: 'Découvrez votre plateforme de bien-être émotionnel',
      icon: Heart,
      content: (
        <div className="text-center space-y-4">
          <div className="mx-auto p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit">
            <Heart className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold">Bienvenue {user?.user_metadata?.name || 'sur EmotionsCare'} !</h3>
          <p className="text-muted-foreground">
            Vous avez 3 jours gratuits pour explorer toutes les fonctionnalités de notre plateforme.
          </p>
          <ul className="text-left space-y-2 text-sm">
            <li>✨ Scanner d'émotions par IA</li>
            <li>🤖 Coach personnel intelligent</li>
            <li>🎵 Musicothérapie personnalisée</li>
            <li>📖 Journal personnel avec analyses</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Définissez vos objectifs',
      description: 'Que souhaitez-vous améliorer dans votre vie ?',
      icon: Target,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quels sont vos objectifs de bien-être ?</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              'Gérer le stress',
              'Améliorer le sommeil',
              'Développer la confiance',
              'Contrôler l\'anxiété',
              'Améliorer l\'humeur',
              'Développer la résilience'
            ].map((goal) => (
              <Button
                key={goal}
                variant={preferences.goals.includes(goal) ? "default" : "outline"}
                onClick={() => {
                  setPreferences(prev => ({
                    ...prev,
                    goals: prev.goals.includes(goal)
                      ? prev.goals.filter(g => g !== goal)
                      : [...prev.goals, goal]
                  }));
                }}
                className="text-xs"
              >
                {goal}
              </Button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Notifications',
      description: 'Configurez vos rappels de bien-être',
      icon: Bell,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Restez connecté à votre bien-être</h3>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferences.notifications}
              onChange={(e) => setPreferences(prev => ({ ...prev, notifications: e.target.checked }))}
              className="rounded"
            />
            <label>Recevoir des rappels quotidiens</label>
          </div>
          {preferences.notifications && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Heure de rappel :</label>
              <input
                type="time"
                value={preferences.reminderTime}
                onChange={(e) => setPreferences(prev => ({ ...prev, reminderTime: e.target.value }))}
                className="w-full p-2 border rounded"
              />
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Prêt à commencer !',
      description: 'Votre profil est configuré',
      icon: CheckCircle,
      content: (
        <div className="text-center space-y-4">
          <div className="mx-auto p-4 bg-green-100 dark:bg-green-900/30 rounded-full w-fit">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold">Tout est prêt !</h3>
          <p className="text-muted-foreground">
            Votre profil de bien-être est maintenant configuré. Commençons votre voyage vers un meilleur équilibre émotionnel.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              💡 Astuce : Commencez par un scan d'émotions pour établir votre baseline de bien-être !
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    try {
      // Sauvegarder les préférences utilisateur
      toast.success('Configuration terminée !');
      navigate('/b2c/dashboard');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900 dark:via-slate-800 dark:to-purple-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mb-4">
              <span>Étape {currentStep + 1} sur {steps.length}</span>
            </div>
            <Progress value={progress} className="mb-4" />
            <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
            <CardDescription>{currentStepData.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              {currentStepData.content}
            </motion.div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                Précédent
              </Button>
              
              <Button onClick={nextStep}>
                {currentStep === steps.length - 1 ? 'Commencer !' : 'Suivant'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2COnboardingPage;
