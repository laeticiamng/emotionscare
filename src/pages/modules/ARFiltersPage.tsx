
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Smile, Heart, Star } from 'lucide-react';

const ARFiltersPage: React.FC = () => {
  const filters = [
    { id: 1, name: 'Zen Aura', emotion: 'Calme', color: 'from-blue-400 to-cyan-300' },
    { id: 2, name: 'Joy Burst', emotion: 'Joie', color: 'from-yellow-400 to-orange-300' },
    { id: 3, name: 'Confidence Glow', emotion: 'Confiance', color: 'from-purple-400 to-pink-300' },
    { id: 4, name: 'Focus Beam', emotion: 'Concentration', color: 'from-green-400 to-teal-300' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Filtres AR Émotionnels</h1>
          <p className="text-muted-foreground">Visualisez et partagez vos émotions en réalité augmentée</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Caméra AR
              </CardTitle>
              <CardDescription>Activez votre caméra pour commencer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-gradient-to-br from-muted to-accent rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Camera className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Caméra non activée</p>
                </div>
              </div>
              
              <Button className="w-full">
                <Camera className="h-4 w-4 mr-2" />
                Activer la caméra AR
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smile className="h-5 w-5" />
                Votre État Émotionnel
              </CardTitle>
              <CardDescription>Détection automatique basée sur votre expression</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-3">
                <div className="h-16 w-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto flex items-center justify-center">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="font-medium">État Détecté: Sérénité</p>
                  <p className="text-sm text-muted-foreground">Confiance: 87%</p>
                </div>
                <Badge variant="secondary">Filtre recommandé: Zen Aura</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Filtres Disponibles
            </CardTitle>
            <CardDescription>Choisissez un filtre selon votre humeur</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filters.map((filter) => (
                <div key={filter.id} className="space-y-3">
                  <div className={`aspect-square bg-gradient-to-br ${filter.color} rounded-lg flex items-center justify-center`}>
                    <span className="text-white font-medium">{filter.name}</span>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">{filter.name}</p>
                    <p className="text-xs text-muted-foreground">{filter.emotion}</p>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    Appliquer
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ARFiltersPage;
