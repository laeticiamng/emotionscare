import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScrollProgressProps {
  className?: string;
  color?: string;
  height?: number;
}

const ScrollProgress: React.FC<ScrollProgressProps> = ({ 
  className = "", 
  color = "primary", 
  height = 2
}) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  return (
    <motion.div
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] origin-left",
        `bg-${color}`,
        className
      )}
      style={{ 
        scaleX, 
        height: `${height}px`
      }}
    />
  );
};

export default ScrollProgress;
