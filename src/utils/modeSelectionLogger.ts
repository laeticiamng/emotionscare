
/**
 * Utility to log mode selection events
 * This helps with analytics tracking of how users navigate through the app
 */

export const logModeSelection = (mode: string) => {
  console.log(`User selected mode: ${mode}`);
  
  // Here we could integrate with analytics services
  // like Google Analytics, Mixpanel, or an internal tracking system
  
  // Log to localStorage for debugging
  try {
    const logs = JSON.parse(localStorage.getItem('modeSelectionLogs') || '[]');
    logs.push({
      mode,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('modeSelectionLogs', JSON.stringify(logs));
  } catch (error) {
    console.error('Failed to log mode selection', error);
  }
};

export default logModeSelection;
