import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Play, 
  Pause,
  Heart,
  Share,
  Trash2,
  Search,
  Filter,
  Clock,
  Star,
  TrendingUp,
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import { MoodMix } from '@/types/mood-mixer';

interface MixLibraryProps {
  myMixes: MoodMix[];
  onPlayMix: (mix: MoodMix) => void;
  onDeleteMix: (mixId: string) => void;
  onShareMix: (mixId: string) => void;
}

const MixLibrary: React.FC<MixLibraryProps> = ({ 
  myMixes, 
  onPlayMix, 
  onDeleteMix, 
  onShareMix 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'favorites' | 'recent' | 'popular'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'duration' | 'plays'>('recent');

  const filteredAndSortedMixes = myMixes
    .filter(mix => {
      // Filtrage par recherche
      const matchesSearch = mix.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           mix.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           mix.baseMood.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      // Filtrage par catégorie
      switch (filterBy) {
        case 'favorites':
          return mix.isFavorite;
        case 'recent':
          return mix.lastPlayed && new Date(mix.lastPlayed).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;
        case 'popular':
          return mix.stats.totalPlays > 5;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'duration':
          return b.duration - a.duration;
        case 'plays':
          return b.stats.totalPlays - a.stats.totalPlays;
        case 'recent':
        default:
          const aDate = a.lastPlayed ? new Date(a.lastPlayed).getTime() : a.createdAt.getTime();
          const bDate = b.lastPlayed ? new Date(b.lastPlayed).getTime() : b.createdAt.getTime();
          return bDate - aDate;
      }
    });

  const getMoodColor = (moodId: string) => {
    switch (moodId) {
      case 'energetic': return 'hsl(var(--destructive))';
      case 'calm': return 'hsl(var(--primary))';
      case 'focused': return 'hsl(var(--accent))';
      case 'creative': return 'hsl(var(--secondary))';
      default: return 'hsl(var(--muted))';
    }
  };

  const formatLastPlayed = (date?: Date) => {
    if (!date) return 'Jamais écouté';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Aujourd\'hui';
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    if (days < 30) return `Il y a ${Math.floor(days / 7)} semaines`;
    return `Il y a ${Math.floor(days / 30)} mois`;
  };

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-500';
    if (rate >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header et contrôles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Ma Bibliothèque</h2>
          <p className="text-muted-foreground">
            {myMixes.length} mix{myMixes.length > 1 ? 's' : ''} créé{myMixes.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un mix..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => {/* Ouvrir modal de filtres */}}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filtres rapides */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'Tous', icon: null },
          { key: 'favorites', label: 'Favoris', icon: Heart },
          { key: 'recent', label: 'Récents', icon: Calendar },
          { key: 'popular', label: 'Populaires', icon: TrendingUp }
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={filterBy === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterBy(key as any)}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            {Icon && <Icon className="h-3 w-3" />}
            {label}
          </Button>
        ))}
      </div>

      {/* Tri */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Trier par :</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-background border rounded px-2 py-1"
        >
          <option value="recent">Plus récent</option>
          <option value="name">Nom</option>
          <option value="duration">Durée</option>
          <option value="plays">Popularité</option>
        </select>
      </div>

      {/* Liste des mix */}
      <AnimatePresence>
        {filteredAndSortedMixes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-4xl mb-4">🎵</div>
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? 'Aucun résultat' : 'Aucun mix trouvé'}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? `Aucun mix ne correspond à "${searchQuery}"`
                : 'Commencez par créer votre premier mix personnalisé'
              }
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedMixes.map((mix, index) => (
              <motion.div
                key={mix.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div 
                    className="h-2"
                    style={{ backgroundColor: getMoodColor(mix.baseMood.id) }}
                  />
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-start justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl flex-shrink-0">{mix.baseMood.icon}</span>
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{mix.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {mix.baseMood.name}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {mix.isFavorite && (
                          <Heart className="h-4 w-4 text-red-500 fill-current" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {/* Toggle more options */}}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {mix.description}
                    </p>
                    
                    {/* Statistiques */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-medium">{mix.duration}min</div>
                        <div className="text-muted-foreground">Durée</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{mix.stats.totalPlays}</div>
                        <div className="text-muted-foreground">Écoutes</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-medium ${getCompletionRateColor(mix.stats.completionRate)}`}>
                          {mix.stats.completionRate}%
                        </div>
                        <div className="text-muted-foreground">Complétion</div>
                      </div>
                    </div>
                    
                    {/* Note moyenne */}
                    {mix.stats.averageRating > 0 && (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(mix.stats.averageRating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">
                          {mix.stats.averageRating.toFixed(1)}
                        </span>
                      </div>
                    )}
                    
                    {/* Humeurs complémentaires */}
                    {mix.mixedMoods.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {mix.mixedMoods.slice(0, 2).map((mood) => (
                          <Badge
                            key={mood.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {mood.icon} {mood.name}
                          </Badge>
                        ))}
                        {mix.mixedMoods.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{mix.mixedMoods.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      {formatLastPlayed(mix.lastPlayed)}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => onPlayMix(mix)}
                        size="sm"
                        className="flex-1"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Écouter
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onShareMix(mix.id)}
                      >
                        <Share className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteMix(mix.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Stats de la bibliothèque */}
      {myMixes.length > 0 && (
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg">Statistiques de votre bibliothèque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {myMixes.reduce((acc, mix) => acc + mix.stats.totalListenTime, 0)}min
                </div>
                <div className="text-sm text-muted-foreground">Temps d'écoute total</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-accent">
                  {myMixes.filter(mix => mix.isFavorite).length}
                </div>
                <div className="text-sm text-muted-foreground">Mix favoris</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-secondary">
                  {(myMixes.reduce((acc, mix) => acc + mix.stats.averageRating, 0) / myMixes.length).toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Note moyenne</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-destructive">
                  {Math.round(myMixes.reduce((acc, mix) => acc + mix.stats.completionRate, 0) / myMixes.length)}%
                </div>
                <div className="text-sm text-muted-foreground">Taux de complétion</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MixLibrary;