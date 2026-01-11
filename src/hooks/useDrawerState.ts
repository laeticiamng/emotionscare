// @ts-nocheck

import { useState, useCallback } from 'react';
import { logger } from '@/lib/logger';

const isDev = import.meta.env.MODE !== 'production';

export default function useDrawerState() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const openDrawer = useCallback(() => {
    if (isDev) {
      logger.debug('openDrawer called, setting isDrawerOpen to true', {}, 'UI');
    }
    setIsDrawerOpen(true);
  }, []);
  
  const closeDrawer = useCallback(() => {
    if (isDev) {
      logger.debug('closeDrawer called, setting isDrawerOpen to false', {}, 'UI');
    }
    setIsDrawerOpen(false);
  }, []);
  
  const toggleDrawer = useCallback(() => {
    if (isDev) {
      logger.debug('toggleDrawer called', { currentValue: !isDrawerOpen }, 'UI');
    }
    setIsDrawerOpen(prev => !prev);
  }, [isDrawerOpen]);
  
  if (isDev) {
    logger.debug('useDrawerState hook', { isDrawerOpen }, 'UI');
  }
  
  return { isDrawerOpen, openDrawer, closeDrawer, toggleDrawer };
}
