
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, Music } from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import { cn } from '@/lib/utils';

interface MiniPlayerProps {
  className?: string;
  onExpand?: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ className, onExpand }) => {
  const {
    currentTrack,
    isPlaying,
    play,
    pause,
    next
  } = useMusic();

  if (!currentTrack) return null;

  return (
    <Card className={cn(
      "fixed bottom-4 right-4 w-80 bg-background/95 backdrop-blur-sm border shadow-lg z-50",
      className
    )}>
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          {/* Cover */}
          <div className="w-12 h-12 rounded-md overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center flex-shrink-0">
            {currentTrack.coverUrl || currentTrack.cover ? (
              <img
                src={currentTrack.coverUrl || currentTrack.cover}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Music className="h-6 w-6 text-primary" />
            )}
          </div>

          {/* Track Info */}
          <div 
            className="flex-1 min-w-0 cursor-pointer" 
            onClick={onExpand}
          >
            <h4 className="font-medium text-sm truncate">{currentTrack.title}</h4>
            <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              size="icon"
              variant="ghost"
              onClick={isPlaying ? pause : play}
              className="h-8 w-8"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              size="icon"
              variant="ghost"
              onClick={next}
              className="h-8 w-8"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mini Progress Bar */}
        <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ 
              width: currentTrack.duration ? 
                `${(0 / currentTrack.duration) * 100}%` : '0%' 
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MiniPlayer;
