import React, { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface WaveformVisualizerProps {
  isPlaying: boolean;
  progress: number;
  onSeek?: (value: number[]) => void;
  className?: string;
  color?: string;
  activeColor?: string;
  audioData?: Uint8Array | number[];
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isPlaying,
  progress,
  onSeek,
  className,
  color = 'hsl(var(--muted))',
  activeColor = 'hsl(var(--primary))',
  audioData
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const animationFrameRef = useRef<number>();
  const lastAudioDataRef = useRef<number[]>([]);

  // Generate initial waveform or use audio data
  useEffect(() => {
    if (audioData && audioData.length > 0) {
      // Use real audio data - normalize to 0-1 range
      const normalized = Array.from(audioData).map(v => Math.min(1, Math.max(0.1, v / 255)));
      // Smooth transition
      if (lastAudioDataRef.current.length === normalized.length) {
        const smoothed = normalized.map((v, i) => {
          const prev = lastAudioDataRef.current[i] || v;
          return prev * 0.3 + v * 0.7; // Exponential smoothing
        });
        lastAudioDataRef.current = smoothed;
        setWaveformData(smoothed);
      } else {
        lastAudioDataRef.current = normalized;
        setWaveformData(normalized);
      }
    } else if (waveformData.length === 0) {
      // Generate mock waveform data only if no data exists
      const samples = 64;
      const data = Array.from({ length: samples }, (_, i) => {
        const baseHeight = Math.sin(i * 0.1) * 0.5 + 0.5;
        const variation = Math.random() * 0.3;
        const peak = Math.sin(i * 0.05) * 0.2;
        return Math.min(1, Math.max(0.1, baseHeight + variation + peak));
      });
      setWaveformData(data);
    }
  }, [audioData]);

  // Animation loop for playing state
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const animate = () => {
      if (canvasRef.current) {
        drawWaveform();
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, progress, waveformData]);

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || waveformData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    const barWidth = Math.max(2, width / waveformData.length);
    const gap = Math.max(1, barWidth * 0.2);
    const progressPoint = (progress / 100) * waveformData.length;

    waveformData.forEach((amplitude, index) => {
      const barHeight = amplitude * height * 0.85;
      const x = index * barWidth;
      const y = (height - barHeight) / 2;

      // Determine color based on progress with gradient effect
      const isActive = index < progressPoint;
      const isNearProgress = Math.abs(index - progressPoint) < 2;
      
      if (isNearProgress && isPlaying) {
        // Glow effect near playhead
        ctx.shadowColor = activeColor;
        ctx.shadowBlur = 8;
      } else {
        ctx.shadowBlur = 0;
      }
      
      ctx.fillStyle = isActive ? activeColor : color;

      // Add subtle animation when playing
      const animationOffset = isPlaying && isActive ? 
        Math.sin(Date.now() * 0.008 + index * 0.15) * 3 : 0;
      const finalHeight = Math.max(3, barHeight + animationOffset);

      // Rounded bars
      const radius = Math.min(2, (barWidth - gap) / 2);
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth - gap, finalHeight, radius);
      ctx.fill();
    });
    
    ctx.shadowBlur = 0;
  }, [waveformData, progress, isPlaying, color, activeColor]);

  // Handle click to seek
  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onSeek || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    
    onSeek([Math.max(0, Math.min(100, percentage))]);
  };

  // Resize canvas to match container
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Redraw after resize
      drawWaveform();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [waveformData]);

  return (
    <div 
      ref={containerRef}
      className={cn("w-full h-full relative cursor-pointer", className)}
    >
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        className="w-full h-full"
      />
      
      {/* Progress indicator */}
      <div 
        className="absolute top-0 bottom-0 w-0.5 bg-primary/60 pointer-events-none transition-all duration-100"
        style={{ left: `${progress}%` }}
      />
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
    </div>
  );
};

export default WaveformVisualizer;
