// @ts-nocheck
/**
 * PREMIUM COMPONENTS LIBRARY
 * Composants haut de gamme avec accessibilité WCAG AAA et animations fluides
 */

import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useUnifiedStore, useUnifiedContext } from '@/core/UnifiedStateManager';
import { Loader2, CheckCircle, AlertCircle, Info, X } from 'lucide-react';

// ==================== BUTTON PREMIUM ====================

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'premium' | 'glass' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  pulse?: boolean;
  glow?: boolean;
}

export const PremiumButton = forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    loadingText,
    icon,
    iconPosition = 'left',
    pulse = false,
    glow = false,
    children,
    disabled,
    ...props
  }, ref) => {
    const { announceToScreenReader } = useUnifiedContext();
    
    const baseClasses = [
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
      'transition-all duration-300 focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none',
      'disabled:opacity-50 relative overflow-hidden group gpu-accelerated',
    ];
    
    const variants = {
      primary: [
        'bg-primary text-primary-foreground hover:bg-primary/90',
        'shadow-lg hover:shadow-xl active:scale-[0.98]',
      ],
      secondary: [
        'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        'border border-border shadow-sm hover:shadow-md',
      ],
      premium: [
        'bg-gradient-to-r from-primary via-purple-600 to-blue-600',
        'text-white shadow-premium hover:shadow-premium-lg',
        'hover:scale-105 active:scale-[0.98]',
        'after:absolute after:inset-0 after:bg-gradient-to-r',
        'after:from-white/20 after:via-transparent after:to-white/20',
        'after:translate-x-[-100%] hover:after:translate-x-[100%]',
        'after:transition-transform after:duration-700',
      ],
      glass: [
        'glass-effect text-foreground backdrop-blur-xl',
        'hover:glass-effect-strong shadow-lg hover:shadow-xl',
      ],
      ghost: [
        'hover:bg-accent hover:text-accent-foreground',
        'hover:shadow-md active:scale-[0.98]',
      ],
      danger: [
        'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        'shadow-lg hover:shadow-xl active:scale-[0.98]',
      ],
    };
    
    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
      xl: 'h-14 px-8 text-lg',
    };
    
    const pulseClass = pulse ? 'animate-pulse-glow' : '';
    const glowClass = glow ? 'shadow-glow hover:shadow-glow-lg' : '';
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading) return;
      
      // Feedback haptique sur mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      // Annonce pour les lecteurs d'écran
      if (loadingText && !loading) {
        announceToScreenReader(`Bouton activé: ${children || loadingText}`);
      }
      
      props.onClick?.(e);
    };
    
    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          pulseClass,
          glowClass,
          className
        )}
        disabled={disabled || loading}
        onClick={handleClick}
        aria-busy={loading}
        aria-live="polite"
        {...props}
      >
        {/* Loading state */}
        {loading && (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span className="sr-only">Chargement...</span>
          </>
        )}
        
        {/* Icon left */}
        {!loading && icon && iconPosition === 'left' && (
          <span aria-hidden="true">{icon}</span>
        )}
        
        {/* Button text */}
        <span>
          {loading ? (loadingText || 'Chargement...') : children}
        </span>
        
        {/* Icon right */}
        {!loading && icon && iconPosition === 'right' && (
          <span aria-hidden="true">{icon}</span>
        )}
        
        {/* Shimmer effect for premium variant */}
        {variant === 'premium' && (
          <div 
            className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"
            aria-hidden="true"
          />
        )}
      </button>
    );
  }
);

PremiumButton.displayName = 'PremiumButton';

// ==================== CARD PREMIUM ====================

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'premium' | 'glass' | 'elevated' | 'floating';
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
}

export const PremiumCard = forwardRef<HTMLDivElement, PremiumCardProps>(
  ({
    className,
    variant = 'default',
    hover = false,
    glow = false,
    gradient = false,
    children,
    ...props
  }, ref) => {
    const baseClasses = [
      'rounded-xl border bg-card text-card-foreground',
      'transition-all duration-300 gpu-accelerated',
    ];
    
    const variants = {
      default: 'shadow-sm hover:shadow-md',
      premium: [
        'shadow-premium border-2 border-primary/20',
        'bg-gradient-to-br from-card via-card to-primary/5',
      ],
      glass: [
        'glass-effect border-white/30',
        'hover:glass-effect-strong',
      ],
      elevated: [
        'shadow-lg hover:shadow-xl',
        'hover:-translate-y-1',
      ],
      floating: [
        'shadow-premium-lg hover:shadow-premium-xl',
        'hover:-translate-y-2 hover:rotate-1',
      ],
    };
    
    const hoverClass = hover ? 'hover-lift' : '';
    const glowClass = glow ? 'hover-glow' : '';
    const gradientClass = gradient ? 'bg-mesh-gradient' : '';
    
    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          hoverClass,
          glowClass,
          gradientClass,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PremiumCard.displayName = 'PremiumCard';

// ==================== INPUT PREMIUM ====================

interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  success?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const PremiumInput = forwardRef<HTMLInputElement, PremiumInputProps>(
  ({
    className,
    label,
    description,
    error,
    success = false,
    loading = false,
    icon,
    iconPosition = 'left',
    id,
    ...props
  }, ref) => {
    const [focused, setFocused] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const descId = description ? `${inputId}-desc` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    
    const { announceToScreenReader } = useUnifiedContext();
    
    useEffect(() => {
      if (error) {
        announceToScreenReader(`Erreur de saisie: ${error}`);
      }
    }, [error, announceToScreenReader]);
    
    const containerClasses = [
      'relative group',
      error ? 'text-destructive' : '',
      success ? 'text-success' : '',
    ];
    
    const inputClasses = [
      'flex h-10 w-full rounded-lg border bg-background px-3 py-2',
      'text-sm ring-offset-background transition-all duration-200',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      'focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      icon && iconPosition === 'left' ? 'pl-10' : '',
      icon && iconPosition === 'right' ? 'pr-10' : '',
      error ? 'border-destructive focus-visible:ring-destructive' : 'border-input',
      success ? 'border-success focus-visible:ring-success' : '',
      focused ? 'shadow-md' : 'shadow-sm',
    ];
    
    return (
      <div className={cn(containerClasses)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium mb-2 transition-colors"
          >
            {label}
            {props.required && (
              <span className="text-destructive ml-1 text-base" aria-label="obligatoire">
                *
              </span>
            )}
          </label>
        )}
        
        {/* Input container */}
        <div className="relative">
          {/* Left icon */}
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {icon}
            </div>
          )}
          
          {/* Input field */}
          <input
            ref={ref}
            id={inputId}
            className={cn(inputClasses, className)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-describedby={cn(descId, errorId)}
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          />
          
          {/* Right content */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {success && !loading && (
              <CheckCircle className="h-4 w-4 text-success" />
            )}
            {icon && iconPosition === 'right' && !loading && !success && (
              <span className="text-muted-foreground">{icon}</span>
            )}
          </div>
        </div>
        
        {/* Description */}
        {description && (
          <p
            id={descId}
            className="text-xs text-muted-foreground mt-1"
          >
            {description}
          </p>
        )}
        
        {/* Error message */}
        {error && (
          <p
            id={errorId}
            className="text-xs text-destructive mt-1 flex items-center gap-1"
            role="alert"
          >
            <AlertCircle className="h-3 w-3" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

PremiumInput.displayName = 'PremiumInput';

// ==================== TOAST PREMIUM ====================

interface PremiumToastProps {
  id: string;
  title?: string;
  description?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onClose?: () => void;
}

export const PremiumToast: React.FC<PremiumToastProps> = ({
  id,
  title,
  description,
  type = 'info',
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const { announceToScreenReader } = useUnifiedContext();
  
  useEffect(() => {
    // Announce to screen readers
    const message = `${title ? `${title}: ` : ''}${description || ''}`;
    announceToScreenReader(message);
    
    // Auto-dismiss
    if (duration > 0) {
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, duration);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [title, description, duration, announceToScreenReader]);
  
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };
  
  if (!isVisible) return null;
  
  const icons = {
    info: <Info className="h-5 w-5" />,
    success: <CheckCircle className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
  };
  
  const variants = {
    info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200',
    success: 'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-200',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200',
    error: 'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
  };
  
  return (
    <div
      className={cn(
        "relative flex items-start gap-3 rounded-lg border p-4 shadow-lg",
        "transition-all duration-300 gpu-accelerated max-w-md",
        variants[type],
        isExiting ? "animate-slide-out-right opacity-0" : "animate-slide-in-right",
      )}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5" aria-hidden="true">
        {icons[type]}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="font-semibold mb-1 text-sm">
            {title}
          </h4>
        )}
        {description && (
          <p className="text-sm opacity-90">
            {description}
          </p>
        )}
      </div>
      
      {/* Close button */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 rounded-md p-1 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        aria-label="Fermer la notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// ==================== LOADING PREMIUM ====================

interface PremiumLoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  text?: string;
  fullScreen?: boolean;
}

export const PremiumLoading: React.FC<PremiumLoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  text,
  fullScreen = false,
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };
  
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };
  
  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return <Loader2 className={cn(sizes[size], "animate-spin text-primary")} />;
      
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "bg-primary rounded-full animate-bounce",
                  size === 'sm' ? 'h-2 w-2' : 
                  size === 'md' ? 'h-3 w-3' :
                  size === 'lg' ? 'h-4 w-4' : 'h-5 w-5'
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );
      
      case 'pulse':
        return (
          <div className={cn(
            "bg-primary rounded-full animate-ping",
            sizes[size]
          )} />
        );
      
      case 'bars':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "bg-primary animate-pulse",
                  size === 'sm' ? 'h-6 w-1' :
                  size === 'md' ? 'h-8 w-1' :
                  size === 'lg' ? 'h-10 w-1' : 'h-12 w-2'
                )}
                style={{ 
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        );
      
      default:
        return <Loader2 className={cn(sizes[size], "animate-spin text-primary")} />;
    }
  };
  
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      {renderLoader()}
      {text && (
        <p className={cn(textSizes[size], "text-muted-foreground animate-pulse")}>
          {text}
        </p>
      )}
    </div>
  );
  
  if (fullScreen) {
    return (
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
        role="status"
        aria-live="polite"
        aria-label={text || "Chargement en cours"}
      >
        {content}
      </div>
    );
  }
  
  return (
    <div
      className="flex items-center justify-center p-4"
      role="status"
      aria-live="polite"
      aria-label={text || "Chargement"}
    >
      {content}
    </div>
  );
};

export {
  PremiumButton as Button,
  PremiumCard as Card,
  PremiumInput as Input,
  PremiumToast as Toast,
  PremiumLoading as Loading,
};