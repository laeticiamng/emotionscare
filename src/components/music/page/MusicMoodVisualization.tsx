
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useMusic } from '@/contexts/music';

interface MusicMoodVisualizationProps {
  className?: string;
}

const MusicMoodVisualization: React.FC<MusicMoodVisualizationProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isPlaying, currentTrack, emotion } = useMusic();
  const [, forceUpdate] = useState({});
  
  // Map emotion to colors
  const getEmotionColors = (emotionType?: string | null) => {
    switch (emotionType?.toLowerCase()) {
      case 'calm':
      case 'peaceful':
      case 'relaxed':
        return ['#5B9BD5', '#8CC7DC', '#68BBE3'];
      case 'happy':
      case 'joy':
        return ['#FFC000', '#ED7D31', '#FFD966'];
      case 'sad':
      case 'melancholy':
        return ['#5B6D8E', '#7D8CA3', '#4A5568'];
      case 'focus':
      case 'concentrate':
        return ['#9062C0', '#763FA3', '#BD8DDA'];
      case 'energetic':
      case 'energy':
        return ['#F25022', '#FF8C00', '#FFCB05'];
      default:
        return ['#5B9BD5', '#9062C0', '#68BBE3'];
    }
  };
  
  // Draw the visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };
    
    // Handle resize
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Animation state
    let animationId: number;
    const particles: any[] = [];
    const colors = getEmotionColors(emotion);
    
    // Create particles
    const createParticles = () => {
      particles.length = 0;
      const numParticles = isPlaying ? 50 : 20;
      
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 5 + 1,
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 1 - 0.5,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };
    
    // Animate particles
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw particles
      particles.forEach(particle => {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Update position
        particle.x += particle.speedX * (isPlaying ? 2 : 0.5);
        particle.y += particle.speedY * (isPlaying ? 2 : 0.5);
        
        // Wrap around edges
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    // Start animation
    createParticles();
    animate();
    
    // Clean up
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isPlaying, emotion, currentTrack]);
  
  // Force update when track changes
  useEffect(() => {
    forceUpdate({});
  }, [currentTrack, emotion]);
  
  return (
    <Card className={`overflow-hidden relative ${className}`}>
      <div className="absolute inset-0">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
          style={{ background: 'transparent' }}
        />
      </div>
      <div className="relative z-10 p-6 text-center">
        <h3 className="font-bold text-lg mb-1">
          {emotion ? `${emotion} Mood` : 'Mood Visualization'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isPlaying 
            ? 'Visualizing your current music mood' 
            : 'Start playing music to see visualization'}
        </p>
      </div>
    </Card>
  );
};

export default MusicMoodVisualization;
