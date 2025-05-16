
// This file re-exports directly from the implementation file.
// We cannot import from ourself, so we need to import directly from the TSX file.

// Export both functions directly from the implementation file
export { toast, useToast } from "@/hooks/use-toast.tsx";
