// @ts-nocheck

import { logger } from '@/lib/logger';

/**
 * Safely opens a URL or performs an action based on the URL
 * This helper prevents direct window.open calls which can be blocked by browsers
 */
export const safeOpen = (url: string, target: string = '_blank'): boolean => {
  try {
    // For safety, check if URL is valid
    const urlObj = new URL(url);
    const newWindow = window.open(urlObj.toString(), target);
    
    // Return true if the window was successfully opened
    return newWindow !== null;
  } catch (error) {
    logger.error('Error opening URL', error as Error, 'UI');
    return false;
  }
}
