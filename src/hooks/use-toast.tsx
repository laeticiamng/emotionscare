
import { useToast as useToastImpl } from "@/components/ui/toast";

// Re-export the hook
export const useToast = useToastImpl;

// Re-export the toast function
export { toast } from "@/components/ui/toast";
