// @ts-nocheck

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Maximize2, Minimize2, Palette } from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import { cn } from '@/lib/utils';

interface VisualizationProps {
  className?: string;
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

type VisualizationType = 'waveform' | 'spectrum' | 'circular' | 'particles' | 'galaxy';
type ColorTheme = 'neon' | 'sunset' | 'ocean' | 'fire' | 'cosmic';

const colorThemes = {
  neon: ['#ff0080', '#00ff80', '#8000ff', '#ff8000'],
  sunset: ['#ff6b35', '#f7931e', '#ffd23f', '#fff75e'],
  ocean: ['#006b96', '#0087b5', '#00a3d4', '#00bef2'],
  fire: ['#ff0000', '#ff4500', '#ffa500', '#ffff00'],
  cosmic: ['#663399', '#9966cc', '#cc99ff', '#ffffff']
};

const ImmersiveVisualization: React.FC<VisualizationProps> = ({
  className,
  fullscreen = false,
  onToggleFullscreen
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const { isPlaying, currentTrack } = useMusic();
  
  const [visualizationType, setVisualizationType] = useState<VisualizationType>('spectrum');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('neon');
  const [intensity, setIntensity] = useState(1);

  // Generate mock audio data
  const generateAudioData = () => {
    return Array.from({ length: 128 }, () => Math.random() * 255);
  };

  const drawWaveform = (ctx: CanvasRenderingContext2D, width: number, height: number, data: number[]) => {
    const colors = colorThemes[colorTheme];
    ctx.strokeStyle = colors[0];
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    for (let i = 0; i < data.length; i++) {
      const x = (i / data.length) * width;
      const y = height / 2 + (data[i] - 128) * intensity;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  };

  const drawSpectrum = (ctx: CanvasRenderingContext2D, width: number, height: number, data: number[]) => {
    const colors = colorThemes[colorTheme];
    const barWidth = width / data.length;
    
    for (let i = 0; i < data.length; i++) {
      const barHeight = (data[i] / 255) * height * intensity;
      const colorIndex = Math.floor((i / data.length) * colors.length);
      
      const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
      gradient.addColorStop(0, colors[colorIndex] + '40');
      gradient.addColorStop(1, colors[colorIndex]);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
    }
  };

  const drawCircular = (ctx: CanvasRenderingContext2D, width: number, height: number, data: number[]) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;
    const colors = colorThemes[colorTheme];
    
    for (let i = 0; i < data.length; i++) {
      const angle = (i / data.length) * Math.PI * 2;
      const barHeight = (data[i] / 255) * radius * intensity;
      
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius + barHeight);
      
      const colorIndex = Math.floor((i / data.length) * colors.length);
      ctx.strokeStyle = colors[colorIndex];
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  };

  const drawParticles = (ctx: CanvasRenderingContext2D, width: number, height: number, data: number[]) => {
    const colors = colorThemes[colorTheme];
    
    for (let i = 0; i < data.length; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = (data[i] / 255) * 10 * intensity;
      const colorIndex = Math.floor(Math.random() * colors.length);
      
      ctx.fillStyle = colors[colorIndex] + '80';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawGalaxy = (ctx: CanvasRenderingContext2D, width: number, height: number, data: number[]) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const colors = colorThemes[colorTheme];
    
    for (let i = 0; i < data.length; i++) {
      const angle = (i / data.length) * Math.PI * 8;
      const distance = (data[i] / 255) * Math.min(width, height) / 3 * intensity;
      
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      const size = (data[i] / 255) * 5;
      
      const colorIndex = Math.floor((distance / (Math.min(width, height) / 3)) * colors.length);
      ctx.fillStyle = colors[colorIndex] + '60';
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = canvas;
    
    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    if (isPlaying) {
      const audioData = generateAudioData();
      
      switch (visualizationType) {
        case 'waveform':
          drawWaveform(ctx, width, height, audioData);
          break;
        case 'spectrum':
          drawSpectrum(ctx, width, height, audioData);
          break;
        case 'circular':
          drawCircular(ctx, width, height, audioData);
          break;
        case 'particles':
          drawParticles(ctx, width, height, audioData);
          break;
        case 'galaxy':
          drawGalaxy(ctx, width, height, audioData);
          break;
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, visualizationType, colorTheme, intensity]);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Eye className="h-5 w-5" />
            Visualisation Immersive
          </CardTitle>
          {onToggleFullscreen && (
            <Button variant="ghost" size="sm" onClick={onToggleFullscreen}>
              {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={visualizationType} onValueChange={(value: VisualizationType) => setVisualizationType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="waveform">Onde</SelectItem>
              <SelectItem value="spectrum">Spectre</SelectItem>
              <SelectItem value="circular">Circulaire</SelectItem>
              <SelectItem value="particles">Particules</SelectItem>
              <SelectItem value="galaxy">Galaxie</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={colorTheme} onValueChange={(value: ColorTheme) => setColorTheme(value)}>
            <SelectTrigger>
              <Palette className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="neon">Néon</SelectItem>
              <SelectItem value="sunset">Coucher de soleil</SelectItem>
              <SelectItem value="ocean">Océan</SelectItem>
              <SelectItem value="fire">Feu</SelectItem>
              <SelectItem value="cosmic">Cosmique</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={() => setIntensity(prev => prev === 1 ? 2 : 1)}
          >
            Intensité: {intensity}x
          </Button>
        </div>
        
        {/* Visualization Canvas */}
        <div className={cn(
          "relative bg-black rounded-lg overflow-hidden",
          fullscreen ? "h-[80vh]" : "h-64"
        )}>
          <canvas
            ref={canvasRef}
            className="w-full h-full"
          />
          
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center text-white/60">
              <div className="text-center">
                <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Démarrez la lecture pour voir la visualisation</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImmersiveVisualization;
