
// Re-export from the correct location
// This avoids breaking existing imports in the codebase
export { useToast, toast } from "@/hooks/use-toast";
export type { Toast, ToastProps, ToastActionElement } from "@/types/toast";
export { Toaster } from "@/components/ui/sonner";
