import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, Heart, Brain, Zap, Waves, Headphones, Shuffle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  genre: string;
  mood: string;
  bpm: number;
  binaural_frequency?: number;
  healing_properties: string[];
  audio_url: string;
  artwork: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: Track[];
  mood: string;
  total_duration: number;
}

const B2CMusicEnhanced: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [selectedMood, setSelectedMood] = useState('calm');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [biometricData, setBiometricData] = useState({
    heartRate: 72,
    stressLevel: 35,
    focusLevel: 78,
    energyLevel: 65
  });
  const [musicPreferences, setMusicPreferences] = useState({
    binauralBeats: true,
    naturesSounds: true,
    adaptiveTempo: true,
    personalizedMix: true
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);

  const moods = {
    calm: {
      name: 'Sérénité',
      icon: Heart,
      color: 'from-blue-400 to-cyan-500',
      frequencies: [432, 528],
      description: 'Musique apaisante pour la relaxation'
    },
    energize: {
      name: 'Énergie',
      icon: Zap,
      color: 'from-orange-400 to-red-500',
      frequencies: [40, 70],
      description: 'Boost énergétique et motivation'
    },
    focus: {
      name: 'Concentration',
      icon: Brain,
      color: 'from-purple-400 to-pink-500',
      frequencies: [10, 40],
      description: 'Musique pour la concentration profonde'
    },
    sleep: {
      name: 'Sommeil',
      icon: Waves,
      color: 'from-indigo-400 to-purple-500',
      frequencies: [0.5, 4],
      description: 'Sons relaxants pour l\'endormissement'
    },
    creative: {
      name: 'Créativité',
      icon: Music,
      color: 'from-pink-400 to-rose-500',
      frequencies: [8, 13],
      description: 'Stimulation créative et inspiration'
    }
  };

  // Génération de playlist IA personnalisée
  const generatePersonalizedPlaylist = async () => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('music-generation', {
        body: {
          mood: selectedMood,
          biometrics: biometricData,
          preferences: musicPreferences,
          duration: 30, // 30 minutes
          adaptiveMode: true
        }
      });

      if (error) throw error;

      const newPlaylist: Playlist = {
        id: Date.now().toString(),
        name: `Mix ${moods[selectedMood as keyof typeof moods].name} Personnalisé`,
        description: `Générée spécialement pour vous basée sur vos données biométriques`,
        tracks: data.tracks,
        mood: selectedMood,
        total_duration: data.totalDuration
      };

      setPlaylists(prev => [newPlaylist, ...prev]);
      setCurrentPlaylist(newPlaylist);
      
      if (data.tracks.length > 0) {
        setCurrentTrack(data.tracks[0]);
        setTrackIndex(0);
      }

      toast({
        title: "🎵 Playlist générée !",
        description: `${data.tracks.length} morceaux créés spécialement pour vous`
      });

    } catch (error) {
      console.error('Error generating playlist:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la playlist",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Simulation de lecture avec sync biométrique
  useEffect(() => {
    if (!isPlaying || !currentTrack) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= currentTrack.duration) {
          playNext();
          return 0;
        }
        return prev + 1;
      });

      // Simulation d'adaptation biométrique en temps réel
      if (musicPreferences.adaptiveTempo && currentTrack.bpm) {
        setBiometricData(prev => {
          const targetHR = selectedMood === 'calm' ? 60 : selectedMood === 'energize' ? 85 : 72;
          const adjustment = (targetHR - prev.heartRate) * 0.1;
          
          return {
            ...prev,
            heartRate: Math.max(50, Math.min(120, prev.heartRate + adjustment)),
            stressLevel: Math.max(0, Math.min(100, prev.stressLevel + (Math.random() - 0.6) * 2)),
            focusLevel: Math.max(0, Math.min(100, prev.focusLevel + (Math.random() - 0.4) * 3))
          };
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentTrack, selectedMood]);

  const playPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = () => {
    if (currentPlaylist && trackIndex < currentPlaylist.tracks.length - 1) {
      const nextIndex = trackIndex + 1;
      setCurrentTrack(currentPlaylist.tracks[nextIndex]);
      setTrackIndex(nextIndex);
      setCurrentTime(0);
    }
  };

  const playPrevious = () => {
    if (currentPlaylist && trackIndex > 0) {
      const prevIndex = trackIndex - 1;
      setCurrentTrack(currentPlaylist.tracks[prevIndex]);
      setTrackIndex(prevIndex);
      setCurrentTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTrackSelect = (track: Track, index: number) => {
    setCurrentTrack(track);
    setTrackIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <motion.div
          animate={isPlaying ? { 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          } : { scale: 1, rotate: 0 }}
          transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }}
        >
          <Headphones className="h-8 w-8 text-purple-500" />
        </motion.div>
        <div>
          <h1 className="text-3xl font-bold">Musicothérapie IA 🎵</h1>
          <p className="text-muted-foreground">Musique thérapeutique adaptée à votre état</p>
        </div>
      </motion.div>

      {/* Données biométriques en temps réel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 60/biometricData.heartRate, repeat: Infinity }}
              className="text-2xl font-bold text-red-500"
            >
              {Math.round(biometricData.heartRate)}
            </motion.div>
            <div className="text-sm text-muted-foreground">BPM</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{Math.round(biometricData.stressLevel)}%</div>
            <div className="text-sm text-muted-foreground">Stress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{Math.round(biometricData.focusLevel)}%</div>
            <div className="text-sm text-muted-foreground">Focus</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">{Math.round(biometricData.energyLevel)}%</div>
            <div className="text-sm text-muted-foreground">Énergie</div>
          </CardContent>
        </Card>
      </div>

      {/* Sélection d'humeur */}
      <Card>
        <CardHeader>
          <CardTitle>Sélectionnez votre état d'esprit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(moods).map(([key, mood]) => {
              const Icon = mood.icon;
              return (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={selectedMood === key ? "default" : "outline"}
                    className={`w-full h-auto p-4 flex flex-col gap-2 ${
                      selectedMood === key ? `bg-gradient-to-r ${mood.color} text-white` : ''
                    }`}
                    onClick={() => setSelectedMood(key)}
                  >
                    <Icon className="h-6 w-6" />
                    <div className="text-sm font-medium">{mood.name}</div>
                    <div className="text-xs opacity-80 text-center">{mood.description}</div>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Lecteur principal */}
      <Card className="relative overflow-hidden">
        <CardHeader className={currentTrack ? `bg-gradient-to-r ${moods[selectedMood as keyof typeof moods].color} text-white` : ''}>
          <CardTitle className="flex items-center justify-between">
            <span>Lecteur Musical</span>
            <Button 
              onClick={generatePersonalizedPlaylist}
              disabled={isGenerating}
              variant={currentTrack ? "secondary" : "default"}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Music className="h-4 w-4" />
                  </motion.div>
                  Génération IA...
                </>
              ) : (
                <>
                  <Shuffle className="h-4 w-4" />
                  Générer Playlist IA
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          {currentTrack ? (
            <div className="space-y-6">
              {/* Info du morceau actuel */}
              <div className="flex items-center gap-4">
                <motion.div
                  animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 4, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center"
                >
                  <Music className="h-8 w-8 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{currentTrack.title}</h3>
                  <p className="text-muted-foreground">{currentTrack.artist}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{currentTrack.genre}</Badge>
                    <Badge variant="outline">{currentTrack.bpm} BPM</Badge>
                    {currentTrack.binaural_frequency && (
                      <Badge variant="outline">{currentTrack.binaural_frequency}Hz</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Propriétés thérapeutiques */}
              <div>
                <h4 className="text-sm font-medium mb-2">Propriétés Thérapeutiques</h4>
                <div className="flex flex-wrap gap-2">
                  {currentTrack.healing_properties.map(property => (
                    <Badge key={property} variant="secondary" className="text-xs">
                      {property}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Barre de progression */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(currentTrack.duration)}</span>
                </div>
                <Progress value={(currentTime / currentTrack.duration) * 100} className="h-2" />
              </div>

              {/* Contrôles */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={playPrevious}
                  variant="outline"
                  size="icon"
                  disabled={trackIndex === 0}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={playPause}
                  size="lg"
                  className="w-16 h-16 rounded-full"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                
                <Button
                  onClick={playNext}
                  variant="outline"
                  size="icon"
                  disabled={!currentPlaylist || trackIndex >= currentPlaylist.tracks.length - 1}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              {/* Contrôle du volume */}
              <div className="flex items-center gap-3">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={5}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-12">{volume[0]}%</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Aucun morceau sélectionné</h3>
              <p className="text-muted-foreground mb-4">
                Générez une playlist IA personnalisée pour commencer
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Liste des morceaux */}
      {currentPlaylist && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{currentPlaylist.name}</span>
              <Badge variant="outline">
                {currentPlaylist.tracks.length} morceaux
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {currentPlaylist.tracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    currentTrack?.id === track.id 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleTrackSelect(track, index)}
                >
                  <div className="w-8 text-center">
                    {currentTrack?.id === track.id && isPlaying ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        <Waves className="h-4 w-4 text-primary" />
                      </motion.div>
                    ) : (
                      <span className="text-sm text-muted-foreground">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{track.title}</div>
                    <div className="text-sm text-muted-foreground">{track.artist}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatTime(track.duration)}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audio element (hidden) */}
      <audio
        ref={audioRef}
        src={currentTrack?.audio_url}
        onEnded={playNext}
        onLoadedData={() => setCurrentTime(0)}
      />
    </div>
  );
};

export default B2CMusicEnhanced;