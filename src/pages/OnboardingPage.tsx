
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Heart, 
  Users, 
  Target,
  Sparkles
} from 'lucide-react';

const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      title: "Bienvenue sur EmotionsCare",
      description: "Découvrez votre plateforme de bien-être émotionnel",
      icon: Heart,
      content: (
        <div className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            EmotionsCare vous accompagne dans votre parcours de bien-être avec des outils innovants et personnalisés.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Heart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium">Scan émotionnel</h4>
              <p className="text-sm text-gray-600">Analysez vos émotions</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium">Communauté</h4>
              <p className="text-sm text-gray-600">Partagez et échangez</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium">Objectifs</h4>
              <p className="text-sm text-gray-600">Atteignez vos buts</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Configurez votre profil",
      description: "Personnalisez votre expérience",
      icon: Users,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Prénom</label>
              <input
                type="text"
                placeholder="Votre prénom"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nom</label>
              <input
                type="text"
                placeholder="Votre nom"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Objectifs principaux</label>
            <div className="grid grid-cols-2 gap-2">
              {['Réduire le stress', 'Améliorer le sommeil', 'Augmenter la confiance', 'Gérer les émotions'].map((goal) => (
                <label key={goal} className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">{goal}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Préférences et notifications",
      description: "Personnalisez vos alertes",
      icon: Target,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Notifications</h4>
            <div className="space-y-2">
              {[
                'Rappels quotidiens de scan émotionnel',
                'Suggestions personnalisées',
                'Événements communautaires',
                'Rapports hebdomadaires'
              ].map((item) => (
                <label key={item} className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">{item}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Meilleur moment pour les rappels</h4>
            <select className="w-full p-2 border rounded-md">
              <option>Matin (9h-12h)</option>
              <option>Après-midi (14h-17h)</option>
              <option>Soir (18h-21h)</option>
            </select>
          </div>
        </div>
      )
    },
    {
      title: "Tout est prêt !",
      description: "Commencez votre parcours bien-être",
      icon: Sparkles,
      content: (
        <div className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">
            Félicitations ! Votre profil est configuré et vous êtes prêt à commencer votre parcours de bien-être.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Button variant="outline" className="h-16">
              <div className="text-center">
                <Heart className="h-6 w-6 mx-auto mb-1" />
                <div className="text-sm">Premier scan émotionnel</div>
              </div>
            </Button>
            <Button variant="outline" className="h-16">
              <div className="text-center">
                <Users className="h-6 w-6 mx-auto mb-1" />
                <div className="text-sm">Explorer la communauté</div>
              </div>
            </Button>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-blue-950 dark:to-purple-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="overflow-hidden">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <StepIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
            <CardDescription>{currentStepData.description}</CardDescription>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Étape {currentStep + 1} sur {steps.length}</span>
                <Badge variant="secondary">{Math.round(progress)}% terminé</Badge>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentStepData.content}
            </motion.div>
          </CardContent>
          
          <div className="flex justify-between items-center p-6 bg-gray-50 dark:bg-gray-800/50">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Précédent
            </Button>
            
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep
                      ? 'bg-blue-600'
                      : completedSteps.includes(index)
                      ? 'bg-green-600'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <Button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className="flex items-center"
            >
              {currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;
