
import React, { useRef, useEffect, useState } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { Card } from '@/components/ui/card';

interface EnhancedMusicVisualizerProps {
  height?: number;
  showControls?: boolean;
  className?: string;
  mood?: string;
  intensity?: number;
  volume?: number;
}

const EnhancedMusicVisualizer: React.FC<EnhancedMusicVisualizerProps> = ({ 
  height = 120, 
  showControls = true,
  className = '',
  mood = 'neutral',
  intensity = 50,
  volume = 0.5
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isPlaying, currentTrack } = useMusic();
  const [visualizerType, setVisualizerType] = useState<'bars' | 'wave' | 'circle'>('bars');
  
  // Generate random data for visualization demo
  // In a real app, this would use Web Audio API to analyze frequency data
  const generateRandomData = (length: number) => {
    const data = [];
    for (let i = 0; i < length; i++) {
      // Generate smoother data by creating patterns
      const baseHeight = Math.sin((i / length) * Math.PI * 4) * 0.5 + 0.5;
      const randomFactor = isPlaying ? 0.5 : 0.1;
      const value = baseHeight * (1 - randomFactor) + Math.random() * randomFactor;
      data.push(value * 0.8 + 0.2); // Scale to 0.2-1.0 range
    }
    return data;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Adjust for high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    let animationId: number;
    let lastTime = 0;
    const fpsInterval = 1000 / 30; // 30fps
    
    const draw = (currentTime: number) => {
      animationId = requestAnimationFrame(draw);
      
      // Throttle to 30fps
      const elapsed = currentTime - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = currentTime - (elapsed % fpsInterval);
      
      // Clear canvas
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      // Generate visualization data
      const barCount = Math.floor(rect.width / 5);
      const data = generateRandomData(barCount);
      
      // Choose visualization type
      switch (visualizerType) {
        case 'bars':
          drawBars(ctx, data, rect.width, rect.height);
          break;
        case 'wave':
          drawWave(ctx, data, rect.width, rect.height);
          break;
        case 'circle':
          drawCircle(ctx, data, rect.width, rect.height);
          break;
      }
    };
    
    animationId = requestAnimationFrame(draw);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, visualizerType]);

  // Use mood to influence the visualization
  useEffect(() => {
    if (mood === 'calm' || mood === 'melancholic') {
      setVisualizerType('wave');
    } else if (mood === 'focused') {
      setVisualizerType('circle');
    } else {
      setVisualizerType('bars');
    }
  }, [mood]);
  
  const drawBars = (
    ctx: CanvasRenderingContext2D, 
    data: number[], 
    width: number, 
    height: number
  ) => {
    const barWidth = width / data.length;
    const baseHue = currentTrack ? 
      (currentTrack.title.charCodeAt(0) % 360) : 
      220; // Default blue hue
    
    data.forEach((value, i) => {
      const barHeight = value * height;
      const x = i * barWidth;
      const hue = (baseHue + i * 0.5) % 360;
      
      ctx.fillStyle = isPlaying ? 
        `hsla(${hue}, 80%, 60%, 0.7)` : 
        `hsla(${hue}, 20%, 60%, 0.3)`;
      
      ctx.beginPath();
      ctx.roundRect(
        x, 
        height - barHeight, 
        barWidth - 1, 
        barHeight, 
        [2, 2, 0, 0]
      );
      ctx.fill();
    });
  };
  
  const drawWave = (
    ctx: CanvasRenderingContext2D, 
    data: number[], 
    width: number, 
    height: number
  ) => {
    const baseHue = currentTrack ? 
      (currentTrack.title.charCodeAt(0) % 360) : 
      220; // Default blue hue
    
    ctx.strokeStyle = isPlaying ? 
      `hsla(${baseHue}, 80%, 60%, 0.8)` : 
      `hsla(${baseHue}, 20%, 60%, 0.4)`;
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    
    data.forEach((value, i) => {
      const x = (width / data.length) * i;
      const y = height / 2 + (value - 0.5) * height * 0.8;
      ctx.lineTo(x, y);
    });
    
    ctx.stroke();
    
    // Add reflection
    ctx.strokeStyle = isPlaying ? 
      `hsla(${baseHue}, 80%, 60%, 0.3)` : 
      `hsla(${baseHue}, 20%, 60%, 0.1)`;
    
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    
    data.forEach((value, i) => {
      const x = (width / data.length) * i;
      const y = height / 2 - (value - 0.5) * height * 0.4;
      ctx.lineTo(x, y);
    });
    
    ctx.stroke();
  };
  
  const drawCircle = (
    ctx: CanvasRenderingContext2D, 
    data: number[], 
    width: number, 
    height: number
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3;
    const baseHue = currentTrack ? 
      (currentTrack.title.charCodeAt(0) % 360) : 
      220;
    
    ctx.lineWidth = 2;
    
    data.forEach((value, i) => {
      const angle = (i / data.length) * Math.PI * 2;
      const spikeHeight = radius * value * 0.8;
      const x = centerX + Math.cos(angle) * (radius + spikeHeight);
      const y = centerY + Math.sin(angle) * (radius + spikeHeight);
      const hue = (baseHue + i * 2) % 360;
      
      ctx.strokeStyle = isPlaying ? 
        `hsla(${hue}, 80%, 60%, 0.7)` : 
        `hsla(${hue}, 20%, 60%, 0.3)`;
      
      ctx.beginPath();
      ctx.moveTo(
        centerX + Math.cos(angle) * radius,
        centerY + Math.sin(angle) * radius
      );
      ctx.lineTo(x, y);
      ctx.stroke();
    });
    
    // Draw inner circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.9, 0, Math.PI * 2);
    ctx.strokeStyle = isPlaying ? 
      `hsla(${baseHue}, 70%, 60%, 0.3)` : 
      `hsla(${baseHue}, 20%, 60%, 0.1)`;
    ctx.stroke();
  };
  
  return (
    <div className={`w-full ${className}`}>
      <div className="relative" style={{ height: `${height}px` }}>
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
          style={{ height: `${height}px` }}
        />
        
        {!currentTrack && !isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
            {currentTrack === null ? "Aucune musique sélectionnée" : "Lecture en pause"}
          </div>
        )}
      </div>
      
      {showControls && (
        <div className="flex justify-center gap-2 mt-2">
          <button 
            className={`px-3 py-1 text-xs rounded ${visualizerType === 'bars' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            onClick={() => setVisualizerType('bars')}
          >
            Barres
          </button>
          <button 
            className={`px-3 py-1 text-xs rounded ${visualizerType === 'wave' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            onClick={() => setVisualizerType('wave')}
          >
            Onde
          </button>
          <button 
            className={`px-3 py-1 text-xs rounded ${visualizerType === 'circle' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            onClick={() => setVisualizerType('circle')}
          >
            Cercle
          </button>
        </div>
      )}
    </div>
  );
};

export default EnhancedMusicVisualizer;
