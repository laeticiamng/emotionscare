
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack, Volume2, X, AlertCircle } from 'lucide-react';
import { useEmotionsCareMusic } from '@/contexts/EmotionsCareMusicContext';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EmotionsCareMusicPlayerProps {
  playlist: any;
  onClose?: () => void;
}

const EmotionsCareMusicPlayer: React.FC<EmotionsCareMusicPlayerProps> = ({ 
  playlist, 
  onClose 
}) => {
  const { 
    isPlaying, 
    volume, 
    currentTrack,
    isLoading,
    error,
    play, 
    pause, 
    toggle,
    nextTrack,
    prevTrack,
    setVolume,
    setPlaylist,
    clearError
  } = useEmotionsCareMusic();

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (playlist?.tracks?.length > 0) {
      console.log('🎵 EmotionsCare - Chargement de la playlist:', playlist);
      setPlaylist(playlist.tracks);
      
      // Auto-play après un délai
      setTimeout(() => {
        play();
      }, 1000);
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

  const handleClearError = () => {
    clearError();
  };

  if (!isVisible || !playlist?.tracks?.length) {
    return null;
  }

  const currentTrackInfo = currentTrack || playlist.tracks[0];

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2">
      <Card className="w-80 bg-background/95 backdrop-blur-md border shadow-lg">
        <CardContent className="p-4 space-y-3">
          {/* Header EmotionsCare */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-sm text-primary">
                🎵 EmotionsCare Music
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

          {/* Affichage des erreurs */}
          {error && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {error}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearError}
                  className="ml-2 h-auto p-1 text-xs"
                >
                  Réessayer
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Info du morceau actuel */}
          {currentTrackInfo && (
            <div className="text-center py-2">
              <p className="font-medium text-sm truncate">
                {currentTrackInfo.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentTrackInfo.artist}
              </p>
              {isLoading && (
                <p className="text-xs text-primary animate-pulse">
                  Chargement...
                </p>
              )}
            </div>
          )}

          {/* Contrôles de lecture */}
          <div className="flex items-center justify-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={prevTrack}
              className="h-8 w-8"
              disabled={isLoading}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="default" 
              size="icon"
              onClick={toggle}
              className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin border-2 border-white border-t-transparent rounded-full" />
              ) : isPlaying ? (
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
              disabled={isLoading}
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

          {/* Statut EmotionsCare */}
          <div className="text-center">
            <p className="text-xs text-primary font-medium">
              {isLoading ? '⏳ Chargement EmotionsCare' : 
               isPlaying ? '▶️ Lecture EmotionsCare' : '⏸️ En pause'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionsCareMusicPlayer;
