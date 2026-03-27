// @ts-nocheck
/**
 * PremiumLoader — Orbital loading indicator
 * Replaces generic spinners with a cinematic ring animation
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PremiumLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizes = {
  sm: { ring: 24, stroke: 2 },
  md: { ring: 40, stroke: 2.5 },
  lg: { ring: 56, stroke: 3 },
};

const PremiumLoader: React.FC<PremiumLoaderProps> = ({
  size = 'md',
  className,
  label,
}) => {
  const { ring, stroke } = sizes[size];
  const radius = (ring - stroke * 2) / 2;
  const circumference = radius * 2 * Math.PI;

  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-3', className)}
      role="status"
      aria-label={label || 'Chargement'}
    >
      <motion.svg
        width={ring}
        height={ring}
        viewBox={`0 0 ${ring} ${ring}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      >
        {/* Background ring */}
        <circle
          cx={ring / 2}
          cy={ring / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-muted-foreground/15"
        />
        {/* Active arc */}
        <circle
          cx={ring / 2}
          cy={ring / 2}
          r={radius}
          fill="none"
          stroke="url(#loader-gradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.3} ${circumference * 0.7}`}
          className="origin-center"
        />
        <defs>
          <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.2)" />
          </linearGradient>
        </defs>
      </motion.svg>

      {label && (
        <span className="text-sm text-muted-foreground font-medium animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
};

export default memo(PremiumLoader);
