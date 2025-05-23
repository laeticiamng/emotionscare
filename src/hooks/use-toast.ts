
import { toast } from 'sonner';

type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info' | 'destructive';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function useToast() {
  const showToast = ({
    title,
    description,
    variant = 'default',
    duration = 5000,
    action,
  }: ToastOptions) => {
    if (variant === 'success') {
      toast.success(title, {
        description,
        duration,
        action: action ? {
          label: action.label,
          onClick: action.onClick,
        } : undefined,
      });
    } else if (variant === 'error' || variant === 'destructive') {
      toast.error(title, {
        description,
        duration,
        action: action ? {
          label: action.label,
          onClick: action.onClick,
        } : undefined,
      });
    } else if (variant === 'warning') {
      toast.warning(title, {
        description,
        duration,
        action: action ? {
          label: action.label,
          onClick: action.onClick,
        } : undefined,
      });
    } else if (variant === 'info') {
      toast.info(title, {
        description,
        duration,
        action: action ? {
          label: action.label,
          onClick: action.onClick,
        } : undefined,
      });
    } else {
      toast(title, {
        description,
        duration,
        action: action ? {
          label: action.label,
          onClick: action.onClick,
        } : undefined,
      });
    }
  };

  return {
    toast: showToast,
    dismiss: toast.dismiss,
  };
}
