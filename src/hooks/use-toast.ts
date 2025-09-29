import { useState } from 'react';

export const toast = (message: any) => {
  console.log('Toast:', message);
};

export const useToast = () => {
  const [toasts, setToasts] = useState<any[]>([]);

  return { toast, toasts };
};