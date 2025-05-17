
import * as React from "react";
import { Toast, ToastProps } from "@/types/toast";
import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";

type ToastOptions = Omit<ToastProps, "id">;

// Create a type-safe wrapper for the toast function
const useToast = () => {
  const toast = (options: ToastOptions) => {
    return sonnerToast(options);
  };

  // Add convenience methods for different variants
  const api = {
    toast,
    // Helper methods for different toast types
    success: (options: ToastOptions) => 
      toast({ ...options, variant: "success" }),
    error: (options: ToastOptions) => 
      toast({ ...options, variant: "destructive" }),
    warning: (options: ToastOptions) => 
      toast({ ...options, variant: "warning" }),
    info: (options: ToastOptions) => 
      toast({ ...options, variant: "info" }),
    // Method to dismiss a toast
    dismiss: (toastId?: string) => sonnerToast.dismiss(toastId),
    // List of active toasts (empty since sonner handles this internally)
    toasts: [] as Toast[]
  };

  // If in the browser, store a reference globally for non-hook usage
  if (typeof window !== 'undefined') {
    (window as any).__toast = api.toast;
  }

  return api;
};

// Export a singleton instance for direct imports outside of React components
const toast = (options: ToastOptions) => {
  // Use the global toast function if available
  if (typeof window !== 'undefined' && (window as any).__toast) {
    return (window as any).__toast(options);
  }
  
  // Fallback to sonner toast directly
  return sonnerToast(options);
};

export { useToast, toast };
export type { Toast, ToastProps, ToastActionElement } from "@/types/toast";
