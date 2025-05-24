
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Clock, User, Star, Moon } from 'lucide-react';

interface GuidedSession {
  id: string;
  title: string;
  instructor: string;
  duration: number;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  category: string;
  description: string;
  rating: number;
  image: string;
}

const mockSessions: GuidedSession[] = [
  {
    id: '1',
    title: 'Méditation Mindfulness Matinale',
    instructor: 'Sarah Chen',
    duration: 15,
    difficulty: 'Débutant',
    category: 'Mindfulness',
    description: 'Commencez votre journée avec sérénité grâce à cette méditation guidée focalisée sur la pleine conscience.',
    rating: 4.8,
    image: '/placeholder.svg'
  },
  {
    id: '2',
    title: 'Relaxation Profonde du Soir',
    instructor: 'Dr. Marie Dubois',
    duration: 25,
    difficulty: 'Intermédiaire',
    category: 'Relaxation',
    description: 'Une session apaisante pour relâcher les tensions de la journée et préparer un sommeil réparateur.',
    rating: 4.9,
    image: '/placeholder.svg'
  },
  {
    id: '3',
    title: 'Gestion du Stress au Travail',
    instructor: 'Thomas Laurent',
    duration: 12,
    difficulty: 'Débutant',
    category: 'Stress',
    description: 'Techniques rapides et efficaces pour gérer le stress professionnel et retrouver votre calme.',
    rating: 4.7,
    image: '/placeholder.svg'
  },
  {
    id: '4',
    title: 'Méditation Transcendantale Avancée',
    instructor: 'Yuki Tanaka',
    duration: 45,
    difficulty: 'Avancé',
    category: 'Spiritualité',
    description: 'Une exploration profonde de la conscience pour les pratiquants expérimentés.',
    rating: 4.9,
    image: '/placeholder.svg'
  },
  {
    id: '5',
    title: 'Voyage Sonore Tibétain',
    instructor: 'Lama Tenzin',
    duration: 30,
    difficulty: 'Intermédiaire',
    category: 'Spiritualité',
    description: 'Immersion dans les vibrations curatives des bols tibétains pour une relaxation profonde.',
    rating: 4.8,
    image: '/placeholder.svg'
  },
  {
    id: '6',
    title: 'Méditation pour Enfants',
    instructor: 'Sophie Martin',
    duration: 8,
    difficulty: 'Débutant',
    category: 'Famille',
    description: 'Une approche ludique et adaptée pour initier les enfants à la méditation.',
    rating: 4.6,
    image: '/placeholder.svg'
  }
];

const GuidedSessionList: React.FC = () => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');

  const categories = ['Tous', 'Mindfulness', 'Relaxation', 'Stress', 'Spiritualité', 'Famille'];

  const filteredSessions = selectedCategory === 'Tous' 
    ? mockSessions 
    : mockSessions.filter(session => session.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant': return 'bg-green-100 text-green-800';
      case 'Intermédiaire': return 'bg-yellow-100 text-yellow-800';
      case 'Avancé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePlayPause = (sessionId: string) => {
    setCurrentlyPlaying(currentlyPlaying === sessionId ? null : sessionId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Sessions Guidées Premium
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Découvrez notre collection de méditations guidées créées par des instructeurs certifiés du monde entier
        </p>
      </div>

      {/* Filtres par catégorie */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="transition-all duration-200"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Grille des sessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map((session) => (
          <Card key={session.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="relative">
              <img 
                src={session.image} 
                alt={session.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4">
                <Badge className={getDifficultyColor(session.difficulty)}>
                  {session.difficulty}
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-2 bg-black/50 rounded-full px-3 py-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{session.duration} min</span>
                </div>
              </div>
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {session.title}
                </CardTitle>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{session.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{session.instructor}</span>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {session.description}
              </p>
              
              <div className="flex items-center justify-between">
                <Button
                  size="sm"
                  onClick={() => handlePlayPause(session.id)}
                  className="flex items-center gap-2"
                >
                  {currentlyPlaying === session.id ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Écouter
                    </>
                  )}
                </Button>
                
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Moon className="h-3 w-3" />
                  {session.category}
                </Badge>
              </div>

              {currentlyPlaying === session.id && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>En cours...</span>
                    <span>2:30 / {session.duration}:00</span>
                  </div>
                  <Progress value={15} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <div className="text-center py-12">
          <Moon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune session trouvée</h3>
          <p className="text-muted-foreground">
            Essayez de sélectionner une autre catégorie pour découvrir plus de sessions.
          </p>
        </div>
      )}
    </div>
  );
};

export default GuidedSessionList;
