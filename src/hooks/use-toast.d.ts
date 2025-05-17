
import * as React from "react";
import { ToastProps, Toast, ToastOptions } from "@/types/toast";

// The function signatures for the toast API
export declare function toast(props: ToastOptions): {
  id: string;
  dismiss: () => void;
  update: (props: Partial<ToastOptions>) => void;
};

export interface UseToastReturn {
  toast: typeof toast;
  toasts: Toast[];
  dismiss: (toastId?: string) => void;
  error: (props: ToastOptions) => typeof toast;
  success: (props: ToastOptions) => typeof toast;
  warning: (props: ToastOptions) => typeof toast;
  info: (props: ToastOptions) => typeof toast;
}

export declare function useToast(): UseToastReturn;

export type { Toast, ToastProps, ToastActionElement, ToastOptions } from "@/types/toast";
