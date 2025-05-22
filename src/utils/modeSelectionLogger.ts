
type ModeSelectionEvent = 
  | 'home_view'
  | 'b2c_selected'
  | 'b2b_selected'
  | 'login_attempt'
  | 'login_success'
  | 'login_failure'
  | 'register_attempt'
  | 'register_success'
  | 'register_failure'
  | 'logout';

export const logModeSelection = (event: ModeSelectionEvent, details?: Record<string, any>): void => {
  // In a real app, this would send analytics data
  console.log(`Mode Selection Event: ${event}`, details || {});
  
  // You could implement more advanced logging here
  // Such as sending to an analytics service, local storage, or backend
  
  // For demo purposes, we'll just log to console
  const timestamp = new Date().toISOString();
  const userId = localStorage.getItem('auth_user') 
    ? JSON.parse(localStorage.getItem('auth_user') || '{}').id 
    : 'guest';
  
  const logData = {
    event,
    timestamp,
    userId,
    ...details
  };
  
  console.log('Mode selection log:', logData);
};
