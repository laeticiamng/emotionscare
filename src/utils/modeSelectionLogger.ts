import { Analytics } from './analytics';
import { modeEmitter } from './modeChangeEmitter';

interface ModeLog {
  mode: string;
  timestamp: string;
}

/**
 * Determine if analytics is enabled based on stored preferences.
 * This avoids storing any personal data if the user opted out.
 */
function analyticsEnabled(): boolean {
  try {
    const prefsRaw = localStorage.getItem('userPreferences');
    if (!prefsRaw) return false;
    const prefs = JSON.parse(prefsRaw);
    if (typeof prefs.privacy === 'string') {
      return prefs.privacy !== 'private';
    }
    return !!prefs.privacy?.analytics;
  } catch {
    return false;
  }
}

/**
 * Log a mode selection event in an anonymised way.
 */
export function logModeSelection(mode: string) {
  const log: ModeLog = { mode, timestamp: new Date().toISOString() };
  if (analyticsEnabled()) {
    Analytics.trackEvent('mode', 'select', mode);
    // Additional logging backend could be added here
  }
  // Emit event for other modules
  modeEmitter.emit('modeChange', log);
}
