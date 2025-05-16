
import * as React from "react";
import { toast as sonnerToast, type ToastT } from "sonner";

export type ToastProps = React.ComponentPropsWithoutRef<typeof sonnerToast>;

export type Toast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactElement;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  duration?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function toast(props: Partial<Toast>) {
  // Ensure we always have an ID for the toast
  const id = props.id || `toast-${Math.random().toString(36).slice(2, 11)}`;
  
  // Map our custom variant to sonner's type if needed
  const type = props.variant === 'destructive' ? 'error' : 
               props.variant === 'warning' ? 'warning' :
               props.variant === 'success' ? 'success' :
               props.variant === 'info' ? 'info' : undefined;

  if (type) {
    sonnerToast[type]({
      ...props,
      id
    });
  } else {
    sonnerToast({
      ...props,
      id
    });
  }
  
  return {
    id,
    dismiss: () => sonnerToast.dismiss(id),
    update: (props: Partial<Toast>) => toast({ ...props, id }),
  };
}

export function useToast() {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  return {
    toast,
    toasts,
    dismiss: sonnerToast.dismiss,
    error: (props: Partial<Toast>) => toast({ ...props, variant: "destructive" }),
    success: (props: Partial<Toast>) => toast({ ...props, variant: "success" }),
    warning: (props: Partial<Toast>) => toast({ ...props, variant: "warning" }),
    info: (props: Partial<Toast>) => toast({ ...props, variant: "info" }),
  };
}
