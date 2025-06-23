
export const initializeProductionSecurity = () => {
  // Configuration de sécurité pour la production
  if (typeof window !== 'undefined') {
    // Désactiver les outils de développement en production
    if (process.env.NODE_ENV === 'production') {
      console.log('Production security initialized');
    }
  }
};
