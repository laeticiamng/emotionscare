
import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface AudioVisualizerProps {
  audioUrl?: string;
  isPlaying: boolean;
  variant?: 'bars' | 'circle' | 'wave';
  height?: number;
  primaryColor?: string;
  secondaryColor?: string;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  audioUrl,
  isPlaying,
  variant = 'bars',
  height = 100,
  primaryColor,
  secondaryColor
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { theme } = useTheme();

  // Initialize the audio elements on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (audioContextRef.current?.state !== 'closed') {
        sourceRef.current?.disconnect();
        analyserRef.current?.disconnect();
      }
    };
  }, []);

  // Handle audio URL changes
  useEffect(() => {
    if (!audioRef.current || !audioUrl) return;
    
    audioRef.current.src = audioUrl;
    
    if (!sourceRef.current && audioContextRef.current && analyserRef.current) {
      sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
  }, [audioUrl]);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current || !audioUrl) return;
    
    if (isPlaying) {
      // Resume AudioContext if it was suspended (browser autoplay policy)
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      audioRef.current.play().catch(error => {
        console.error('Error playing audio for visualizer:', error);
      });
      
      // Start visualization
      if (canvasRef.current) {
        startVisualization();
      }
    } else {
      audioRef.current.pause();
      
      // Stop visualization
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [isPlaying, audioUrl]);

  // Drawing functions for different visualizer types
  const drawBars = (ctx: CanvasRenderContext2D, bufferLength: number, dataArray: Uint8Array, width: number, height: number) => {
    const barWidth = (width / bufferLength) * 2.5;
    let x = 0;
    
    const primColor = primaryColor || (theme === 'dark' ? '#6366F1' : '#4F46E5');
    const secColor = secondaryColor || (theme === 'dark' ? '#A5B4FC' : '#818CF8');
    
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i] / 255 * height;
      
      const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
      gradient.addColorStop(0, primColor);
      gradient.addColorStop(1, secColor);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);
      
      x += barWidth + 1;
    }
  };

  const drawCircle = (ctx: CanvasRenderContext2D, bufferLength: number, dataArray: Uint8Array, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    const primColor = primaryColor || (theme === 'dark' ? '#6366F1' : '#4F46E5');
    const secColor = secondaryColor || (theme === 'dark' ? '#A5B4FC' : '#818CF8');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = secColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    for (let i = 0; i < bufferLength; i++) {
      const angle = (i * 2 * Math.PI) / bufferLength;
      const barHeight = (dataArray[i] / 255) * (radius * 0.5);
      
      const x = centerX + Math.cos(angle) * (radius - barHeight / 2);
      const y = centerY + Math.sin(angle) * (radius - barHeight / 2);
      
      ctx.beginPath();
      ctx.arc(x, y, barHeight / 4, 0, 2 * Math.PI);
      ctx.fillStyle = primColor;
      ctx.fill();
    }
  };

  const drawWave = (ctx: CanvasRenderContext2D, bufferLength: number, dataArray: Uint8Array, width: number, height: number) => {
    const primColor = primaryColor || (theme === 'dark' ? '#6366F1' : '#4F46E5');
    
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    
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
    ctx.strokeStyle = primColor;
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  // Main visualization function
  const startVisualization = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const width = canvas.width;
    const height = canvas.height;
    
    const renderFrame = () => {
      animationRef.current = requestAnimationFrame(renderFrame);
      
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      ctx.clearRect(0, 0, width, height);
      
      switch (variant) {
        case 'bars':
          drawBars(ctx, bufferLength, dataArray, width, height);
          break;
        case 'circle':
          drawCircle(ctx, bufferLength, dataArray, width, height);
          break;
        case 'wave':
          drawWave(ctx, bufferLength, dataArray, width, height);
          break;
        default:
          drawBars(ctx, bufferLength, dataArray, width, height);
      }
    };
    
    renderFrame();
  };

  return (
    <div className="audio-visualizer w-full" style={{ height: `${height}px` }}>
      <canvas 
        ref={canvasRef} 
        width={500}
        height={height}
        className="w-full h-full"
      />
    </div>
  );
};

export default AudioVisualizer;
