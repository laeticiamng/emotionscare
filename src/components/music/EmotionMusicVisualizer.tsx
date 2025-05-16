
import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { MusicTrack } from '@/types';

interface EmotionMusicVisualizerProps {
  track: MusicTrack | null;
  isPlaying: boolean;
  color?: string;
  height?: number;
  barWidth?: number;
  barGap?: number;
  barCount?: number;
}

const EmotionMusicVisualizer: React.FC<EmotionMusicVisualizerProps> = ({
  track,
  isPlaying,
  color = '#3B82F6',
  height = 100,
  barWidth = 3,
  barGap = 1,
  barCount = 80
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioSource, setAudioSource] = useState<MediaElementAudioSourceNode | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  // Create audio context and set up analyzer
  useEffect(() => {
    if (!track) return;
    
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    
    // Use the appropriate track URL property
    const trackUrl = track.track_url;
    
    if (!trackUrl) {
      console.error('No URL available for track:', track);
      return;
    }
    
    audio.src = trackUrl;
    setAudioElement(audio);
    
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = context.createMediaElementSource(audio);
    const analyzerNode = context.createAnalyser();
    
    analyzerNode.fftSize = 256;
    analyzerNode.smoothingTimeConstant = 0.8;
    
    source.connect(analyzerNode);
    analyzerNode.connect(context.destination);
    
    setAudioContext(context);
    setAudioSource(source);
    setAnalyser(analyzerNode);
    
    return () => {
      audio.pause();
      if (context.state !== 'closed') {
        context.close();
      }
    };
  }, [track]);
  
  // Handle play/pause
  useEffect(() => {
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.play().catch(err => console.error('Failed to play:', err));
    } else {
      audioElement.pause();
    }
    
    return () => {
      audioElement.pause();
    };
  }, [isPlaying, audioElement]);
  
  // Animation frame for visualization
  useEffect(() => {
    if (!canvasRef.current || !analyser || !isPlaying) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      if (!isPlaying) return;
      
      const width = canvas.width;
      const height = canvas.height;
      
      analyser.getByteFrequencyData(dataArray);
      
      ctx.clearRect(0, 0, width, height);
      
      // Calculate total width of all bars and gaps
      const totalBarWidth = barCount * barWidth;
      const totalGapWidth = (barCount - 1) * barGap;
      const totalWidth = totalBarWidth + totalGapWidth;
      
      // Calculate starting position to center the bars
      const startX = (width - totalWidth) / 2;
      
      // Draw bars
      for (let i = 0; i < barCount; i++) {
        // Map dataArray index to available data points
        const dataIndex = Math.floor((i / barCount) * bufferLength);
        const value = dataArray[dataIndex] || 0;
        
        // Calculate bar height based on audio data
        const barHeight = (value / 255) * height;
        
        // Calculate x position
        const x = startX + i * (barWidth + barGap);
        
        ctx.fillStyle = color;
        ctx.fillRect(
          x,
          height - barHeight,
          barWidth,
          barHeight
        );
      }
      
      requestAnimationFrame(draw);
    };
    
    draw();
  }, [analyser, isPlaying, barCount, barGap, barWidth, color]);
  
  // Resize canvas on window resize
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const resizeCanvas = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = height;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [height]);
  
  return (
    <Card className="overflow-hidden p-0">
      <canvas 
        ref={canvasRef} 
        className="w-full block"
        style={{ height: `${height}px`, background: 'transparent' }}
      />
    </Card>
  );
};

export default EmotionMusicVisualizer;
