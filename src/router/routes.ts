
import { RouteObject } from 'react-router-dom';
import { b2cRoutes } from './b2cRoutes';
import { b2bRoutes } from './b2bRoutes';
import { commonRoutes } from './commonRoutes';

export const routes: RouteObject[] = [
  ...commonRoutes,
  ...b2cRoutes,
  ...b2bRoutes,
];

export default routes;
