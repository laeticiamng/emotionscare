// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Universe } from '@/types/universes';
import { Card } from '@/components/ui/card';

interface UniversePortalProps {
  universe: Universe;
  isEntering: boolean;
  onEnterComplete: () => void;
  children: React.ReactNode;
  className?: string;
}

export const UniversePortal: React.FC<UniversePortalProps> = ({
  universe,
  isEntering,
  onEnterComplete,
  children,
  className = ""
}) => {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'open'>('closed');

  useEffect(() => {
    if (isEntering) {
      setPhase('opening');
      setTimeout(() => {
        setPhase('open');
        onEnterComplete();
      }, 800);
    }
  }, [isEntering, onEnterComplete]);

  const getPortalStyle = () => {
    const baseStyle = {
      background: universe.ambiance.colors.background,
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
    };

    switch (phase) {
      case 'closed':
        return {
          ...baseStyle,
          opacity: 0,
          transform: 'scale(0.8) rotateY(-15deg)',
          filter: 'blur(10px)'
        };
      case 'opening':
        return {
          ...baseStyle,
          opacity: 0.7,
          transform: 'scale(0.95) rotateY(-5deg)',
          filter: 'blur(2px)'
        };
      case 'open':
        return {
          ...baseStyle,
          opacity: 1,
          transform: 'scale(1) rotateY(0deg)',
          filter: 'blur(0px)'
        };
    }
  };

  return (
    <div 
      className={`min-h-screen relative overflow-hidden ${className}`}
      style={getPortalStyle()}
    >
      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-pulse"
            style={{
              background: `radial-gradient(circle, ${universe.ambiance.colors.accent}, transparent)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Universe title overlay */}
      {phase === 'opening' && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Card className="p-6 bg-card/90 backdrop-blur-md border-0 shadow-elegant animate-fade-in">
            <h2 className="text-2xl font-light text-center text-foreground mb-2">
              {universe.name}
            </h2>
            <p className="text-muted-foreground text-center text-sm">
              {universe.ambiance.metaphor}
            </p>
          </Card>
        </div>
      )}

      {/* Main content */}
      <div 
        className={`relative z-20 transition-opacity duration-500 ${
          phase === 'open' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {children}
      </div>

      {/* Ambient glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${universe.ambiance.colors.primary}20, transparent 70%)`
        }}
      />
    </div>
  );
};