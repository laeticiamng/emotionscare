
// Re-export du hook Toast de ShadCN
import { useToast as useShadCNToast } from "@/components/ui/use-toast"; 

export const useToast = useShadCNToast;
export { toast } from "@/components/ui/use-toast";

export default useToast;
