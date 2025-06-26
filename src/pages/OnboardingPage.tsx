
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Heart, 
  Target, 
  Users, 
  Sparkles,
  Brain,
  Shield,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userChoices, setUserChoices] = useState<Record<string, any>>({});
  const [isCompleting, setIsCompleting] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Bienvenue dans EmotionsCare',
      description: 'Découvrez votre parcours de bien-être personnalisé',
      icon: Heart,
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
            <Heart className="h-12 w-12 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Bonjour {user?.email?.split('@')[0]} !</h3>
            <p className="text-muted-foreground">
              Nous sommes ravis de vous accompagner dans votre parcours de bien-être émotionnel.
              Prenons quelques minutes pour personnaliser votre expérience.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
              <Brain className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Analyse émotionnelle</p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950">
              <Zap className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Recommandations IA</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'goals',
      title: 'Vos objectifs de bien-être',
      description: 'Définissez ce que vous souhaitez améliorer',
      icon: Target,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Target className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Quels sont vos objectifs principaux ?</h3>
            <p className="text-muted-foreground">Sélectionnez jusqu'à 3 objectifs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { id: 'stress', label: 'Réduire le stress', icon: '🧘' },
              { id: 'mood', label: 'Améliorer l\'humeur', icon: '😊' },
              { id: 'focus', label: 'Augmenter la concentration', icon: '🎯' },
              { id: 'sleep', label: 'Mieux dormir', icon: '😴' },
              { id: 'energy', label: 'Avoir plus d\'énergie', icon: '⚡' },
              { id: 'relations', label: 'Améliorer les relations', icon: '👥' }
            ].map((goal) => (
              <Button
                key={goal.id}
                variant={userChoices.goals?.includes(goal.id) ? 'default' : 'outline'}
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => {
                  const goals = userChoices.goals || [];
                  const updated = goals.includes(goal.id)
                    ? goals.filter((g: string) => g !== goal.id)
                    : goals.length < 3 ? [...goals, goal.id] : goals;
                  setUserChoices({ ...userChoices, goals: updated });
                }}
              >
                <span className="text-2xl">{goal.icon}</span>
                <span className="text-sm font-medium">{goal.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'preferences',
      title: 'Vos préférences',
      description: 'Personnalisez votre expérience',
      icon: Sparkles,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Sparkles className="h-16 w-16 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Comment préférez-vous recevoir du contenu ?</h3>
          </div>
          <div className="space-y-4">
            {[
              { id: 'visual', label: 'Contenu visuel (images, vidéos)', icon: '👁️' },
              { id: 'audio', label: 'Contenu audio (musique, méditations)', icon: '🎵' },
              { id: 'text', label: 'Contenu écrit (articles, exercices)', icon: '📝' },
              { id: 'interactive', label: 'Expériences interactives (VR, jeux)', icon: '🎮' }
            ].map((pref) => (
              <div
                key={pref.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  userChoices.contentPreferences?.includes(pref.id)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  const prefs = userChoices.contentPreferences || [];
                  const updated = prefs.includes(pref.id)
                    ? prefs.filter((p: string) => p !== pref.id)
                    : [...prefs, pref.id];
                  setUserChoices({ ...userChoices, contentPreferences: updated });
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{pref.icon}</span>
                  <span className="font-medium">{pref.label}</span>
                  {userChoices.contentPreferences?.includes(pref.id) && (
                    <Check className="h-5 w-5 text-blue-600 ml-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'privacy',
      title: 'Confidentialité et sécurité',
      description: 'Configurez vos paramètres de confidentialité',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Shield className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Vos données sont importantes</h3>
            <p className="text-muted-foreground">Configurez vos préférences de confidentialité</p>
          </div>
          <div className="space-y-4">
            {[
              {
                id: 'analytics',
                title: 'Données d\'usage anonymes',
                description: 'Nous aide à améliorer l\'application',
                default: true
              },
              {
                id: 'personalization',
                title: 'Personnalisation avancée',
                description: 'Recommandations basées sur vos habitudes',
                default: true
              },
              {
                id: 'sharing',
                title: 'Partage avec les professionnels',
                description: 'Permettre le partage avec votre thérapeute (si applicable)',
                default: false
              }
            ].map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex-1">
                  <h4 className="font-medium">{setting.title}</h4>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
                <Button
                  variant={userChoices.privacy?.[setting.id] !== false ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    const privacy = userChoices.privacy || {};
                    setUserChoices({
                      ...userChoices,
                      privacy: {
                        ...privacy,
                        [setting.id]: !privacy[setting.id]
                      }
                    });
                  }}
                >
                  {userChoices.privacy?.[setting.id] !== false ? 'Activé' : 'Désactivé'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'complete',
      title: 'Tout est prêt !',
      description: 'Votre profil est configuré',
      icon: Check,
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
            <Check className="h-12 w-12 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Félicitations !</h3>
            <p className="text-muted-foreground mb-6">
              Votre profil est maintenant configuré. Vous êtes prêt à commencer votre parcours de bien-être.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <Brain className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Scan émotionnel</p>
              <p className="text-xs text-muted-foreground">Analysez votre état</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <Heart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Coach IA</p>
              <p className="text-xs text-muted-foreground">Accompagnement personnalisé</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <Sparkles className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Activités</p>
              <p className="text-xs text-muted-foreground">Musique, VR, journal</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

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
    setIsCompleting(true);
    try {
      // Simulate API call to save onboarding data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Onboarding terminé !",
        description: "Votre profil a été configuré avec succès.",
      });
      
      // Redirect to dashboard based on user type
      if (user?.user_metadata?.userType === 'b2b_admin') {
        navigate('/b2b/admin/dashboard');
      } else if (user?.user_metadata?.userType === 'b2b_user') {
        navigate('/b2b/user/dashboard');
      } else {
        navigate('/b2c/dashboard');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de finaliser l'onboarding. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4">
              Étape {currentStep + 1} sur {steps.length}
            </Badge>
            <Progress value={progress} className="mb-4" />
            <h1 className="text-3xl font-bold mb-2">{steps[currentStep].title}</h1>
            <p className="text-muted-foreground">{steps[currentStep].description}</p>
          </div>

          {/* Content */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {steps[currentStep].content}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </Button>

            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleComplete}
                disabled={isCompleting}
                className="flex items-center gap-2"
              >
                {isCompleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Finalisation...
                  </>
                ) : (
                  <>
                    Commencer
                    <Check className="h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
