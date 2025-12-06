
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  loading?: boolean;
  asChild?: boolean;
}

const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  className,
  asChild = false,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : 'button';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-900 text-white shadow-2xl border border-blue-500/20',
    secondary: 'bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 hover:from-gray-700 hover:via-gray-800 hover:to-gray-900 text-white shadow-2xl border border-gray-500/20',
    accent: 'bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 hover:from-orange-600 hover:via-pink-600 hover:to-red-600 text-white shadow-2xl border border-orange-400/20',
    ghost: 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white shadow-xl hover:shadow-2xl'
  };
  
  const sizes = {
    sm: 'px-6 py-3 text-sm font-semibold',
    md: 'px-8 py-4 text-base font-bold',
    lg: 'px-12 py-5 text-lg font-bold'
  };

  const ButtonComponent = (
    <Comp
      ref={ref}
      className={cn(
        variants[variant],
        sizes[size],
        'rounded-2xl transition-all duration-300 relative overflow-hidden',
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
        'before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
        'transform hover:scale-105 hover:-translate-y-1 active:scale-95',
        loading && 'cursor-not-allowed opacity-70',
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
          Chargement...
        </div>
      ) : (
        children
      )}
    </Comp>
  );

  if (asChild) {
    return ButtonComponent;
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {ButtonComponent}
    </motion.div>
  );
});

PremiumButton.displayName = "PremiumButton";

export default PremiumButton;
