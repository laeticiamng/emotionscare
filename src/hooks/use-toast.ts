
import { toast } from "@/components/ui/use-toast";

export { toast };

// We need to export the full useToast hook from this file directly
// rather than re-exporting from itself which causes the circular dependency
export { useToast } from "@/hooks/use-toast.tsx";
