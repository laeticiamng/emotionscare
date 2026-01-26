import React, { useState, useCallback, useRef, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Repeat, Bookmark, Star, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMusicSettings } from '@/hooks/music/useMusicSettings';

interface LoopSection {
  start: number;
  end: number;
  name?: string;
}

interface SavedPosition {
  time: number;
  name: string;
  createdAt: string;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
  markers?: { time: number; label: string; color?: string }[];
  showPreview?: boolean;
  buffered?: number;
  variant?: 'default' | 'minimal' | 'expanded';
  trackId?: string;
  onLoopChange?: (loop: LoopSection | null) => void;
}

export const MusicProgressBar: React.FC<ProgressBarProps> = ({
  currentTime = 0,
  duration = 0,
  onSeek,
  className = '',
  formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  },
  showTimestamps = true,
  markers = [],
  showPreview = true,
  buffered = 0,
  variant = 'default',
  trackId,
  onLoopChange,
}) => {
  const { toast } = useToast();
  const { value: allPositions, setValue: setAllPositions } = useMusicSettings<Record<string, SavedPosition[]>>({
    key: 'music:saved-positions',
    defaultValue: {}
  });
  
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(0);
  const [hoverTime, setHoverTime] = useState(0);
  const [loop, setLoop] = useState<LoopSection | null>(null);
  const [isSettingLoop, setIsSettingLoop] = useState<'start' | 'end' | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [positionName, setPositionName] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Positions sauvegardées pour ce track
  const savedPositions = useMemo(() => 
    trackId ? (allPositions[trackId] || []) : [], 
    [allPositions, trackId]
  );
  
  const setSavedPositions = useCallback((positions: SavedPosition[] | ((prev: SavedPosition[]) => SavedPosition[])) => {
    if (!trackId) return;
    setAllPositions(prev => {
      const newPositions = typeof positions === 'function' 
        ? positions(prev[trackId] || []) 
        : positions;
      return { ...prev, [trackId]: newPositions };
    });
  }, [trackId, setAllPositions]);

  const handleChange = useCallback((value: number[]) => {
    if (onSeek) {
      onSeek(value[0]);
    }
  }, [onSeek]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !showPreview) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    
    setHoverPosition(x);
    setHoverTime(percentage * duration);
  }, [duration, showPreview]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const clickTime = percentage * duration;

    // Handle loop setting
    if (isSettingLoop === 'start') {
      setLoop(prev => ({ start: clickTime, end: prev?.end || duration, name: prev?.name }));
      setIsSettingLoop('end');
      toast({
        title: 'Point de départ défini',
        description: `Cliquez pour définir la fin de la boucle`,
      });
    } else if (isSettingLoop === 'end') {
      setLoop(prev => {
        const newLoop = { start: prev?.start || 0, end: clickTime, name: prev?.name };
        onLoopChange?.(newLoop);
        return newLoop;
      });
      setIsSettingLoop(null);
      toast({
        title: 'Boucle A-B créée',
        description: `${formatTime(loop?.start || 0)} → ${formatTime(clickTime)}`,
      });
    }
  }, [duration, isSettingLoop, loop, onLoopChange, formatTime, toast]);

  // Save current position
  const savePosition = () => {
    if (!trackId || !positionName.trim()) return;

    const newPosition: SavedPosition = {
      time: currentTime,
      name: positionName,
      createdAt: new Date().toISOString(),
    };

    setSavedPositions(prev => [...prev, newPosition]);
    setPositionName('');

    toast({
      title: 'Position sauvegardée',
      description: `"${positionName}" à ${formatTime(currentTime)}`,
    });
  };

  // Delete saved position
  const deletePosition = (index: number) => {
    setSavedPositions(prev => prev.filter((_, i) => i !== index));
  };

  // Jump to saved position
  const jumpToPosition = (position: SavedPosition) => {
    onSeek(position.time);
    toast({
      title: `Saut vers "${position.name}"`,
      description: formatTime(position.time),
    });
  };

  // Toggle loop mode
  const startLoopMode = () => {
    if (loop) {
      setLoop(null);
      onLoopChange?.(null);
      toast({
        title: 'Boucle désactivée',
      });
    } else {
      setIsSettingLoop('start');
      toast({
        title: 'Mode boucle A-B',
        description: 'Cliquez pour définir le point de départ',
      });
    }
  };

  const bufferedProgress = duration > 0 ? (buffered / duration) * 100 : 0;
  const loopStartPercent = loop && duration > 0 ? (loop.start / duration) * 100 : 0;
  const loopEndPercent = loop && duration > 0 ? (loop.end / duration) * 100 : 0;

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={cn('w-full', className)}>
        <Slider
          value={[currentTime || 0]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleChange}
          className="cursor-pointer"
          aria-label="Progression du morceau"
        />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={cn('space-y-2', className)}>
        {/* Timestamps with controls */}
        {showTimestamps && (
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span className="font-mono tabular-nums">{formatTime(currentTime || 0)}</span>
            
            {/* Center controls */}
            <div className="flex items-center gap-1">
              {/* Loop button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={loop ? 'secondary' : 'ghost'}
                    size="icon"
                    className={cn(
                      'h-6 w-6',
                      loop && 'text-primary',
                      isSettingLoop && 'animate-pulse'
                    )}
                    onClick={startLoopMode}
                  >
                    <Repeat className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {loop ? 'Désactiver la boucle' : isSettingLoop ? 'Définir la boucle...' : 'Boucle A-B'}
                </TooltipContent>
              </Tooltip>

              {/* Save position button */}
              <Popover open={showSettings} onOpenChange={setShowSettings}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                  >
                    <Bookmark className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3" align="center">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Positions sauvegardées</h4>
                    
                    {/* Save new position */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={positionName}
                        onChange={(e) => setPositionName(e.target.value)}
                        placeholder="Nom de la position"
                        className="flex-1 px-2 py-1 text-xs border rounded bg-background"
                      />
                      <Button
                        size="sm"
                        className="h-7"
                        onClick={savePosition}
                        disabled={!positionName.trim()}
                      >
                        <Star className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Position at current time */}
                    <div className="text-xs text-muted-foreground">
                      Position actuelle: {formatTime(currentTime)}
                    </div>

                    {/* Saved positions list */}
                    {savedPositions.length > 0 && (
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {savedPositions.map((pos, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-1.5 rounded bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <button
                              onClick={() => jumpToPosition(pos)}
                              className="flex-1 text-left text-xs"
                            >
                              <span className="font-medium">{pos.name}</span>
                              <span className="text-muted-foreground ml-2">
                                {formatTime(pos.time)}
                              </span>
                            </button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => deletePosition(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {savedPositions.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-2">
                        Aucune position sauvegardée
                      </p>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <span className="font-mono tabular-nums">{formatTime(duration || 0)}</span>
          </div>
        )}

        {/* Progress bar container */}
        <div 
          ref={containerRef}
          className="relative group cursor-pointer"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
          onClick={isSettingLoop ? handleClick : undefined}
        >
          {/* Buffered indicator */}
          {buffered > 0 && variant === 'expanded' && (
            <div 
              className="absolute h-1 bg-muted-foreground/20 rounded-full top-1/2 -translate-y-1/2 left-0 pointer-events-none"
              style={{ width: `${bufferedProgress}%` }}
            />
          )}

          {/* Loop section highlight */}
          {loop && (
            <div
              className="absolute h-full bg-primary/20 rounded-sm top-0 pointer-events-none"
              style={{
                left: `${loopStartPercent}%`,
                width: `${loopEndPercent - loopStartPercent}%`,
              }}
            />
          )}

          {/* Loop markers */}
          {loop && (
            <>
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-primary pointer-events-none"
                style={{ left: `${loopStartPercent}%` }}
              >
                <Badge 
                  variant="secondary" 
                  className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] px-1"
                >
                  A
                </Badge>
              </div>
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-primary pointer-events-none"
                style={{ left: `${loopEndPercent}%` }}
              >
                <Badge 
                  variant="secondary" 
                  className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] px-1"
                >
                  B
                </Badge>
              </div>
            </>
          )}

          {/* Markers */}
          {markers.length > 0 && (
            <div className="absolute inset-0 pointer-events-none">
              {markers.map((marker, index) => {
                const markerPosition = duration > 0 ? (marker.time / duration) * 100 : 0;
                return (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          'absolute top-1/2 -translate-y-1/2 w-1 h-3 rounded-full transition-opacity cursor-pointer pointer-events-auto',
                          isHovering ? 'opacity-100' : 'opacity-50'
                        )}
                        style={{ 
                          left: `${markerPosition}%`,
                          backgroundColor: marker.color || 'hsl(var(--primary))'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSeek(marker.time);
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      {marker.label} - {formatTime(marker.time)}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          )}

          {/* Saved positions markers */}
          {savedPositions.map((pos, index) => {
            const posPercent = duration > 0 ? (pos.time / duration) * 100 : 0;
            return (
              <Tooltip key={`pos-${index}`}>
                <TooltipTrigger asChild>
                  <div
                    className="absolute top-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto"
                    style={{ left: `${posPercent}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSeek(pos.time);
                    }}
                  >
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {pos.name} - {formatTime(pos.time)}
                </TooltipContent>
              </Tooltip>
            );
          })}

          {/* Slider */}
          <Slider
            defaultValue={[currentTime || 0]}
            value={[currentTime || 0]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleChange}
            className={cn(
              'cursor-pointer',
              isHovering && 'scale-y-125 transition-transform'
            )}
            aria-label="Progression du morceau"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(currentTime)}
            aria-valuetext={`${formatTime(currentTime)} sur ${formatTime(duration)}`}
          />

          {/* Hover preview */}
          {showPreview && isHovering && !isSettingLoop && (
            <div 
              className="absolute -top-8 transform -translate-x-1/2 transition-opacity opacity-100 pointer-events-none"
              style={{ left: hoverPosition }}
            >
              <Badge variant="secondary" className="text-xs font-mono shadow-md">
                {formatTime(hoverTime)}
              </Badge>
            </div>
          )}

          {/* Loop setting indicator */}
          {isSettingLoop && isHovering && (
            <div 
              className="absolute -top-8 transform -translate-x-1/2 pointer-events-none"
              style={{ left: hoverPosition }}
            >
              <Badge variant="default" className="text-xs font-mono animate-pulse">
                {isSettingLoop === 'start' ? 'Début: ' : 'Fin: '}{formatTime(hoverTime)}
              </Badge>
            </div>
          )}
        </div>

        {/* Loop info */}
        {loop && (
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Repeat className="h-3 w-3 mr-1" />
              Boucle: {formatTime(loop.start)} → {formatTime(loop.end)}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 text-xs"
              onClick={() => {
                setLoop(null);
                onLoopChange?.(null);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default MusicProgressBar;
