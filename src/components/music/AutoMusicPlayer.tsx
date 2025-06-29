
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack, Volume2, X } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { Slider } from '@/components/ui/slider';

interface AutoMusicPlayerProps {
  playlist: any;
  onClose?: () => void;
}

const AutoMusicPlayer: React.FC<AutoMusicPlayerProps> = ({ 
  playlist, 
  onClose 
}) => {
  const { 
    isPlaying, 
    volume, 
    currentTrack,
    play, 
    pause, 
    toggle,
    nextTrack,
    prevTrack,
    setVolume,
    setPlaylist 
  } = useMusic();

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (playlist?.tracks?.length > 0) {
      console.log('🎵 Chargement de la playlist:', playlist);
      setPlaylist(playlist.tracks);
      
      // Auto-play le premier morceau
      setTimeout(() => {
        if (playlist.tracks[0]) {
          play();
        }
      }, 500);
    }
  }, [playlist, setPlaylist, play]);

  const handleClose = () => {
    setIsVisible(false);
    pause();
    if (onClose) {
      onClose();
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  if (!isVisible || !playlist?.tracks?.length) {
    return null;
  }

  const currentTrackInfo = currentTrack || playlist.tracks[0];

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2">
      <Card className="w-80 bg-background/95 backdrop-blur-md border shadow-lg">
        <CardContent className="p-4 space-y-3">
          {/* Header avec titre et bouton fermer */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-sm">
                {playlist.name || 'Playlist générée'}
              </h4>
              <p className="text-xs text-muted-foreground">
                {playlist.tracks.length} morceaux • {playlist.emotion}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Info du morceau actuel */}
          {currentTrackInfo && (
            <div className="text-center py-2">
              <p className="font-medium text-sm truncate">
                {currentTrackInfo.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentTrackInfo.artist}
              </p>
            </div>
          )}

          {/* Contrôles de lecture */}
          <div className="flex items-center justify-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={prevTrack}
              className="h-8 w-8"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="default" 
              size="icon"
              onClick={toggle}
              className="h-10 w-10 rounded-full"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={nextTrack}
              className="h-8 w-8"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Contrôle du volume */}
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[volume]}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
              className="flex-1"
            />
          </div>

          {/* Statut */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              {isPlaying ? '▶️ En cours de lecture' : '⏸️ En pause'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutoMusicPlayer;
