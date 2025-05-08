
import React, { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Music } from 'lucide-react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useAudioPlayerState } from '@/hooks/audio/useAudioPlayerState';
import { formatTime } from '@/hooks/audio/audioPlayerUtils';

interface MiniPlayerProps {
  onOpenFullPlayer?: () => void;
  className?: string;
}

/**
 * A compact music player component that can be embedded in various parts of the app
 */
const MiniPlayer: React.FC<MiniPlayerProps> = ({
  onOpenFullPlayer,
  className = ""
}) => {
  const {
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
  } = useAudioPlayer();

  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    loadingTrack
  } = useAudioPlayerState();

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  // Handle play/pause
  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      resumeTrack();
    }
  };

  // Get the cover image URL from the current track
  const getCoverImage = () => {
    if (!currentTrack) return null;
    
    if ('coverUrl' in currentTrack && currentTrack.coverUrl) {
      return currentTrack.coverUrl;
    }
    
    if ('cover' in currentTrack && currentTrack.cover) {
      return currentTrack.cover;
    }
    
    return null;
  };

  if (!currentTrack) {
    return (
      <Card className={`overflow-hidden shadow-sm ${className}`}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
                <Music className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">No track playing</p>
                <p className="text-xs text-muted-foreground">Select a track to play</p>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={onOpenFullPlayer}
              className="h-8"
            >
              Open Player
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden shadow-sm hover:shadow-md transition-shadow ${className}`} onClick={onOpenFullPlayer}>
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center overflow-hidden">
            {getCoverImage() ? (
              <img 
                src={getCoverImage() || ''} 
                alt={currentTrack.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <Music className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{currentTrack.title}</p>
            <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
            
            {/* Progress bar */}
            <div className="w-full h-1 bg-secondary mt-1 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={(e) => {
                e.stopPropagation();
                previousTrack();
              }}
              className="h-8 w-8"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button 
              size="icon" 
              variant={isPlaying ? "secondary" : "default"}
              onClick={(e) => {
                e.stopPropagation();
                handlePlayPause();
              }}
              disabled={loadingTrack}
              className="h-8 w-8 rounded-full"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 ml-0.5" />
              )}
            </Button>
            
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={(e) => {
                e.stopPropagation();
                nextTrack();
              }}
              className="h-8 w-8"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MiniPlayer;
