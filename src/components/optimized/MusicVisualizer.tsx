/**
 * 🎵 MUSIC VISUALIZER OPTIMIZED
 * Visualiseur musical optimisé pour la musicothérapie
 */

import React, { memo, useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves, Volume2, Pause, Play } from 'lucide-react';

interface MusicVisualizerProps {
  audioRef?: React.RefObject<HTMLAudioElement>;
  isPlaying?: boolean;
  style?: 'bars' | 'wave' | 'circle' | 'minimal';
  color?: string;
  height?: number;
  showControls?: boolean;
  animated?: boolean;
  responsive?: boolean;
}

interface VisualizationData {
  frequencies: number[];
  waveform: number[];
  volume: number;
}

const VISUALIZATION_STYLES = {
  bars: { bars: 32, minHeight: 2, maxHeight: 40 },
  wave: { points: 64, amplitude: 30 },
  circle: { points: 48, radius: 60 },
  minimal: { bars: 8, minHeight: 4, maxHeight: 20 }
};

export const MusicVisualizer: React.FC<MusicVisualizerProps> = memo(({
  audioRef,
  isPlaying = false,
  style = 'bars',
  color = 'hsl(var(--primary))',
  height = 80,
  showControls = false,
  animated = true,
  responsive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyzerRef = useRef<AnalyserNode>();
  const audioContextRef = useRef<AudioContext>();
  const [visualData, setVisualData] = useState<VisualizationData>({
    frequencies: [],
    waveform: [],
    volume: 0
  });

  const initAudioAnalyzer = useCallback(() => {
    if (!audioRef?.current || audioContextRef.current) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyzer = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioRef.current);
      
      analyzer.fftSize = style === 'wave' ? 2048 : 256;
      analyzer.smoothingTimeConstant = 0.8;
      source.connect(analyzer);
      analyzer.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      analyzerRef.current = analyzer;
    } catch (error) {
      console.warn('Audio visualization not supported:', error);
    }
  }, [audioRef, style]);

  const getVisualizationData = useCallback((): VisualizationData => {
    if (!analyzerRef.current) {
      return { frequencies: [], waveform: [], volume: 0 };
    }

    const analyzer = analyzerRef.current;
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const waveArray = new Uint8Array(bufferLength);
    
    analyzer.getByteFrequencyData(dataArray);
    analyzer.getByteTimeDomainData(waveArray);

    // Calculate volume
    const volume = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length / 255;

    return {
      frequencies: Array.from(dataArray),
      waveform: Array.from(waveArray),
      volume
    };
  }, []);

  const drawBarsVisualization = useCallback((ctx: CanvasRenderingContext2D, data: VisualizationData) => {
    const { bars, minHeight, maxHeight } = VISUALIZATION_STYLES[style as keyof typeof VISUALIZATION_STYLES] as any;
    const canvas = ctx.canvas;
    const barWidth = canvas.width / bars;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < bars; i++) {
      const dataIndex = Math.floor((i / bars) * data.frequencies.length);
      const barHeight = Math.max(minHeight, (data.frequencies[dataIndex] / 255) * maxHeight);
      
      const x = i * barWidth;
      const y = canvas.height - barHeight;
      
      // Gradient effect
      const gradient = ctx.createLinearGradient(0, y, 0, canvas.height);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, color + '80');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth - 2, barHeight);
    }
  }, [style, color]);

  const drawWaveVisualization = useCallback((ctx: CanvasRenderingContext2D, data: VisualizationData) => {
    const canvas = ctx.canvas;
    const { amplitude } = VISUALIZATION_STYLES.wave;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    const centerY = canvas.height / 2;
    const sliceWidth = canvas.width / data.waveform.length;
    
    let x = 0;
    for (let i = 0; i < data.waveform.length; i++) {
      const v = data.waveform[i] / 128.0;
      const y = centerY + (v * amplitude);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      x += sliceWidth;
    }
    
    ctx.stroke();
  }, [color]);

  const drawCircleVisualization = useCallback((ctx: CanvasRenderingContext2D, data: VisualizationData) => {
    const canvas = ctx.canvas;
    const { points, radius } = VISUALIZATION_STYLES.circle;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < points; i++) {
      const dataIndex = Math.floor((i / points) * data.frequencies.length);
      const amplitude = (data.frequencies[dataIndex] / 255) * 30;
      const angle = (i / points) * Math.PI * 2;
      
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + amplitude);
      const y2 = centerY + Math.sin(angle) * (radius + amplitude);
      
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }, [color]);

  const animate = useCallback(() => {
    if (!isPlaying || !analyzerRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const data = getVisualizationData();
    setVisualData(data);

    switch (style) {
      case 'bars':
      case 'minimal':
        drawBarsVisualization(ctx, data);
        break;
      case 'wave':
        drawWaveVisualization(ctx, data);
        break;
      case 'circle':
        drawCircleVisualization(ctx, data);
        break;
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isPlaying, style, getVisualizationData, drawBarsVisualization, drawWaveVisualization, drawCircleVisualization]);

  // Initialize audio analyzer when audio element is available
  useEffect(() => {
    if (audioRef?.current && !audioContextRef.current) {
      // Wait for user interaction to initialize audio context
      const initOnPlay = () => {
        initAudioAnalyzer();
        audioRef.current?.removeEventListener('play', initOnPlay);
      };
      audioRef.current.addEventListener('play', initOnPlay);
      
      return () => {
        audioRef.current?.removeEventListener('play', initOnPlay);
      };
    }
  }, [audioRef, initAudioAnalyzer]);

  // Handle play/pause animation
  useEffect(() => {
    if (isPlaying && animated) {
      animate();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animated, animate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Static visualization when not playing
  const renderStaticVisualization = () => {
    if (style === 'bars' || style === 'minimal') {
      const { bars } = VISUALIZATION_STYLES[style];
      return (
        <div className="flex items-end justify-center gap-1 h-full">
          {Array.from({ length: bars }).map((_, i) => (
            <motion.div
              key={i}
              className="bg-current opacity-30"
              style={{
                width: `${100 / bars}%`,
                maxWidth: '8px'
              }}
              animate={animated ? {
                height: [
                  '20%',
                  `${Math.random() * 60 + 20}%`,
                  '20%'
                ]
              } : { height: '20%' }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <Waves className="h-8 w-8 opacity-50" />
      </div>
    );
  };

  const canvasWidth = responsive ? '100%' : 400;
  const canvasHeight = height;

  return (
    <div className="relative">
      <div
        className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5"
        style={{ height: canvasHeight, color }}
      >
        <AnimatePresence mode="wait">
          {isPlaying && analyzerRef.current ? (
            <motion.canvas
              key="canvas"
              ref={canvasRef}
              width={responsive ? 400 : canvasWidth}
              height={canvasHeight}
              className="w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ width: canvasWidth, height: canvasHeight }}
            />
          ) : (
            <motion.div
              key="static"
              className="w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderStaticVisualization()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Volume indicator */}
        {isPlaying && visualData.volume > 0 && (
          <motion.div
            className="absolute top-2 right-2 flex items-center gap-1 text-xs bg-black/20 rounded px-2 py-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Volume2 className="h-3 w-3" />
            {Math.round(visualData.volume * 100)}%
          </motion.div>
        )}

        {/* Play/Pause overlay for minimal style */}
        {showControls && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 hover:opacity-100 transition-opacity">
            {isPlaying ? (
              <Pause className="h-8 w-8 text-white drop-shadow-lg" />
            ) : (
              <Play className="h-8 w-8 text-white drop-shadow-lg" />
            )}
          </div>
        )}
      </div>

      {/* Frequency spectrum text display for debugging */}
      {process.env.NODE_ENV === 'development' && visualData.frequencies.length > 0 && (
        <div className="mt-2 text-xs text-muted-foreground">
          Volume: {Math.round(visualData.volume * 100)}% | 
          Freq Bins: {visualData.frequencies.length} |
          Style: {style}
        </div>
      )}
    </div>
  );
});

MusicVisualizer.displayName = 'MusicVisualizer';