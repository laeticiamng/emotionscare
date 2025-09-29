import { useState } from 'react';

export const useFeedback = () => {
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  
  const submit = async () => {
    setLoading(true);
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setOpen(false);
    setIsOpen(false);
  };

  const captureScreenshot = () => {
    console.log('Screenshot captured');
  };
  
  return { 
    open, 
    setOpen,
    isOpen,
    setIsOpen,
    draft,
    setDraft,
    loading,
    submit,
    captureScreenshot
  };
};