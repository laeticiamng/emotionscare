
import { useToast as useShadCNToast } from "@/components/ui/sonner";
import { toast as toastFunction } from "@/components/ui/sonner";
import type { ToastProps, ToastActionElement } from "@/types/toast";

export const useToast = useShadCNToast;
export const toast = toastFunction;

export type { ToastProps, ToastActionElement };
export type { Toast, ToastOptions } from "@/types/toast";

export default useToast;
