
import React from "react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  console.log('[Toaster] Rendering with React:', !!React);
  
  // Ensure React is available
  if (!React || !React.createElement) {
    console.error('[Toaster] React not available');
    return null;
  }

  const { toasts } = useToast()

  return React.createElement(
    ToastProvider,
    {},
    ...(toasts || []).map(function ({ id, title, description, action, ...props }) {
      return React.createElement(
        Toast,
        { key: id, ...props },
        React.createElement(
          'div',
          { className: "grid gap-1" },
          title && React.createElement(ToastTitle, {}, title),
          description && React.createElement(ToastDescription, {}, description)
        ),
        action,
        React.createElement(ToastClose)
      )
    }),
    React.createElement(ToastViewport)
  )
}
