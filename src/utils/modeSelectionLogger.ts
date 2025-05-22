
import { UserMode } from '@/types/auth';

/**
 * Logs user mode selection events for analytics
 * @param mode The selected user mode
 */
export const logModeSelection = (mode: UserMode | string) => {
  // Log the mode selection to console (in production this would go to an analytics service)
  console.log(`[Mode Selection] User selected mode: ${mode}`);
  
  // Here you would typically send this to your analytics service
  // Example: analyticsService.trackEvent('mode_selection', { mode });
  
  // Store the last selected mode in localStorage for persistence
  localStorage.setItem('last_mode_selection', mode);
  localStorage.setItem('last_mode_selection_time', new Date().toISOString());
};

/**
 * Gets user mode selection history
 */
export const getModeSelectionHistory = () => {
  const lastMode = localStorage.getItem('last_mode_selection');
  const lastTime = localStorage.getItem('last_mode_selection_time');
  
  return {
    lastMode,
    lastTime: lastTime ? new Date(lastTime) : null
  };
};
