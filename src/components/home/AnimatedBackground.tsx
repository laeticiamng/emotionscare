
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  mood?: string | null;
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ mood, timeOfDay = 'morning' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    const getColors = () => {
      if (mood === 'calm') {
        return ['rgba(59, 130, 246, 0.1)', 'rgba(147, 197, 253, 0.15)', 'rgba(96, 165, 250, 0.1)'];
      } else if (mood === 'energetic') {
        return ['rgba(251, 146, 60, 0.1)', 'rgba(253, 186, 116, 0.15)', 'rgba(254, 215, 170, 0.1)'];
      } else {
        return ['rgba(139, 92, 246, 0.1)', 'rgba(196, 181, 253, 0.15)', 'rgba(167, 139, 250, 0.1)'];
      }
    };
    
    const colors = getColors();
    
    class FloatingOrb {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
      opacity: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 60 + 20;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < -this.radius) this.x = canvas.width + this.radius;
        if (this.x > canvas.width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = canvas.height + this.radius;
        if (this.y > canvas.height + this.radius) this.y = -this.radius;
      }
      
      draw() {
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    
    const orbs: FloatingOrb[] = [];
    for (let i = 0; i < 8; i++) {
      orbs.push(new FloatingOrb());
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      orbs.forEach(orb => {
        orb.update();
        orb.draw();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, [mood, timeOfDay]);
  
  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 -z-10" 
        style={{ filter: 'blur(0.5px)' }}
      />
      
      {/* Floating elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full opacity-20"
            style={{
              background: `linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default AnimatedBackground;
