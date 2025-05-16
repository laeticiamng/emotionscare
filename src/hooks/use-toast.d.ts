
import * as React from "react";

export interface ToastProps {
  id?: string;
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactElement;
  variant?: "default" | "success" | "destructive" | "warning" | "info";
  duration?: number;
}

export type Toast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactElement;
  variant?: "default" | "success" | "destructive" | "warning" | "info";
  duration?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export interface ToastActionElement extends React.ReactElement {}

// The function signatures for the toast API
export declare function toast(props: Partial<Toast>): {
  id: string;
  dismiss: () => void;
  update: (props: Partial<Toast>) => void;
};

export interface UseToastReturn {
  toast: typeof toast;
  toasts: Toast[];
  dismiss: (toastId?: string) => void;
  error: typeof toast;
  success: typeof toast;
  warning: typeof toast;
  info: typeof toast;
}

export declare function useToast(): UseToastReturn;
