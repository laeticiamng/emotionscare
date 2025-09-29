
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface AnimatedButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  pulseEffect?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className,
  isLoading,
  loadingText,
  pulseEffect = true,
  disabled,
  ...props
}) => {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      whileHover={pulseEffect ? { scale: 1.01, boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)' } : {}}
      className="w-full"
    >
      <Button
        className={cn('relative overflow-hidden transition-all duration-300', className)}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-primary/10">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            {loadingText || 'Chargement...'}
          </span>
        )}
        <span className={cn(isLoading ? 'opacity-0' : 'opacity-100')}>
          {children}
        </span>
      </Button>
    </motion.div>
  );
};

export default AnimatedButton;
