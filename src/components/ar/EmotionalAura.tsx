/**
 * Emotional Aura - Phase 4.5
 * Visualize emotional state as an immersive AR aura
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Heart, X } from 'lucide-react';
import { useAR } from '@/contexts/ARContext';
import { useEmotionalAura } from '@/hooks/useARCore';
import { EmotionData } from '@/services/arService';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';

export interface EmotionalAuraProps {
  userId: string | undefined;
  emotionScores: EmotionData;
  onClose?: () => void;
  className?: string;
}

export function EmotionalAura({
  userId,
  emotionScores,
  onClose,
  className
}: EmotionalAuraProps) {
  const { setAura, arMode } = useAR();
  const { aura, generateAura, loading } = useEmotionalAura(userId);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    hue: number;
    life: number;
    maxLife: number;
  }

  // Generate aura on mount
  useEffect(() => {
    const loadAura = async () => {
      if (userId) {
        const newAura = await generateAura(emotionScores);
        if (newAura) {
          setAura(newAura);
        }
      }
    };

    loadAura();
  }, [userId, emotionScores, generateAura, setAura]);

  // Initialize canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !aura) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();

    // Create initial particles
    const createParticles = () => {
      particlesRef.current = [];
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const particleCount = Math.floor(50 * (aura.intensity / 5));

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.random() * Math.PI * 2);
        const distance = 50 + Math.random() * 150;
        const speed = 0.5 + Math.random() * 1.5;

        particlesRef.current.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2 + Math.random() * 6,
          opacity: Math.random() * 0.6 + 0.4,
          hue: Math.random() * 30, // Variation autour de la couleur de base
          life: 0,
          maxLife: 2 + Math.random() * 3
        });
      }
    };

    createParticles();

    // Animation loop
    const animate = () => {
      timeRef.current += 0.016; // ~60fps

      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw aura circle
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200);
      gradient.addColorStop(0, aura.colorRGB + '40');
      gradient.addColorStop(0.5, aura.colorRGB + '20');
      gradient.addColorStop(1, aura.colorRGB + '00');

      ctx.fillStyle = gradient;
      const auraRadius = 150 * aura.sizeMultiplier * (0.9 + Math.sin(timeRef.current) * 0.1);
      ctx.beginPath();
      ctx.arc(centerX, centerY, auraRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw center circle
      ctx.fillStyle = aura.colorRGB;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Update and draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.life += 0.016;

        if (p.life > p.maxLife) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        // Physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // Gravity

        // Fade out
        p.opacity = (1 - p.life / p.maxLife) * 0.6;

        // Draw particle
        ctx.fillStyle = aura.colorRGB;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      // Spawn new particles
      if (Math.random() < 0.3) {
        const angle = (Math.random() * Math.PI * 2);
        const distance = 100 + Math.random() * 150;
        const speed = 0.5 + Math.random() * 1;

        particlesRef.current.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2 + Math.random() * 5,
          opacity: 0.4 + Math.random() * 0.4,
          hue: Math.random() * 30,
          life: 0,
          maxLife: 2 + Math.random() * 3
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [aura]);

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center h-full bg-gradient-to-b from-gray-900 to-black', className)}>
        <div className="text-center text-white">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-lg font-semibold">Création de votre aura...</p>
        </div>
      </div>
    );
  }

  if (!aura) {
    return (
      <div className={cn('flex items-center justify-center h-full bg-gradient-to-b from-gray-900 to-black', className)}>
        <div className="text-center text-white">
          <p className="text-lg font-semibold">Impossible de charger l'aura</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative w-full h-full overflow-hidden bg-black', className)}>
      {/* Canvas for particle animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col">
        {/* Top bar */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-white">
              <Heart className="w-6 h-6 fill-current" style={{ color: aura.colorRGB }} />
              <div>
                <h2 className="text-xl font-bold">Votre Aura</h2>
                <p className="text-sm text-gray-300 capitalize">{aura.dominantEmotion}</p>
              </div>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="pointer-events-auto p-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-lg transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Bottom stats */}
        <div className="mt-auto p-6">
          <div className="bg-black bg-opacity-60 rounded-lg p-4 max-w-sm">
            <h3 className="text-white font-semibold mb-3">États émotionnels</h3>
            <div className="space-y-2">
              {Object.entries(aura.emotionScores).map(([emotion, score]) => (
                <div key={emotion} className="flex items-center gap-2">
                  <div className="w-24 text-white text-sm font-medium capitalize">
                    {emotion}
                  </div>
                  <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r"
                      style={{
                        width: `${(score / 100) * 100}%`,
                        backgroundImage: `linear-gradient(to right, ${aura.colorRGB}, #ff00ff)`
                      }}
                    />
                  </div>
                  <div className="w-8 text-right text-gray-300 text-xs">
                    {Math.round(score)}%
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-600">
              <p className="text-gray-300 text-xs">
                Intensité: {aura.intensity}/5
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
