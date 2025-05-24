
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain, Music } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            EmotionsCare
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Votre compagnon de bien-être émotionnel powered by AI
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Commencer
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Scanner d'émotions</CardTitle>
              <CardDescription>
                Analysez vos émotions avec l'IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Découvrez votre état émotionnel grâce à notre technologie avancée d'analyse.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <CardTitle>Coach IA</CardTitle>
              <CardDescription>
                Accompagnement personnalisé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Recevez des conseils adaptés à votre situation émotionnelle.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Music className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Musique thérapeutique</CardTitle>
              <CardDescription>
                Sons apaisants personnalisés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Découvrez des compositions adaptées à votre humeur.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
