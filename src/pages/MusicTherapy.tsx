import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, Heart, Search } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn, formatTime } from '@/lib/utils';

const musicCategories = [
  { id: 'calm', name: 'Calme', color: 'bg-blue-500', emoji: '🌊' },
  { id: 'energetic', name: 'Énergisant', color: 'bg-orange-500', emoji: '⚡' },
  { id: 'focus', name: 'Concentration', color: 'bg-green-500', emoji: '🎯' },
  { id: 'sleep', name: 'Sommeil', color: 'bg-purple-500', emoji: '🌙' },
  { id: 'meditation', name: 'Méditation', color: 'bg-indigo-500', emoji: '🧘‍♀️' },
  { id: 'motivation', name: 'Motivation', color: 'bg-red-500', emoji: '💪' },
];

export const MusicTherapy: React.FC = () => {
  const { user } = useAuth();
  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    playlist,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    setVolume,
    seekTo,
  } = useMusic();

  const [selectedCategory, setSelectedCategory] = useState<string>('calm');
  const [searchQuery, setSearchQuery] = useState('');

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      resumeTrack();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    seekTo(newTime);
  };

  const filteredTracks = playlist.filter(track => 
    (selectedCategory === 'all' || track.emotion === selectedCategory) &&
    (track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     track.artist.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <Music className="h-10 w-10 text-primary" />
            Musicothérapie
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez des musiques adaptées à votre état émotionnel pour améliorer votre bien-être
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Sidebar - Catégories et recherche */}
          <div className="space-y-6">
            {/* Recherche */}
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Rechercher une musique..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Catégories */}
            <Card>
              <CardHeader>
                <CardTitle>Catégories</CardTitle>
                <CardDescription>Choisissez votre ambiance musicale</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={cn(
                    "w-full p-3 rounded-lg transition-all duration-300 flex items-center gap-3",
                    selectedCategory === 'all'
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  )}
                >
                  <span>🎵</span>
                  <span>Toutes les musiques</span>
                </button>
                
                {musicCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "w-full p-3 rounded-lg transition-all duration-300 flex items-center gap-3",
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    )}
                  >
                    <span>{category.emoji}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Player actuel */}
            {currentTrack && (
              <Card>
                <CardHeader>
                  <CardTitle>En cours de lecture</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <h3 className="font-semibold">{currentTrack.title}</h3>
                    <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
                  </div>

                  {/* Barre de progression */}
                  <div className="space-y-2">
                    <div 
                      className="w-full bg-muted rounded-full h-2 cursor-pointer"
                      onClick={handleSeek}
                    >
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Contrôles */}
                  <div className="flex items-center justify-center gap-4">
                    <Button variant="outline" size="icon" onClick={previousTrack}>
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    
                    <Button size="icon" onClick={handlePlayPause}>
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <Button variant="outline" size="icon" onClick={nextTrack}>
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Volume */}
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="flex-1"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Liste des pistes */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedCategory === 'all' 
                    ? 'Toutes les musiques' 
                    : musicCategories.find(cat => cat.id === selectedCategory)?.name
                  }
                </CardTitle>
                <CardDescription>
                  {filteredTracks.length} piste{filteredTracks.length > 1 ? 's' : ''} disponible{filteredTracks.length > 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredTracks.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucune musique trouvée dans cette catégorie</p>
                    </div>
                  ) : (
                    filteredTracks.map((track) => (
                      <div
                        key={track.id}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-lg transition-all duration-300 cursor-pointer hover:bg-accent",
                          currentTrack?.id === track.id ? "bg-primary/10 border-l-4 border-primary" : ""
                        )}
                        onClick={() => playTrack(track)}
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{track.title}</h4>
                          <p className="text-sm text-muted-foreground">{track.artist}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                              {track.genre}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(track.duration)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Heart className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant={currentTrack?.id === track.id && isPlaying ? "default" : "outline"}
                            size="icon"
                          >
                            {currentTrack?.id === track.id && isPlaying ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};