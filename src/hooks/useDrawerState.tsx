
import { useState } from 'react';

/**
 * Hook to manage drawer state
 */
export function useDrawerState() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return {
    isDrawerOpen,
    openDrawer,
    closeDrawer
  };
}
