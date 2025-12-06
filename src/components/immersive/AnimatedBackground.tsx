// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';
import type { Theme } from '@/types/theme';

interface AnimatedBackgroundProps {
  interactive?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  type?: 'particles' | 'waves' | 'gradient';
  className?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  interactive = true,
  intensity = 'medium',
  type = 'particles',
  className = ''
}) => {
  const { theme } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });
  
  // Set intensity factor
  const intensityFactor = intensity === 'low' ? 0.5 : intensity === 'high' ? 2 : 1;
  
  // Update window size on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle mouse movement for interactive backgrounds
  useEffect(() => {
    if (!interactive) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / windowSize.width,
        y: e.clientY / windowSize.height
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive, windowSize]);
  
  // Generate particles based on screen size and intensity
  const generateParticles = () => {
    const particleCount = Math.floor((windowSize.width * windowSize.height) / 25000 * intensityFactor);
    return Array.from({ length: particleCount }).map((_, index) => {
      const size = Math.random() * 4 + 2;
      return (
        <motion.div
          key={index}
          className={`absolute rounded-full ${
            theme === 'dark' ? 'bg-blue-400/30' : 'bg-blue-500/20'
          }`}
          style={{
            width: size,
            height: size,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      );
    });
  };
  
  // Render wave background
  const renderWaves = () => {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <svg 
          className="absolute w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 320"
        >
          <motion.path 
            fill={theme === 'dark' ? '#4C6EF5' : '#3B82F6'}
            fillOpacity="0.3"
            d="M0,128L48,138.7C96,149,192,171,288,181.3C384,192,480,192,576,165.3C672,139,768,85,864,90.7C960,96,1056,160,1152,186.7C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            animate={{
              d: [
                "M0,128L48,138.7C96,149,192,171,288,181.3C384,192,480,192,576,165.3C672,139,768,85,864,90.7C960,96,1056,160,1152,186.7C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,192L48,181.3C96,171,192,149,288,149.3C384,149,480,171,576,165.3C672,160,768,128,864,128C960,128,1056,160,1152,192C1248,224,1344,256,1392,272L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,256L48,229.3C96,203,192,149,288,138.7C384,128,480,160,576,154.7C672,149,768,107,864,106.7C960,107,1056,149,1152,170.7C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ]
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 20,
              ease: "easeInOut"
            }}
          />
          <motion.path 
            fill={theme === 'dark' ? '#8B5CF6' : '#A78BFA'}
            fillOpacity="0.3"
            d="M0,256L48,261.3C96,267,192,277,288,272C384,267,480,245,576,213.3C672,181,768,139,864,154.7C960,171,1056,245,1152,240C1248,235,1344,149,1392,106.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            animate={{
              d: [
                "M0,256L48,261.3C96,267,192,277,288,272C384,267,480,245,576,213.3C672,181,768,139,864,154.7C960,171,1056,245,1152,240C1248,235,1344,149,1392,106.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,160L48,170.7C96,181,192,203,288,208C384,213,480,203,576,181.3C672,160,768,128,864,144C960,160,1056,224,1152,234.7C1248,245,1344,203,1392,181.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,96L48,128C96,160,192,224,288,224C384,224,480,160,576,165.3C672,171,768,245,864,250.7C960,256,1056,192,1152,149.3C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ]
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 25,
              ease: "easeInOut"
            }}
          />
        </svg>
      </div>
    );
  };

  // Render gradient background
  const renderGradient = () => {
    const themePalette = {
      light: ['from-blue-100', 'to-purple-100'],
      dark: ['from-blue-900/30', 'to-purple-900/30'],
      pastel: ['from-blue-100/70', 'to-purple-100/70'],
      system: window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? ['from-blue-900/30', 'to-purple-900/30'] 
        : ['from-blue-100', 'to-purple-100']
    };
    
    const colors = themePalette[theme as keyof typeof themePalette] || themePalette.light;
    
    return (
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-br ${colors[0]} ${colors[1]}`}
        animate={{
          backgroundPosition: interactive 
            ? [
                '0% 0%',
                `${50 + mousePosition.x * 50}% ${50 + mousePosition.y * 50}%`,
              ]
            : ['0% 0%', '100% 100%', '0% 0%']
        }}
        transition={{
          duration: interactive ? 2 : 20,
          ease: "easeInOut",
          repeat: interactive ? 0 : Infinity
        }}
        style={{ backgroundSize: '200% 200%' }}
      />
    );
  };
  
  // Render appropriate background type
  const renderBackground = () => {
    switch (type) {
      case 'particles':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {generateParticles()}
          </div>
        );
      case 'waves':
        return renderWaves();
      case 'gradient':
      default:
        return renderGradient();
    }
  };
  
  return (
    <div className={`absolute inset-0 -z-10 pointer-events-none ${className}`}>
      {renderBackground()}
    </div>
  );
};

export default AnimatedBackground;
