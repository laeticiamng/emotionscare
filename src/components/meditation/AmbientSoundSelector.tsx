import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Volume2, 
  Heart, 
  Shuffle, 
  Timer,
  Layers,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AmbientSound {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  audioUrl?: string;
}

const ambientSounds: AmbientSound[] = [
  {
    id: '1',
    name: 'Pluie douce',
    category: 'Nature',
    description: 'Son relaxant de gouttes de pluie',
    icon: '🌧️',
    audioUrl: '/audio/rain-soft.mp3'
  },
  {
    id: '2',
    name: 'Vagues océan',
    category: 'Nature',
    description: 'Bruit des vagues sur la plage',
    icon: '🌊',
    audioUrl: '/sounds/nature-calm.mp3'
  },
  {
    id: '3',
    name: 'Forêt mystique',
    category: 'Nature',
    description: 'Sons d\'oiseaux et bruissement des feuilles',
    icon: '🌲',
    audioUrl: '/sounds/ambient-calm.mp3'
  },
  {
    id: '4',
    name: 'Bol tibétain',
    category: 'Spirituel',
    description: 'Résonance apaisante des bols chantants',
    icon: '🎵',
    audioUrl: '/audio/lofi-120.mp3'
  },
  {
    id: '5',
    name: 'Bruit blanc',
    category: 'Ambiant',
    description: 'Son neutre pour la concentration',
    icon: '⚪',
    audioUrl: '/sounds/focus-ambient.mp3'
  },
  {
    id: '6',
    name: 'Feu de cheminée',
    category: 'Ambiant',
    description: 'Crépitement chaleureux du feu',
    icon: '🔥',
    audioUrl: '/sounds/ambient-calm.mp3'
  }
];

const FAVORITES_KEY = 'ambient-sound-favorites';

const AmbientSoundSelector: React.FC = () => {
  const { toast } = useToast();
  const [playingSounds, setPlayingSounds] = useState<Set<string>>(new Set());
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [masterVolume, setMasterVolume] = useState(80);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const [sleepTimeRemaining, setSleepTimeRemaining] = useState<number | null>(null);
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());

  const categories = ['Tous', 'Nature', 'Spirituel', 'Ambiant', '❤️ Favoris'];

  // Load favorites
  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) {
      setFavorites(new Set(JSON.parse(saved)));
    }
  }, []);

  // Filter sounds
  const filteredSounds = selectedCategory === 'Tous'
    ? ambientSounds
    : selectedCategory === '❤️ Favoris'
    ? ambientSounds.filter(sound => favorites.has(sound.id))
    : ambientSounds.filter(sound => sound.category === selectedCategory);

  // Initialize audio elements
  useEffect(() => {
    const elements = new Map<string, HTMLAudioElement>();

    ambientSounds.forEach((sound) => {
      if (!sound.audioUrl) return;

      const audio = new Audio(sound.audioUrl);
      audio.loop = true;
      audio.volume = ((volumes[sound.id] ?? 50) / 100) * (masterVolume / 100);
      elements.set(sound.id, audio);
    });

    audioElementsRef.current = elements;

    return () => {
      elements.forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
      elements.clear();
    };
  }, []);

  // Update volumes
  useEffect(() => {
    audioElementsRef.current.forEach((audio, id) => {
      const volume = volumes[id] ?? 50;
      audio.volume = (volume / 100) * (masterVolume / 100);
    });
  }, [volumes, masterVolume]);

  // Sleep timer
  useEffect(() => {
    if (sleepTimeRemaining === null || sleepTimeRemaining <= 0) return;

    const interval = setInterval(() => {
      setSleepTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          stopAllSounds();
          toast({
            title: 'Minuterie terminée',
            description: 'Les sons ont été arrêtés automatiquement',
          });
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimeRemaining]);

  const toggleSound = (soundId: string) => {
    const newPlayingSounds = new Set(playingSounds);
    const audio = audioElementsRef.current.get(soundId);

    if (!audio) return;

    if (newPlayingSounds.has(soundId)) {
      audio.pause();
      audio.currentTime = 0;
      newPlayingSounds.delete(soundId);
    } else {
      audio.volume = ((volumes[soundId] ?? 50) / 100) * (masterVolume / 100);
      audio.currentTime = 0;
      audio.play().catch(() => {});
      newPlayingSounds.add(soundId);
    }
    setPlayingSounds(newPlayingSounds);
  };

  const setVolume = (soundId: string, volume: number) => {
    setVolumes(prev => ({ ...prev, [soundId]: volume }));
  };

  const stopAllSounds = useCallback(() => {
    audioElementsRef.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    setPlayingSounds(new Set());
    setSleepTimer(null);
    setSleepTimeRemaining(null);
  }, []);

  const toggleFavorite = (soundId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(soundId)) {
      newFavorites.delete(soundId);
    } else {
      newFavorites.add(soundId);
    }
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...newFavorites]));
  };

  const playRandomMix = () => {
    const shuffled = [...ambientSounds].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 2);
    
    stopAllSounds();
    
    setTimeout(() => {
      selected.forEach(sound => toggleSound(sound.id));
      toast({
        title: 'Mix aléatoire',
        description: `${selected.map(s => s.name).join(' + ')}`,
      });
    }, 100);
  };

  const startSleepTimer = (minutes: number) => {
    setSleepTimer(minutes);
    setSleepTimeRemaining(minutes * 60);
    toast({
      title: 'Minuterie activée',
      description: `Les sons s'arrêteront dans ${minutes} minutes`,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Ambiances Sonores</CardTitle>
              <CardDescription>
                Mixez plusieurs sons pour créer votre ambiance parfaite
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              {playingSounds.size > 0 && (
                <>
                  <Badge variant="secondary" className="gap-1">
                    <Layers className="h-3 w-3" />
                    {playingSounds.size} actif{playingSounds.size > 1 ? 's' : ''}
                  </Badge>
                  
                  {sleepTimeRemaining && (
                    <Badge variant="outline" className="gap-1">
                      <Timer className="h-3 w-3" />
                      {formatTime(sleepTimeRemaining)}
                    </Badge>
                  )}
                  
                  <Button variant="outline" size="sm" onClick={stopAllSounds}>
                    <X className="h-4 w-4 mr-1" />
                    Tout arrêter
                  </Button>
                </>
              )}
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
          {/* Quick actions */}
          <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
            <Button variant="outline" size="sm" onClick={playRandomMix}>
              <Shuffle className="h-4 w-4 mr-1" />
              Mix aléatoire
            </Button>
            
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground mr-1">Timer:</span>
              {[15, 30, 60].map((mins) => (
                <Button
                  key={mins}
                  variant={sleepTimer === mins ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => startSleepTimer(mins)}
                >
                  {mins}m
                </Button>
              ))}
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={[masterVolume]}
                max={100}
                step={5}
                onValueChange={([v]) => setMasterVolume(v)}
                className="w-24"
                aria-label="Volume principal"
              />
              <span className="text-xs text-muted-foreground w-8">{masterVolume}%</span>
            </div>
          </div>

          {/* Sound grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSounds.map((sound) => {
              const isPlaying = playingSounds.has(sound.id);
              const isFavorite = favorites.has(sound.id);
              const volume = volumes[sound.id] ?? 50;
              
              return (
                <Card 
                  key={sound.id} 
                  className={cn(
                    'transition-all duration-300',
                    isPlaying && 'ring-2 ring-primary shadow-lg'
                  )}
                >
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="text-center flex-1">
                          <div className={cn(
                            'text-4xl mb-2 transition-transform duration-300',
                            isPlaying && 'scale-110 animate-pulse'
                          )}>
                            {sound.icon}
                          </div>
                          <h3 className="font-semibold">{sound.name}</h3>
                          <p className="text-sm text-muted-foreground">{sound.description}</p>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn('h-8 w-8', isFavorite && 'text-red-500')}
                          onClick={() => toggleFavorite(sound.id)}
                        >
                          <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
                        </Button>
                      </div>
                      
                      <Badge variant="outline" className="w-fit mx-auto">
                        {sound.category}
                      </Badge>
                      
                      <div className="space-y-3">
                        <Button
                          onClick={() => toggleSound(sound.id)}
                          variant={isPlaying ? "secondary" : "default"}
                          className="w-full"
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              Arrêter
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Jouer
                            </>
                          )}
                        </Button>
                        
                        {/* Volume control - always visible for mixing */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Volume2 className="h-4 w-4" />
                            <span>Volume: {volume}%</span>
                          </div>
                          <Slider
                            value={[volume]}
                            max={100}
                            step={5}
                            onValueChange={(value) => setVolume(sound.id, value[0])}
                            aria-label={`Contrôle du volume pour ${sound.name}`}
                            className={cn(!isPlaying && 'opacity-50')}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Empty state for favorites */}
          {selectedCategory === '❤️ Favoris' && filteredSounds.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Heart className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>Aucun son favori</p>
              <p className="text-sm">Cliquez sur ❤️ pour ajouter des favoris</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AmbientSoundSelector;
