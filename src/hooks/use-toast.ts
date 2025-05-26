
import { useState, useCallback } from 'react';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<any[]>([]);

  const toast = useCallback((options: ToastOptions) => {
    const id = Date.now().toString();
    const newToast = { id, ...options };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, options.duration || 3000);
  }, []);

  return { toast, toasts };
};

export { useToast as toast };
