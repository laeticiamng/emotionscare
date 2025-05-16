
import { toast } from 'sonner';

type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  // Add other Sonner options as needed
}

export const useToast = () => {
  const showToast = (message: string, type: ToastType = 'default', options?: ToastOptions) => {
    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'warning':
        toast.warning(message, options);
        break;
      case 'info':
        toast.info(message, options);
        break;
      default:
        toast(message, options);
        break;
    }
  };

  return {
    toast: showToast,
    dismiss: toast.dismiss,
    // Expose other Sonner methods as needed
  };
};
