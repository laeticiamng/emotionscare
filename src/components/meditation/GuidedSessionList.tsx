// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, User, Star } from 'lucide-react';

interface GuidedSession {
  id: string;
  title: string;
  instructor: string;
  duration: number;
  category: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  rating: number;
  description: string;
  thumbnail?: string;
}

const guidedSessions: GuidedSession[] = [
  {
    id: '1',
    title: 'Méditation pour débutants',
    instructor: 'Marie Dubois',
    duration: 10,
    category: 'Mindfulness',
    difficulty: 'Débutant',
    rating: 4.8,
    description: 'Une introduction douce à la méditation de pleine conscience'
  },
  {
    id: '2',
    title: 'Gestion du stress au travail',
    instructor: 'Pierre Martin',
    duration: 15,
    category: 'Anti-stress',
    difficulty: 'Intermédiaire',
    rating: 4.9,
    description: 'Techniques spécialement conçues pour réduire le stress professionnel'
  },
  {
    id: '3',
    title: 'Méditation du sommeil',
    instructor: 'Sophie Leroy',
    duration: 20,
    category: 'Sommeil',
    difficulty: 'Débutant',
    rating: 4.7,
    description: 'Préparez-vous à une nuit de sommeil réparateur'
  },
  {
    id: '4',
    title: 'Scan corporel avancé',
    instructor: 'Dr. Jean Moreau',
    duration: 25,
    category: 'Body Scan',
    difficulty: 'Avancé',
    rating: 4.6,
    description: 'Exploration profonde des sensations corporelles'
  }
];

const GuidedSessionList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  
  const categories = ['Tous', 'Mindfulness', 'Anti-stress', 'Sommeil', 'Body Scan'];
  
  const filteredSessions = selectedCategory === 'Tous' 
    ? guidedSessions 
    : guidedSessions.filter(session => session.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant': return 'bg-green-100 text-green-800';
      case 'Intermédiaire': return 'bg-orange-100 text-orange-800';
      case 'Avancé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sessions Guidées</CardTitle>
          
          {/* Filtres par catégorie */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{session.title}</h3>
                      <Badge variant="secondary" className={getDifficultyColor(session.difficulty)}>
                        {session.difficulty}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{session.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {session.instructor}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {session.duration} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                        {session.rating}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{session.category}</Badge>
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Commencer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuidedSessionList;
