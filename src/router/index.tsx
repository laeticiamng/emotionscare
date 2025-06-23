
import { createBrowserRouter } from 'react-router-dom';
import { createAppRoutes } from './AppRoutes';

// Utilise la configuration modulaire complète des routes
console.log('🔧 Configuration du router avec toutes les routes...');

export const router = createBrowserRouter(createAppRoutes());

console.log('✅ Router configuré avec', router.routes);
