
import { useState, useCallback } from 'react';

export default function useDrawerState() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const openDrawer = useCallback(() => {
    console.log('🔔 openDrawer called, setting isDrawerOpen to true');
    setIsDrawerOpen(true);
  }, []);
  
  const closeDrawer = useCallback(() => {
    console.log('🔔 closeDrawer called, setting isDrawerOpen to false');
    setIsDrawerOpen(false);
  }, []);
  
  const toggleDrawer = useCallback(() => {
    console.log('🔔 toggleDrawer called, current value:', !isDrawerOpen);
    setIsDrawerOpen(prev => !prev);
  }, [isDrawerOpen]);
  
  console.log('🔔 useDrawerState hook, isDrawerOpen:', isDrawerOpen);
  
  return { isDrawerOpen, openDrawer, closeDrawer, toggleDrawer };
}
