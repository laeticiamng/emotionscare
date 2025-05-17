
import { Toast, ToastActionElement, ToastProps } from '@/types/toast';
import { useToast as useShadcnToast } from '@/components/ui/toast';

export const useToast = () => {
  const shadcnToast = useShadcnToast();

  return {
    ...shadcnToast,
    toast: (props: ToastProps) => {
      return shadcnToast.toast(props);
    }
  };
};

// Exporter aussi directement l'objet toast pour faciliter l'utilisation
// sans hook dans les composants de classe ou les utility functions
export const toast = (props: ToastProps) => {
  // Créer une fonction toast temporaire si on est en dehors d'un composant
  // qui utilise useToast
  const toastFn = typeof window !== 'undefined' ? 
    (window as any).__toast || 
    ((props: ToastProps) => console.log('Toast (fallback):', props.title, props.description)) : 
    () => {};
  
  return toastFn(props);
};

export type { Toast, ToastActionElement, ToastProps };
