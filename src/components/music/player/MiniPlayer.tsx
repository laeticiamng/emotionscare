
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, Music, Heart } from 'lucide-react';
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
  
  const [isLiked, setIsLiked] = useState(false);

  if (!currentTrack) return null;

  return (
    <Card className={cn(
      "fixed bottom-4 right-4 w-80 bg-gradient-to-r from-background/95 to-background/90 backdrop-blur-lg border shadow-2xl z-50 overflow-hidden",
      "hover:shadow-3xl transition-all duration-300 hover:scale-105",
      className
    )}>
      <CardContent className="p-0">
        {/* Progress bar */}
        <div className="h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-80" />
        
        <div className="p-4">
          <div className="flex items-center gap-3">
            {/* Cover with glow effect */}
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center flex-shrink-0">
              {currentTrack.coverUrl || currentTrack.cover ? (
                <img
                  src={currentTrack.coverUrl || currentTrack.cover}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Music className="h-6 w-6 text-primary" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Track Info with hover effect */}
            <div 
              className="flex-1 min-w-0 cursor-pointer group" 
              onClick={onExpand}
            >
              <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                {currentTrack.title}
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                {currentTrack.artist}
              </p>
              {currentTrack.emotion && (
                <p className="text-xs text-primary/80 capitalize">
                  {currentTrack.emotion}
                </p>
              )}
            </div>

            {/* Enhanced Controls */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsLiked(!isLiked)}
                className="h-8 w-8 hover:bg-primary/10"
              >
                <Heart className={cn(
                  "h-4 w-4 transition-colors",
                  isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
                )} />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                onClick={isPlaying ? pause : play}
                className="h-9 w-9 bg-primary/10 hover:bg-primary/20 transition-all duration-200"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 text-primary" />
                ) : (
                  <Play className="h-4 w-4 text-primary" />
                )}
              </Button>
              
              <Button
                size="icon"
                variant="ghost"
                onClick={next}
                className="h-8 w-8 hover:bg-primary/10"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Animated progress visualization */}
          {isPlaying && (
            <div className="mt-3 flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary/60 rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 8 + 4}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: `${Math.random() * 0.5 + 0.5}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MiniPlayer;
