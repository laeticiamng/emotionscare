import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, Heart, Brain } from 'lucide-react';

const MusicTherapy: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState([75]);
  
  const playlists = [
    {
      name: 'Relaxation profonde',
      description: 'Pour apaiser le stress et l\'anxiété',
      emotion: 'Calme',
      color: 'bg-blue-500',
      tracks: 12,
      duration: '45 min'
    },
    {
      name: 'Énergie positive',
      description: 'Pour booster votre moral',
      emotion: 'Joyeux',
      color: 'bg-yellow-500',
      tracks: 15,
      duration: '52 min'
    },
    {
      name: 'Concentration zen',
      description: 'Pour améliorer votre focus',
      emotion: 'Concentré',
      color: 'bg-green-500',
      tracks: 10,
      duration: '38 min'
    },
    {
      name: 'Méditation guidée',
      description: 'Sons binauraux et nature',
      emotion: 'Paisible',
      color: 'bg-purple-500',
      tracks: 8,
      duration: '60 min'
    }
  ];

  const currentPlaylist = playlists[0];
  const tracks = [
    { title: 'Ocean Waves', artist: 'Nature Sounds', duration: '4:32' },
    { title: 'Deep Breathing', artist: 'Meditation Master', duration: '6:15' },
    { title: 'Forest Rain', artist: 'Ambient Collection', duration: '5:43' },
    { title: 'Peaceful Mind', artist: 'Relaxation Pro', duration: '7:21' },
  ];

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Music className="h-8 w-8 text-primary" />
            Thérapie musicale
          </h1>
          <p className="text-muted-foreground">Musique personnalisée selon votre état émotionnel</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Playlists */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Playlists recommandées</CardTitle>
                <CardDescription>Basées sur votre dernier scan émotionnel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {playlists.map((playlist, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 ${playlist.color} rounded-lg flex items-center justify-center`}>
                            <Music className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{playlist.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{playlist.description}</p>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {playlist.emotion}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {playlist.tracks} titres • {playlist.duration}
                              </span>
                            </div>
                            <Button size="sm" className="w-full">
                              <Play className="h-3 w-3 mr-1" />
                              Écouter
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Playlist */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Music className="h-4 w-4 text-white" />
                  </div>
                  {currentPlaylist.name}
                </CardTitle>
                <CardDescription>{currentPlaylist.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tracks.map((track, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        index === currentTrack
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <Button
                        size="sm"
                        variant={index === currentTrack && isPlaying ? "default" : "outline"}
                        className="w-8 h-8"
                        onClick={() => {
                          setCurrentTrack(index);
                          setIsPlaying(true);
                        }}
                      >
                        {index === currentTrack && isPlaying ? (
                          <Pause className="h-3 w-3" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                      </Button>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{track.title}</p>
                        <p className="text-xs text-muted-foreground">{track.artist}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{track.duration}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Player & Controls */}
          <div className="space-y-6">
            {/* Now Playing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">En cours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Music className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="font-medium">{tracks[currentTrack].title}</h3>
                  <p className="text-sm text-muted-foreground">{tracks[currentTrack].artist}</p>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Button size="sm" variant="outline" onClick={prevTrack}>
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button size="lg" onClick={togglePlay}>
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <Button size="sm" variant="outline" onClick={nextTrack}>
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                {/* Volume */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    <span className="text-sm">Volume</span>
                  </div>
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  Bienfaits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Heart className="h-4 w-4 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Réduction du stress</p>
                      <p className="text-xs text-muted-foreground">Diminue le cortisol de 30%</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Brain className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Améliore la concentration</p>
                      <p className="text-xs text-muted-foreground">Ondes alpha optimisées</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Music className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Équilibre émotionnel</p>
                      <p className="text-xs text-muted-foreground">Harmonise l'humeur</p>
                    </div>
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

export default MusicTherapy;