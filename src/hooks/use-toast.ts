
import { toast as sonnerToast } from 'sonner';

interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export const useToast = () => {
  const toast = ({ title, description, variant = 'default' }: ToastProps) => {
    const message = title ? `${title}${description ? `: ${description}` : ''}` : description || '';
    
    if (variant === 'destructive') {
      sonnerToast.error(message);
    } else {
      sonnerToast.success(message);
    }
  };

  return { toast };
};

// Export direct pour compatibilité
export const toast = useToast().toast;
