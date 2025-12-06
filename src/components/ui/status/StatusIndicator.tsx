
import React from 'react';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

type StatusType = 'loading' | 'error' | 'success' | 'info' | 'warning';

interface StatusIndicatorProps {
  type: StatusType;
  title?: string;
  message?: string;
  className?: string;
  onDismiss?: () => void;
  onRetry?: () => void;
  position?: 'fixed' | 'absolute' | 'static';
  size?: 'sm' | 'md' | 'lg';
  showButtons?: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  type,
  title,
  message,
  className,
  onDismiss,
  onRetry,
  position = 'static',
  size = 'md',
  showButtons = true
}) => {
  const getIcon = () => {
    switch (type) {
      case 'loading':
        return <Loader2 className={cn("animate-spin", size === 'sm' ? 'h-4 w-4' : 'h-5 w-5')} />;
      case 'error':
        return <AlertCircle className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />;
      case 'success':
        return <CheckCircle className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />;
      case 'info':
      case 'warning':
        return <AlertCircle className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />;
      default:
        return null;
    }
  };
  
  const getVariant = () => {
    switch (type) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      default:
        return 'default';
    }
  };
  
  // Pour les indicateurs de chargement simples
  if (type === 'loading' && !message && !title) {
    return (
      <div className={cn(
        "flex items-center justify-center",
        position === 'fixed' && "fixed top-4 right-4 z-50 bg-background/80 p-2 rounded-full",
        position === 'absolute' && "absolute top-4 right-4 z-10 bg-background/80 p-2 rounded-full",
        className
      )}>
        <Loader2 className={cn("animate-spin text-primary", 
          size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6')} />
      </div>
    );
  }
  
  // Pour les indicateurs plus complets
  return (
    <Alert 
      variant={getVariant()} 
      className={cn(
        position === 'fixed' && "fixed top-4 right-4 max-w-md z-50",
        position === 'absolute' && "absolute top-4 right-4 max-w-md z-10",
        className
      )}
    >
      <div className="flex items-start">
        {getIcon()}
        <div className="ml-2 flex-1">
          {title && <AlertTitle>{title}</AlertTitle>}
          {message && <AlertDescription>{message}</AlertDescription>}
          
          {showButtons && (type === 'error' || type === 'warning') && (
            <div className="mt-2 flex gap-2">
              {onRetry && (
                <Button variant="outline" size="sm" onClick={onRetry}>
                  Réessayer
                </Button>
              )}
              {onDismiss && (
                <Button variant="ghost" size="sm" onClick={onDismiss}>
                  Fermer
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Alert>
  );
};

export default StatusIndicator;
