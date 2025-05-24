
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, Music, Heart, Maximize2, Sparkles } from 'lucide-react';
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
  const [isHovered, setIsHovered] = useState(false);

  if (!currentTrack) return null;

  return (
    <Card className={cn(
      "fixed bottom-4 right-4 w-80 bg-gradient-to-r from-background/95 to-background/90 backdrop-blur-lg border shadow-2xl z-50 overflow-hidden",
      "hover:shadow-3xl transition-all duration-300 hover:scale-105 glass-effect-premium",
      className
    )}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        {/* Progress bar avec gradient */}
        <div className="h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-80 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-secondary/60 animate-pulse" />
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-3">
            {/* Cover avec effet de brillance */}
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center flex-shrink-0 group">
              {currentTrack.coverUrl || currentTrack.cover ? (
                <img
                  src={currentTrack.coverUrl || currentTrack.cover}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <Music className="h-6 w-6 text-primary" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              {isPlaying && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse" />
              )}
            </div>

            {/* Track Info avec animations */}
            <div 
              className="flex-1 min-w-0 cursor-pointer group" 
              onClick={onExpand}
            >
              <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors duration-300">
                {currentTrack.title}
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                {currentTrack.artist}
              </p>
              {currentTrack.emotion && (
                <p className="text-xs text-primary/80 capitalize flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {currentTrack.emotion}
                </p>
              )}
            </div>

            {/* Enhanced Controls avec effets premium */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsLiked(!isLiked)}
                className="h-8 w-8 hover:bg-primary/10 transition-all duration-200 hover:scale-110"
              >
                <Heart className={cn(
                  "h-4 w-4 transition-all duration-300",
                  isLiked ? "fill-red-500 text-red-500 animate-pulse" : "text-muted-foreground"
                )} />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                onClick={isPlaying ? pause : play}
                className="h-9 w-9 bg-primary/10 hover:bg-primary/20 transition-all duration-200 hover:scale-110 shadow-lg"
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
                className="h-8 w-8 hover:bg-primary/10 transition-all duration-200 hover:scale-110"
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              {/* Bouton d'expansion */}
              <Button
                size="icon"
                variant="ghost"
                onClick={onExpand}
                className="h-8 w-8 hover:bg-primary/10 transition-all duration-200 hover:scale-110"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Visualisation audio premium */}
          {isPlaying && (
            <div className="mt-3 flex items-center justify-center gap-1">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-t from-primary to-secondary rounded-full transition-all duration-300"
                  style={{
                    width: '2px',
                    height: `${Math.random() * 16 + 6}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: `${Math.random() * 0.5 + 0.5}s`,
                    opacity: 0.6 + Math.random() * 0.4
                  }}
                  className="animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Effets de hover premium */}
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none animate-fade-in" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MiniPlayer;
