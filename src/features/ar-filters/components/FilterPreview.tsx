/**
 * Preview du filtre AR actif
 * Simule l'affichage de la caméra avec le filtre appliqué
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { ARFilter } from '../index';
import { cn } from '@/lib/utils';

interface FilterPreviewProps {
  filter: ARFilter;
  className?: string;
}

const FILTER_GRADIENTS: Record<string, string> = {
  'mood-aura': 'from-blue-500/20 via-purple-500/10 to-transparent',
  'emotion-mask': 'from-pink-500/20 via-red-500/10 to-transparent',
  'zen-particles': 'from-green-500/20 via-teal-500/10 to-transparent',
  'nature-overlay': 'from-green-600/20 via-lime-500/10 to-transparent',
  'dream-filter': 'from-indigo-500/30 via-purple-500/20 to-blue-500/10',
  'energy-flow': 'from-orange-500/20 via-yellow-500/10 to-transparent',
};

export function FilterPreview({ filter, className }: FilterPreviewProps) {
  const gradient = FILTER_GRADIENTS[filter.type] || FILTER_GRADIENTS['mood-aura'];

  return (
    <div
      className={cn(
        'relative aspect-[3/4] w-full max-w-sm mx-auto rounded-2xl overflow-hidden bg-slate-800/50',
        className
      )}
    >
      {/* Simulated camera feed background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-700/30 to-slate-900/50" />

      {/* Filter overlay */}
      <motion.div
        className={cn('absolute inset-0 bg-gradient-radial', gradient)}
        animate={{
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Animated particles for certain filters */}
      {(filter.type === 'zen-particles' || filter.type === 'energy-flow') && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                'absolute w-2 h-2 rounded-full',
                filter.type === 'zen-particles' ? 'bg-green-400/60' : 'bg-orange-400/60'
              )}
              initial={{
                x: Math.random() * 100 + '%',
                y: '110%',
                opacity: 0,
              }}
              animate={{
                y: '-10%',
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}

      {/* Aura effect for mood-aura */}
      {filter.type === 'mood-aura' && (
        <motion.div
          className="absolute inset-8 rounded-full bg-gradient-radial from-blue-400/30 via-purple-500/20 to-transparent blur-xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Dream filter effect */}
      {filter.type === 'dream-filter' && (
        <>
          <motion.div
            className="absolute inset-0 bg-indigo-500/10"
            animate={{
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <div className="absolute inset-0 backdrop-blur-[1px]" />
        </>
      )}

      {/* Camera icon placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-muted-foreground/30 text-center">
          <div className="text-4xl mb-2">📷</div>
          <p className="text-xs">Aperçu caméra</p>
        </div>
      </div>

      {/* Filter name badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <motion.div
          className="bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {filter.name}
        </motion.div>
      </div>
    </div>
  );
}
