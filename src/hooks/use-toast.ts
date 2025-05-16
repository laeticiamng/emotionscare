
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  duration?: number;
};

export function toast(props: ToastProps) {
  const { title, description, variant, duration = 3000 } = props;
  
  sonnerToast(title || "", {
    description,
    duration,
    className: variant ? `toast-${variant}` : "",
  });
}

export function useToast() {
  return {
    toast,
    toasts: []
  };
}
