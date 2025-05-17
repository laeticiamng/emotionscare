
import { toast } from "sonner";
import type { ToastProps, ToastActionElement } from "@/types/toast";

export { toast };
export const useToast = () => ({ toast });

export type { ToastProps, ToastActionElement };
export type { Toast, ToastOptions } from "@/types/toast";

export default useToast;
