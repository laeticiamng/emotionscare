
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Button
          onClick={() => navigate('/b2c/dashboard')}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Aller au tableau de bord
        </Button>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Heart className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Bienvenue dans EmotionsCare</CardTitle>
            <CardDescription>
              Commençons votre parcours de bien-être émotionnel
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Configuration de votre profil</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Nous allons personnaliser votre expérience pour mieux vous accompagner
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium text-green-800 dark:text-green-300">Étape 1</h4>
                  <p className="text-sm text-green-600 dark:text-green-400">Définir vos objectifs de bien-être</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-300">Étape 2</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Configurer vos préférences</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h4 className="font-medium text-purple-800 dark:text-purple-300">Étape 3</h4>
                  <p className="text-sm text-purple-600 dark:text-purple-400">Découvrir les fonctionnalités</p>
                </div>
              </div>

              <Button 
                onClick={() => navigate('/b2c/dashboard')}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                Commencer l'aventure
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;
