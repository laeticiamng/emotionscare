import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CosmicBreathingOrbProps {
  phase: 'inhale' | 'hold' | 'exhale' | 'idle';
  phaseTimer: number;
  maxTime: number;
  isActive: boolean;
  className?: string;
}

export const CosmicBreathingOrb: React.FC<CosmicBreathingOrbProps> = ({
  phase,
  phaseTimer,
  maxTime,
  isActive,
  className = ""
}) => {
  const getPhaseColors = () => {
    switch (phase) {
      case 'inhale': return 'from-blue-400 via-cyan-300 to-white';
      case 'hold': return 'from-purple-400 via-indigo-300 to-blue-200';
      case 'exhale': return 'from-green-400 via-teal-300 to-blue-200';
      default: return 'from-gray-400 via-gray-300 to-gray-200';
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Inspire avec les étoiles';
      case 'hold': return 'Retiens le cosmos';
      case 'exhale': return 'Expire vers l\'infini';
      default: return 'Prépare-toi';
    }
  };

  const orbScale = () => {
    if (!isActive) return 1;
    switch (phase) {
      case 'inhale': return 1.4;
      case 'hold': return 1.3;
      case 'exhale': return 0.9;
      default: return 1;
    }
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Constellation particles - Reduced */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-ping"
            style={{
              left: `${25 + (i * 8) % 50}%`,
              top: `${25 + (i * 12) % 50}%`,
              opacity: isActive ? 0.6 : 0.3,
              animationDelay: `${i * 0.3}s`,
              animationDuration: '2s',
            }}
          />
        ))}
      </div>

      {/* Main cosmic orb */}
      <motion.div
        className={cn(
          "relative w-80 h-80 rounded-full flex items-center justify-center",
          "bg-gradient-radial shadow-2xl border-2 border-white/20",
          getPhaseColors()
        )}
        animate={{
          scale: orbScale(),
        }}
        transition={{
          duration: maxTime,
          ease: "easeInOut"
        }}
      >
        {/* Inner glow - Static */}
        <div className="absolute inset-4 rounded-full bg-white/20 backdrop-blur-sm opacity-60" />

        {/* Content */}
        <div className="relative z-10 text-center text-white">
          <div className="text-xl font-light mb-4 tracking-wide opacity-90">
            {getPhaseText()}
          </div>
          
          <div className="text-6xl font-mono font-bold mb-2">
            {phaseTimer}
          </div>
          
          <div className="text-sm opacity-80 tracking-widest uppercase">
            {phase === 'idle' ? 'Cosmos' : 'Étoiles'}
          </div>
        </div>

        {/* Cosmic ring - Single simplified */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full border border-white/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.2, 0.6]
            }}
            transition={{
              duration: maxTime,
              repeat: Infinity,
            }}
          />
        )}
      </motion.div>
    </div>
  );
};