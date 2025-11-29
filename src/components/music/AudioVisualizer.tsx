import React, { useEffect, useRef, useState } from 'react';
import { logger } from '@/lib/logger';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface AudioVisualizerProps {
  audioUrl?: string;
  height?: number;
  isPlaying?: boolean;
  variant?: 'bars' | 'wave' | 'circle';
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  showControls?: boolean;
  volume?: number;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  audioUrl,
  height = 120,
  isPlaying = false,
  variant = 'bars',
  primaryColor = '#7C3AED',
  secondaryColor,
  backgroundColor = 'rgba(124, 58, 237, 0.1)',
  showControls = true,
  volume = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [localIsPlaying, setLocalIsPlaying] = useState(isPlaying);
  const [localVolume, setLocalVolume] = useState(volume);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  
  // Initialize audio on mount
  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      const audio = new Audio();
      audioRef.current = audio;
    }
    
    // Set volume
    if (audioRef.current) {
      audioRef.current.volume = localVolume;
    }
    
    // Clean up on unmount
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch((err) => logger.error('Error closing audio context', err as Error, 'MUSIC'));
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Handle audioUrl changes
  useEffect(() => {
    if (!audioUrl || !audioRef.current) return;
    
    const setupAudio = async () => {
      if (!audioRef.current) return;
      
      // Set new audio source
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      
      // Initialize or reuse AudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      
      // Setup analyzer
      if (!analyserRef.current) {
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
        
        // Create source node from audio element
        const source = audioContextRef.current.createMediaElementSource(audioRef.current);
        source.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }
      
      // Auto-play if isPlaying is true
      if (localIsPlaying) {
        try {
          await audioRef.current.play();
        } catch (err) {
          logger.error('Autoplay prevented', err as Error, 'MUSIC');
          setLocalIsPlaying(false);
        }
      }
    };
    
    setupAudio().catch((err) => logger.error('Error setting up audio', err as Error, 'MUSIC'));
  }, [audioUrl]);
  
  // Sync with isPlaying prop
  useEffect(() => {
    if (isPlaying !== localIsPlaying) {
      setLocalIsPlaying(isPlaying);
    }
  }, [isPlaying]);
  
  // Sync with volume prop
  useEffect(() => {
    if (volume !== localVolume) {
      setLocalVolume(volume);
      if (audioRef.current) {
        audioRef.current.volume = volume;
      }
    }
  }, [volume]);
  
  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (localIsPlaying) {
      audioRef.current.play().catch(err => {
        logger.error('Play error', err as Error, 'MUSIC');
        setLocalIsPlaying(false);
      });
      visualize();
    } else {
      audioRef.current.pause();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [localIsPlaying]);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = localVolume;
    }
  }, [localVolume]);
  
  // Drawing functions
  const visualize = () => {
    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    
    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    // Get data
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    // Choose visualization variant
    switch (variant) {
      case 'bars':
        drawBars(ctx, WIDTH, HEIGHT, dataArrayRef.current);
        break;
      case 'wave':
        drawWave(ctx, WIDTH, HEIGHT, dataArrayRef.current);
        break;
      case 'circle':
        drawCircle(ctx, WIDTH, HEIGHT, dataArrayRef.current);
        break;
      default:
        drawBars(ctx, WIDTH, HEIGHT, dataArrayRef.current);
    }
    
    // Loop animation
    animationRef.current = requestAnimationFrame(visualize);
  };
  
  const drawBars = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    dataArray: Uint8Array
  ) => {
    const barWidth = width / dataArray.length * 2.5;
    let x = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
      const barHeight = dataArray[i] / 255 * height;
      
      // Create gradient for bars
      const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
      gradient.addColorStop(0, primaryColor);
      gradient.addColorStop(1, secondaryColor || primaryColor + '80');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);
      
      x += barWidth + 1;
    }
  };
  
  const drawWave = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    dataArray: Uint8Array
  ) => {
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    
    // Draw wave path
    const sliceWidth = width / dataArray.length;
    let x = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * height) / 2;
      
      ctx.lineTo(x, y);
      x += sliceWidth;
    }
    
    ctx.lineTo(width, height / 2);
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Fill area under the line
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.fillStyle = secondaryColor || `${primaryColor}40`;
    ctx.fill();
  };
  
  const drawCircle = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    dataArray: Uint8Array
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    
    // Draw outer circle (container)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = `${primaryColor}40`;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw frequency data as circle bars
    const barCount = 32; // Use fewer bars for better visualization
    const angleStep = (2 * Math.PI) / barCount;
    
    for (let i = 0; i < barCount; i++) {
      // Use modulo to get data points from our array
      const dataIndex = i % dataArray.length;
      const barHeight = (dataArray[dataIndex] / 255) * (radius * 0.5);
      
      const angle = i * angleStep;
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius - barHeight);
      const y2 = centerY + Math.sin(angle) * (radius - barHeight);
      
      // Draw bar
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = secondaryColor || primaryColor;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    
    // Draw inner circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.3, 0, 2 * Math.PI);
    ctx.fillStyle = primaryColor;
    ctx.fill();
  };
  
  const togglePlay = () => {
    setLocalIsPlaying(!localIsPlaying);
  };
  
  const handleVolumeChange = (values: number[]) => {
    setLocalVolume(values[0]);
  };
  
  return (
    <div className="audio-visualizer" style={{ height: `${height}px` }}>
      <canvas 
        ref={canvasRef}
        width={500}
        height={height}
        className="w-full h-full rounded-md"
      />
      
      {showControls && (
        <div className="controls absolute bottom-2 left-0 right-0 flex justify-between items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/80"
            onClick={togglePlay}
          >
            {localIsPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          
          <div className="flex items-center gap-2 bg-background/80 rounded-full px-2 py-1">
            {localVolume === 0 ? (
              <VolumeX className="h-3 w-3" />
            ) : (
              <Volume2 className="h-3 w-3" />
            )}
            <Slider
              value={[localVolume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-20"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioVisualizer;
export type { AudioVisualizerProps };
