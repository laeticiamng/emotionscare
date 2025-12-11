import React from 'react';
import { Button, ButtonProps } from './ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type PastelVariant = 'pink-blue' | 'mint-teal' | 'peach-coral' | 'lavender-purple' | 'sky-indigo' | 'rose-amber';
type PastelSize = 'sm' | 'md' | 'lg' | 'xl';

interface PastelButtonProps extends Omit<ButtonProps, 'variant' | 'size'> {
  pastelVariant?: PastelVariant;
  size?: PastelSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  pulse?: boolean;
  glow?: boolean;
}

const PASTEL_VARIANTS: Record<PastelVariant, {
  gradient: string;
  hoverGradient: string;
  text: string;
  shadow: string;
}> = {
  'pink-blue': {
    gradient: 'bg-gradient-to-r from-pink-200 to-blue-200',
    hoverGradient: 'hover:from-pink-300 hover:to-blue-300',
    text: 'text-slate-700 dark:text-slate-800',
    shadow: 'shadow-pink-200/50',
  },
  'mint-teal': {
    gradient: 'bg-gradient-to-r from-emerald-200 to-teal-200',
    hoverGradient: 'hover:from-emerald-300 hover:to-teal-300',
    text: 'text-slate-700 dark:text-slate-800',
    shadow: 'shadow-emerald-200/50',
  },
  'peach-coral': {
    gradient: 'bg-gradient-to-r from-orange-200 to-rose-200',
    hoverGradient: 'hover:from-orange-300 hover:to-rose-300',
    text: 'text-slate-700 dark:text-slate-800',
    shadow: 'shadow-orange-200/50',
  },
  'lavender-purple': {
    gradient: 'bg-gradient-to-r from-violet-200 to-purple-200',
    hoverGradient: 'hover:from-violet-300 hover:to-purple-300',
    text: 'text-slate-700 dark:text-slate-800',
    shadow: 'shadow-violet-200/50',
  },
  'sky-indigo': {
    gradient: 'bg-gradient-to-r from-sky-200 to-indigo-200',
    hoverGradient: 'hover:from-sky-300 hover:to-indigo-300',
    text: 'text-slate-700 dark:text-slate-800',
    shadow: 'shadow-sky-200/50',
  },
  'rose-amber': {
    gradient: 'bg-gradient-to-r from-rose-200 to-amber-200',
    hoverGradient: 'hover:from-rose-300 hover:to-amber-300',
    text: 'text-slate-700 dark:text-slate-800',
    shadow: 'shadow-rose-200/50',
  },
};

const SIZE_CLASSES: Record<PastelSize, string> = {
  sm: 'h-8 px-3 text-xs rounded-md',
  md: 'h-10 px-4 text-sm rounded-lg',
  lg: 'h-12 px-6 text-base rounded-lg',
  xl: 'h-14 px-8 text-lg rounded-xl',
};

const ICON_SIZES: Record<PastelSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
  xl: 'h-6 w-6',
};

export const PastelButton: React.FC<PastelButtonProps> = ({
  pastelVariant = 'pink-blue',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  pulse = false,
  glow = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const variant = PASTEL_VARIANTS[pastelVariant];

  return (
    <Button
      className={cn(
        // Base styles
        'relative font-medium transition-all duration-300 ease-out',
        'border-0 outline-none',
        
        // Gradient
        variant.gradient,
        variant.hoverGradient,
        variant.text,
        
        // Size
        SIZE_CLASSES[size],
        
        // Effects
        'hover:scale-[1.02] active:scale-[0.98]',
        glow && `shadow-lg ${variant.shadow} hover:shadow-xl`,
        pulse && 'animate-pulse',
        
        // Disabled state
        (disabled || loading) && 'opacity-60 cursor-not-allowed hover:scale-100',
        
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <Loader2 className={cn(
          'animate-spin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
          ICON_SIZES[size]
        )} />
      )}
      
      {/* Content wrapper */}
      <span className={cn(
        'inline-flex items-center gap-2',
        loading && 'opacity-0'
      )}>
        {/* Left icon */}
        {icon && iconPosition === 'left' && (
          <span className={ICON_SIZES[size]}>{icon}</span>
        )}
        
        {/* Text */}
        {children}
        
        {/* Right icon */}
        {icon && iconPosition === 'right' && (
          <span className={ICON_SIZES[size]}>{icon}</span>
        )}
      </span>

      {/* Shine effect on hover */}
      <span className={cn(
        'absolute inset-0 overflow-hidden rounded-inherit',
        'before:absolute before:inset-0',
        'before:translate-x-[-100%] hover:before:translate-x-[100%]',
        'before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent',
        'before:transition-transform before:duration-700 before:ease-out',
        'pointer-events-none'
      )} />
    </Button>
  );
};

// Preset variants for convenience
export const PinkBlueButton: React.FC<Omit<PastelButtonProps, 'pastelVariant'>> = (props) => (
  <PastelButton pastelVariant="pink-blue" {...props} />
);

export const MintTealButton: React.FC<Omit<PastelButtonProps, 'pastelVariant'>> = (props) => (
  <PastelButton pastelVariant="mint-teal" {...props} />
);

export const PeachCoralButton: React.FC<Omit<PastelButtonProps, 'pastelVariant'>> = (props) => (
  <PastelButton pastelVariant="peach-coral" {...props} />
);

export const LavenderPurpleButton: React.FC<Omit<PastelButtonProps, 'pastelVariant'>> = (props) => (
  <PastelButton pastelVariant="lavender-purple" {...props} />
);

export const SkyIndigoButton: React.FC<Omit<PastelButtonProps, 'pastelVariant'>> = (props) => (
  <PastelButton pastelVariant="sky-indigo" {...props} />
);

export const RoseAmberButton: React.FC<Omit<PastelButtonProps, 'pastelVariant'>> = (props) => (
  <PastelButton pastelVariant="rose-amber" {...props} />
);

export default PastelButton;
