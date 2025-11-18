// @ts-nocheck

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface FloatingActionButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  ariaLabel: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon: Icon,
  onClick,
  className = '',
  variant = 'primary',
  ariaLabel
}) => {
  const variantStyles = {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
    secondary: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
  };

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: 180 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={className}
    >
      <Button
        size="icon"
        onClick={onClick}
        className={`w-14 h-14 rounded-full shadow-2xl border-0 text-white ${variantStyles[variant]} hover:shadow-3xl transition-all duration-300`}
        aria-label={ariaLabel}
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <Icon className="h-6 w-6" />
        </motion.div>
      </Button>
    </motion.div>
  );
};

export default FloatingActionButton;
