
import { createBrowserRouter } from 'react-router-dom';
import { buildUnifiedRoutes } from './buildUnifiedRoutes.tsx';

console.log('🚀 Router index.tsx - Creating router...');

export const router = createBrowserRouter(buildUnifiedRoutes(), {
  basename: import.meta.env.BASE_URL ?? '/',
});

console.log('✅ Router created successfully:', router);
