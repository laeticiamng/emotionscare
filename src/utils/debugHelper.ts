
/**
 * Utilitaire de débogage pour l'application
 * 
 * Ce fichier contient diverses fonctions utiles pour le débogage
 */

export const checkEnvironment = () => {
  console.group('🔍 Vérification de l\'environnement');
  console.log('NODE_ENV:', import.meta.env.NODE_ENV);
  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL || 'Non défini');
  console.log('BASE_URL:', import.meta.env.BASE_URL);
  console.log('Mode DEV?', import.meta.env.DEV);
  console.log('Mode PROD?', import.meta.env.PROD);
  console.groupEnd();
};

export const checkDOMElement = (id: string) => {
  const element = document.getElementById(id);
  console.log(`📌 Élément #${id} existe:`, !!element);
  if (element) {
    console.log(`📌 Contenu de #${id}:`, element.innerHTML.substring(0, 100) + '...');
  }
};

export const logRouterState = (router: any) => {
  try {
    console.group('🧭 État du Router');
    console.log('Routes:', router.routes);
    console.log('Location actuelle:', window.location.pathname);
    console.groupEnd();
  } catch (error) {
    console.error('Erreur lors de l\'affichage de l\'état du router:', error);
  }
};

// Ajouter cet utilitaire à window pour l'utiliser dans la console
if (typeof window !== 'undefined') {
  (window as any).__DEBUG_UTILS__ = {
    checkEnvironment,
    checkDOMElement,
    logRouterState
  };
}
