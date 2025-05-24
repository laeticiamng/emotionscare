
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Clock, User, Search, Star, Heart, Brain, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

interface GuidedSession {
  id: string;
  title: string;
  instructor: string;
  duration: number;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  category: 'Relaxation' | 'Concentration' | 'Sommeil' | 'Stress' | 'Gratitude' | 'Pleine conscience';
  description: string;
  rating: number;
  plays: number;
  premium?: boolean;
  thumbnail?: string;
}

const sessions: GuidedSession[] = [
  {
    id: '1',
    title: 'Méditation de Pleine Conscience',
    instructor: 'Marie Dubois',
    duration: 15,
    level: 'Débutant',
    category: 'Pleine conscience',
    description: 'Une introduction douce à la pleine conscience pour débutants',
    rating: 4.8,
    plays: 12543
  },
  {
    id: '2',
    title: 'Relaxation Profonde du Soir',
    instructor: 'Pierre Martin',
    duration: 20,
    level: 'Débutant',
    category: 'Sommeil',
    description: 'Préparez-vous à un sommeil réparateur avec cette session relaxante',
    rating: 4.9,
    plays: 8921,
    premium: true
  },
  {
    id: '3',
    title: 'Gestion du Stress au Travail',
    instructor: 'Sophie Laurent',
    duration: 12,
    level: 'Intermédiaire',
    category: 'Stress',
    description: 'Techniques efficaces pour gérer le stress professionnel',
    rating: 4.7,
    plays: 15632
  },
  {
    id: '4',
    title: 'Concentration et Focus Mental',
    instructor: 'Thomas Wilson',
    duration: 18,
    level: 'Intermédiaire',
    category: 'Concentration',
    description: 'Améliorez votre concentration avec des techniques avancées',
    rating: 4.6,
    plays: 7891,
    premium: true
  },
  {
    id: '5',
    title: 'Méditation de Gratitude',
    instructor: 'Emma Rodriguez',
    duration: 10,
    level: 'Débutant',
    category: 'Gratitude',
    description: 'Cultivez un état d\'esprit positif grâce à la gratitude',
    rating: 4.8,
    plays: 9876
  },
  {
    id: '6',
    title: 'Scan Corporel Avancé',
    instructor: 'Dr. Alex Chen',
    duration: 25,
    level: 'Avancé',
    category: 'Relaxation',
    description: 'Technique approfondie de relaxation par scan corporel',
    rating: 4.9,
    plays: 5432,
    premium: true
  }
];

const categoryIcons = {
  'Relaxation': <Heart className="h-4 w-4" />,
  'Concentration': <Brain className="h-4 w-4" />,
  'Sommeil': <Moon className="h-4 w-4" />,
  'Stress': <Zap className="h-4 w-4" />,
  'Gratitude': <Star className="h-4 w-4" />,
  'Pleine conscience': <Leaf className="h-4 w-4" />
};

const GuidedSessionList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || session.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || session.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.plays - a.plays;
      case 'rating':
        return b.rating - a.rating;
      case 'duration':
        return a.duration - b.duration;
      case 'newest':
        return b.id.localeCompare(a.id);
      default:
        return 0;
    }
  });

  const categories = Array.from(new Set(sessions.map(s => s.category)));
  const levels = Array.from(new Set(sessions.map(s => s.level)));

  return (
    <div className="space-y-6">
      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Sessions Guidées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Rechercher une session..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:col-span-1"
            />
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    <div className="flex items-center gap-2">
                      {categoryIcons[category as keyof typeof categoryIcons]}
                      {category}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                {levels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Popularité</SelectItem>
                <SelectItem value="rating">Note</SelectItem>
                <SelectItem value="duration">Durée</SelectItem>
                <SelectItem value="newest">Plus récent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des sessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSessions.map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {categoryIcons[session.category as keyof typeof categoryIcons]}
                    <Badge variant="outline">{session.category}</Badge>
                  </div>
                  {session.premium && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black">
                      Premium
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{session.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {session.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    <span>{session.instructor}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {session.duration} min
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {session.level}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{session.rating}</span>
                      <span className="text-xs text-muted-foreground">
                        ({session.plays.toLocaleString()} écoutes)
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Écouter
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">
              Aucune session trouvée avec ces critères.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GuidedSessionList;
