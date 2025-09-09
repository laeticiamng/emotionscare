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

      {/* Floating stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: isActive ? [0.3, 1, 0.3] : [0.2, 0.6, 0.2],
              scale: isActive ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Nebula clouds */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 5 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: `${200 + Math.random() * 300}px`,
              height: `${200 + Math.random() * 300}px`,
              left: `${Math.random() * 80}%`,
              top: `${Math.random() * 80}%`,
              background: `radial-gradient(circle, ${getNebulaColor()}40, transparent)`
            }}
            animate={{
              opacity: isActive ? [0.1, 0.4, 0.1] : 0.2,
              scale: isActive ? [1, 1.1, 1] : 1,
              x: [0, 10, 0],
              y: [0, -5, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Shooting stars */}
      {isActive && (
        <div className="absolute inset-0">
          {Array.from({ length: 3 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"
              style={{
                width: '100px',
                top: `${20 + Math.random() * 60}%`,
                left: '-100px',
              }}
              animate={{
                x: ['0vw', '120vw'],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 3 + Math.random() * 2,
                repeat: Infinity,
                repeatDelay: 10,
              }}
            />
          ))}
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