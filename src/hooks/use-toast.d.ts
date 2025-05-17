
import * as React from "react";
import { ToastProps, Toast } from "@/types/toast";

// The function signatures for the toast API
export declare function toast(props: ToastProps): {
  id: string;
  dismiss: () => void;
  update: (props: Partial<ToastProps>) => void;
};

export interface UseToastReturn {
  toast: typeof toast;
  toasts: Toast[];
  dismiss: (toastId?: string) => void;
  error: (props: ToastProps) => typeof toast;
  success: (props: ToastProps) => typeof toast;
  warning: (props: ToastProps) => typeof toast;
  info: (props: ToastProps) => typeof toast;
}

export declare function useToast(): UseToastReturn;

export type { Toast, ToastProps, ToastActionElement } from "@/types/toast";
