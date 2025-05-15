
// Re-export the hook from the ui component
import { useToast as useToastImpl } from "@/components/ui/use-toast";
import { toast } from "@/components/ui/toast";

// Re-export the hook
export const useToast = useToastImpl;

// Re-export the toast function
export { toast };
