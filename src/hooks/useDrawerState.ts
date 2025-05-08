
import { useState, useCallback } from 'react';

export default function useDrawerState() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen(prev => !prev), []);
  
  return { isDrawerOpen, openDrawer, closeDrawer, toggleDrawer };
}
