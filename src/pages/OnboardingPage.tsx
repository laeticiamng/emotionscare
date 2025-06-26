
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Brain, 
  Music, 
  Camera, 
  Users, 
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';

const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const navigate = useNavigate();

  const steps = [
    {
      title: "Bienvenue sur EmotionsCare",
      subtitle: "Votre compagnon pour le bien-être émotionnel",
      content: (
        <div className="text-center space-y-6">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
            <Heart className="h-16 w-16 text-white" />
          </div>
          <p className="text-lg text-gray-600">
            Découvrez une nouvelle façon de prendre soin de votre santé mentale 
            avec des outils innovants et personnalisés.
          </p>
        </div>
      )
    },
    {
      title: "Vos intérêts",
      subtitle: "Quels modules vous intéressent le plus ?",
      content: (
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'scan', icon: Camera, label: 'Scanner émotionnel' },
            { id: 'music', icon: Music, label: 'Thérapie musicale' },
            { id: 'coach', icon: Brain, label: 'Coach IA' },
            { id: 'journal', icon: Target, label: 'Journal personnel' },
            { id: 'vr', icon: Users, label: 'Réalité virtuelle' },
            { id: 'social', icon: Users, label: 'Cocon social' }
          ].map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card 
                className={`cursor-pointer transition-all ${
                  selectedPreferences.includes(option.id) 
                    ? 'bg-blue-50 border-blue-300 shadow-md' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => {
                  setSelectedPreferences(prev => 
                    prev.includes(option.id)
                      ? prev.filter(p => p !== option.id)
                      : [...prev, option.id]
                  );
                }}
              >
                <CardContent className="p-6 text-center">
                  <option.icon className={`h-8 w-8 mx-auto mb-3 ${
                    selectedPreferences.includes(option.id) ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                  <p className="font-medium">{option.label}</p>
                  {selectedPreferences.includes(option.id) && (
                    <CheckCircle className="h-5 w-5 text-blue-500 mx-auto mt-2" />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )
    },
    {
      title: "Objectifs personnels",
      subtitle: "Que souhaitez-vous améliorer ?",
      content: (
        <div className="space-y-4">
          {[
            'Réduire le stress et l\'anxiété',
            'Améliorer la gestion des émotions',
            'Développer la confiance en soi',
            'Renforcer les relations sociales',
            'Augmenter la motivation',
            'Améliorer la qualité du sommeil'
          ].map((goal, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedPreferences.includes(`goal-${index}`)
                  ? 'bg-green-50 border-green-300'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => {
                const goalId = `goal-${index}`;
                setSelectedPreferences(prev => 
                  prev.includes(goalId)
                    ? prev.filter(p => p !== goalId)
                    : [...prev, goalId]
                );
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{goal}</span>
                {selectedPreferences.includes(`goal-${index}`) && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )
    },
    {
      title: "Tout est prêt !",
      subtitle: "Votre parcours commence maintenant",
      content: (
        <div className="text-center space-y-6">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <CheckCircle className="h-16 w-16 text-white" />
          </div>
          <div className="space-y-4">
            <p className="text-lg text-gray-600">
              Félicitations ! Votre profil est configuré.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Conseil :</strong> Commencez par un scan émotionnel pour 
                établir votre état de bien-être actuel.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Terminer l'onboarding et rediriger vers le dashboard
      localStorage.setItem('onboarding-completed', 'true');
      localStorage.setItem('user-preferences', JSON.stringify(selectedPreferences));
      navigate('/b2c/dashboard');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4" data-testid="page-root">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8">
          <Progress value={progress} className="h-2 mb-4" />
          <div className="text-center text-sm text-gray-500">
            Étape {currentStep + 1} sur {steps.length}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-xl">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {steps[currentStep].title}
                </CardTitle>
                <p className="text-gray-600 text-lg mt-2">
                  {steps[currentStep].subtitle}
                </p>
              </CardHeader>
              <CardContent className="p-8">
                {steps[currentStep].content}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Précédent
          </Button>

          <Button
            onClick={nextStep}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            {currentStep === steps.length - 1 ? 'Commencer' : 'Suivant'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
