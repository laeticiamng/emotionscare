
import React from 'react';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive';
}

interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, 'id'>) => void;
  dismiss: (toastId: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    // Fallback pour éviter les erreurs
    return {
      toast: ({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
        console.log(`Toast: ${title} - ${description}`);
      },
      toasts: [],
      dismiss: () => {},
    };
  }

  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback(({ title, description, action, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2);
    const newToast: Toast = {
      id,
      title,
      description,
      action,
      variant,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = React.useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  }, []);

  const value: ToastContextType = {
    toasts,
    toast,
    dismiss,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

export const toast = (props: Omit<Toast, 'id'>) => {
  // Fonction utilitaire pour usage direct
  console.log(`Toast: ${props.title} - ${props.description}`);
};
