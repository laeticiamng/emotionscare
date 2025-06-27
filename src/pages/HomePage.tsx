
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Sparkles } from 'lucide-react';

const HomePage: React.FC = () => {
  console.log('🏠 HomePage - Rendering home page');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
            <Heart className="h-8 w-8 text-red-500" />
            EmotionsCare
            <Sparkles className="h-8 w-8 text-yellow-500" />
          </h1>
          <p className="text-xl text-gray-600">
            Votre plateforme de bien-être émotionnel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>🎵 Musique Thérapeutique</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Génération de musique basée sur vos émotions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔍 Analyse Émotionnelle</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Scan et analyse de votre état émotionnel
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🧘 Réalité Virtuelle</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Expériences immersives de relaxation
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Application chargée avec succès • {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
