
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Headphones, Star, Rocket, Globe } from 'lucide-react';

const VRGalactiquePage: React.FC = () => {
  const experiences = [
    { id: 1, name: 'Nébuleuse Zen', difficulty: 'Débutant', duration: '10 min', color: 'from-purple-400 to-pink-300' },
    { id: 2, name: 'Voyage Intergalactique', difficulty: 'Intermédiaire', duration: '20 min', color: 'from-blue-400 to-cyan-300' },
    { id: 3, name: 'Trou Noir Méditatif', difficulty: 'Avancé', duration: '30 min', color: 'from-gray-700 to-black' },
    { id: 4, name: 'Aurore Cosmique', difficulty: 'Expert', duration: '45 min', color: 'from-green-400 to-blue-500' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">VR Galactique</h1>
          <p className="text-muted-foreground">Explorez l'univers intérieur à travers l'espace cosmique</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5" />
                Casque VR Détecté
              </CardTitle>
              <CardDescription>Meta Quest 3 - Prêt pour l'exploration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center p-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-lg">
                <div className="text-center text-white space-y-2">
                  <Globe className="h-12 w-12 mx-auto" />
                  <p className="font-medium">Univers Prêt</p>
                  <p className="text-sm opacity-80">Connexion établie</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Batterie:</span>
                  <span className="text-green-500">87%</span>
                </div>
                <div className="flex justify-between">
                  <span>Suivi:</span>
                  <span className="text-green-500">Optimal</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Progression Cosmique
              </CardTitle>
              <CardDescription>Votre voyage à travers les dimensions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-3">
                <div className="h-16 w-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto flex items-center justify-center">
                  <Rocket className="h-8 w-8 text-white" />
                </div>
                
                <div>
                  <p className="font-medium">Explorateur Galactique</p>
                  <p className="text-sm text-muted-foreground">Niveau 7</p>
                </div>
                
                <div className="flex justify-center gap-2">
                  <Badge variant="secondary">23 Systèmes explorés</Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">156</p>
                  <p className="text-xs text-muted-foreground">Minutes méditées</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">8</p>
                  <p className="text-xs text-muted-foreground">Planètes visitées</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Expériences Disponibles</CardTitle>
            <CardDescription>Choisissez votre destination cosmique</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="border rounded-lg p-4 space-y-3">
                  <div className={`h-24 bg-gradient-to-r ${exp.color} rounded-md flex items-center justify-center`}>
                    <span className="text-white font-medium">{exp.name}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{exp.difficulty}</Badge>
                    <span className="text-sm text-muted-foreground">{exp.duration}</span>
                  </div>
                  
                  <Button className="w-full">
                    <Rocket className="h-4 w-4 mr-2" />
                    Lancer l'expérience
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

export default VRGalactiquePage;
