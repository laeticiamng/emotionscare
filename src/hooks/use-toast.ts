
// This file re-exports from the tsx implementation file
// Import directly from the implementation to avoid circular dependencies
import { toast as toastImpl } from "@/hooks/use-toast.tsx";

// Export the toast function directly, not as a re-export
export const toast = toastImpl;

// Export the hook directly from the implementation file
export { useToast } from "@/hooks/use-toast.tsx";
