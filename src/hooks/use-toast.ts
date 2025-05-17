
import { ReactNode } from 'react';
import { toast as sonnerToast } from 'sonner';
import { Toast as ToastType } from '@/types/toast';

type ToastProps = {
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  duration?: number;
};

type ToastActionElement = React.ReactElement<
  React.ComponentPropsWithoutRef<'button'>
>;

export type Toast = ToastType;

// Action types
type Action =
  | { type: 'ADD_TOAST'; toast: ToastType }
  | { type: 'UPDATE_TOAST'; toast: ToastType }
  | { type: 'DISMISS_TOAST'; toastId?: string }
  | { type: 'REMOVE_TOAST'; toastId?: string };

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
};

const defaultToast: Partial<Toast> = {
  duration: 5000,
  variant: 'default',
};

// Adapter for sonner toast
const toast = (props: ToastProps) => {
  const { title, description, variant, duration, action } = props;

  // Map our variants to sonner variants
  let sonnerVariant: any = 'default';
  if (variant === 'destructive') sonnerVariant = 'error';
  else if (variant === 'success') sonnerVariant = 'success';
  else if (variant === 'warning') sonnerVariant = 'warning';
  else if (variant === 'info') sonnerVariant = 'info';

  return sonnerToast(title, {
    description,
    duration,
    action,
    // @ts-ignore - sonner typing issue
    type: sonnerVariant,
  });
};

// Hook that exposes toast functionality
export const useToast = () => {
  return {
    toast,
    dismiss: (toastId?: string) => {
      if (toastId) {
        sonnerToast.dismiss(toastId);
      } else {
        sonnerToast.dismiss();
      }
    },
  };
};

export { toast };
export type { ToastProps, ToastActionElement };
