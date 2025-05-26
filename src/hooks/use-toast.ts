
import { useState } from 'react';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

const toasts: Toast[] = [];

export function useToast() {
  const [, setCounter] = useState(0);

  const toast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    toasts.push({ id, ...toast });
    setCounter(c => c + 1);
    
    setTimeout(() => {
      const index = toasts.findIndex(t => t.id === id);
      if (index > -1) {
        toasts.splice(index, 1);
        setCounter(c => c + 1);
      }
    }, 5000);
  };

  return { toast, toasts };
}

export const toast = (options: { title?: string; description?: string }) => {
  console.log('Toast:', options.title || options.description);
};

export const error = (message: string) => toast({ title: 'Erreur', description: message });
export const success = (message: string) => toast({ title: 'Succès', description: message });
export const warning = (message: string) => toast({ title: 'Attention', description: message });
export const info = (message: string) => toast({ title: 'Information', description: message });
