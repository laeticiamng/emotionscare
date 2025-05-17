
// Re-export from the correct location
import { toast } from "sonner";
import { useToast } from "@/components/ui/use-toast";

export { toast, useToast };
export type { Toast, ToastProps, ToastActionElement, ToastOptions } from "@/types/toast";
export { Toaster } from "@/components/ui/sonner";
