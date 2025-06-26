
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VrHeadset, Play, Clock, Star, Mountain, Waves, TreePine, Home } from 'lucide-react';

const VRPage: React.FC = () => {
  const vrExperiences = [
    {
      id: 1,
      title: 'Plage Tropicale',
      description: 'Détendez-vous sur une plage paradisiaque avec le bruit des vagues',
      duration: '15 min',
      difficulty: 'Débutant',
      icon: Waves,
      color: 'from-blue-400 to-cyan-500',
      tags: ['Relaxation', 'Océan', 'Méditation']
    },
    {
      id: 2,
      title: 'Forêt Enchantée',
      description: 'Promenade apaisante dans une forêt mystique avec sons naturels',
      duration: '20 min',
      difficulty: 'Intermédiaire',
      icon: TreePine,
      color: 'from-green-400 to-emerald-500',
      tags: ['Nature', 'Marche', 'Zen']
    },
    {
      id: 3,
      title: 'Montagne Sacrée',
      description: 'Méditation guidée au sommet d\'une montagne avec vue panoramique',
      duration: '25 min',
      difficulty: 'Avancé',
      icon: Mountain,
      color: 'from-purple-400 to-pink-500',
      tags: ['Méditation', 'Altitude', 'Spirituel']
    },
    {
      id: 4,
      title: 'Cocon Domestique',
      description: 'Espace de relaxation personnalisé dans votre salon virtuel',
      duration: '10 min',
      difficulty: 'Débutant',
      icon: Home,
      color: 'from-orange-400 to-red-500',
      tags: ['Confort', 'Maison', 'Familier']
    }
  ];

  const difficultyColors = {
    'Débutant': 'bg-green-100 text-green-800',
    'Intermédiaire': 'bg-yellow-100 text-yellow-800',
    'Avancé': 'bg-red-100 text-red-800'
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
              <VrHeadset className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Réalité Virtuelle</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explorez des environnements immersifs conçus pour votre bien-être mental et votre relaxation
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">12</div>
              <div className="text-gray-600">Séances terminées</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">4h 32min</div>
              <div className="text-gray-600">Temps total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">85%</div>
              <div className="text-gray-600">Niveau de relaxation</div>
            </CardContent>
          </Card>
        </div>

        {/* VR Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {vrExperiences.map((experience) => {
            const IconComponent = experience.icon;
            return (
              <Card key={experience.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className={`h-32 bg-gradient-to-br ${experience.color} flex items-center justify-center`}>
                  <IconComponent className="h-16 w-16 text-white" />
                </div>
                
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">{experience.title}</CardTitle>
                      <CardDescription className="text-base">
                        {experience.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{experience.duration}</span>
                    </div>
                    <Badge className={difficultyColors[experience.difficulty as keyof typeof difficultyColors]}>
                      {experience.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {experience.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Play className="mr-2 h-4 w-4" />
                    Commencer l'expérience
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Section */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border-none">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Besoin d'un casque VR ?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Nos expériences fonctionnent avec la plupart des casques VR modernes. 
              Vous pouvez également profiter de certaines expériences sur votre ordinateur ou smartphone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline">
                Voir les casques compatibles
              </Button>
              <Button variant="outline">
                Mode sans casque
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VRPage;
