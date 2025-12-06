// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, Star, Users } from 'lucide-react';

interface VREnvironment {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  category: 'Méditation' | 'Relaxation' | 'Énergie' | 'Focus';
  rating: number;
  participants?: number;
  thumbnail: string;
  isPopular?: boolean;
}

interface VREnvironmentSelectorProps {
  onSelectEnvironment?: (environment: VREnvironment) => void;
  className?: string;
}

const VREnvironmentSelector: React.FC<VREnvironmentSelectorProps> = ({
  onSelectEnvironment,
  className = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  
  const environments: VREnvironment[] = [
    {
      id: '1',
      name: 'Forêt Enchantée',
      description: 'Plongez dans une forêt mystique avec des sons apaisants',
      duration: 15,
      difficulty: 'Débutant',
      category: 'Méditation',
      rating: 4.8,
      participants: 1247,
      thumbnail: '/images/vr-forest.jpg',
      isPopular: true
    },
    {
      id: '2',
      name: 'Plage au Coucher de Soleil',
      description: 'Relaxez-vous sur une plage tropicale au coucher du soleil',
      duration: 20,
      difficulty: 'Débutant',
      category: 'Relaxation',
      rating: 4.9,
      participants: 892,
      thumbnail: '/images/vr-beach.jpg'
    },
    {
      id: '3',
      name: 'Montagne Énergisante',
      description: 'Rechargez vos batteries au sommet d\'une montagne',
      duration: 12,
      difficulty: 'Intermédiaire',
      category: 'Énergie',
      rating: 4.6,
      participants: 543,
      thumbnail: '/images/vr-mountain.jpg'
    },
    {
      id: '4',
      name: 'Espace Cosmique',
      description: 'Méditation dans l\'immensité de l\'espace',
      duration: 25,
      difficulty: 'Avancé',
      category: 'Focus',
      rating: 4.7,
      participants: 321,
      thumbnail: '/images/vr-space.jpg',
      isPopular: true
    }
  ];

  const categories = ['Tous', 'Méditation', 'Relaxation', 'Énergie', 'Focus'];

  const filteredEnvironments = selectedCategory === 'Tous' 
    ? environments 
    : environments.filter(env => env.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'Débutant': 'bg-green-100 text-green-800',
      'Intermédiaire': 'bg-yellow-100 text-yellow-800',
      'Avancé': 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Méditation': 'bg-purple-100 text-purple-800',
      'Relaxation': 'bg-blue-100 text-blue-800',
      'Énergie': 'bg-orange-100 text-orange-800',
      'Focus': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Environnements VR</CardTitle>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {filteredEnvironments.map(environment => (
            <Card key={environment.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center">
                    <Play className="h-8 w-8 text-muted-foreground" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium flex items-center gap-2">
                        {environment.name}
                        {environment.isPopular && (
                          <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                            Populaire
                          </Badge>
                        )}
                      </h3>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span>{environment.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {environment.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={`text-xs ${getCategoryColor(environment.category)}`}>
                        {environment.category}
                      </Badge>
                      <Badge className={`text-xs ${getDifficultyColor(environment.difficulty)}`}>
                        {environment.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {environment.duration} min
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {environment.participants}
                      </span>
                    </div>
                    
                    <Button
                      onClick={() => onSelectEnvironment?.(environment)}
                      className="w-full"
                      size="sm"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Commencer la session
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VREnvironmentSelector;
