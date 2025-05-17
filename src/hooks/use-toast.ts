
// Re-export du hook Toast de ShadCN
import { useToast as useShadCNToast, toast as toastFunction } from "@/components/ui/toast";

export const useToast = useShadCNToast;
export const toast = toastFunction;

export default useToast;
