
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Play, Pause, Volume2, Mix, Waves, TreePine, Cloud, Coffee, Flame, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface AmbientSound {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'Nature' | 'Urbain' | 'Mystique' | 'Relaxation';
  color: string;
  premium?: boolean;
  // En production, ces seraient de vrais URLs audio
  audioUrl: string;
}

const ambientSounds: AmbientSound[] = [
  {
    id: 'rain',
    name: 'Pluie Douce',
    description: 'Pluie légère sur les feuilles',
    icon: <Cloud className="h-6 w-6" />,
    category: 'Nature',
    color: 'from-blue-400 to-blue-600',
    audioUrl: '/sounds/rain.mp3'
  },
  {
    id: 'ocean',
    name: 'Vagues Océan',
    description: 'Ressac apaisant de l\'océan',
    icon: <Waves className="h-6 w-6" />,
    category: 'Nature',
    color: 'from-cyan-400 to-blue-500',
    audioUrl: '/sounds/ocean.mp3'
  },
  {
    id: 'forest',
    name: 'Forêt Enchantée',
    description: 'Chants d\'oiseaux et bruissement des feuilles',
    icon: <TreePine className="h-6 w-6" />,
    category: 'Nature',
    color: 'from-green-400 to-green-600',
    audioUrl: '/sounds/forest.mp3'
  },
  {
    id: 'fireplace',
    name: 'Feu de Cheminée',
    description: 'Crépitement chaleureux du feu',
    icon: <Flame className="h-6 w-6" />,
    category: 'Relaxation',
    color: 'from-orange-400 to-red-500',
    audioUrl: '/sounds/fireplace.mp3',
    premium: true
  },
  {
    id: 'cafe',
    name: 'Café Parisien',
    description: 'Ambiance feutrée de café',
    icon: <Coffee className="h-6 w-6" />,
    category: 'Urbain',
    color: 'from-amber-400 to-brown-500',
    audioUrl: '/sounds/cafe.mp3'
  },
  {
    id: 'mystical',
    name: 'Bols Tibétains',
    description: 'Sons méditatifs et mystiques',
    icon: <Sparkles className="h-6 w-6" />,
    category: 'Mystique',
    color: 'from-purple-400 to-pink-500',
    audioUrl: '/sounds/tibetan.mp3',
    premium: true
  }
];

const AmbientSoundSelector: React.FC = () => {
  const [playingSounds, setPlayingSounds] = useState<Set<string>>(new Set());
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const [masterVolume, setMasterVolume] = useState(70);
  const [mixMode, setMixMode] = useState(false);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  // Initialiser les volumes
  useEffect(() => {
    const initialVolumes: Record<string, number> = {};
    ambientSounds.forEach(sound => {
      initialVolumes[sound.id] = 50;
    });
    setVolumes(initialVolumes);
  }, []);

  // Créer les éléments audio
  useEffect(() => {
    ambientSounds.forEach(sound => {
      if (!audioRefs.current[sound.id]) {
        const audio = new Audio(sound.audioUrl);
        audio.loop = true;
        audio.volume = (volumes[sound.id] || 50) / 100 * (masterVolume / 100);
        audioRefs.current[sound.id] = audio;
      }
    });

    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  // Mettre à jour le volume quand les sliders changent
  useEffect(() => {
    Object.entries(volumes).forEach(([soundId, volume]) => {
      const audio = audioRefs.current[soundId];
      if (audio) {
        audio.volume = (volume / 100) * (masterVolume / 100);
      }
    });
  }, [volumes, masterVolume]);

  const toggleSound = async (soundId: string) => {
    const audio = audioRefs.current[soundId];
    if (!audio) return;

    if (playingSounds.has(soundId)) {
      // Arrêter le son
      audio.pause();
      setPlayingSounds(prev => {
        const newSet = new Set(prev);
        newSet.delete(soundId);
        return newSet;
      });
    } else {
      // Si pas en mode mix, arrêter les autres sons
      if (!mixMode) {
        playingSounds.forEach(id => {
          const otherAudio = audioRefs.current[id];
          if (otherAudio) {
            otherAudio.pause();
          }
        });
        setPlayingSounds(new Set([soundId]));
      } else {
        setPlayingSounds(prev => new Set([...prev, soundId]));
      }
      
      // Démarrer le nouveau son
      try {
        await audio.play();
      } catch (error) {
        console.error('Erreur lors de la lecture audio:', error);
      }
    }
  };

  const stopAllSounds = () => {
    playingSounds.forEach(soundId => {
      const audio = audioRefs.current[soundId];
      if (audio) {
        audio.pause();
      }
    });
    setPlayingSounds(new Set());
  };

  const categories = Array.from(new Set(ambientSounds.map(s => s.category)));

  return (
    <div className="space-y-6">
      {/* Contrôles globaux */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Contrôles Audio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Volume Principal</Label>
              <Slider
                value={[masterVolume]}
                onValueChange={(values) => setMasterVolume(values[0])}
                max={100}
                step={1}
                className="w-full"
              />
              <span className="text-sm text-muted-foreground">{masterVolume}%</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="mix-mode"
                checked={mixMode}
                onCheckedChange={setMixMode}
              />
              <Label htmlFor="mix-mode" className="flex items-center gap-2">
                <Mix className="h-4 w-4" />
                Mode Mix
              </Label>
            </div>
            
            <Button
              onClick={stopAllSounds}
              variant="outline"
              className="flex items-center gap-2"
              disabled={playingSounds.size === 0}
            >
              <Pause className="h-4 w-4" />
              Tout Arrêter
            </Button>
          </div>
          
          {mixMode && (
            <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
              Mode Mix activé : vous pouvez jouer plusieurs sons simultanément
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sons par catégorie */}
      {categories.map(category => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg">{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {ambientSounds
                .filter(sound => sound.category === category)
                .map((sound, index) => (
                  <motion.div
                    key={sound.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        playingSounds.has(sound.id) ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => toggleSound(sound.id)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${sound.color} text-white`}>
                              {sound.icon}
                            </div>
                            {sound.premium && (
                              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black">
                                Premium
                              </Badge>
                            )}
                          </div>
                          
                          <div>
                            <h4 className="font-medium">{sound.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {sound.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant={playingSounds.has(sound.id) ? "default" : "outline"}
                              className="flex items-center gap-1"
                            >
                              {playingSounds.has(sound.id) ? (
                                <Pause className="h-3 w-3" />
                              ) : (
                                <Play className="h-3 w-3" />
                              )}
                            </Button>
                            
                            {playingSounds.has(sound.id) && (
                              <div className="flex-1 space-y-1">
                                <Slider
                                  value={[volumes[sound.id] || 50]}
                                  onValueChange={(values) => {
                                    setVolumes(prev => ({
                                      ...prev,
                                      [sound.id]: values[0]
                                    }));
                                  }}
                                  max={100}
                                  step={1}
                                  className="w-full"
                                />
                                <span className="text-xs text-muted-foreground">
                                  {volumes[sound.id] || 50}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AmbientSoundSelector;
