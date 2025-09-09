import React from 'react';
import { motion } from 'framer-motion';

interface CosmicBackgroundProps {
  phase: 'inhale' | 'hold' | 'exhale' | 'idle';
  isActive: boolean;
  className?: string;
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({
  phase,
  isActive,
  className = ""
}) => {
  const getNebulaColor = () => {
    switch (phase) {
      case 'inhale': return 'hsl(240, 80%, 60%)';  // Bleu cosmos
      case 'hold': return 'hsl(280, 70%, 50%)';    // Violet nébuleuse
      case 'exhale': return 'hsl(200, 60%, 40%)';  // Bleu profond
      default: return 'hsl(260, 60%, 30%)';        // Violet sombre
    }
  };

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Base cosmic background */}
      <motion.div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, ${getNebulaColor()}15 0%, ${getNebulaColor()}08 30%, hsl(240, 30%, 5%) 70%, hsl(0, 0%, 2%) 100%)`
        }}
        animate={{
          background: `radial-gradient(ellipse at center, ${getNebulaColor()}15 0%, ${getNebulaColor()}08 30%, hsl(240, 30%, 5%) 70%, hsl(0, 0%, 2%) 100%)`
        }}
        transition={{ duration: 1 }}
      />

      {/* Floating stars - Optimized */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              left: `${(i * 7) % 100}%`,
              top: `${(i * 11) % 100}%`,
              opacity: isActive ? 0.8 : 0.4,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      {/* Nebula clouds - Static with CSS animation */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-3xl animate-pulse"
            style={{
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
              left: `${i * 30}%`,
              top: `${i * 25}%`,
              background: `radial-gradient(circle, ${getNebulaColor()}30, transparent)`,
              animationDuration: `${6 + i * 2}s`,
              animationDelay: `${i}s`,
            }}
          />
        ))}
      </div>

      {/* Shooting star - Single optimized */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
            style={{
              width: '120px',
              top: '40%',
              left: '-120px',
            }}
            animate={{
              x: ['0vw', '120vw'],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 8,
            }}
          />
        </div>
      )}

      {/* Breathing wave effect */}
      {isActive && (
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${getNebulaColor()}, transparent 70%)`
          }}
          animate={{
            scale: phase === 'inhale' ? [1, 1.3] : phase === 'exhale' ? [1.3, 1] : 1,
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: phase === 'hold' ? 0.5 : 4,
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  );
};