
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, Headphones, Music, Shuffle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const MusicPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState([70]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(240);

  const playlists = [
    {
      id: 1,
      name: 'Relaxation Profonde',
      tracks: 12,
      duration: '45 min',
      mood: 'Calme',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'Focus & Concentration',
      tracks: 18,
      duration: '60 min',
      mood: 'Focus',
      color: 'bg-purple-500'
    },
    {
      id: 3,
      name: 'Énergie Positive',
      tracks: 15,
      duration: '50 min',
      mood: 'Joyeux',
      color: 'bg-yellow-500'
    },
    {
      id: 4,
      name: 'Méditation Guidée',
      tracks: 8,
      duration: '30 min',
      mood: 'Zen',
      color: 'bg-green-500'
    }
  ];

  const currentPlaylist = [
    { id: 1, title: 'Océan Tranquille', artist: 'Nature Sounds', duration: '4:20', mood: 'Relaxant' },
    { id: 2, title: 'Forêt Mystique', artist: 'Ambient Dreams', duration: '5:15', mood: 'Mystique' },
    { id: 3, title: 'Pluie Douce', artist: 'Rain Therapy', duration: '3:45', mood: 'Apaisant' },
    { id: 4, title: 'Méditation Tibétaine', artist: 'Monks Chanting', duration: '6:30', mood: 'Spirituel' }
  ];

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    toast.success(isPlaying ? 'Musique en pause' : 'Lecture en cours');
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % currentPlaylist.length);
    toast.info('Piste suivante');
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + currentPlaylist.length) % currentPlaylist.length);
    toast.info('Piste précédente');
  };

  // Simulation du temps de lecture
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            nextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4" data-testid="music-page">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Musicothérapie</h1>
          <p className="text-xl text-gray-600">Musique adaptative pour votre bien-être émotionnel</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lecteur Principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
              <CardContent className="relative p-8">
                <div className="text-center mb-8">
                  <motion.div
                    className="w-48 h-48 mx-auto bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-6"
                    animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Music className="h-24 w-24 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-2">{currentPlaylist[currentTrack].title}</h3>
                  <p className="text-gray-600 mb-1">{currentPlaylist[currentTrack].artist}</p>
                  <Badge variant="secondary">{currentPlaylist[currentTrack].mood}</Badge>
                </div>

                {/* Barre de progression */}
                <div className="space-y-2 mb-6">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Contrôles */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Button variant="outline" size="icon" onClick={prevTrack}>
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  <Button size="lg" onClick={togglePlay} className="bg-purple-600 hover:bg-purple-700">
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextTrack}>
                    <SkipForward className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Shuffle className="h-5 w-5" />
                  </Button>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-4">
                  <Volume2 className="h-5 w-5 text-gray-600" />
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 w-12">{volume[0]}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Playlist Actuelle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5" />
                  Playlist en cours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentPlaylist.map((track, index) => (
                    <div
                      key={track.id}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        index === currentTrack ? 'bg-purple-100' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setCurrentTrack(index)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          {index === currentTrack && isPlaying ? (
                            <Pause className="h-4 w-4 text-white" />
                          ) : (
                            <Play className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{track.title}</p>
                          <p className="text-sm text-gray-600">{track.artist}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-1">{track.mood}</Badge>
                        <p className="text-sm text-gray-600">{track.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Playlists Recommandées */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Playlists Recommandées
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => toast.info(`Chargement de "${playlist.name}"`)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 ${playlist.color} rounded-lg flex items-center justify-center`}>
                        <Music className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{playlist.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{playlist.tracks} pistes • {playlist.duration}</p>
                        <Badge variant="outline" className="text-xs">{playlist.mood}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques d'Écoute</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">2h 45m</p>
                  <p className="text-sm text-gray-600">Temps d'écoute aujourd'hui</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Sessions cette semaine</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Genre préféré</span>
                    <span className="font-medium">Relaxation</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Amélioration du stress</span>
                    <span className="font-medium text-green-600">-15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
