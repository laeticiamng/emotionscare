import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Repeat, 
  Bookmark, 
  Plus, 
  Trash2, 
  Clock, 
  FastForward,
  Rewind,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusicSettings } from '@/hooks/music/useMusicSettings';

interface Marker {
  id: string;
  time: number;
  label: string;
  color: string;
}

interface LoopRegion {
  start: number;
  end: number;
}

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
}

const MARKER_COLORS = [
  'hsl(var(--primary))',
  'hsl(142, 76%, 36%)', // green
  'hsl(38, 92%, 50%)',  // amber
  'hsl(280, 87%, 60%)', // purple
  'hsl(0, 84%, 60%)'    // red
];

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
  className = ""
}) => {
  const { value: markers, setValue: setMarkers } = useMusicSettings<Marker[]>({
    key: 'music:progressbar-markers',
    defaultValue: []
  });
  
  const [loop, setLoop] = useState<LoopRegion | null>(null);
  const [isLoopActive, setIsLoopActive] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showWaveform, setShowWaveform] = useState(true);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [seekHistory, setSeekHistory] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Loop logic
  useEffect(() => {
    if (isLoopActive && loop && currentTime >= loop.end) {
      onSeek(loop.start);
    }
  }, [currentTime, loop, isLoopActive, onSeek]);

  const handleSeek = (values: number[]) => {
    const newTime = values[0];
    setSeekHistory(prev => [...prev.slice(-19), newTime]);
    onSeek(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const _formatDetailedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const addMarker = () => {
    const newMarker: Marker = {
      id: Date.now().toString(),
      time: currentTime,
      label: `Marker ${markers.length + 1}`,
      color: MARKER_COLORS[markers.length % MARKER_COLORS.length]
    };
    setMarkers(prev => [...prev, newMarker].sort((a, b) => a.time - b.time));
  };

  const removeMarker = (id: string) => {
    setMarkers(prev => prev.filter(m => m.id !== id));
  };

  const setLoopPoint = (type: 'start' | 'end') => {
    if (type === 'start') {
      setLoop(prev => ({ start: currentTime, end: prev?.end ?? duration }));
    } else {
      setLoop(prev => ({ start: prev?.start ?? 0, end: currentTime }));
    }
  };

  const clearLoop = () => {
    setLoop(null);
    setIsLoopActive(false);
  };

  const skipSeconds = (seconds: number) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    onSeek(newTime);
  };

  const jumpToMarker = (marker: Marker) => {
    onSeek(marker.time);
  };

  // Calculate progress percentage
  const _progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Calculate hovered time based on mouse position
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (sliderRef.current && duration > 0) {
      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = Math.max(0, Math.min(1, x / rect.width));
      setHoverTime(percent * duration);
    }
  }, [duration]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          skipSeconds(e.shiftKey ? -10 : -5);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipSeconds(e.shiftKey ? 10 : 5);
          break;
        case 'm':
          e.preventDefault();
          addMarker();
          break;
        case 'l':
          e.preventDefault();
          setIsLoopActive(prev => loop ? !prev : false);
          break;
        case '[':
          e.preventDefault();
          setLoopPoint('start');
          break;
        case ']':
          e.preventDefault();
          setLoopPoint('end');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTime, loop, duration]);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main progress area */}
      <div 
        ref={sliderRef}
        className="relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverTime(null)}
      >
        {/* Waveform visualization (simplified) */}
        {showWaveform && (
          <div className="absolute inset-0 h-8 -top-2 opacity-20 pointer-events-none overflow-hidden rounded">
            <div className="flex items-center h-full gap-0.5">
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-primary rounded-full"
                  initial={{ height: '20%' }}
                  animate={{ 
                    height: `${20 + Math.sin(i * 0.3 + currentTime * 0.5) * 40 + Math.random() * 20}%` 
                  }}
                  transition={{ duration: 0.1 }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Loop region overlay */}
        {loop && (
          <div 
            className={`absolute h-full top-0 rounded transition-colors ${
              isLoopActive ? 'bg-primary/20' : 'bg-muted/30'
            }`}
            style={{
              left: `${(loop.start / duration) * 100}%`,
              width: `${((loop.end - loop.start) / duration) * 100}%`
            }}
          />
        )}

        {/* Markers on the track */}
        {markers.map((marker) => (
          <TooltipProvider key={marker.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full cursor-pointer hover:scale-125 transition-transform z-10"
                  style={{ 
                    left: `${(marker.time / duration) * 100}%`,
                    backgroundColor: marker.color,
                    transform: 'translateX(-50%) translateY(-50%)'
                  }}
                  onClick={() => jumpToMarker(marker)}
                  aria-label={`Aller au marqueur ${marker.label}`}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{marker.label}</p>
                <p className="text-xs text-muted-foreground">{formatTime(marker.time)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}

        {/* Hover time indicator */}
        <AnimatePresence>
          {hoverTime !== null && !isDragging && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -top-8 bg-popover text-popover-foreground px-2 py-1 rounded text-xs shadow-lg pointer-events-none"
              style={{ 
                left: `${(hoverTime / duration) * 100}%`,
                transform: 'translateX(-50%)'
              }}
            >
              {formatTime(hoverTime)}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main slider */}
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
          className="w-full relative z-20"
          aria-label="Progression du morceau"
          aria-valuemin={0}
          aria-valuemax={duration || 100}
          aria-valuenow={currentTime}
        />
      </div>

      {/* Time display and controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground min-w-[40px]">
            {formatTime(currentTime)}
          </span>
          
          {/* Skip buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => skipSeconds(-10)}
              aria-label="Reculer de 10 secondes"
            >
              <Rewind className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => skipSeconds(10)}
              aria-label="Avancer de 10 secondes"
            >
              <FastForward className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Center controls */}
        <div className="flex items-center gap-2">
          {/* Playback speed */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs gap-1">
                <Clock className="h-3 w-3" />
                {playbackSpeed}x
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-32 p-2">
              <div className="space-y-1">
                {PLAYBACK_SPEEDS.map((speed) => (
                  <Button
                    key={speed}
                    variant={playbackSpeed === speed ? 'secondary' : 'ghost'}
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => setPlaybackSpeed(speed)}
                  >
                    {speed}x
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Loop controls */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isLoopActive ? 'default' : 'ghost'}
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => loop ? setIsLoopActive(!isLoopActive) : setLoopPoint('start')}
                  aria-label={isLoopActive ? 'Désactiver la boucle' : 'Activer la boucle'}
                >
                  <Repeat className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{loop ? (isLoopActive ? 'Désactiver A-B' : 'Activer A-B') : 'Définir point A'}</p>
                <p className="text-xs text-muted-foreground">Raccourci: [ et ] puis L</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {loop && (
            <Badge variant="outline" className="text-xs h-6 gap-1">
              {formatTime(loop.start)} - {formatTime(loop.end)}
              <button 
                onClick={clearLoop}
                className="hover:text-destructive"
                aria-label="Supprimer la boucle"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {/* Add marker */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={addMarker}
                  aria-label="Ajouter un marqueur"
                >
                  <Bookmark className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ajouter un marqueur (M)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <span className="text-xs font-mono text-muted-foreground min-w-[40px] text-right">
          {formatTime(duration)}
        </span>
      </div>

      {/* Markers list */}
      <AnimatePresence>
        {markers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-1"
          >
            {markers.map((marker) => (
              <motion.div
                key={marker.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Badge
                  variant="outline"
                  className="text-xs cursor-pointer hover:bg-accent gap-1 group"
                  onClick={() => jumpToMarker(marker)}
                  style={{ borderColor: marker.color }}
                >
                  <span 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: marker.color }}
                  />
                  {formatTime(marker.time)}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeMarker(marker.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                    aria-label={`Supprimer le marqueur ${marker.label}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgressBar;
