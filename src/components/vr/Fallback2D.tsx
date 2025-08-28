import React, { useRef, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Music, MusicOff } from 'lucide-react';
import { type VRBreathPhase, type VRPattern } from '@/store/vr.store';

interface Fallback2DProps {
  running: boolean;
  paused: boolean;
  phase: VRBreathPhase;
  pattern: VRPattern;
  progress: number; // Phase progress 0-1
  elapsedTime: number;
  duration: number;
  musicEnabled: boolean;
  reduceMotion: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onToggleMusic: () => void;
}

// Phase colors for 2D fallback
const PHASE_COLORS = {
  inhale: '#3b82f6', // Blue
  hold: '#8b5cf6',   // Purple  
  exhale: '#06b6d4', // Cyan
  pause: '#64748b',  // Slate
} as const;

// Phase names
const PHASE_NAMES = {
  inhale: 'Inspire',
  hold: 'Tiens',
  exhale: 'Expire', 
  pause: 'Pause',
} as const;

export const Fallback2D: React.FC<Fallback2DProps> = ({
  running,
  paused,
  phase,
  pattern,
  progress,
  elapsedTime,
  duration,
  musicEnabled,
  reduceMotion,
  onStart,
  onPause,
  onResume,
  onStop,
  onToggleMusic,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Get breathing sphere properties
  const getSphereProperties = useCallback(() => {
    const baseRadius = 80;
    let radius = baseRadius;
    let opacity = 0.5;

    switch (phase) {
      case 'inhale':
        radius = baseRadius + (progress * 40); // 80 to 120px
        opacity = 0.4 + (progress * 0.4); // 0.4 to 0.8
        break;
      case 'hold':
        radius = baseRadius + 40; // 120px
        opacity = 0.8;
        break;
      case 'exhale':
        radius = (baseRadius + 40) - (progress * 40); // 120 to 80px
        opacity = 0.8 - (progress * 0.3); // 0.8 to 0.5
        break;
      case 'pause':
        radius = baseRadius; // 80px
        opacity = 0.5;
        break;
    }

    return { radius, opacity, color: PHASE_COLORS[phase] };
  }, [phase, progress]);

  // Draw 2D breathing visualization
  const drawBreathingSphere = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw galaxy background (simple starfield)
    if (!reduceMotion) {
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 2;
        const alpha = Math.random() * 0.8 + 0.2;
        
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Get sphere properties
    const { radius, opacity, color } = getSphereProperties();

    // Draw outer glow ring
    if (!reduceMotion) {
      const gradient = ctx.createRadialGradient(
        centerX, centerY, radius * 0.7,
        centerX, centerY, radius * 1.4
      );
      gradient.addColorStop(0, `${color}30`); // 30% opacity
      gradient.addColorStop(1, `${color}00`); // Transparent
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.4, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Draw main breathing sphere
    const sphereGradient = ctx.createRadialGradient(
      centerX - radius * 0.3, centerY - radius * 0.3, 0,
      centerX, centerY, radius
    );
    sphereGradient.addColorStop(0, `${color}CC`); // 80% opacity
    sphereGradient.addColorStop(0.7, `${color}99`); // 60% opacity  
    sphereGradient.addColorStop(1, `${color}66`); // 40% opacity

    ctx.globalAlpha = opacity;
    ctx.fillStyle = sphereGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Draw inner core
    ctx.fillStyle = `${color}DD`; // 87% opacity
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.3, 0, 2 * Math.PI);
    ctx.fill();

    // Draw breathing ring (outline)
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }, [getSphereProperties, reduceMotion]);

  // Animation loop
  const animate = useCallback(() => {
    drawBreathingSphere();
    
    if (running && !paused) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [drawBreathingSphere, running, paused]);

  // Handle canvas resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    drawBreathingSphere();
  }, [drawBreathingSphere]);

  // Initialize canvas
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleResize]);

  // Start/stop animation
  useEffect(() => {
    if (running && !paused) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      drawBreathingSphere(); // Draw static state
    }
  }, [running, paused, animate, drawBreathingSphere]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sessionProgress = duration > 0 ? elapsedTime / duration : 0;
  const isComplete = running && sessionProgress >= 1;

  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Canvas for 2D breathing visualization */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }}
      />

      {/* Overlay UI */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        
        {/* Session Complete Overlay */}
        {isComplete && (
          <Card className="mb-8 bg-emerald-900/80 backdrop-blur-sm border-emerald-700/50">
            <CardContent className="p-6 text-center text-white">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2">Session terminée !</h3>
              <p className="text-emerald-200 text-sm">
                Excellente séance de cohérence cardiaque
              </p>
            </CardContent>
          </Card>
        )}

        {/* Bottom Controls */}
        <Card className="bg-black/60 backdrop-blur-sm border-white/20 mt-auto mb-8">
          <CardContent className="p-4 min-w-80">
            
            {/* Session Info */}
            <div className="text-center text-white mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs border-white/20 text-white">
                  {pattern.replace('-', '–')}
                </Badge>
                <span className="text-xs text-white/60">•</span>
                <span className="text-xs text-white/80">
                  {formatTime(elapsedTime)} / {formatTime(duration)}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-white/20 rounded-full h-1 mb-3">
                <div 
                  className="bg-white h-1 rounded-full transition-all duration-300"
                  style={{ width: `${sessionProgress * 100}%` }}
                />
              </div>
              
              {/* Current Phase */}
              {running && !isComplete && (
                <div 
                  className="text-lg font-medium transition-colors duration-300"
                  style={{ color: PHASE_COLORS[phase] }}
                >
                  {PHASE_NAMES[phase]}...
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              {!running ? (
                <Button
                  onClick={onStart}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                  <Play className="h-4 w-4" />
                  Démarrer
                </Button>
              ) : !isComplete ? (
                <>
                  <Button
                    onClick={paused ? onResume : onPause}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 gap-2"
                  >
                    {paused ? (
                      <>
                        <Play className="h-4 w-4" />
                        Reprendre
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4" />
                        Pause
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={onStop}
                    variant="destructive"
                    className="gap-2"
                  >
                    <Square className="h-4 w-4" />
                    Terminer
                  </Button>
                </>
              ) : (
                <Button
                  onClick={onStop}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  Fermer
                </Button>
              )}
              
              {/* Music Toggle */}
              <Button
                onClick={onToggleMusic}
                variant="ghost"
                size="sm"
                className={`text-white hover:bg-white/10 ${musicEnabled ? 'bg-white/10' : ''}`}
              >
                {musicEnabled ? (
                  <Music className="h-4 w-4" />
                ) : (
                  <MusicOff className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Instructions */}
            {!running && (
              <div className="text-center text-xs text-white/60 mt-3">
                Regardez la sphère et suivez son rythme de respiration
              </div>
            )}
            
            {paused && (
              <div className="text-center text-xs text-yellow-400 mt-3">
                Session en pause - Espace pour reprendre
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* WebXR Not Supported Notice */}
      <div className="absolute top-4 left-4">
        <Badge variant="secondary" className="text-xs">
          Mode 2D • WebXR non supporté
        </Badge>
      </div>
    </div>
  );
};