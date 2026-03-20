import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PremiumBackgroundProps {
  variant?: 'gradient' | 'particles' | 'waves' | 'neural' | 'aurora';
  intensity?: 'subtle' | 'medium' | 'intense';
  className?: string;
  children?: React.ReactNode;
}

const PremiumBackground: React.FC<PremiumBackgroundProps> = ({
  variant = 'gradient',
  intensity = 'medium',
  className,
  children
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (variant === 'particles' || variant === 'neural') {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      // Animation des particules
      const particles: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        opacity: number;
        connections: number[];
      }> = [];

      const particleCount = intensity === 'subtle' ? 50 : intensity === 'medium' ? 100 : 150;

      // Initialiser les particules
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          connections: []
        });
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Mettre à jour et dessiner les particules
        particles.forEach((particle, i) => {
          // Mouvement
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Rebond sur les bords
          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

          // Dessiner la particule
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(147, 51, 234, ${particle.opacity})`;
          ctx.fill();

          // Connexions neurales (pour variant neural)
          if (variant === 'neural') {
            particles.forEach((otherParticle, j) => {
              if (i !== j) {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                  ctx.beginPath();
                  ctx.moveTo(particle.x, particle.y);
                  ctx.lineTo(otherParticle.x, otherParticle.y);
                  ctx.strokeStyle = `rgba(147, 51, 234, ${0.1 * (1 - distance / 100)})`;
                  ctx.lineWidth = 0.5;
                  ctx.stroke();
                }
              }
            });
          }
        });

        requestAnimationFrame(animate);
      };

      animate();

      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }
  }, [variant, intensity]);

  const getBackgroundClasses = () => {
    const baseClasses = "fixed inset-0 -z-10 overflow-hidden";
    
    switch (variant) {
      case 'gradient':
        return cn(
          baseClasses,
          intensity === 'subtle' && "bg-gradient-to-br from-background via-background to-primary/5",
          intensity === 'medium' && "bg-gradient-to-br from-background via-primary/5 to-accent/10",
          intensity === 'intense' && "bg-gradient-to-br from-primary/10 via-accent/15 to-secondary/10"
        );
      
      case 'waves':
        return cn(baseClasses, "bg-gradient-to-br from-background via-blue-500/5 to-purple-500/10");
      
      case 'aurora':
        return cn(baseClasses, "bg-gradient-to-br from-background via-green-400/5 to-blue-600/10");
      
      default:
        return cn(baseClasses, "bg-background");
    }
  };

  const WavesPattern = () => (
    <div className="absolute inset-0">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(147, 51, 234, 0.1)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.1)" />
            <stop offset="100%" stopColor="rgba(147, 51, 234, 0.1)" />
          </linearGradient>
        </defs>
        
        <motion.path
          d="M0,400 Q300,300 600,400 T1200,400 V800 H0 Z"
          fill="url(#waveGradient)"
          initial={{ d: "M0,400 Q300,300 600,400 T1200,400 V800 H0 Z" }}
          animate={{ 
            d: [
              "M0,400 Q300,300 600,400 T1200,400 V800 H0 Z",
              "M0,400 Q300,350 600,300 T1200,400 V800 H0 Z",
              "M0,400 Q300,300 600,400 T1200,400 V800 H0 Z"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.path
          d="M0,500 Q400,400 800,500 T1200,500 V800 H0 Z"
          fill="rgba(59, 130, 246, 0.05)"
          initial={{ d: "M0,500 Q400,400 800,500 T1200,500 V800 H0 Z" }}
          animate={{ 
            d: [
              "M0,500 Q400,400 800,500 T1200,500 V800 H0 Z",
              "M0,500 Q400,450 800,400 T1200,500 V800 H0 Z",
              "M0,500 Q400,400 800,500 T1200,500 V800 H0 Z"
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </svg>
    </div>
  );

  const AuroraPattern = () => (
    <div className="absolute inset-0">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-blue-500/10 to-purple-600/10"
        animate={{
          background: [
            "linear-gradient(45deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))",
            "linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1))",
            "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), rgba(34, 197, 94, 0.1))",
            "linear-gradient(45deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))"
          ]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Rayons d'aurore */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"
          style={{ left: `${15 + i * 15}%` }}
          animate={{
            opacity: [0, 0.5, 0],
            scaleY: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  return (
    <div className={cn(getBackgroundClasses(), className)}>
      {/* Canvas pour particules et neural */}
      {(variant === 'particles' || variant === 'neural') && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
      )}
      
      {/* Patterns spéciaux */}
      {variant === 'waves' && <WavesPattern />}
      {variant === 'aurora' && <AuroraPattern />}
      
      {/* Overlay de texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:20px_20px] opacity-30" />
      
      {/* Contenu */}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
};

export default PremiumBackground;