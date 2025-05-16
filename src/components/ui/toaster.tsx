
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast, Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  const { toasts } = useToast();

  React.useEffect(() => {
    // Synchronize our toasts with sonner
    if (toasts && Array.isArray(toasts)) {
      toasts.forEach((toast) => {
        if (toast && toast.open) {
          sonnerToast(toast.title || "", {
            id: toast.id,
            description: toast.description,
            duration: toast.duration,
          });
        }
      });
    }
  }, [toasts]);

  return <SonnerToaster position="bottom-right" closeButton />;
}

export { Toaster as Toast };
