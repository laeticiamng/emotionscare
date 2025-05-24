
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Waves, 
  Wind, 
  Zap, 
  Mountain, 
  TreePine, 
  CloudRain,
  Shuffle,
  Heart,
  Moon,
  Sun
} from 'lucide-react';

const AmbientSoundSelector: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('nature');
  const [playingSounds, setPlayingSounds] = useState<string[]>([]);
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const [globalVolume, setGlobalVolume] = useState(70);

  const soundCategories = {
    nature: {
      icon: <TreePine className="h-5 w-5" />,
      title: 'Nature',
      sounds: [
        { id: 'rain', name: 'Pluie douce', icon: <CloudRain className="h-4 w-4" />, color: 'blue' },
        { id: 'ocean', name: 'Vagues océan', icon: <Waves className="h-4 w-4" />, color: 'cyan' },
        { id: 'forest', name: 'Forêt mystique', icon: <TreePine className="h-4 w-4" />, color: 'green' },
        { id: 'wind', name: 'Vent léger', icon: <Wind className="h-4 w-4" />, color: 'gray' },
        { id: 'thunder', name: 'Orage lointain', icon: <Zap className="h-4 w-4" />, color: 'purple' },
        { id: 'birds', name: 'Chants d\'oiseaux', icon: <Mountain className="h-4 w-4" />, color: 'orange' }
      ]
    },
    ambient: {
      icon: <Moon className="h-5 w-5" />,
      title: 'Ambiant',
      sounds: [
        { id: 'white-noise', name: 'Bruit blanc', icon: <Shuffle className="h-4 w-4" />, color: 'gray' },
        { id: 'brown-noise', name: 'Bruit brun', icon: <Shuffle className="h-4 w-4" />, color: 'amber' },
        { id: 'pink-noise', name: 'Bruit rose', icon: <Shuffle className="h-4 w-4" />, color: 'pink' },
        { id: 'tibetan-bowls', name: 'Bols tibétains', icon: <Heart className="h-4 w-4" />, color: 'yellow' },
        { id: 'crystal-singing', name: 'Cristaux chantants', icon: <Heart className="h-4 w-4" />, color: 'purple' },
        { id: 'binaural-beats', name: 'Battements binauraux', icon: <Waves className="h-4 w-4" />, color: 'indigo' }
      ]
    },
    focus: {
      icon: <Sun className="h-5 w-5" />,
      title: 'Concentration',
      sounds: [
        { id: 'cafe-ambience', name: 'Café parisien', icon: <Heart className="h-4 w-4" />, color: 'amber' },
        { id: 'library', name: 'Bibliothèque', icon: <Heart className="h-4 w-4" />, color: 'gray' },
        { id: 'fireplace', name: 'Cheminée crépitante', icon: <Zap className="h-4 w-4" />, color: 'orange' },
        { id: 'clock-ticking', name: 'Tic-tac horloge', icon: <Heart className="h-4 w-4" />, color: 'gray' },
        { id: 'keyboard-typing', name: 'Clavier mécanique', icon: <Heart className="h-4 w-4" />, color: 'blue' },
        { id: 'vinyl-crackle', name: 'Crépitement vinyle', icon: <Heart className="h-4 w-4" />, color: 'amber' }
      ]
    }
  };

  const toggleSound = (soundId: string) => {
    if (playingSounds.includes(soundId)) {
      setPlayingSounds(prev => prev.filter(id => id !== soundId));
    } else {
      setPlayingSounds(prev => [...prev, soundId]);
      if (!volumes[soundId]) {
        setVolumes(prev => ({ ...prev, [soundId]: 50 }));
      }
    }
  };

  const updateVolume = (soundId: string, volume: number) => {
    setVolumes(prev => ({ ...prev, [soundId]: volume }));
  };

  const clearAllSounds = () => {
    setPlayingSounds([]);
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500/20 text-blue-600 border-blue-200',
      cyan: 'bg-cyan-500/20 text-cyan-600 border-cyan-200',
      green: 'bg-green-500/20 text-green-600 border-green-200',
      gray: 'bg-gray-500/20 text-gray-600 border-gray-200',
      purple: 'bg-purple-500/20 text-purple-600 border-purple-200',
      orange: 'bg-orange-500/20 text-orange-600 border-orange-200',
      amber: 'bg-amber-500/20 text-amber-600 border-amber-200',
      pink: 'bg-pink-500/20 text-pink-600 border-pink-200',
      yellow: 'bg-yellow-500/20 text-yellow-600 border-yellow-200',
      indigo: 'bg-indigo-500/20 text-indigo-600 border-indigo-200'
    };
    return colorMap[color] || colorMap.gray;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Waves className="h-5 w-5 text-blue-500" />
            Ambiances Sonores
          </CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              {playingSounds.length} actifs
            </Badge>
            {playingSounds.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllSounds}>
                Tout arrêter
              </Button>
            )}
          </div>
        </div>
        
        {/* Volume Global */}
        <div className="flex items-center gap-3 mt-4 p-3 bg-muted/50 rounded-lg">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium min-w-[100px]">Volume global</span>
          <Slider
            value={[globalVolume]}
            onValueChange={(value) => setGlobalVolume(value[0])}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground w-12">{globalVolume}%</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-3">
            {Object.entries(soundCategories).map(([key, category]) => (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                {category.icon}
                <span className="hidden sm:inline">{category.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(soundCategories).map(([categoryKey, category]) => (
            <TabsContent key={categoryKey} value={categoryKey} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {category.sounds.map((sound) => {
                  const isPlaying = playingSounds.includes(sound.id);
                  const volume = volumes[sound.id] || 50;
                  
                  return (
                    <Card 
                      key={sound.id} 
                      className={`transition-all duration-300 hover:shadow-lg ${
                        isPlaying ? 'ring-2 ring-primary/50 shadow-lg' : ''
                      }`}
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-lg border ${getColorClasses(sound.color)}`}>
                              {sound.icon}
                            </div>
                            <span className="font-medium text-sm">{sound.name}</span>
                          </div>
                          <Button
                            size="sm"
                            variant={isPlaying ? "default" : "outline"}
                            onClick={() => toggleSound(sound.id)}
                            className="h-8 w-8 p-0"
                          >
                            {isPlaying ? (
                              <Pause className="h-3 w-3" />
                            ) : (
                              <Play className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        
                        {isPlaying && (
                          <div className="flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
                            <VolumeX className="h-3 w-3 text-muted-foreground" />
                            <Slider
                              value={[volume]}
                              onValueChange={(value) => updateVolume(sound.id, value[0])}
                              max={100}
                              step={1}
                              className="flex-1"
                            />
                            <Volume2 className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground w-8">{volume}%</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {playingSounds.length > 0 && (
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Waves className="h-4 w-4 text-primary" />
                <span className="font-medium">Mix en cours</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {playingSounds.map((soundId) => {
                  const sound = Object.values(soundCategories)
                    .flatMap(cat => cat.sounds)
                    .find(s => s.id === soundId);
                  
                  return sound ? (
                    <Badge 
                      key={soundId} 
                      variant="secondary" 
                      className="flex items-center gap-1"
                    >
                      {sound.icon}
                      {sound.name}
                      <button
                        onClick={() => toggleSound(soundId)}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <VolumeX className="h-3 w-3" />
                      </button>
                    </Badge>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default AmbientSoundSelector;
