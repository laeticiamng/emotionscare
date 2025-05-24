
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Heart, Brain, Music, Target, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const B2COnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    goals: [] as string[],
    interests: [] as string[],
    experience: ''
  });
  const navigate = useNavigate();

  const steps = [
    {
      title: 'Bienvenue dans EmotionsCare !',
      description: 'Votre parcours de bien-être émotionnel commence ici',
      icon: Heart,
      content: (
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            EmotionsCare utilise l'intelligence artificielle pour vous accompagner 
            dans votre développement émotionnel personnel.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              ✨ Votre période d'essai gratuite de 3 jours est activée !
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Vos objectifs',
      description: 'Que souhaitez-vous améliorer ?',
      icon: Target,
      content: (
        <div className="space-y-4">
          {[
            'Gestion du stress',
            'Améliorer ma confiance en moi',
            'Mieux comprendre mes émotions',
            'Développer ma créativité',
            'Améliorer mes relations',
            'Trouver l\'équilibre travail-vie'
          ].map(goal => (
            <Button
              key={goal}
              variant={preferences.goals.includes(goal) ? 'default' : 'outline'}
              className="w-full justify-start"
              onClick={() => {
                setPreferences(prev => ({
                  ...prev,
                  goals: prev.goals.includes(goal)
                    ? prev.goals.filter(g => g !== goal)
                    : [...prev.goals, goal]
                }));
              }}
            >
              {preferences.goals.includes(goal) && <CheckCircle className="mr-2 h-4 w-4" />}
              {goal}
            </Button>
          ))}
        </div>
      )
    },
    {
      title: 'Vos centres d\'intérêt',
      description: 'Quels sont vos domaines de prédilection ?',
      icon: Brain,
      content: (
        <div className="space-y-4">
          {[
            'Méditation et mindfulness',
            'Musique et sons apaisants',
            'Exercices de respiration',
            'Journal personnel',
            'Coaching motivationnel',
            'Développement personnel'
          ].map(interest => (
            <Button
              key={interest}
              variant={preferences.interests.includes(interest) ? 'default' : 'outline'}
              className="w-full justify-start"
              onClick={() => {
                setPreferences(prev => ({
                  ...prev,
                  interests: prev.interests.includes(interest)
                    ? prev.interests.filter(i => i !== interest)
                    : [...prev.interests, interest]
                }));
              }}
            >
              {preferences.interests.includes(interest) && <CheckCircle className="mr-2 h-4 w-4" />}
              {interest}
            </Button>
          ))}
        </div>
      )
    },
    {
      title: 'Prêt à commencer !',
      description: 'Votre profil est configuré',
      icon: Music,
      content: (
        <div className="text-center space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-green-700 dark:text-green-300 font-medium">
              🎉 Configuration terminée !
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              Vous pouvez maintenant découvrir toutes les fonctionnalités d'EmotionsCare.
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Prochaines étapes :</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Scanner vos émotions avec l'IA</li>
              <li>• Discuter avec votre coach personnel</li>
              <li>• Découvrir la musique adaptée à votre humeur</li>
              <li>• Tenir votre journal émotionnel</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finaliser l'onboarding
      toast.success('Bienvenue dans EmotionsCare !');
      navigate('/b2c/dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit">
              <Icon className="h-8 w-8 text-blue-500" />
            </div>
            <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
            <CardDescription>{currentStepData.description}</CardDescription>
            
            {/* Progress indicator */}
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-8 rounded-full ${
                      index <= currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="min-h-[300px]">
              {currentStepData.content}
            </div>
            
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                Précédent
              </Button>
              <Button onClick={handleNext}>
                {currentStep === steps.length - 1 ? 'Commencer' : 'Suivant'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2COnboardingPage;
