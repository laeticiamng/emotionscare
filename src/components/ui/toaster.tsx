
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import NotificationToast from './notification-toast';

export const Toaster: React.FC = () => {
  const { toasts, dismiss } = useToast();
  
  const notifications = toasts.map(toast => ({
    id: toast.id,
    type: toast.variant === 'destructive' ? 'error' as const : 
          toast.variant === 'success' ? 'success' as const : 'info' as const,
    title: toast.title || '',
    message: toast.description,
    duration: toast.duration
  }));
  
  return <NotificationToast notifications={notifications} onRemove={dismiss} />;
};
