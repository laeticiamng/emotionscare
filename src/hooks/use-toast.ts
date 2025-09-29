import { useState } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState<any[]>([]);

  const toast = (message: any) => {
    console.log('Toast:', message);
  };

  return { toast, toasts };
};