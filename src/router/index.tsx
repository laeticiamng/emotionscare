
import { createBrowserRouter } from 'react-router-dom';
import { buildUnifiedRoutes } from './buildUnifiedRoutes';

console.log('%c[Router] Configuration du router unifié avec imports directs...', 'color:purple; font-weight:bold');

// CRÉATION DU ROUTER AVEC STRUCTURE SIMPLE
export const router = createBrowserRouter(buildUnifiedRoutes(), {
  basename: import.meta.env.BASE_URL || '/',
});

console.log('%c[Router] ✅ Router unifié configuré', 'color:green; font-weight:bold');
console.log('%c[Router] Nombre de routes:', 'color:blue', router.routes.length);
