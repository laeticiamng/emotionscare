export { router, routerV2 } from './router';
export type { AppRouter } from './router';

export {
  routes,
  publicRoutes,
  authRoutes,
  b2cRoutes,
  consumerRoutes,
  b2bRoutes,
  specialRoutes,
  Routes,
} from './routes';
export type {
  PublicRoute,
  AuthRoute,
  B2CRoute,
  ConsumerRoute,
  B2BRoute,
  SpecialRoute,
  RoutesCompat,
} from './routes';

export {
  ROUTE_ALIASES,
  ROUTE_ALIAS_ENTRIES,
  LegacyRedirect,
  findRedirectFor,
  isDeprecatedPath,
} from './aliases';
export type { LegacyPath, RouteAlias } from './aliases';

export { ROUTES_REGISTRY } from './registry';
export { ROUTER_V2_MANIFEST } from './manifest';

export { AuthGuard, RoleGuard, ModeGuard, RouteGuard } from './guards';
