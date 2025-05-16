
import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/use-theme';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const setCanvasSize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Theme-based colors
    const getColors = () => {
      switch (theme) {
        case 'dark':
          return {
            background: '#0f172a',
            primary: '#0891B2',
            secondary: '#1e3a8a',
            accent: '#2563eb'
          };
        case 'pastel':
          return {
            background: '#E0F2FE',
            primary: '#93c5fd',
            secondary: '#bae6fd',
            accent: '#7dd3fc'
          };
        default: // light
          return {
            background: '#ffffff',
            primary: '#3b82f6',
            secondary: '#60a5fa',
            accent: '#93c5fd'
          };
      }
    };
    
    let colors = getColors();
    
    // Particles setup
    const particles: {
      x: number;
      y: number;
      radius: number;
      color: string;
      speedX: number;
      speedY: number;
      opacity: number;
    }[] = [];
    
    const createParticles = () => {
      particles.length = 0;
      const numParticles = Math.min(window.innerWidth / 10, 100);
      
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 5 + 1,
          color: [colors.primary, colors.secondary, colors.accent][
            Math.floor(Math.random() * 3)
          ],
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
    };
    
    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Clear canvas
      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update particles
      particles.forEach(particle => {
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16);
        ctx.fill();
        
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });
      
      // Draw gradient circles
      const drawGradientCircle = (x: number, y: number, radius: number, color: string) => {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, color + '40');
        gradient.addColorStop(1, color + '00');
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      };
      
      // Draw slow-moving gradient circles
      const time = Date.now() * 0.001;
      drawGradientCircle(
        canvas.width * (0.3 + 0.1 * Math.sin(time * 0.2)),
        canvas.height * (0.3 + 0.1 * Math.cos(time * 0.3)),
        canvas.width * 0.4,
        colors.primary
      );
      
      drawGradientCircle(
        canvas.width * (0.7 + 0.1 * Math.cos(time * 0.25)),
        canvas.height * (0.7 + 0.1 * Math.sin(time * 0.35)),
        canvas.width * 0.5,
        colors.secondary
      );
      
      requestAnimationFrame(animate);
    };
    
    // Update colors when theme changes
    colors = getColors();
    createParticles();
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [theme]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 w-full h-full" 
      style={{ backgroundColor: theme === 'dark' ? '#0f172a' : theme === 'pastel' ? '#E0F2FE' : '#ffffff' }}
    />
  );
};

export default AnimatedBackground;
