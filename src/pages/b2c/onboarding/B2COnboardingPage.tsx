
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Heart, 
  Brain, 
  Music, 
  Users, 
  Target, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';
import { toast } from 'sonner';

const onboardingSteps = [
  {
    id: 'welcome',
    title: 'Bienvenue sur EmotionsCare !',
    description: 'Votre plateforme de bien-être émotionnel personnalisée',
    icon: Heart,
    content: (
      <div className="space-y-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-10 w-10 text-blue-600" />
          </div>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            Découvrez comment l'IA peut vous aider à mieux comprendre et gérer vos émotions au quotidien.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Brain className="h-6 w-6 text-blue-600 mb-2" />
            <h4 className="font-medium">Analyse IA</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Scanner émotionnel intelligent
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Music className="h-6 w-6 text-green-600 mb-2" />
            <h4 className="font-medium">Musique adaptée</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Thérapie sonore personnalisée
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'features',
    title: 'Vos outils de bien-être',
    description: 'Découvrez les fonctionnalités qui vous accompagneront',
    icon: Sparkles,
    content: (
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <Brain className="h-6 w-6 text-blue-600" />
            <div>
              <h4 className="font-medium">Scanner d'émotions</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Analysez vos émotions par texte, audio ou emojis
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <Users className="h-6 w-6 text-green-600" />
            <div>
              <h4 className="font-medium">Coach IA personnel</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Conseils adaptés à votre situation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <Music className="h-6 w-6 text-purple-600" />
            <div>
              <h4 className="font-medium">Musique thérapeutique</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Sons et mélodies pour votre bien-être
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'trial',
    title: 'Votre essai gratuit',
    description: '3 jours pour découvrir toutes les fonctionnalités',
    icon: Target,
    content: (
      <div className="space-y-4">
        <div className="text-center">
          <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            3 jours gratuits
          </Badge>
          <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-4">
            Profitez de toutes les fonctionnalités premium
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="text-sm">Accès illimité au scanner d'émotions</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="text-sm">Coach IA personnel 24h/24</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="text-sm">Génération musicale illimitée</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="text-sm">Journal personnel et analyses</span>
          </div>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Astuce :</strong> Commencez par faire un premier scan de vos émotions pour personnaliser votre expérience !
          </p>
        </div>
      </div>
    )
  }
];

const B2COnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    setIsCompleting(true);
    try {
      // Marquer l'onboarding comme terminé
      // Ici on pourrait faire un appel API pour sauvegarder cette information
      toast.success('Bienvenue dans EmotionsCare !');
      navigate('/b2c/dashboard');
    } catch (error) {
      toast.error('Erreur lors de la finalisation');
    } finally {
      setIsCompleting(false);
    }
  };

  const currentStepData = onboardingSteps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-900/20 dark:via-slate-900 dark:to-blue-800/20 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center space-x-2 mb-4">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index <= currentStep 
                      ? 'bg-blue-600' 
                      : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                />
              ))}
            </div>
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
              <Icon className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-800 dark:text-blue-300">
              {currentStepData.title}
            </CardTitle>
            <CardDescription className="text-lg">
              {currentStepData.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStepData.content}
            </motion.div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                Précédent
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={isCompleting}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                {isCompleting ? (
                  'Finalisation...'
                ) : currentStep === onboardingSteps.length - 1 ? (
                  <>
                    Commencer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Suivant
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            {user && (
              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/b2c/dashboard')}
                  className="text-sm"
                >
                  Passer l'introduction
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2COnboardingPage;
