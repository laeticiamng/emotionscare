/**
 * ScrollProgress - Indicateur de progression du scroll
 */

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScrollProgressProps {
  className?: string;
  variant?: 'bar' | 'circle' | 'dots';
  color?: string;
}

const ScrollProgress: React.FC<ScrollProgressProps> = ({
  className,
  variant = 'bar',
  color = 'bg-primary',
}) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setProgress(Math.round(latest * 100));
    });
  }, [scrollYProgress]);

  if (variant === 'circle') {
    const circumference = 2 * Math.PI * 18;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: progress > 5 ? 1 : 0 }}
        className={cn('fixed bottom-6 left-6 z-40', className)}
      >
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 transform -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="18"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-muted"
            />
            <motion.circle
              cx="24"
              cy="24"
              r="18"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-primary"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-foreground">
            {progress}%
          </span>
        </div>
      </motion.div>
    );
  }

  if (variant === 'dots') {
    const sections = 5;
    const activeSections = Math.ceil((progress / 100) * sections);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: progress > 5 ? 1 : 0 }}
        className={cn('fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2', className)}
      >
        {Array.from({ length: sections }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ scale: 1 }}
            animate={{
              scale: index < activeSections ? 1.2 : 1,
            }}
            className={cn(
              'w-2 h-2 rounded-full transition-colors',
              index < activeSections ? 'bg-primary' : 'bg-muted'
            )}
          />
        ))}
      </motion.div>
    );
  }

  // Bar variant (default)
  return (
    <motion.div
      className={cn(
        'fixed top-0 left-0 right-0 h-1 z-50 origin-left',
        color,
        className
      )}
      style={{ scaleX }}
    />
  );
};

export default ScrollProgress;
