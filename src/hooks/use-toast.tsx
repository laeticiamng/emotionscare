
import React from 'react';
import { toast as sonnerToast, Toast, ToastOptions } from 'sonner';

type ToastProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
} & Omit<ToastOptions, 'className'>;

const useToast = () => {
  const toast = ({ title, description, action, variant = 'default', ...props }: ToastProps) => {
    sonnerToast(title as string, {
      description,
      action,
      className: variant === 'destructive' 
        ? 'bg-destructive text-white' 
        : variant === 'success'
        ? 'bg-green-500 text-white'
        : variant === 'warning'
        ? 'bg-yellow-500 text-white'
        : variant === 'info'
        ? 'bg-blue-500 text-white'
        : undefined,
      ...props,
    });
  };

  return { toast };
};

export { useToast };
