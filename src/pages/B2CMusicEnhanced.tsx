import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, SkipBack, SkipForward, Heart, Music, Zap, Brain, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageRoot from '@/components/common/PageRoot';

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  category: 'focus' | 'relaxation' | 'energy' | 'healing' | 'meditation';
  mood: string;
  color: string;
  preview?: string;
}

const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: '1',
    title: 'Sérénité Océanique',
    artist: 'EmotionsCare',
    duration: '8:32',
    category: 'relaxation',
    mood: 'Calme',
    color: 'bg-blue-500'
  },
  {
    id: '2',
    title: 'Focus Flow',
    artist: 'AI Composer',
    duration: '12:45',
    category: 'focus',
    mood: 'Concentration',
    color: 'bg-purple-500'
  },
  {
    id: '3',
    title: 'Energy Boost',
    artist: 'Digital Waves',
    duration: '6:18',
    category: 'energy',
    mood: 'Dynamisme',
    color: 'bg-orange-500'
  },
  {
    id: '4',
    title: 'Guérison Intérieure',
    artist: 'Healing Frequencies',
    duration: '15:27',
    category: 'healing',
    mood: 'Réparation',
    color: 'bg-green-500'
  },
  {
    id: '5',
    title: 'Méditation Profonde',
    artist: 'Zen Masters',
    duration: '20:00',
    category: 'meditation',
    mood: 'Paix',
    color: 'bg-indigo-500'
  }
];

const CATEGORY_ICONS = {
  focus: Brain,
  relaxation: Heart,
  energy: Zap,
  healing: Sparkles,
  meditation: Music
};

const B2CMusicEnhanced: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState([0]);
  const [volume, setVolume] = useState([75]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTracks = selectedCategory 
    ? MUSIC_TRACKS.filter(track => track.category === selectedCategory)
    : MUSIC_TRACKS;

  const handlePlayPause = (track?: MusicTrack) => {
    if (track) {
      setCurrentTrack(track);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (currentTrack) {
      const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id);
      const nextIndex = (currentIndex + 1) % filteredTracks.length;
      setCurrentTrack(filteredTracks[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (currentTrack) {
      const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id);
      const prevIndex = currentIndex === 0 ? filteredTracks.length - 1 : currentIndex - 1;
      setCurrentTrack(filteredTracks[prevIndex]);
    }
  };

  // Simulation du progrès de la musique
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev[0] + 0.5;
          return newProgress >= 100 ? [0] : [newProgress];
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  const categories = Array.from(new Set(MUSIC_TRACKS.map(track => track.category)));

  return (
    <PageRoot>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Thérapie Musicale
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Découvrez notre collection de musiques thérapeutiques adaptées à votre état émotionnel
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="transition-all"
            >
              Toutes
            </Button>
            {categories.map(category => {
              const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="transition-all"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Track List */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-semibold mb-4">
                {selectedCategory ? 
                  `Musiques ${selectedCategory}` : 
                  'Toutes les musiques'
                } ({filteredTracks.length})
              </h2>
              
              {filteredTracks.map((track) => {
                const Icon = CATEGORY_ICONS[track.category as keyof typeof CATEGORY_ICONS];
                const isCurrentTrack = currentTrack?.id === track.id;
                
                return (
                  <Card key={track.id} className={`transition-all hover:shadow-lg cursor-pointer ${
                    isCurrentTrack ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}>
                    <CardContent className="flex items-center gap-4 p-4">
                      <Button
                        size="sm"
                        variant={isCurrentTrack && isPlaying ? "default" : "outline"}
                        onClick={() => handlePlayPause(track)}
                        className="shrink-0"
                      >
                        {isCurrentTrack && isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>

                      <div className={`w-12 h-12 rounded-lg ${track.color} flex items-center justify-center shrink-0`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{track.title}</h3>
                        <p className="text-sm text-muted-foreground">{track.artist}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {track.mood}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{track.duration}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Player */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Lecteur</h3>
                  
                  {currentTrack ? (
                    <div className="space-y-6">
                      {/* Current Track Info */}
                      <div className="text-center">
                        <div className={`w-20 h-20 mx-auto rounded-xl ${currentTrack.color} flex items-center justify-center mb-4`}>
                          {React.createElement(CATEGORY_ICONS[currentTrack.category as keyof typeof CATEGORY_ICONS], 
                            { className: "h-10 w-10 text-white" }
                          )}
                        </div>
                        <h4 className="font-semibold">{currentTrack.title}</h4>
                        <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
                        <Badge variant="outline" className="mt-2">
                          {currentTrack.mood}
                        </Badge>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <Slider
                          value={progress}
                          onValueChange={setProgress}
                          max={100}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{Math.floor((progress[0] / 100) * parseInt(currentTrack.duration.split(':')[0]) * 60 + (progress[0] / 100) * parseInt(currentTrack.duration.split(':')[1]))}:00</span>
                          <span>{currentTrack.duration}</span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-center gap-4">
                        <Button variant="outline" size="sm" onClick={handlePrevious}>
                          <SkipBack className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handlePlayPause()} className="w-12 h-12 rounded-full">
                          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleNext}>
                          <SkipForward className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Volume */}
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4 shrink-0" />
                        <Slider
                          value={volume}
                          onValueChange={setVolume}
                          max={100}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-xs text-muted-foreground w-8">{volume[0]}%</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Sélectionnez une musique pour commencer</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageRoot>
  );
};

export default B2CMusicEnhanced;