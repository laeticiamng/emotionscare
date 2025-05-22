
/**
 * Logs the mode selection event for analytics
 * @param mode The selected mode or action
 */
export const logModeSelection = (mode: string) => {
  // In a real app, this would send to an analytics service
  console.log(`Mode selection: ${mode}`, {
    timestamp: new Date().toISOString(),
    path: window.location.pathname
  });
};
