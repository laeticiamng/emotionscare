import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Music,
  Waves
} from 'lucide-react';

interface AudioPreviewProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  components: { id: string; name: string; value: number; color: string }[];
  mixName?: string;
}

const AudioPreview: React.FC<AudioPreviewProps> = ({
  isPlaying,
  onPlayPause,
  components,
  mixName = 'Mix Personnalisé'
}) => {
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(180); // 3 minutes
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const _progressRef = useRef<number>(0);

  // Simulate progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            if (isRepeat) return 0;
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, isRepeat]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate visualization bars based on components
  const visualizerBars = 24;
  const getBarHeight = (index: number) => {
    if (!isPlaying) return 20;
    const avgValue = components.reduce((sum, c) => sum + c.value, 0) / components.length;
    const baseHeight = (avgValue / 100) * 60;
    const variation = Math.sin(Date.now() / 200 + index) * 20;
    return Math.max(10, baseHeight + variation);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Visualizer */}
        <div className="relative h-32 bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
          {/* Wave visualization */}
          <div className="absolute inset-0 flex items-end justify-center gap-1 px-4 pb-2">
            {Array.from({ length: visualizerBars }).map((_, index) => {
              const height = getBarHeight(index);
              const componentIndex = index % components.length;
              const color = components[componentIndex]?.color || 'from-primary to-primary';
              
              return (
                <motion.div
                  key={index}
                  className={`w-2 rounded-t bg-gradient-to-t ${color} opacity-80`}
                  animate={{
                    height: isPlaying ? `${height}%` : '20%',
                  }}
                  transition={{
                    duration: 0.15,
                    ease: 'easeOut',
                  }}
                />
              );
            })}
          </div>

          {/* Playing indicator */}
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-3 right-3"
            >
              <Badge className="bg-green-500/90 text-white flex items-center gap-1">
                <Waves className="h-3 w-3 animate-pulse" />
                En lecture
              </Badge>
            </motion.div>
          )}

          {/* Mix name */}
          <div className="absolute top-3 left-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
                <Music className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium">{mixName}</div>
                <div className="text-xs text-muted-foreground">
                  {components.length} composantes
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 space-y-4">
          {/* Progress bar */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={(value) => setCurrentTime(value[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main controls */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${isShuffle ? 'text-primary' : ''}`}
              onClick={() => setIsShuffle(!isShuffle)}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => setCurrentTime(Math.max(0, currentTime - 15))}
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            
            <Button
              size="icon"
              className="h-14 w-14 rounded-full"
              onClick={onPlayPause}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-0.5" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => setCurrentTime(Math.min(duration, currentTime + 15))}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${isRepeat ? 'text-primary' : ''}`}
              onClick={() => setIsRepeat(!isRepeat)}
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          {/* Volume control */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={100}
              step={1}
              onValueChange={(value) => {
                setVolume(value[0]);
                if (value[0] > 0) setIsMuted(false);
              }}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-8 text-right">
              {isMuted ? 0 : volume}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioPreview;
