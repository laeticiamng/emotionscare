
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';

const AnimatedBackground: React.FC = () => {
  const { isDarkMode, theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Get colors based on time of day and theme
  const getBackgroundColors = () => {
    const hour = new Date().getHours();
    
    if (theme === 'pastel') {
      return {
        circle1: 'rgba(139, 140, 255, 0.3)',
        circle2: 'rgba(196, 165, 255, 0.3)',
      };
    }
    
    if (isDarkMode) {
      if (hour >= 5 && hour < 12) {
        return { 
          circle1: 'rgba(30, 58, 138, 0.3)', 
          circle2: 'rgba(49, 46, 129, 0.3)' 
        };
      } else if (hour >= 12 && hour < 18) {
        return { 
          circle1: 'rgba(67, 56, 202, 0.3)', 
          circle2: 'rgba(79, 70, 229, 0.3)' 
        };
      } else {
        return { 
          circle1: 'rgba(30, 41, 59, 0.3)', 
          circle2: 'rgba(15, 23, 42, 0.3)' 
        };
      }
    } else {
      if (hour >= 5 && hour < 12) {
        return { 
          circle1: 'rgba(224, 242, 254, 0.5)', 
          circle2: 'rgba(186, 230, 253, 0.5)' 
        };
      } else if (hour >= 12 && hour < 18) {
        return { 
          circle1: 'rgba(224, 231, 255, 0.5)', 
          circle2: 'rgba(199, 210, 254, 0.5)' 
        };
      } else {
        return { 
          circle1: 'rgba(239, 246, 255, 0.5)', 
          circle2: 'rgba(219, 234, 254, 0.5)' 
        };
      }
    }
  };
  
  const { circle1, circle2 } = getBackgroundColors();
  
  // Canvas particles animation
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
    }[] = [];
    
    // Create particles
    const createParticles = () => {
      const particleCount = Math.min(window.innerWidth / 10, 100); // Limit particles based on screen width
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(66, 153, 225, 0.3)'
        });
      }
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Wrap particles around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
      
      requestAnimationFrame(animate);
    };
    
    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles.length = 0; // Clear particles
      createParticles();
    };
    
    createParticles();
    animate();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isDarkMode]);
  
  return (
    <div className="ambient-animation">
      <motion.div 
        className="blur-circle circle-1" 
        style={{ background: `radial-gradient(circle, ${circle1} 0%, rgba(99, 102, 241, 0) 70%)` }}
        animate={{ 
          x: [0, 20, 0], 
          y: [0, -20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="blur-circle circle-2"
        style={{ background: `radial-gradient(circle, ${circle2} 0%, rgba(139, 92, 246, 0) 70%)` }}
        animate={{ 
          x: [0, -30, 0], 
          y: [0, 20, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />
    </div>
  );
};

export default AnimatedBackground;
