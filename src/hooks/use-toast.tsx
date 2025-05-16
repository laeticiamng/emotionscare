
import * as React from "react";
import { toast as sonnerToast } from "sonner";

export type ToastProps = React.ComponentPropsWithoutRef<typeof sonnerToast>;

export function toast(props: ToastProps) {
  sonnerToast(props);
}

export function useToast() {
  const toasts = React.useState<ToastProps[]>([]);

  return {
    toast,
    toasts: toasts[0],
    dismiss: sonnerToast.dismiss,
    error: sonnerToast.error,
    success: sonnerToast.success,
    warning: sonnerToast.warning,
    info: sonnerToast.info,
  };
}
