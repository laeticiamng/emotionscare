
import React from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (props: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const toast = (props: Omit<Toast, 'id'>) => {
  // Cette fonction sera exposée globalement
  const event = new CustomEvent('toast', { detail: props });
  window.dispatchEvent(event);
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  
  const addToast = React.useCallback((props: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...props, id };
    setToasts(prev => [...prev, newToast]);
    
    if (props.duration !== 0) {
      setTimeout(() => {
        dismiss(id);
      }, props.duration || 5000);
    }
  }, []);
  
  const dismiss = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);
  
  React.useEffect(() => {
    const handleToast = (event: CustomEvent) => {
      addToast(event.detail);
    };
    
    window.addEventListener('toast', handleToast as EventListener);
    return () => window.removeEventListener('toast', handleToast as EventListener);
  }, [addToast]);
  
  return (
    <ToastContext.Provider value={{ toasts, toast: addToast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
};
