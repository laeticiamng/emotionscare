/**
 * Card3D — Premium floating card with 3D elevation
 * Multi-layer shadows, catch light, smooth hover lift
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import '@/styles/premium-3d-player.css';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  as?: 'div' | 'article' | 'section';
  elevation?: 'low' | 'medium' | 'high';
  hoverLift?: boolean;
  animate?: boolean;
}

const Card3D: React.FC<Card3DProps> = ({
  children,
  className,
  onClick,
  as: Tag = 'div',
  elevation = 'medium',
  hoverLift = true,
  animate = true,
}) => {
  const elevationClass = {
    low: 'shadow-sm',
    medium: '',
    high: 'shadow-xl',
  }[elevation];

  const Component = animate ? motion[Tag] : Tag;

  const props = animate
    ? {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
      }
    : {};

  return (
    <Component
      className={cn(
        'card-3d-elevated',
        elevationClass,
        hoverLift && 'cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
};

export default memo(Card3D);
