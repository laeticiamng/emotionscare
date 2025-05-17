
// Importing from types/toast
import { Toast, ToastProps, ToastActionElement } from '@/types/toast';

// Mock implementation
export const toast = (props: Partial<Toast>) => {
  console.log('Toast displayed:', props);
  return {
    id: props.id || `toast-${Math.random().toString(36).slice(2, 11)}`,
    dismiss: () => {},
    update: (props: Partial<Toast>) => {}
  };
};

export const useToast = () => {
  return {
    toast,
    toasts: [],
    dismiss: (toastId?: string) => {},
    error: (props: Partial<Toast>) => toast({ ...props, variant: 'destructive' }),
    success: (props: Partial<Toast>) => toast({ ...props, variant: 'success' }),
    warning: (props: Partial<Toast>) => toast({ ...props, variant: 'warning' }),
    info: (props: Partial<Toast>) => toast({ ...props, variant: 'info' })
  };
};
