
import { createBrowserRouter } from 'react-router-dom';
import { buildUnifiedRoutes } from './buildUnifiedRoutes';

export const router = createBrowserRouter(buildUnifiedRoutes(), {
  basename: import.meta.env.BASE_URL ?? '/',
});
