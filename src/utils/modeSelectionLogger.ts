import { supabase } from '@/integrations/supabase/client';

interface ModeSelectionLog {
  selection_type: string;
  user_agent?: string;
  timestamp?: string;
  additional_data?: Record<string, any>;
}

export const logModeSelection = async (
  selectionType: string,
  additionalData?: Record<string, any>
): Promise<void> => {
  try {
    const logData: ModeSelectionLog = {
      selection_type: selectionType,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      additional_data: additionalData || {}
    };

    // Store in local storage for now (since we don't have a specific table for this)
    const existingLogs = JSON.parse(localStorage.getItem('mode_selection_logs') || '[]');
    existingLogs.push(logData);
    
    // Keep only the last 100 logs
    if (existingLogs.length > 100) {
      existingLogs.splice(0, existingLogs.length - 100);
    }
    
    localStorage.setItem('mode_selection_logs', JSON.stringify(existingLogs));

    console.log('Mode selection logged:', logData);
  } catch (error) {
    console.error('Error logging mode selection:', error);
  }
};

export const getModeSelectionLogs = (): ModeSelectionLog[] => {
  try {
    return JSON.parse(localStorage.getItem('mode_selection_logs') || '[]');
  } catch (error) {
    console.error('Error retrieving mode selection logs:', error);
    return [];
  }
};

export const clearModeSelectionLogs = (): void => {
  try {
    localStorage.removeItem('mode_selection_logs');
    console.log('Mode selection logs cleared');
  } catch (error) {
    console.error('Error clearing mode selection logs:', error);
  }
};
