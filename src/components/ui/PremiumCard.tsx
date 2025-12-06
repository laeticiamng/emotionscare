import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  delay?: number;
  asChild?: boolean;
}

const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(({
  children,
  className,
  hover = true,
  gradient = false,
  delay = 0,
  asChild = false,
  ...props
}, ref) => {
  const Component = asChild ? 'div' : motion.div;
  
  const motionProps = asChild ? {} : {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { 
      duration: 0.6, 
      delay: delay,
      ease: [0.4, 0, 0.2, 1]
    },
    whileHover: hover ? { 
      y: -8, 
      scale: 1.02,
      transition: { duration: 0.3 }
    } : undefined
  };

  return (
    <Component
      ref={ref}
      {...motionProps}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl transition-all duration-500",
        gradient ? "bg-gradient-to-br from-white/95 via-white/90 to-white/85 dark:from-gray-900/95 dark:via-gray-900/90 dark:to-gray-900/85" : "bg-white/90 dark:bg-gray-900/90",
        hover && "hover:shadow-3xl cursor-pointer group",
        className
      )}
      {...props}
    >
      {/* Subtle gradient overlay */}
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/20 dark:from-blue-900/10 dark:via-purple-900/5 dark:to-pink-900/5" />
      )}
      
      {/* Shine effect on hover */}
      {hover && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      )}
      
      <div className="relative z-10 p-8">
        {children}
      </div>
    </Component>
  );
});

PremiumCard.displayName = "PremiumCard";

export default PremiumCard;
