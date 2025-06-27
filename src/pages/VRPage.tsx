
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  VrBoxIcon, 
  Play, 
  Settings, 
  Users, 
  Clock,
  Star,
  Headphones,
  Volume2
} from 'lucide-react';

const VRPage: React.FC = () => {
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);

  const vrExperiences = [
    {
      id: 'forest-calm',
      title: 'Forêt Apaisante',
      description: 'Immersion dans une forêt calme pour réduire le stress',
      duration: '15 min',
      difficulty: 'Débutant',
      category: 'Relaxation'
    },
    {
      id: 'ocean-waves',
      title: 'Vagues Océaniques',
      description: 'Méditation guidée au bord de l\'océan',
      duration: '20 min',
      difficulty: 'Intermédiaire',
      category: 'Méditation'
    },
    {
      id: 'mountain-peak',
      title: 'Sommet Montagneux',
      description: 'Exercices de respiration en altitude',
      duration: '25 min',
      difficulty: 'Avancé',
      category: 'Respiration'
    },
    {
      id: 'space-journey',
      title: 'Voyage Spatial',
      description: 'Exploration de l\'espace pour stimuler la créativité',
      duration: '30 min',
      difficulty: 'Intermédiaire',
      category: 'Créativité'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <VrBoxIcon className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Expériences VR
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Plongez dans des environnements immersifs pour votre bien-être émotionnel
          </p>
        </div>

        {/* VR Status */}
        <Card className="mb-8 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <VrBoxIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Casque VR Détecté</h3>
                  <p className="text-gray-600">Meta Quest 2 - Connecté</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Prêt
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Expériences VR */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {vrExperiences.map((experience) => (
            <Card 
              key={experience.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedExperience === experience.id ? 'ring-2 ring-purple-500' : ''
              }`}
              onClick={() => setSelectedExperience(experience.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{experience.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{experience.duration}</span>
                  </div>
                </div>
                <CardTitle className="text-xl">{experience.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{experience.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{experience.difficulty}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">4.8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contrôles */}
        {selectedExperience && (
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Lancer l'expérience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  <Play className="h-5 w-5 mr-2" />
                  Commencer
                </Button>
                <Button variant="outline" size="lg">
                  <Settings className="h-5 w-5 mr-2" />
                  Paramètres
                </Button>
                <Button variant="outline" size="lg">
                  <Users className="h-5 w-5 mr-2" />
                  Mode Groupe
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-gray-500" />
                  <span className="text-sm">Audio spatial activé</span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-gray-500" />
                  <span className="text-sm">Volume : 75%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VRPage;
