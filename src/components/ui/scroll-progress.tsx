
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScrollProgressProps {
  color?: string;
  height?: number;
  className?: string;
}

const ScrollProgress: React.FC<ScrollProgressProps> = ({
  color = 'primary',
  height = 2,
  className = ''
}) => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <motion.div
      className={cn(
        'fixed top-0 left-0 z-50 bg-primary origin-left',
        className
      )}
      style={{ 
        height: `${height}px`,
        width: `${progress}%`
      }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: progress / 100 }}
      transition={{ duration: 0.1 }}
    />
  );
};

export default ScrollProgress;
