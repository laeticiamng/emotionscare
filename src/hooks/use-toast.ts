
import { toast as sonnerToast } from 'sonner';

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export const toast = (props: ToastProps) => {
  const { title, description, variant = 'default' } = props;
  
  const message = title ? `${title}${description ? ': ' + description : ''}` : description || '';
  
  if (variant === 'destructive') {
    sonnerToast.error(message);
  } else {
    sonnerToast.success(message);
  }
};

export const useToast = () => {
  return { toast };
};
