import React from 'react';
import { cn } from '@/lib/utils';

interface AccessibilityOptimizedProps {
  children: React.ReactNode;
  className?: string;
  skipToContent?: boolean;
  announceChanges?: boolean;
  focusManagement?: boolean;
}

// Skip to content link for keyboard navigation
const SkipToContent: React.FC = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md transition-all"
  >
    Aller au contenu principal
  </a>
);

// Live region for announcing dynamic changes
const LiveRegion: React.FC<{ message: string; priority?: 'polite' | 'assertive' }> = ({
  message,
  priority = 'polite'
}) => (
  <div
    role="status"
    aria-live={priority}
    aria-atomic="true"
    className="sr-only"
  >
    {message}
  </div>
);

// Focus trap component for modals
const FocusTrap: React.FC<{ children: React.ReactNode; active: boolean }> = ({
  children,
  active
}) => {
  const trapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!active || !trapRef.current) return;

    const focusableElements = trapRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [active]);

  return (
    <div ref={trapRef} className="contents">
      {children}
    </div>
  );
};

// High contrast mode detector
const useHighContrast = () => {
  const [isHighContrast, setIsHighContrast] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isHighContrast;
};

// Reduced motion detector
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Main accessibility wrapper component
export const AccessibilityOptimized: React.FC<AccessibilityOptimizedProps> = ({
  children,
  className,
  skipToContent = true,
  announceChanges = true,
  focusManagement = true
}) => {
  const isHighContrast = useHighContrast();
  const prefersReducedMotion = useReducedMotion();
  const [announcements, setAnnouncements] = React.useState<string[]>([]);

  const announce = React.useCallback((message: string, _priority: 'polite' | 'assertive' = 'polite') => {
    if (announceChanges) {
      setAnnouncements(prev => [...prev, message]);
      // Clear announcements after they've been read
      setTimeout(() => {
        setAnnouncements(prev => prev.filter(msg => msg !== message));
      }, 1000);
    }
  }, [announceChanges]);

  // Provide announce function to children via context if needed
  const _contextValue = React.useMemo(() => ({ announce }), [announce]);

  return (
    <div 
      className={cn(
        'accessibility-optimized',
        {
          'high-contrast': isHighContrast,
          'reduced-motion': prefersReducedMotion
        },
        className
      )}
    >
      {skipToContent && <SkipToContent />}
      
      {announcements.map((message, index) => (
        <LiveRegion key={index} message={message} />
      ))}
      
      <main id="main-content" className="focus:outline-none" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
};

// Accessible button with proper ARIA attributes
export const AccessibleButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}> = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  ariaLabel,
  ariaDescribedBy,
  className,
  variant = 'primary'
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      className={cn(
        'relative inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
          'bg-secondary text-secondary-foreground hover:bg-secondary/90': variant === 'secondary',
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground': variant === 'outline',
          'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
          'opacity-50 cursor-not-allowed': disabled || loading
        },
        className
      )}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <span className={loading ? 'invisible' : 'visible'}>
        {children}
      </span>
    </button>
  );
};

// Accessible form field with proper labeling
export const AccessibleFormField: React.FC<{
  id: string;
  label: string;
  children: React.ReactNode;
  error?: string;
  description?: string;
  required?: boolean;
  className?: string;
}> = ({
  id,
  label,
  children,
  error,
  description,
  required = false,
  className
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <label 
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {required && <span className="text-destructive ml-1" aria-label="requis">*</span>}
      </label>
      
      {description && (
        <p id={`${id}-description`} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      
      {React.cloneElement(children as React.ReactElement, {
        id,
        'aria-describedby': [
          description ? `${id}-description` : '',
          error ? `${id}-error` : ''
        ].filter(Boolean).join(' ') || undefined,
        'aria-invalid': error ? 'true' : undefined,
        'aria-required': required
      })}
      
      {error && (
        <p 
          id={`${id}-error`}
          className="text-sm text-destructive"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
};

// Export hooks for use in other components
export { useHighContrast, useReducedMotion, FocusTrap, LiveRegion };

export default AccessibilityOptimized;