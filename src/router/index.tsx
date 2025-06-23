
import { createBrowserRouter } from 'react-router-dom';
import { buildUnifiedRoutes } from './buildUnifiedRoutes';

console.log('🚀 Configuration du router unifié...');

export const router = createBrowserRouter(buildUnifiedRoutes(), {
  basename: import.meta.env.BASE_URL || '/',
});

console.log('✅ Router unifié configuré avec toutes les routes modulaires');
