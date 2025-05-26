
// Validation des dépendances critiques au démarrage
export const validateStartup = (): boolean => {
  const criticalDependencies = [
    'React',
    'ReactDOM',
    'Vite'
  ];

  const missingDeps: string[] = [];

  // Vérifier React
  if (typeof React === 'undefined') {
    missingDeps.push('React');
  }

  // Vérifier que nous sommes dans un navigateur
  if (typeof window === 'undefined') {
    console.warn('⚠️ Environment de navigateur non détecté');
    return false;
  }

  // Vérifier les APIs critiques du navigateur
  const criticalAPIs = ['fetch', 'localStorage', 'sessionStorage'];
  criticalAPIs.forEach(api => {
    if (!(api in window)) {
      missingDeps.push(api);
    }
  });

  if (missingDeps.length > 0) {
    console.error('❌ Dépendances manquantes:', missingDeps);
    return false;
  }

  console.log('✅ Validation du démarrage réussie');
  return true;
};

export const checkEnvironment = (): void => {
  const env = import.meta.env;
  
  if (!env.PROD && !env.DEV) {
    console.warn('⚠️ Mode d\'environnement non reconnu');
  }

  if (env.DEV) {
    console.log('🔧 Mode développement activé');
  }

  if (env.PROD) {
    console.log('🚀 Mode production activé');
  }
};
