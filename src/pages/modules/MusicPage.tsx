/**
 * MusicPage - Module de thérapie musicale
 * Interface pour les sessions de musique thérapeutique
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Heart,
  Music,
  Clock,
  Repeat,
  Shuffle,
  Download,
  Share
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  genre: string;
  mood: string;
  image: string;
  audioUrl: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: Track[];
  mood: string;
  duration: number;
}

const MusicPage: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playlists: Playlist[] = [
    {
      id: '1',
      name: 'Détente & Relaxation',
      description: 'Sons apaisants pour une relaxation profonde',
      mood: 'calm',
      duration: 45,
      tracks: [
        {
          id: '1',
          title: 'Océan de Paix',
          artist: 'Nature Sounds',
          duration: 8.5,
          genre: 'Ambient',
          mood: 'calm',
          image: '/api/placeholder/150/150',
          audioUrl: ''
        },
        {
          id: '2',
          title: 'Méditation Guidée',
          artist: 'Zen Master',
          duration: 12.0,
          genre: 'Meditation',
          mood: 'calm',
          image: '/api/placeholder/150/150',
          audioUrl: ''
        }
      ]
    },
    {
      id: '2',
      name: 'Énergie & Motivation',
      description: 'Musiques énergisantes pour se motiver',
      mood: 'energetic',
      duration: 35,
      tracks: [
        {
          id: '3',
          title: 'Réveil Dynamique',
          artist: 'Energy Beats',
          duration: 6.2,
          genre: 'Electronic',
          mood: 'energetic',
          image: '/api/placeholder/150/150',
          audioUrl: ''
        },
        {
          id: '4',
          title: 'Force Intérieure',
          artist: 'Motivation Mix',
          duration: 8.8,
          genre: 'Ambient',
          mood: 'focused',
          image: '/api/placeholder/150/150',
          audioUrl: ''
        }
      ]
    },
    {
      id: '3',
      name: 'Focus & Concentration',
      description: 'Ambiances pour améliorer la concentration',
      mood: 'focused',
      duration: 60,
      tracks: [
        {
          id: '5',
          title: 'Flow State',
          artist: 'Productivity Sounds',
          duration: 15.0,
          genre: 'Lo-fi',
          mood: 'focused',
          image: '/api/placeholder/150/150',
          audioUrl: ''
        },
        {
          id: '6',
          title: 'Deep Work',
          artist: 'Ambient Focus',
          duration: 20.0,
          genre: 'Ambient',
          mood: 'focused',
          image: '/api/placeholder/150/150',
          audioUrl: ''
        }
      ]
    }
  ];

  const playTrack = (track: Track, playlist?: Playlist) => {
    setCurrentTrack(track);
    if (playlist) setCurrentPlaylist(playlist);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds);
    const secs = Math.floor((seconds % 1) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'calm': return 'bg-blue-500';
      case 'energetic': return 'bg-orange-500';
      case 'focused': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'calm': return Heart;
      case 'energetic': return Play;
      case 'focused': return Clock;
      default: return Music;
    }
  };

  // Simulation de progression audio
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentTrack.duration) {
            setIsPlaying(false);
            return currentTrack.duration;
          }
          return prev + 0.1;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentTrack]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
            <Music className="h-8 w-8 text-purple-600" />
            Thérapie Musicale
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez des playlists personnalisées pour votre bien-être émotionnel
          </p>
        </motion.div>

        {/* Lecteur audio */}
        <AnimatePresence>
          {currentTrack && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                      <Music className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{currentTrack.title}</h3>
                      <p className="text-white/80">{currentTrack.artist}</p>
                      <Badge variant="secondary" className="mt-1">
                        {currentTrack.genre}
                      </Badge>
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div className="space-y-2 mb-4">
                    <Progress 
                      value={(currentTime / currentTrack.duration) * 100} 
                      className="bg-white/20"
                    />
                    <div className="flex justify-between text-sm text-white/80">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(currentTrack.duration)}</span>
                    </div>
                  </div>

                  {/* Contrôles */}
                  <div className="flex items-center justify-center gap-4">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                      <SkipBack className="h-5 w-5" />
                    </Button>
                    
                    <Button 
                      onClick={togglePlayPause}
                      size="icon" 
                      className="h-12 w-12 bg-white text-purple-600 hover:bg-white/90"
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6 ml-1" />
                      )}
                    </Button>
                    
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                      <SkipForward className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Contrôles secondaires */}
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      <Slider 
                        value={[volume]} 
                        onValueChange={(value) => setVolume(value[0])}
                        max={100} 
                        step={1}
                        className="w-20"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                        <Repeat className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                        <Shuffle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Playlists */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Playlists Thérapeutiques</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist, index) => {
              const MoodIcon = getMoodIcon(playlist.mood);
              
              return (
                <motion.div
                  key={playlist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="flex items-center gap-2">
                            <div className={`p-2 rounded-lg ${getMoodColor(playlist.mood)} text-white`}>
                              <MoodIcon className="h-4 w-4" />
                            </div>
                            {playlist.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {playlist.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {playlist.duration} min
                        <Badge variant="outline" className="text-xs">
                          {playlist.tracks.length} pistes
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      {playlist.tracks.slice(0, 2).map((track) => (
                        <div 
                          key={track.id}
                          onClick={() => playTrack(track, playlist)}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                        >
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 shrink-0"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{track.title}</div>
                            <div className="text-sm text-muted-foreground truncate">
                              {track.artist} • {formatTime(track.duration)}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {playlist.tracks.length > 2 && (
                        <div className="text-center pt-2">
                          <Button variant="outline" size="sm">
                            Voir toutes les pistes ({playlist.tracks.length})
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Section recommandations */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Recommandations personnalisées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-blue-600">85%</div>
                <div className="text-sm text-muted-foreground">Efficacité relaxation</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm text-muted-foreground">Sessions complétées</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-purple-600">45 min</div>
                <div className="text-sm text-muted-foreground">Temps moyen/session</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MusicPage;