// @ts-nocheck

import { ReactElement, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

type NotificationVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

interface NotificationOptions {
  title?: string;
  description?: string | ReactNode;
  variant?: NotificationVariant;
  duration?: number;
  action?: ReactElement;
}

export const useNotifications = () => {
  const { toast } = useToast();

  const notify = (options: NotificationOptions) => {
    const { title, description, variant = 'default', duration = 5000, action } = options;
    
    let toastVariant: 'default' | 'destructive' = 'default';
    
    if (variant === 'error') {
      toastVariant = 'destructive';
    }
    
    return toast({
      title,
      description,
      variant: toastVariant,
      duration
    });
  };

  const success = (options: Omit<NotificationOptions, 'variant'>) => {
    return notify({ ...options, variant: 'success' });
  };

  const error = (options: Omit<NotificationOptions, 'variant'>) => {
    return notify({ ...options, variant: 'error' });
  };

  const warning = (options: Omit<NotificationOptions, 'variant'>) => {
    return notify({ ...options, variant: 'warning' });
  };

  const info = (options: Omit<NotificationOptions, 'variant'>) => {
    return notify({ ...options, variant: 'info' });
  };

  return {
    notify,
    success,
    error,
    warning,
    info
  };
};

export default useNotifications;
