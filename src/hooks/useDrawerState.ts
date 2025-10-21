// @ts-nocheck

import { useState, useCallback } from 'react';
import { logger } from '@/lib/logger';

export default function useDrawerState() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const openDrawer = useCallback(() => {
    if (process.env.NODE_ENV !== 'production') {
      logger.debug('openDrawer called, setting isDrawerOpen to true', {}, 'UI');
    }
    setIsDrawerOpen(true);
  }, []);
  
  const closeDrawer = useCallback(() => {
    if (process.env.NODE_ENV !== 'production') {
      logger.debug('closeDrawer called, setting isDrawerOpen to false', {}, 'UI');
    }
    setIsDrawerOpen(false);
  }, []);
  
  const toggleDrawer = useCallback(() => {
    if (process.env.NODE_ENV !== 'production') {
      logger.debug('toggleDrawer called', { currentValue: !isDrawerOpen }, 'UI');
    }
    setIsDrawerOpen(prev => !prev);
  }, [isDrawerOpen]);
  
  if (process.env.NODE_ENV !== 'production') {
    logger.debug('useDrawerState hook', { isDrawerOpen }, 'UI');
  }
  
  return { isDrawerOpen, openDrawer, closeDrawer, toggleDrawer };
}
