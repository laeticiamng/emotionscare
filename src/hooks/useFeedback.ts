import { useState } from 'react';

export const useFeedback = () => {
  const [open, setOpen] = useState(false);
  
  return { open, setOpen };
};