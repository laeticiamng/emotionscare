
export function validateStartup(): boolean {
  try {
    // Check if React is available
    if (typeof React === 'undefined') {
      console.error('React is not available');
      return false;
    }

    // Check if required DOM elements exist
    if (typeof document === 'undefined' || !document.getElementById('root')) {
      console.error('Root element not found');
      return false;
    }

    console.log('✅ Startup validation passed');
    return true;
  } catch (error) {
    console.error('Startup validation error:', error);
    return false;
  }
}
