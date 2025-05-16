
import React from 'react';
import { toast as sonnerToast, ToastOptions } from 'sonner';

type ToastProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  open?: boolean;
  id?: string;
  duration?: number;
} & Omit<ToastOptions, 'className'>;

// Create state to track active toasts
type ToastState = {
  toasts: ToastProps[];
};

const initialState: ToastState = {
  toasts: []
};

let state = initialState;
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((listener) => listener());

// Create the toast function to export explicitly
const toast = ({ title, description, action, variant = 'default', id, duration = 5000, ...props }: ToastProps) => {
  const toastId = id || String(Math.random());
  
  const newToast = {
    id: toastId,
    title,
    description,
    action,
    variant,
    duration,
    open: true,
    ...props
  };
  
  state = {
    toasts: [...state.toasts, newToast]
  };
  
  sonnerToast(title as string, {
    id: toastId,
    description,
    action,
    duration,
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
  
  notify();
  
  return toastId;
};

toast.dismiss = (id?: string) => {
  if (id) {
    state = {
      toasts: state.toasts.map((toast) => 
        toast.id === id ? { ...toast, open: false } : toast
      )
    };
  } else {
    state = {
      toasts: state.toasts.map((toast) => ({ ...toast, open: false }))
    };
  }
  
  sonnerToast.dismiss(id);
  notify();
};

const useToast = () => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);
  
  React.useEffect(() => {
    const listener = () => {
      setToasts([...state.toasts]);
    };
    
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);
  
  return { toast, toasts, dismiss: toast.dismiss };
};

export { useToast, toast };
