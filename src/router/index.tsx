
import { createBrowserRouter } from 'react-router-dom';
import { buildUnifiedRoutes } from './buildUnifiedRoutes';

console.log('🚀 Configuration du router unifié (version corrigée)...');

export const router = createBrowserRouter(buildUnifiedRoutes(), {
  basename: import.meta.env.BASE_URL || '/',
});

console.log('✅ Router unifié configuré avec routes nettoyées');
console.log('📊 Nombre de routes:', router.routes.length);
