
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Bienvenue sur EmotionsCare',
      description: 'Votre plateforme de bien-être émotionnel personnalisée',
      content: 'Nous sommes ravis de vous accompagner dans votre parcours de développement personnel et de bien-être émotionnel.'
    },
    {
      title: 'Découvrez nos modules',
      description: 'Des outils puissants pour votre équilibre',
      content: 'Journal émotionnel, musicothérapie, scanner émotionnel, coach IA et bien plus encore vous attendent.'
    },
    {
      title: 'Personnalisez votre expérience',
      description: 'Adaptez la plateforme à vos besoins',
      content: 'Configurez vos préférences pour une expérience sur mesure qui évolue avec vous.'
    },
    {
      title: 'Prêt à commencer',
      description: 'Votre voyage vers le bien-être commence maintenant',
      content: 'Explorez votre tableau de bord et découvrez tous les outils à votre disposition.'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/b2c/dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Heart className="h-12 w-12 text-pink-500" />
            </div>
            <div className="flex justify-center space-x-2 mb-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index <= currentStep ? 'bg-pink-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="text-gray-600 dark:text-gray-300"
            >
              {steps[currentStep].content}
            </motion.div>

            <div className="flex justify-between pt-6">
              <Button
                onClick={handlePrevious}
                variant="outline"
                disabled={currentStep === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Précédent
              </Button>

              <Button
                onClick={handleNext}
                className="bg-pink-500 hover:bg-pink-600"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Commencer
                  </>
                ) : (
                  <>
                    Suivant
                    <ArrowRight className="ml-2 h-4 w-4" />
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

export default OnboardingPage;
