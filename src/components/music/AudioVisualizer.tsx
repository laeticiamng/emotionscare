
import React, { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";

interface AudioVisualizerProps {
  audioUrl?: string;
  isPlaying: boolean;
  variant?: 'bars' | 'wave' | 'circle';
  height?: number;
  primaryColor?: string;
  secondaryColor?: string;
}

/**
 * AudioVisualizer component that creates visual representations of audio
 * Can display in different styles based on variant prop
 */
const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  audioUrl,
  isPlaying,
  variant = 'bars',
  height = 100,
  primaryColor = '#6366F1', 
  secondaryColor = '#818CF8'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  
  // Initialize audio context and analyzer
  useEffect(() => {
    if (!audioUrl) return;
    
    // Create audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = 'anonymous';
    }
    
    audioRef.current.src = audioUrl;
    
    // Create audio context and analyzer
    if (!audioContextRef.current) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
        
        // Connect audio to analyzer
        const source = audioContextRef.current.createMediaElementSource(audioRef.current);
        source.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      } catch (error) {
        console.error('Error initializing audio context:', error);
      }
    }
    
    return () => {
      // Cleanup animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioUrl]);
  
  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
      });
      renderFrame();
    } else {
      audioRef.current.pause();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
  }, [isPlaying]);
  
  // Main rendering function
  const renderFrame = () => {
    if (!canvasRef.current || !dataArrayRef.current || !analyserRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Get analysis data
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Render based on variant
    switch (variant) {
      case 'bars':
        renderBars(ctx, width, height, dataArrayRef.current);
        break;
      case 'wave':
        renderWave(ctx, width, height, dataArrayRef.current);
        break;
      case 'circle':
        renderCircle(ctx, width, height, dataArrayRef.current);
        break;
      default:
        renderBars(ctx, width, height, dataArrayRef.current);
    }
    
    // Loop animation
    animationRef.current = requestAnimationFrame(renderFrame);
  };
  
  // Render bar visualization
  const renderBars = (ctx: CanvasRenderingContext2D, width: number, height: number, dataArray: Uint8Array) => {
    const barCount = dataArray.length / 2;
    const barWidth = width / barCount;
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, primaryColor);
    gradient.addColorStop(1, secondaryColor);
    
    ctx.fillStyle = gradient;
    
    for (let i = 0; i < barCount; i++) {
      const barHeight = (dataArray[i] / 255) * height;
      
      ctx.beginPath();
      ctx.roundRect(
        i * barWidth, 
        height - barHeight,
        barWidth - 1,
        barHeight,
        [2, 2, 0, 0]
      );
      ctx.fill();
    }
  };
  
  // Render wave visualization
  const renderWave = (ctx: CanvasRenderingContext2D, width: number, height: number, dataArray: Uint8Array) => {
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, primaryColor);
    gradient.addColorStop(1, secondaryColor);
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    
    const sliceWidth = width / dataArray.length;
    
    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * height) / 2;
      const x = i * sliceWidth;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.lineTo(width, height / 2);
    ctx.stroke();
  };
  
  // Render circle visualization
  const renderCircle = (ctx: CanvasRenderingContext2D, width: number, height: number, dataArray: Uint8Array) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    const segments = Math.min(dataArray.length, 64);
    const angleStep = (Math.PI * 2) / segments;
    
    for (let i = 0; i < segments; i++) {
      const value = dataArray[i] / 255;
      const spikeLength = value * radius * 0.5;
      
      const angle = i * angleStep;
      const innerX = centerX + Math.cos(angle) * radius;
      const innerY = centerY + Math.sin(angle) * radius;
      const outerX = centerX + Math.cos(angle) * (radius + spikeLength);
      const outerY = centerY + Math.sin(angle) * (radius + spikeLength);
      
      ctx.beginPath();
      ctx.moveTo(innerX, innerY);
      ctx.lineTo(outerX, outerY);
      
      const gradient = ctx.createLinearGradient(innerX, innerY, outerX, outerY);
      gradient.addColorStop(0, primaryColor);
      gradient.addColorStop(1, secondaryColor);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };
  
  // Render placeholder when no audio
  const renderPlaceholder = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (variant === 'bars') {
      const barCount = 40;
      const barWidth = canvas.width / barCount;
      
      for (let i = 0; i < barCount; i++) {
        // Generate a random height or a pattern
        const barHeight = Math.max(5, Math.sin(i * 0.2) * 20 + Math.random() * 5);
        
        ctx.fillStyle = i % 3 === 0 ? primaryColor : secondaryColor;
        ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
      }
    } else if (variant === 'wave') {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      
      for (let i = 0; i < canvas.width; i++) {
        const y = Math.sin(i * 0.05) * 10 + canvas.height / 2;
        ctx.lineTo(i, y);
      }
      
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (variant === 'circle') {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) * 0.8;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Add some spikes
      for (let i = 0; i < 32; i++) {
        const angle = (i / 32) * Math.PI * 2;
        const spikeHeight = i % 3 === 0 ? 15 : 5;
        
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + spikeHeight);
        const y2 = centerY + Math.sin(angle) * (radius + spikeHeight);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = i % 3 === 0 ? primaryColor : secondaryColor;
        ctx.stroke();
      }
    }
  };
  
  // Effect to render placeholder when not playing
  useEffect(() => {
    if (!isPlaying && canvasRef.current) {
      renderPlaceholder();
    }
  }, [canvasRef.current, isPlaying, variant, primaryColor, secondaryColor]);
  
  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <canvas
        ref={canvasRef}
        width={300}
        height={height}
        className="w-full h-full"
      />
    </div>
  );
};

export default AudioVisualizer;
