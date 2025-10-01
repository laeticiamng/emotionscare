// @ts-nocheck

export const logModeSelection = (selectionType: string, additionalData?: any) => {
  const logData = {
    selection_type: selectionType,
    user_agent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    additional_data: additionalData || {}
  };
  
  console.info('Mode selection logged:', logData);
  
  // En production, on pourrait envoyer ça à un service d'analytics
  if (typeof window !== 'undefined' && 'localStorage' in window) {
    try {
      const existing = JSON.parse(localStorage.getItem('mode_selections') || '[]');
      existing.push(logData);
      // Garder seulement les 50 derniers logs
      if (existing.length > 50) {
        existing.splice(0, existing.length - 50);
      }
      localStorage.setItem('mode_selections', JSON.stringify(existing));
    } catch (error) {
      console.error('Failed to log mode selection:', error);
    }
  }
};
