import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2,
  Heart,
  Shuffle,
  Repeat,
  Music,
  Headphones,
  Clock
} from 'lucide-react';
import { useNavAction } from '@/hooks/useNavAction';

export function MusicHub() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState([75]);
  const navAction = useNavAction();

  const playlists = [
    {
      id: 'relaxation',
      title: 'Relaxation Profonde',
      description: 'Pour apaiser l\'esprit et réduire le stress',
      trackCount: 12,
      duration: 45,
      mood: 'Calme',
      color: 'bg-blue-500'
    },
    {
      id: 'focus',
      title: 'Concentration Optimale',
      description: 'Musique binaurale pour la focus',
      trackCount: 8,
      duration: 60,
      mood: 'Concentration',
      color: 'bg-purple-500'
    },
    {
      id: 'energy',
      title: 'Boost d\'Énergie',
      description: 'Retrouvez votre dynamisme',
      trackCount: 15,
      duration: 38,
      mood: 'Énergisant',
      color: 'bg-orange-500'
    }
  ];

  const currentPlaylist = playlists[0];
  const tracks = [
    { title: 'Vagues Océaniques', artist: 'Nature Sounds', duration: '4:32' },
    { title: 'Méditation Guidée', artist: 'Dr. Wellness', duration: '8:15' },
    { title: 'Fréquences 432Hz', artist: 'Healing Tones', duration: '6:45' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Musicothérapie</h1>
          <p className="text-muted-foreground">
            Musiques thérapeutiques personnalisées selon vos émotions
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          <Headphones className="w-4 h-4 mr-1" />
          Mode Bien-être
        </Badge>
      </div>

      {/* Current Player */}
      <Card className="overflow-hidden">
        <div className={`h-2 ${currentPlaylist.color}`} />
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 ${currentPlaylist.color} rounded-lg flex items-center justify-center`}>
                <Music className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">{tracks[currentTrack]?.title}</h3>
                <p className="text-sm text-muted-foreground">{tracks[currentTrack]?.artist}</p>
                <Badge variant="outline" size="sm" className="mt-1">
                  {currentPlaylist.mood}
                </Badge>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navAction({ type: 'modal', id: 'add-favorite', payload: { trackId: currentTrack } })}
            >
              <Heart className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress */}
          <div className="space-y-2 mb-4">
            <Slider
              value={[35]}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1:32</span>
              <span>{tracks[currentTrack]?.duration}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Button variant="ghost" size="icon">
              <Shuffle className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button 
              size="icon" 
              className="w-12 h-12"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
            <Button variant="ghost" size="icon">
              <SkipForward className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Repeat className="w-4 h-4" />
            </Button>
          </div>

          {/* Volume */}
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4" />
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-8">{volume[0]}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Playlists */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Playlists Recommandées</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((playlist) => (
            <Card 
              key={playlist.id} 
              className="cursor-pointer hover:shadow-lg transition-all"
              onClick={() => navAction({ type: 'modal', id: 'playlist', payload: { playlistId: playlist.id } })}
            >
              <div className={`h-2 ${playlist.color}`} />
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{playlist.title}</CardTitle>
                <CardDescription>{playlist.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Music className="w-4 h-4 mr-1" />
                    {playlist.trackCount} titres
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {playlist.duration} min
                  </div>
                </div>
                <Badge variant="secondary" className="w-fit">
                  {playlist.mood}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button 
          onClick={() => navAction({ type: 'modal', id: 'emotion-music' })}
        >
          <Heart className="w-4 h-4 mr-2" />
          Musique selon mon émotion
        </Button>
        <Button 
          variant="outline"
          onClick={() => navAction({ type: 'modal', id: 'create-playlist' })}
        >
          <Music className="w-4 h-4 mr-2" />
          Créer une playlist
        </Button>
        <Button 
          variant="outline"
          onClick={() => navAction({ type: 'route', to: '/music/favorites' })}
        >
          <Heart className="w-4 h-4 mr-2" />
          Mes favoris
        </Button>
      </div>
    </div>
  );
}