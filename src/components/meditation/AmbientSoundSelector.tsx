
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2 } from 'lucide-react';

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
    icon: '🌧️'
  },
  {
    id: '2',
    name: 'Vagues océan',
    category: 'Nature',
    description: 'Bruit des vagues sur la plage',
    icon: '🌊'
  },
  {
    id: '3',
    name: 'Forêt mystique',
    category: 'Nature',
    description: 'Sons d\'oiseaux et bruissement des feuilles',
    icon: '🌲'
  },
  {
    id: '4',
    name: 'Bol tibétain',
    category: 'Spirituel',
    description: 'Résonance apaisante des bols chantants',
    icon: '🎵'
  },
  {
    id: '5',
    name: 'Bruit blanc',
    category: 'Ambiant',
    description: 'Son neutre pour la concentration',
    icon: '⚪'
  },
  {
    id: '6',
    name: 'Feu de cheminée',
    category: 'Ambiant',
    description: 'Crépitement chaleureux du feu',
    icon: '🔥'
  }
];

const AmbientSoundSelector: React.FC = () => {
  const [playingSounds, setPlayingSounds] = useState<Set<string>>(new Set());
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  
  const categories = ['Tous', 'Nature', 'Spirituel', 'Ambiant'];
  
  const filteredSounds = selectedCategory === 'Tous' 
    ? ambientSounds 
    : ambientSounds.filter(sound => sound.category === selectedCategory);

  const toggleSound = (soundId: string) => {
    const newPlayingSounds = new Set(playingSounds);
    if (newPlayingSounds.has(soundId)) {
      newPlayingSounds.delete(soundId);
    } else {
      newPlayingSounds.add(soundId);
    }
    setPlayingSounds(newPlayingSounds);
  };

  const setVolume = (soundId: string, volume: number) => {
    setVolumes(prev => ({
      ...prev,
      [soundId]: volume
    }));
  };

  const stopAllSounds = () => {
    setPlayingSounds(new Set());
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Ambiances Sonores</CardTitle>
            {playingSounds.size > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {playingSounds.size} actif{playingSounds.size > 1 ? 's' : ''}
                </Badge>
                <Button variant="outline" size="sm" onClick={stopAllSounds}>
                  Tout arrêter
                </Button>
              </div>
            )}
          </div>
          
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSounds.map((sound) => {
              const isPlaying = playingSounds.has(sound.id);
              const volume = volumes[sound.id] || 50;
              
              return (
                <Card 
                  key={sound.id} 
                  className={`transition-all ${isPlaying ? 'ring-2 ring-primary' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl mb-2">{sound.icon}</div>
                        <h3 className="font-semibold">{sound.name}</h3>
                        <p className="text-sm text-muted-foreground">{sound.description}</p>
                        <Badge variant="outline" className="mt-2">
                          {sound.category}
                        </Badge>
                      </div>
                      
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
                        
                        {isPlaying && (
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
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AmbientSoundSelector;
