
import React, { useEffect, useRef } from 'react';

interface BackgroundAnimationProps {
  musicEnabled?: boolean;
  emotion?: string;
}

const BackgroundAnimation: React.FC<BackgroundAnimationProps> = ({ 
  musicEnabled = false,
  emotion = 'neutral'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Configure animation based on emotion
    let particleCount = 30;
    let speed = 0.5;
    let particleSize = 40;
    let colors: string[] = [];
    
    switch(emotion) {
      case 'happy':
        colors = ['rgba(255, 222, 125, 0.2)', 'rgba(255, 190, 67, 0.2)', 'rgba(253, 171, 94, 0.2)'];
        speed = 0.8;
        break;
      case 'calm':
        colors = ['rgba(147, 197, 253, 0.2)', 'rgba(59, 130, 246, 0.2)', 'rgba(96, 165, 250, 0.2)'];
        particleSize = 50;
        speed = 0.3;
        break;
      case 'sad':
      case 'melancholic':
        colors = ['rgba(107, 114, 128, 0.1)', 'rgba(75, 85, 99, 0.1)', 'rgba(55, 65, 81, 0.1)'];
        particleSize = 60;
        speed = 0.2;
        break;
      case 'energetic':
        colors = ['rgba(252, 165, 165, 0.2)', 'rgba(239, 68, 68, 0.2)', 'rgba(248, 113, 113, 0.2)'];
        speed = 1.0;
        particleCount = 40;
        break;
      case 'focused':
        colors = ['rgba(167, 139, 250, 0.2)', 'rgba(124, 58, 237, 0.1)', 'rgba(139, 92, 246, 0.2)'];
        particleSize = 35;
        particleCount = 25;
        break;
      default: // neutral
        colors = ['rgba(209, 213, 219, 0.1)', 'rgba(156, 163, 175, 0.1)', 'rgba(107, 114, 128, 0.1)'];
        particleSize = 45;
        speed = 0.4;
    }
    
    // Create particles
    const particles: {
      x: number;
      y: number;
      radius: number;
      color: string;
      speedX: number;
      speedY: number;
    }[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * particleSize + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * speed,
        speedY: (Math.random() - 0.5) * speed
      });
    }
    
    // Animation loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Move particles
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY;
        }
      });
      
      // If music is enabled, make some particles pulse
      if (musicEnabled) {
        const now = Date.now() / 1000;
        particles.forEach((particle, index) => {
          if (index % 3 === 0) {
            particle.radius = (Math.sin(now * 2 + index) + 1) * particleSize / 2 + 10;
          }
        });
      }
      
      requestAnimationFrame(draw);
    };
    
    // Start animation
    const animationId = requestAnimationFrame(draw);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationId);
    };
  }, [musicEnabled, emotion]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none" 
      style={{ zIndex: 0 }}
    />
  );
};

export default BackgroundAnimation;
