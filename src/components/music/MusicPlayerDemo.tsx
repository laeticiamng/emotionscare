
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { useMusicControls } from '@/hooks/useMusicControls';
import { mockMusicTracks } from '@/mocks/musicTracks';

const MusicPlayerDemo: React.FC = () => {
  const {
    isPlaying,
    currentTrack,
    volume,
    play,
    pause,
    setVolume
  } = useMusicControls();

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      // Jouer le premier track de démonstration
      play(mockMusicTracks[0]);
    }
  };

  const playRandomTrack = () => {
    const randomTrack = mockMusicTracks[Math.floor(Math.random() * mockMusicTracks.length)];
    play(randomTrack);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Lecteur Musical
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informations du track */}
        <div className="text-center">
          <h3 className="font-medium">
            {currentTrack?.title || 'Aucune musique sélectionnée'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {currentTrack?.artist || 'Sélectionnez une musique'}
          </p>
        </div>

        {/* Contrôles de lecture */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={playRandomTrack}
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            onClick={handlePlayPause}
            className="h-12 w-12"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={playRandomTrack}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Contrôle du volume */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Volume: {Math.round(volume * 100)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Liste des tracks disponibles */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Morceaux disponibles:</h4>
          <div className="space-y-1">
            {mockMusicTracks.map((track) => (
              <Button
                key={track.id}
                variant="ghost"
                size="sm"
                onClick={() => play(track)}
                className="w-full justify-start text-left"
              >
                <div>
                  <div className="font-medium">{track.title}</div>
                  <div className="text-xs text-muted-foreground">{track.artist}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* État de lecture */}
        <div className="text-center text-sm text-muted-foreground">
          {isPlaying ? '🎵 Lecture en cours' : '⏸️ En pause'}
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicPlayerDemo;
