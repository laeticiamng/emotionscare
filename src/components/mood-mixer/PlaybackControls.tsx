import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  Volume2,
  VolumeX,
  Heart,
  Share,
  Download,
  MoreHorizontal,
  Repeat,
  Shuffle,
  Clock,
  Waveform
} from 'lucide-react';
import { MoodMix } from '@/types/mood-mixer';

interface PlaybackControlsProps {
  mix: MoodMix;
  isPlaying: boolean;
  onPlayPause: () => void;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({ 
  mix, 
  isPlaying, 
  onPlayPause 
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // Simulation du temps de lecture
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= mix.duration * 60) {
            return 0; // Reset à la fin
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, mix.duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    setIsMuted(value[0] === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const skipForward = () => {
    setCurrentTime(Math.min(currentTime + 30, mix.duration * 60));
  };

  const skipBackward = () => {
    setCurrentTime(Math.max(currentTime - 30, 0));
  };

  const getProgressPercentage = () => {
    return (currentTime / (mix.duration * 60)) * 100;
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'energetic': return 'hsl(var(--destructive))';
      case 'calm': return 'hsl(var(--primary))';
      case 'focused': return 'hsl(var(--accent))';
      case 'creative': return 'hsl(var(--secondary))';
      default: return 'hsl(var(--muted))';
    }
  };

  return (
    <div className="space-y-6">
      {/* Information du mix */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{mix.baseMood.icon}</div>
              <div>
                <h2 className="text-xl font-bold">{mix.name}</h2>
                <p className="text-muted-foreground">{mix.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {mix.duration}min
              </Badge>
              <Badge 
                variant="outline"
                style={{ borderColor: getMoodColor(mix.baseMood.id) }}
              >
                {mix.baseMood.name}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Barre de progression */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              onValueChange={handleSeek}
              max={mix.duration * 60}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(mix.duration * 60)}</span>
            </div>
          </div>

          {/* Contrôles principaux */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsShuffling(!isShuffling)}
              className={isShuffling ? 'bg-primary text-primary-foreground' : ''}
            >
              <Shuffle className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={skipBackward}
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={onPlayPause}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-1" />
                )}
              </Button>
            </motion.div>

            <Button
              variant="outline"
              size="sm"
              onClick={skipForward}
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLooping(!isLooping)}
              className={isLooping ? 'bg-primary text-primary-foreground' : ''}
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          {/* Contrôles secondaires */}
          <div className="flex items-center justify-between">
            {/* Volume */}
            <div className="flex items-center gap-2 flex-1 max-w-xs">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
              >
                {isMuted || volume[0] === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <Slider
                value={isMuted ? [0] : volume}
                onValueChange={handleVolumeChange}
                max={100}
                min={0}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-8">
                {isMuted ? 0 : volume[0]}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {}}
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {}}
              >
                <Share className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {}}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {}}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques de lecture en temps réel */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {Math.round(getProgressPercentage())}%
            </div>
            <div className="text-sm text-muted-foreground">Progression</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">
              {mix.stats.averageRating.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Note Moyenne</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">
              {mix.stats.totalPlays}
            </div>
            <div className="text-sm text-muted-foreground">Écoutes</div>
          </CardContent>
        </Card>
      </div>

      {/* État actuel de l'humeur */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Card className="bg-gradient-to-r from-muted/50 to-muted/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Waveform className="h-6 w-6 text-primary" />
                    </motion.div>
                    <div>
                      <div className="font-medium">Écoute active</div>
                      <div className="text-sm text-muted-foreground">
                        Adaptation à votre humeur {mix.baseMood.name}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">
                      Prochaine transition dans
                    </div>
                    <Badge variant="outline">
                      {formatTime(Math.max(0, 180 - (currentTime % 180)))}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlaybackControls;