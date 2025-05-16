
// This is a simplified version of the use-toast hook to satisfy imports
// In a real application, this would be connected to a Toast provider
import { toast } from './use-toast.tsx';

export const useToast = () => {
  return { toast };
};

export { toast };

export default useToast;
