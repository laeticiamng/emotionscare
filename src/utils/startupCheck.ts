
export const validateStartup = (): boolean => {
  try {
    // Vérifier que React est disponible
    if (typeof React === 'undefined') {
      console.error('❌ React is not available globally');
      return false;
    }

    // Vérifier que les hooks React sont disponibles
    if (!React.useState || !React.useEffect) {
      console.error('❌ React hooks are not available');
      return false;
    }

    // Vérifier que le DOM est prêt
    if (!document.getElementById('root')) {
      console.error('❌ Root element not found');
      return false;
    }

    // Vérifier que les modules React essentiels sont chargés
    if (typeof React.createElement !== 'function') {
      console.error('❌ React.createElement is not available');
      return false;
    }

    console.log('✅ Startup validation successful');
    return true;
  } catch (error) {
    console.error('❌ Startup validation failed:', error);
    return false;
  }
};
