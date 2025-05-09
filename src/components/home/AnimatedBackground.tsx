
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  mood?: string | null;
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ mood, timeOfDay = 'morning' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Effect for drawing the background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Get colors based on mood and time of day
    const getColors = () => {
      if (mood === 'calm') {
        return ['rgba(191, 219, 254, 0.3)', 'rgba(147, 197, 253, 0.3)', 'rgba(96, 165, 250, 0.2)'];
      } else if (mood === 'energetic') {
        return ['rgba(254, 215, 170, 0.3)', 'rgba(253, 186, 116, 0.3)', 'rgba(251, 146, 60, 0.2)'];
      } else if (mood === 'creative') {
        return ['rgba(216, 180, 254, 0.3)', 'rgba(196, 181, 253, 0.3)', 'rgba(167, 139, 250, 0.2)'];
      } else {
        // Default based on time of day
        switch(timeOfDay) {
          case 'morning':
            return ['rgba(254, 249, 195, 0.3)', 'rgba(253, 224, 71, 0.2)', 'rgba(250, 204, 21, 0.1)'];
          case 'afternoon':
            return ['rgba(191, 219, 254, 0.3)', 'rgba(147, 197, 253, 0.2)', 'rgba(96, 165, 250, 0.1)'];
          case 'evening':
            return ['rgba(165, 180, 252, 0.3)', 'rgba(129, 140, 248, 0.2)', 'rgba(99, 102, 241, 0.1)'];
          default:
            return ['rgba(191, 219, 254, 0.3)', 'rgba(147, 197, 253, 0.2)', 'rgba(96, 165, 250, 0.1)'];
        }
      }
    };
    
    const colors = getColors();
    
    // Create particles
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 15 + 5;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }
    
    // Create particle array
    const particleCount = 20;
    const particles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update each particle
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, [mood, timeOfDay]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 -z-10 overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
    </motion.div>
  );
};

export default AnimatedBackground;
