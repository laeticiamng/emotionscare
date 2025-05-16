
import { toast as sonnerToast } from 'sonner';

type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  // Add other Sonner options as needed
}

// Define the structure for object-based toast calls
export interface ToastProps {
  title?: string;
  description?: React.ReactNode;
  action?: React.ReactElement;
  variant?: 'default' | 'success' | 'destructive' | 'warning' | 'info';
  duration?: number;
  id?: string;
}

export const useToast = () => {
  // Original string-based toast function
  const showToastString = (message: string, type: ToastType = 'default', options?: ToastOptions) => {
    switch (type) {
      case 'success':
        sonnerToast.success(message, options);
        break;
      case 'error':
        sonnerToast.error(message, options);
        break;
      case 'warning':
        sonnerToast.warning(message, options);
        break;
      case 'info':
        sonnerToast.info(message, options);
        break;
      default:
        sonnerToast(message, options);
        break;
    }
  };

  // Enhanced object-based toast function
  const showToast = (messageOrProps: string | ToastProps, type?: ToastType, options?: ToastOptions) => {
    // If the first parameter is a string, use the traditional method
    if (typeof messageOrProps === 'string') {
      showToastString(messageOrProps, type, options);
      return;
    }

    // If it's an object, use the variant property to determine toast type
    const { variant = 'default', title, description, duration, action } = messageOrProps;

    const toastOptions = {
      ...options,
      duration,
      action
    };

    switch (variant) {
      case 'success':
        sonnerToast.success(title, {
          ...toastOptions,
          description
        });
        break;
      case 'destructive':
      case 'error':
        sonnerToast.error(title, {
          ...toastOptions,
          description
        });
        break;
      case 'warning':
        sonnerToast.warning(title, {
          ...toastOptions,
          description
        });
        break;
      case 'info':
        sonnerToast.info(title, {
          ...toastOptions,
          description
        });
        break;
      default:
        sonnerToast(title || '', {
          ...toastOptions,
          description
        });
        break;
    }
  };

  return {
    toast: showToast,
    dismiss: sonnerToast.dismiss,
    // Expose other Sonner methods as needed
  };
};
