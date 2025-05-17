
import { toast as sonnerToast } from "sonner";
import type { ToastProps, ToastActionElement, ToastOptions } from "@/types/toast";

// Create a wrapper around sonner toast to support our app's toast options
export const toast = (options: ToastOptions) => {
  return sonnerToast(options.title || "", {
    description: options.description,
    action: options.action,
    duration: options.duration,
    className: options.variant ? `toast-${options.variant}` : undefined,
  });
};

export const useToast = () => {
  return { 
    toast 
  };
};

export type { ToastProps, ToastActionElement, ToastOptions };
export { Toast } from "@/types/toast";

export default useToast;
