import { toast as sonnerToast } from 'sonner';

export const useToast = () => {
  const toast = (options: { title?: string; description?: string; variant?: 'default' | 'destructive' }) => {
    if (options.variant === 'destructive') {
      sonnerToast.error(options.title || 'Error', {
        description: options.description,
      });
    } else {
      sonnerToast.success(options.title || 'Success', {
        description: options.description,
      });
    }
  };

  return { toast };
};

export { sonnerToast as toast };