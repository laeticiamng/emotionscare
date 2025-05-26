
import { useState, useCallback } from 'react';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastState {
  toasts: Toast[];
}

let toastCount = 0;

export function useToast() {
  const [state, setState] = useState<ToastState>({ toasts: [] });

  const toast = useCallback(({
    title,
    description,
    variant = 'default',
    action,
    ...props
  }: Omit<Toast, 'id'>) => {
    const id = (++toastCount).toString();
    
    const newToast: Toast = {
      id,
      title,
      description,
      variant,
      action,
      ...props,
    };

    setState((state) => ({
      ...state,
      toasts: [...state.toasts, newToast],
    }));

    // Auto remove after 5 seconds
    setTimeout(() => {
      setState((state) => ({
        ...state,
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 5000);

    return {
      id,
      dismiss: () => {
        setState((state) => ({
          ...state,
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },
    };
  }, []);

  const dismiss = useCallback((toastId?: string) => {
    setState((state) => ({
      ...state,
      toasts: toastId
        ? state.toasts.filter((t) => t.id !== toastId)
        : [],
    }));
  }, []);

  return {
    ...state,
    toast,
    dismiss,
  };
}

// Export a convenience function for one-off toasts
export const toast = ({
  title,
  description,
  variant = 'default',
  action,
}: Omit<Toast, 'id'>) => {
  const id = (++toastCount).toString();
  
  // Create a temporary event for this toast
  const event = new CustomEvent('toast', {
    detail: { id, title, description, variant, action }
  });
  
  window.dispatchEvent(event);
  
  return { id };
};
