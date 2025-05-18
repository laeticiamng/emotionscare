
import { useState, useCallback } from 'react';

export default function useDrawerState() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const openDrawer = useCallback(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔔 openDrawer called, setting isDrawerOpen to true');
    }
    setIsDrawerOpen(true);
  }, []);
  
  const closeDrawer = useCallback(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔔 closeDrawer called, setting isDrawerOpen to false');
    }
    setIsDrawerOpen(false);
  }, []);
  
  const toggleDrawer = useCallback(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔔 toggleDrawer called, current value:', !isDrawerOpen);
    }
    setIsDrawerOpen(prev => !prev);
  }, [isDrawerOpen]);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('🔔 useDrawerState hook, isDrawerOpen:', isDrawerOpen);
  }
  
  return { isDrawerOpen, openDrawer, closeDrawer, toggleDrawer };
}
