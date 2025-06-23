
import { createBrowserRouter } from 'react-router-dom';
import { buildUnifiedRoutes } from './buildUnifiedRoutes';

console.log('%c[Router] Initializing unified router...', 'color:purple; font-weight:bold');

export const router = createBrowserRouter(buildUnifiedRoutes(), {
  basename: import.meta.env.BASE_URL ?? '/',
});

console.log('%c[Router] ✅ Router initialized with unified routes', 'color:green; font-weight:bold');
