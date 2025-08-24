import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface NavigationButtonProps extends Omit<ButtonProps, 'onClick'> {
  to: string;
  replace?: boolean;
  loadingMessage?: string;
  showArrow?: boolean;
  confirmNavigation?: boolean;
  confirmMessage?: string;
  preNavigationAction?: () => Promise<void> | void;
  children: React.ReactNode;
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({
  to,
  replace = false,
  loadingMessage = "Navigation en cours...",
  showArrow = false,
  confirmNavigation = false,
  confirmMessage = "Êtes-vous sûr de vouloir naviguer vers cette page ?",
  preNavigationAction,
  children,
  disabled,
  className,
  ...props
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = async () => {
    if (confirmNavigation) {
      const confirmed = window.confirm(confirmMessage);
      if (!confirmed) return;
    }

    setIsNavigating(true);

    try {
      // Show loading toast
      toast({
        title: "Navigation",
        description: loadingMessage,
        duration: 1500
      });

      // Execute pre-navigation action if provided
      if (preNavigationAction) {
        await Promise.resolve(preNavigationAction());
      }

      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));

      // Navigate
      navigate(to, { replace });

    } catch (error) {
      console.error('Navigation error:', error);
      toast({
        title: "Erreur de navigation",
        description: "Impossible de naviguer vers cette page",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setIsNavigating(false);
    }
  };

  return (
    <Button
      {...props}
      onClick={handleClick}
      disabled={disabled || isNavigating}
      className={cn(
        "transition-all duration-200",
        className
      )}
    >
      {isNavigating && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {children}
      {showArrow && !isNavigating && (
        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
      )}
    </Button>
  );
};

export default NavigationButton;