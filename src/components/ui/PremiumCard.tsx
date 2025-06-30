
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  delay?: number;
}

const PremiumCard: React.FC<PremiumCardProps> = ({
  children,
  className,
  hover = true,
  gradient = false,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: delay,
        ease: [0.4, 0, 0.2, 1]
      }}
      className={cn(
        "premium-card p-8 relative overflow-hidden",
        gradient && "bg-gradient-to-br from-white/90 via-white/80 to-white/70",
        hover && "hover:transform hover:-translate-y-2 cursor-pointer",
        "dark:from-gray-900/90 dark:via-gray-900/80 dark:to-gray-900/70",
        className
      )}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/20 dark:from-blue-900/10 dark:via-purple-900/5 dark:to-pink-900/5" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default PremiumCard;
