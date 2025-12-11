import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Play, 
  Clock, 
  User, 
  Star, 
  Heart, 
  Search, 
  Filter,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
  playCount?: number;
  isNew?: boolean;
  isPremium?: boolean;
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
    description: 'Une introduction douce à la méditation de pleine conscience',
    playCount: 1250,
    isNew: false
  },
  {
    id: '2',
    title: 'Gestion du stress au travail',
    instructor: 'Pierre Martin',
    duration: 15,
    category: 'Anti-stress',
    difficulty: 'Intermédiaire',
    rating: 4.9,
    description: 'Techniques spécialement conçues pour réduire le stress professionnel',
    playCount: 890,
    isNew: true
  },
  {
    id: '3',
    title: 'Méditation du sommeil',
    instructor: 'Sophie Leroy',
    duration: 20,
    category: 'Sommeil',
    difficulty: 'Débutant',
    rating: 4.7,
    description: 'Préparez-vous à une nuit de sommeil réparateur',
    playCount: 2100
  },
  {
    id: '4',
    title: 'Scan corporel avancé',
    instructor: 'Dr. Jean Moreau',
    duration: 25,
    category: 'Body Scan',
    difficulty: 'Avancé',
    rating: 4.6,
    description: 'Exploration profonde des sensations corporelles',
    playCount: 450,
    isPremium: true
  },
  {
    id: '5',
    title: 'Méditation de gratitude',
    instructor: 'Marie Dubois',
    duration: 12,
    category: 'Mindfulness',
    difficulty: 'Débutant',
    rating: 4.9,
    description: 'Cultivez la gratitude au quotidien',
    playCount: 780,
    isNew: true
  }
];

const FAVORITES_KEY = 'guided-session-favorites';

const GuidedSessionList: React.FC = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'duration' | 'newest'>('popular');
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const categories = ['Tous', 'Mindfulness', 'Anti-stress', 'Sommeil', 'Body Scan', '❤️ Favoris'];

  // Filter and sort sessions
  const filteredSessions = useMemo(() => {
    let sessions = [...guidedSessions];

    // Category filter
    if (selectedCategory === '❤️ Favoris') {
      sessions = sessions.filter(s => favorites.has(s.id));
    } else if (selectedCategory !== 'Tous') {
      sessions = sessions.filter(s => s.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      sessions = sessions.filter(s => 
        s.title.toLowerCase().includes(query) ||
        s.instructor.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        sessions.sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
        break;
      case 'rating':
        sessions.sort((a, b) => b.rating - a.rating);
        break;
      case 'duration':
        sessions.sort((a, b) => a.duration - b.duration);
        break;
      case 'newest':
        sessions.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return sessions;
  }, [selectedCategory, searchQuery, sortBy, favorites]);

  const toggleFavorite = (sessionId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(sessionId)) {
      newFavorites.delete(sessionId);
      toast({ title: 'Retiré des favoris' });
    } else {
      newFavorites.add(sessionId);
      toast({ title: 'Ajouté aux favoris' });
    }
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...newFavorites]));
  };

  const startSession = (session: GuidedSession) => {
    toast({
      title: 'Session démarrée',
      description: `${session.title} avec ${session.instructor}`,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Intermédiaire': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Avancé': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-muted';
    }
  };

  // Get recommended session based on time of day
  const recommendedSession = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 10) {
      return guidedSessions.find(s => s.category === 'Mindfulness');
    } else if (hour > 20) {
      return guidedSessions.find(s => s.category === 'Sommeil');
    } else {
      return guidedSessions.find(s => s.category === 'Anti-stress');
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Sessions Guidées</CardTitle>
              <CardDescription>
                {filteredSessions.length} sessions disponibles
              </CardDescription>
            </div>

            {/* Search and filters */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-48">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={sortBy} onValueChange={(v: typeof sortBy) => setSortBy(v)}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Populaires</SelectItem>
                  <SelectItem value="rating">Notes</SelectItem>
                  <SelectItem value="duration">Durée</SelectItem>
                  <SelectItem value="newest">Nouveautés</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 pt-2">
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
        
        <CardContent className="space-y-6">
          {/* Recommendation card */}
          {recommendedSession && selectedCategory === 'Tous' && !searchQuery && (
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/20">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-primary">Recommandé pour vous</span>
                      <TrendingUp className="h-3 w-3 text-primary" />
                    </div>
                    <h3 className="font-semibold">{recommendedSession.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {recommendedSession.duration} min • {recommendedSession.instructor}
                    </p>
                  </div>
                  <Button onClick={() => startSession(recommendedSession)}>
                    <Play className="h-4 w-4 mr-1" />
                    Commencer
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sessions grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSessions.map((session) => {
              const isFavorite = favorites.has(session.id);
              
              return (
                <Card 
                  key={session.id} 
                  className={cn(
                    'transition-all hover:shadow-md',
                    session.isPremium && 'border-amber-200 dark:border-amber-800'
                  )}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{session.title}</h3>
                            {session.isNew && (
                              <Badge className="bg-blue-500 text-white text-xs">Nouveau</Badge>
                            )}
                            {session.isPremium && (
                              <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs">
                                Premium
                              </Badge>
                            )}
                          </div>
                          <Badge variant="secondary" className={getDifficultyColor(session.difficulty)}>
                            {session.difficulty}
                          </Badge>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn('h-8 w-8', isFavorite && 'text-red-500')}
                          onClick={() => toggleFavorite(session.id)}
                        >
                          <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
                        </Button>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {session.description}
                      </p>
                      
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
                          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                          {session.rating}
                        </div>
                      </div>

                      {session.playCount && (
                        <div className="text-xs text-muted-foreground">
                          {session.playCount.toLocaleString()} écoutes
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pt-2">
                        <Badge variant="outline">{session.category}</Badge>
                        <Button size="sm" onClick={() => startSession(session)}>
                          <Play className="h-4 w-4 mr-1" />
                          Commencer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Empty state */}
          {filteredSessions.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>Aucune session trouvée</p>
              <p className="text-sm">Essayez d'ajuster vos filtres</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GuidedSessionList;
