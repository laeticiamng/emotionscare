
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <SonnerToaster 
      position="bottom-right" 
      closeButton 
      richColors 
      theme="light" 
    />
  );
}

export { Toaster as Toast };
