
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Brain, 
  Music, 
  MessageCircle, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const B2COnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  const steps: OnboardingStep[] = [
    {
      id: 0,
      title: "Bienvenue dans votre espace bien-être !",
      description: "Découvrez comment EmotionsCare va transformer votre quotidien",
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
            <Heart className="h-12 w-12 text-pink-500" />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Votre parenthèse personnelle vous attend</h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Nous allons vous guider pour créer un espace de bien-être adapté à vos besoins uniques.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                ✨ Période d'essai gratuite de 3 jours activée
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: "Comment vous sentez-vous aujourd'hui ?",
      description: "Votre état émotionnel nous aide à personnaliser votre expérience",
      icon: <Brain className="h-8 w-8 text-blue-500" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center">Évaluez votre bien-être actuel</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { emoji: '😊', label: 'Excellent', value: 5 },
              { emoji: '🙂', label: 'Bien', value: 4 },
              { emoji: '😐', label: 'Neutre', value: 3 },
              { emoji: '😔', label: 'Difficile', value: 2 },
              { emoji: '😰', label: 'Très difficile', value: 1 }
            ].map((mood) => (
              <Button
                key={mood.value}
                variant={responses.currentMood === mood.value ? "default" : "outline"}
                className="h-16 flex flex-col gap-2"
                onClick={() => setResponses(prev => ({ ...prev, currentMood: mood.value }))}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-sm">{mood.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Quels sont vos objectifs ?",
      description: "Dites-nous ce qui compte le plus pour vous",
      icon: <Sparkles className="h-8 w-8 text-purple-500" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center">Vos priorités bien-être</h3>
          <div className="space-y-3">
            {[
              'Réduire le stress au quotidien',
              'Améliorer la gestion des émotions',
              'Développer la confiance en soi',
              'Retrouver l\'équilibre travail-vie',
              'Améliorer les relations interpersonnelles',
              'Cultiver la pleine conscience'
            ].map((goal) => (
              <label key={goal} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={responses.goals?.includes(goal) || false}
                  onChange={(e) => {
                    const currentGoals = responses.goals || [];
                    if (e.target.checked) {
                      setResponses(prev => ({ 
                        ...prev, 
                        goals: [...currentGoals, goal] 
                      }));
                    } else {
                      setResponses(prev => ({ 
                        ...prev, 
                        goals: currentGoals.filter((g: string) => g !== goal) 
                      }));
                    }
                  }}
                  className="rounded"
                />
                <span className="text-sm">{goal}</span>
              </label>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Découvrez nos fonctionnalités",
      description: "Voici comment nous allons vous accompagner",
      icon: <Music className="h-8 w-8 text-green-500" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center">Vos outils de bien-être</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Brain className="h-8 w-8 text-blue-500" />
              <div>
                <h4 className="font-medium">Scanner émotionnel</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Analysez vos émotions via texte, audio ou émojis
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Music className="h-8 w-8 text-green-500" />
              <div>
                <h4 className="font-medium">Musique adaptée</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Compositions personnalisées selon votre état
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <MessageCircle className="h-8 w-8 text-purple-500" />
              <div>
                <h4 className="font-medium">Coach personnel</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Accompagnement IA adapté à vos besoins
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Tout est prêt !",
      description: "Votre espace personnalisé est configuré",
      icon: <Check className="h-8 w-8 text-green-500" />,
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
            <Check className="h-12 w-12 text-green-500" />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Bienvenue dans votre nouvelle routine bien-être !</h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Votre parcours personnalisé est maintenant configuré. 
              Commencez dès maintenant votre première session.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
              <p className="text-sm font-medium">
                💡 Conseil : Utilisez le scanner émotionnel quotidiennement pour de meilleurs résultats
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Save onboarding responses to user profile
      await updateProfile({
        onboarding_completed: true,
        onboarding_responses: responses,
        emotional_score: responses.currentMood ? responses.currentMood * 20 : 60
      });

      toast.success('Configuration terminée ! Bienvenue dans votre espace bien-être.');
      navigate('/b2c/dashboard');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde. Redirection vers le tableau de bord...');
      navigate('/b2c/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-8">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Étape {currentStep + 1} sur {steps.length}</span>
                  <span className="text-sm text-slate-600">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Step Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                  {currentStepData.icon}
                </div>
                <h2 className="text-2xl font-bold mb-2">{currentStepData.title}</h2>
                <p className="text-slate-600 dark:text-slate-400">{currentStepData.description}</p>
              </div>

              {/* Step Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8"
                >
                  {currentStepData.content}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Précédent
                </Button>

                {currentStep === steps.length - 1 ? (
                  <Button
                    onClick={handleComplete}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
                  >
                    {isLoading ? 'Configuration...' : 'Commencer mon parcours'}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default B2COnboardingPage;
