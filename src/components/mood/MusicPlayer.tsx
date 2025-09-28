import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, SkipForward, Volume2 } from 'lucide-react';

interface MusicPlayerProps {
  src: string | null;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onEnded: () => void;
  className?: string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  src,
  isPlaying,
  onPlay,
  onPause,
  onEnded,
  className = ''
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && src) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, src]);

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  if (!src) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-4 text-center text-muted-foreground">
          Aucune piste disponible
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} overflow-hidden`}>
      <CardContent className="p-4">
        <audio
          ref={audioRef}
          src={src}
          onEnded={onEnded}
          onLoadStart={() => console.log('Loading track')}
          onCanPlay={() => console.log('Track ready')}
        />
        
        <div className="flex items-center gap-4">
          <Button
            onClick={handlePlayPause}
            size="icon"
            className="h-12 w-12 rounded-full"
            aria-label={isPlaying ? 'Mettre en pause' : 'Lire'}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          
          <div className="flex-1">
            <div className="text-sm font-medium">Mix Génératif</div>
            <div className="text-xs text-muted-foreground">Ambiance personnalisée</div>
          </div>
          
          <Badge variant="secondary" className="flex items-center gap-1">
            <Volume2 className="h-3 w-3" />
            {isPlaying ? 'En cours' : 'En pause'}
          </Badge>
        </div>
        
        <motion.div
          className="w-full h-1 bg-muted rounded mt-3"
          animate={isPlaying ? { backgroundColor: ['hsl(var(--muted))', 'hsl(var(--primary))', 'hsl(var(--muted))'] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;