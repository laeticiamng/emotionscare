import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Music, Play, Plus, Search, Filter, Clock, Heart, 
  Shuffle, TrendingUp, Star, Headphones 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: number;
  duration: string;
  color: string;
  emotion: string;
  popularity: number;
  isLiked: boolean;
  genre: string[];
  mood: string;
}

interface PlaylistManagerProps {
  playlists: Playlist[];
  onPlaylistSelect: (playlist: Playlist) => void;
  onCreatePlaylist: () => void;
}

const PlaylistManager: React.FC<PlaylistManagerProps> = ({
  playlists,
  onPlaylistSelect,
  onCreatePlaylist
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'popularity' | 'duration'>('popularity');

  const moods = ['all', 'Calme', 'Joie', 'Énergie', 'Concentration', 'Sérénité', 'Motivation'];

  const filteredPlaylists = playlists
    .filter(playlist => {
      const matchesSearch = playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           playlist.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMood = selectedMood === 'all' || playlist.emotion === selectedMood;
      return matchesSearch && matchesMood;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popularity':
          return b.popularity - a.popularity;
        case 'duration':
          return parseInt(a.duration) - parseInt(b.duration);
        default:
          return 0;
      }
    });

  const getMoodColor = (mood: string) => {
    const colors: Record<string, string> = {
      'Calme': 'bg-blue-500',
      'Joie': 'bg-yellow-500',
      'Énergie': 'bg-orange-500',
      'Concentration': 'bg-purple-500',
      'Sérénité': 'bg-green-500',
      'Motivation': 'bg-red-500'
    };
    return colors[mood] || 'bg-gray-500';
  };

  const getMoodIcon = (mood: string) => {
    const icons: Record<string, string> = {
      'Calme': '🧘',
      'Joie': '😊',
      'Énergie': '⚡',
      'Concentration': '🎯',
      'Sérénité': '☮️',
      'Motivation': '💪'
    };
    return icons[mood] || '🎵';
  };

  return (
    <div className="space-y-6">
      {/* Header avec contrôles */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Vos Playlists</h2>
          <p className="text-muted-foreground">
            {filteredPlaylists.length} playlist{filteredPlaylists.length > 1 ? 's' : ''} disponible{filteredPlaylists.length > 1 ? 's' : ''}
          </p>
        </div>
        
        <Button onClick={onCreatePlaylist} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Créer une playlist
        </Button>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une playlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtre par humeur */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-2 overflow-x-auto">
                {moods.map((mood) => (
                  <Button
                    key={mood}
                    variant={selectedMood === mood ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMood(mood)}
                    className="whitespace-nowrap"
                  >
                    {mood === 'all' ? 'Toutes' : `${getMoodIcon(mood)} ${mood}`}
                  </Button>
                ))}
              </div>
            </div>

            {/* Tri */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="popularity">Popularité</option>
              <option value="name">Nom</option>
              <option value="duration">Durée</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Grille des playlists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaylists.map((playlist, index) => (
          <motion.div
            key={playlist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
              <div 
                className={`h-32 ${playlist.color} relative flex items-center justify-center`}
                onClick={() => onPlaylistSelect(playlist)}
              >
                <div className="text-white text-4xl opacity-80">
                  {getMoodIcon(playlist.emotion)}
                </div>
                
                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Play className="h-6 w-6 ml-0.5" />
                  </Button>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3">
                  {playlist.isLiked && (
                    <Badge className="bg-red-500 text-white border-0">
                      <Heart className="h-3 w-3 mr-1 fill-current" />
                      Favori
                    </Badge>
                  )}
                </div>
                
                <div className="absolute top-3 right-3">
                  <Badge className="bg-black/20 text-white border-0">
                    <Star className="h-3 w-3 mr-1" />
                    {playlist.popularity}%
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{playlist.name}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {playlist.description}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Music className="h-4 w-4" />
                      {playlist.tracks} titres
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {playlist.duration}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {playlist.emotion}
                    </Badge>
                    {playlist.genre.slice(0, 2).map((genre) => (
                      <Badge key={genre} variant="outline" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Toggle like
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Heart className={`h-4 w-4 ${playlist.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Shuffle play
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Shuffle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Message si aucun résultat */}
      {filteredPlaylists.length === 0 && (
        <div className="text-center py-12">
          <Music className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune playlist trouvée</h3>
          <p className="text-muted-foreground mb-4">
            Essayez de modifier vos critères de recherche ou créez une nouvelle playlist.
          </p>
          <Button onClick={onCreatePlaylist}>
            <Plus className="h-4 w-4 mr-2" />
            Créer votre première playlist
          </Button>
        </div>
      )}

      {/* Statistiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Vos habitudes d'écoute
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Headphones className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">247</div>
              <div className="text-sm text-muted-foreground">Heures écoutées</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Heart className="h-6 w-6 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold">42</div>
              <div className="text-sm text-muted-foreground">Favoris</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Music className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">1,249</div>
              <div className="text-sm text-muted-foreground">Morceaux</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">89%</div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaylistManager;