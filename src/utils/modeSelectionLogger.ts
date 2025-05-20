
/**
 * Utility for logging user mode selection events
 * This helps with analytics tracking and understanding user behavior
 */

type ModeType = 'b2c' | 'b2b_user' | 'b2b_admin' | string;

/**
 * Logs a mode selection event
 * @param mode The selected user mode
 */
export const logModeSelection = (mode: ModeType): void => {
  try {
    console.log(`[Mode Selection] User selected mode: ${mode}`);
    
    // Track the event using analytics if available
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track('Mode Selected', {
        mode,
        timestamp: new Date().toISOString(),
        location: window.location.pathname
      });
    }
    
    // Store the selection in localStorage for persistence
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('userMode', mode);
      localStorage.setItem('userModeSelectedAt', new Date().toISOString());
    }
  } catch (error) {
    console.error('[Mode Selection Logger] Error:', error);
  }
};

/**
 * Gets the history of mode selections
 * @returns Array of mode selection events
 */
export const getModeSelectionHistory = (): { mode: string; timestamp: string }[] => {
  try {
    if (typeof localStorage !== 'undefined') {
      const historyString = localStorage.getItem('userModeHistory');
      if (historyString) {
        return JSON.parse(historyString);
      }
    }
  } catch (error) {
    console.error('[Mode Selection Logger] Error getting history:', error);
  }
  
  return [];
};

/**
 * Checks if user has ever selected a specific mode
 * @param mode The mode to check
 * @returns True if the user has selected this mode before
 */
export const hasSelectedMode = (mode: ModeType): boolean => {
  try {
    const history = getModeSelectionHistory();
    return history.some(item => item.mode === mode);
  } catch (error) {
    console.error('[Mode Selection Logger] Error checking mode history:', error);
  }
  
  return false;
};

// Add type declaration for analytics
declare global {
  interface Window {
    analytics?: {
      track: (event: string, properties?: any) => void;
      identify: (userId: string, traits?: any) => void;
      page: (name?: string, properties?: any) => void;
    };
  }
}
