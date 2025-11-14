/**
 * Interactive Bubbles - Phase 4.5
 * Interactive floating bubbles with gratitude affirmations
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useAR } from '@/contexts/ARContext';
import { useARBubbles } from '@/hooks/useARCore';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';

export interface InteractivebubblesProps {
  userId: string | undefined;
  affirmations?: string[];
  onClose?: () => void;
  className?: string;
}

interface Bubble {
  id: string;
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
  affirmation: string;
  isPopping: boolean;
  popProgress: number;
}

const defaultAffirmations = [
  'Je suis gratuit',
  'Je m\'aime',
  'Je suis courageux',
  'Je suis capable',
  'Je suis digne',
  'Je suis fort',
  'Je suis créatif',
  'Je suis intelligent',
  'Je suis aimé',
  'Je suis paisible'
];

export function InteractiveBubbles({
  userId,
  affirmations = defaultAffirmations,
  onClose,
  className
}: InteractivebubblesProps) {
  const { setBubblesScore, bubblesScore } = useAR();
  const { popBubble, score, popCount, resetScore } = useARBubbles(userId);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const animationRef = useRef<number>();
  const nextIdRef = useRef(0);

  // Initialize bubbles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const createBubbles = () => {
      bubblesRef.current = [];
      const bubbleCount = 15;
      const colors = [
        '#FF69B4', // Hot pink
        '#FFD700', // Gold
        '#87CEEB', // Sky blue
        '#00CED1', // Dark turquoise
        '#FF6B6B', // Red
        '#4ECDC4', // Teal
        '#45B7D1', // Blue
        '#F06292'  // Pink
      ];

      for (let i = 0; i < bubbleCount; i++) {
        bubblesRef.current.push({
          id: `bubble-${nextIdRef.current++}`,
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 20 + Math.random() * 40,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 - 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          affirmation: affirmations[Math.floor(Math.random() * affirmations.length)],
          isPopping: false,
          popProgress: 0
        });
      }
    };

    createBubbles();

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();

    // Mouse/touch handler
    const handlePointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (const bubble of bubblesRef.current) {
        if (bubble.isPopping) continue;

        const dx = bubble.x - x;
        const dy = bubble.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < bubble.radius) {
          bubble.isPopping = true;
          popBubble(bubble.id, Math.floor(bubble.radius / 10) * 10);
          logger.info('Bubble popped', { affirmation: bubble.affirmation }, 'AR');
        }
      }
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('resize', updateCanvasSize);

    // Animation loop
    const animate = () => {
      if (!canvasRef.current) return;

      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      // Clear
      ctx.fillStyle = 'rgba(10, 10, 20, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw bubbles
      for (let i = bubblesRef.current.length - 1; i >= 0; i--) {
        const bubble = bubblesRef.current[i];

        if (bubble.isPopping) {
          bubble.popProgress += 0.05;

          if (bubble.popProgress >= 1) {
            // Create new bubble
            const colors = [
              '#FF69B4',
              '#FFD700',
              '#87CEEB',
              '#00CED1',
              '#FF6B6B',
              '#4ECDC4',
              '#45B7D1',
              '#F06292'
            ];

            const newBubble: Bubble = {
              id: `bubble-${nextIdRef.current++}`,
              x: Math.random() * canvas.width,
              y: canvas.height,
              radius: 20 + Math.random() * 40,
              vx: (Math.random() - 0.5) * 2,
              vy: -1 - Math.random() * 1,
              color: colors[Math.floor(Math.random() * colors.length)],
              affirmation: affirmations[Math.floor(Math.random() * affirmations.length)],
              isPopping: false,
              popProgress: 0
            };

            bubblesRef.current[i] = newBubble;
          } else {
            // Draw pop effect
            ctx.strokeStyle = bubble.color;
            ctx.lineWidth = 2 * (1 - bubble.popProgress);
            ctx.globalAlpha = 1 - bubble.popProgress;
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.radius * (1 + bubble.popProgress), 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
            continue;
          }
        }

        // Physics
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;
        bubble.vy -= 0.02; // Rising effect

        // Bounce off walls
        if (bubble.x - bubble.radius < 0) bubble.vx = Math.abs(bubble.vx);
        if (bubble.x + bubble.radius > canvas.width) bubble.vx = -Math.abs(bubble.vx);
        if (bubble.y - bubble.radius < 0) bubble.vy = Math.abs(bubble.vy);
        if (bubble.y + bubble.radius > canvas.height) {
          bubble.y = canvas.height - bubble.radius;
          bubble.vy = -Math.abs(bubble.vy) * 0.8;
        }

        // Draw bubble
        const gradient = ctx.createRadialGradient(
          bubble.x - bubble.radius * 0.3,
          bubble.y - bubble.radius * 0.3,
          0,
          bubble.x,
          bubble.y,
          bubble.radius
        );

        gradient.addColorStop(0, bubble.color + '60');
        gradient.addColorStop(0.7, bubble.color + '30');
        gradient.addColorStop(1, bubble.color + '00');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw border
        ctx.strokeStyle = bubble.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [affirmations, popBubble]);

  return (
    <div className={cn('relative w-full h-full overflow-hidden bg-gradient-to-b from-gray-900 to-black', className)}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-pointer"
      />

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col">
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <Sparkles className="w-6 h-6" />
            <h2 className="text-xl font-bold">Bulles Interactives</h2>
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

        {/* Stats bar */}
        <div className="p-4">
          <div className="flex items-center justify-between bg-black bg-opacity-60 rounded-lg p-4">
            <div className="text-center text-white">
              <div className="text-3xl font-bold text-indigo-400">{score}</div>
              <p className="text-xs text-gray-300">Points</p>
            </div>
            <div className="text-center text-white">
              <div className="text-3xl font-bold text-pink-400">{popCount}</div>
              <p className="text-xs text-gray-300">Bulles éclatées</p>
            </div>
            <div className="text-center text-white">
              <div className="text-sm font-semibold text-gray-300">Éclatez les bulles!</div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="px-6 py-2">
          <div className="bg-indigo-900 bg-opacity-60 rounded-lg p-3 text-center">
            <p className="text-indigo-200 text-sm">
              Cliquez sur les bulles pour les éclater et libérer les affirmations positives
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
