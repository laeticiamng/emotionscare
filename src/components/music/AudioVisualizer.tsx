
import React, { useEffect, useRef, useState } from 'react';

interface AudioVisualizerProps {
  audioUrl?: string;
  isPlaying?: boolean;
  variant?: 'bars' | 'wave' | 'circle';
  height?: number;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  showControls?: boolean;
  volume?: number;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  audioUrl,
  isPlaying = false,
  variant = 'bars',
  height = 120,
  primaryColor = '#7C3AED', // couleur primaire par défaut
  secondaryColor,
  backgroundColor = 'rgba(124, 58, 237, 0.1)', // couleur de fond par défaut
  showControls = false,
  volume = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  const [localIsPlaying, setLocalIsPlaying] = useState(false);
  
  // Create audio element and set up analyzer
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    // Set volume
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }

    try {
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        if (audioRef.current) {
          sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
          sourceNodeRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioContextRef.current.destination);
        }
      }
    } catch (error) {
      console.error("Error setting up audio context:", error);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [volume]);

  // Handle audio URL
  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Error playing audio:", e);
        });
      }
    }
  }, [audioUrl]);

  // Handle playback state
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying && !localIsPlaying) {
      audioRef.current.play().catch(e => {
        console.error("Error playing audio:", e);
      });
      setLocalIsPlaying(true);
    } else if (!isPlaying && localIsPlaying) {
      audioRef.current.pause();
      setLocalIsPlaying(false);
    }
  }, [isPlaying, localIsPlaying]);

  // Animation for visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    
    if (!canvas || !analyser || !localIsPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const width = canvas.width;
    const height = canvas.height;
    
    const draw = () => {
      if (!ctx) return;
      
      animationRef.current = requestAnimationFrame(draw);
      
      analyser.getByteFrequencyData(dataArray);
      
      ctx.fillStyle = backgroundColor || 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);
      
      // Different visualizations based on variant
      switch(variant) {
        case 'bars':
          drawBars(ctx, width, height, bufferLength, dataArray);
          break;
        case 'wave':
          drawWave(ctx, width, height, bufferLength, dataArray);
          break;
        case 'circle':
          drawCircle(ctx, width, height, bufferLength, dataArray);
          break;
        default:
          drawBars(ctx, width, height, bufferLength, dataArray);
      }
    };
    
    draw();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [localIsPlaying, variant, primaryColor, secondaryColor, backgroundColor]);

  // Draw bars visualization
  const drawBars = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    bufferLength: number,
    dataArray: Uint8Array
  ) => {
    const barWidth = width / bufferLength * 2.5;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * height;
      
      // Simulate activity even without real audio
      let finalHeight = Math.max(5, barHeight || Math.random() * 30);
      
      // Use secondaryColor for alternate bars if provided
      if (secondaryColor && i % 2 === 0) {
        ctx.fillStyle = secondaryColor;
      } else {
        ctx.fillStyle = primaryColor;
      }
      
      ctx.fillRect(x, height - finalHeight, barWidth, finalHeight);
      
      x += barWidth + 1;
    }
  };
  
  // Draw wave visualization
  const drawWave = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    bufferLength: number,
    dataArray: Uint8Array
  ) => {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = primaryColor;
    
    const sliceWidth = width / bufferLength;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * height / 2;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      x += sliceWidth;
    }
    
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    // Draw second wave with secondary color if provided
    if (secondaryColor) {
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = secondaryColor;
      x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const v = (dataArray[i] / 128.0) * 0.8; // Slightly smaller wave
        const y = v * height / 2 + 10; // Offset from primary wave
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        x += sliceWidth;
      }
      
      ctx.lineTo(width, height / 2 + 10);
      ctx.stroke();
    }
  };
  
  // Draw circle visualization
  const drawCircle = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    bufferLength: number,
    dataArray: Uint8Array
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    for (let i = 0; i < bufferLength; i++) {
      const percent = i / bufferLength;
      const amplitude = dataArray[i] / 255;
      
      const x1 = centerX + radius * Math.cos(percent * 2 * Math.PI);
      const y1 = centerY + radius * Math.sin(percent * 2 * Math.PI);
      const x2 = centerX + (radius + amplitude * 50) * Math.cos(percent * 2 * Math.PI);
      const y2 = centerY + (radius + amplitude * 50) * Math.sin(percent * 2 * Math.PI);
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = secondaryColor || primaryColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  // Simulate activity even without audio
  useEffect(() => {
    if (!isPlaying) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // If no audio or analyzer, create simulated animation
    if (!audioUrl || !analyserRef.current) {
      const drawSimulation = () => {
        if (!ctx) return;
        
        animationRef.current = requestAnimationFrame(drawSimulation);
        
        ctx.fillStyle = backgroundColor || 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const barCount = 64;
        const barWidth = canvas.width / barCount;
        
        for (let i = 0; i < barCount; i++) {
          // Random height with some continuity (wave effect)
          const barHeight = (Math.sin(Date.now() * 0.001 + i * 0.15) + 1) * 0.5 * canvas.height * 0.5;
          
          ctx.fillStyle = primaryColor;
          ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
        }
      };
      
      drawSimulation();
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      };
    }
  }, [isPlaying, audioUrl, primaryColor, backgroundColor]);
  
  // Local toggle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (localIsPlaying) {
        audioRef.current.pause();
        setLocalIsPlaying(false);
      } else {
        audioRef.current.play().catch(console.error);
        setLocalIsPlaying(true);
      }
    }
  };

  return (
    <div className="audio-visualizer" style={{ height: `${height}px` }}>
      <canvas 
        ref={canvasRef} 
        width={500}
        height={height}
        className="w-full h-full"
      />
      
      {showControls && (
        <div className="flex justify-center mt-2">
          <button 
            onClick={togglePlay}
            className="px-4 py-1 text-sm bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
          >
            {localIsPlaying ? 'Pause' : 'Lecture'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioVisualizer;
export type { AudioVisualizerProps };
