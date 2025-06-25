
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipForward, SkipBack, Volume2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import { toast } from 'sonner';

const MusicPage: React.FC = () => {
  const navigate = useNavigate();
  const musicPlayer = useMusicPlayer();
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('detente');

  const playlists = {
    detente: {
      name: 'Détente',
      tracks: [
        { id: '1', title: 'Sérénité Océanique', artist: 'Nature Sounds', url: '/sounds/ambient-calm.mp3', duration: 180 },
        { id: '2', title: 'Méditation Douce', artist: 'Zen Masters', url: '/sounds/ambient-calm.mp3', duration: 240 },
        { id: '3', title: 'Respiration Profonde', artist: 'Calm Waves', url: '/sounds/ambient-calm.mp3', duration: 300 }
      ]
    },
    focus: {
      name: 'Focus',
      tracks: [
        { id: '4', title: 'Concentration Pure', artist: 'Focus Flow', url: '/sounds/ambient-calm.mp3', duration: 200 },
        { id: '5', title: 'Productivité Zen', artist: 'Work Sounds', url: '/sounds/ambient-calm.mp3', duration: 250 },
        { id: '6', title: 'Mental Clarity', artist: 'Brain Waves', url: '/sounds/ambient-calm.mp3', duration: 280 }
      ]
    },
    energie: {
      name: 'Énergie',
      tracks: [
        { id: '7', title: 'Motivation Matinale', artist: 'Energy Boost', url: '/sounds/ambient-calm.mp3', duration: 220 },
        { id: '8', title: 'Dynamisme Positif', artist: 'Good Vibes', url: '/sounds/ambient-calm.mp3', duration: 190 },
        { id: '9', title: 'Force Intérieure', artist: 'Power Up', url: '/sounds/ambient-calm.mp3', duration: 260 }
      ]
    }
  };

  const currentPlaylist = playlists[selectedPlaylist as keyof typeof playlists];
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrack = currentPlaylist.tracks[currentTrackIndex];

  useEffect(() => {
    if (currentTrack) {
      musicPlayer.loadTrack({
        id: currentTrack.id,
        title: currentTrack.title,
        artist: currentTrack.artist,
        url: currentTrack.url,
        duration: currentTrack.duration,
        emotion: selectedPlaylist
      });
    }
  }, [currentTrack, selectedPlaylist]);

  const handlePlayPause = () => {
    if (musicPlayer.isPlaying) {
      musicPlayer.pause();
    } else {
      musicPlayer.play();
      toast.success(`Lecture: ${currentTrack.title}`);
    }
  };

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % currentPlaylist.tracks.length;
    setCurrentTrackIndex(nextIndex);
  };

  const handlePrevious = () => {
    const prevIndex = currentTrackIndex === 0 ? currentPlaylist.tracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const handlePlaylistTrack = (trackIndex: number) => {
    setCurrentTrackIndex(trackIndex);
    setTimeout(() => musicPlayer.play(), 100);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Musicothérapie</h1>
          <p className="text-muted-foreground">Musique adaptée à votre état émotionnel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lecteur Principal */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Lecteur Musical</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Info Piste */}
              <div className="text-center">
                <h3 className="text-xl font-semibold">{currentTrack.title}</h3>
                <p className="text-muted-foreground">{currentTrack.artist}</p>
              </div>

              {/* Barre de progression */}
              <div className="space-y-2">
                <Slider
                  value={[musicPlayer.currentTime]}
                  max={musicPlayer.duration || 100}
                  step={1}
                  onValueChange={(value) => musicPlayer.seek(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatTime(musicPlayer.currentTime)}</span>
                  <span>{formatTime(musicPlayer.duration)}</span>
                </div>
              </div>

              {/* Contrôles */}
              <div className="flex items-center justify-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handlePrevious}
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
                
                <Button 
                  size="lg"
                  onClick={handlePlayPause}
                  className="h-12 w-12 rounded-full"
                >
                  {musicPlayer.isPlaying ? 
                    <Pause className="h-6 w-6" /> : 
                    <Play className="h-6 w-6 ml-1" />
                  }
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleNext}
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-3">
                <Volume2 className="h-4 w-4" />
                <Slider
                  value={[musicPlayer.volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={(value) => musicPlayer.setVolume(value[0] / 100)}
                  className="flex-1"
                />
                <span className="text-sm w-12 text-right">
                  {Math.round(musicPlayer.volume * 100)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Playlists */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Playlists Recommandées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(playlists).map(([key, playlist]) => (
                <Button
                  key={key}
                  variant={selectedPlaylist === key ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedPlaylist(key);
                    setCurrentTrackIndex(0);
                  }}
                >
                  {playlist.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pistes - {currentPlaylist.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {currentPlaylist.tracks.map((track, index) => (
                <div
                  key={track.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    index === currentTrackIndex 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => handlePlaylistTrack(index)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{track.title}</p>
                      <p className="text-xs text-muted-foreground">{track.artist}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaylistTrack(index);
                      }}
                    >
                      Écouter
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
