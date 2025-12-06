// @ts-nocheck
export { router, routerV2 } from '@/routerV2/router';
export type { AppRouter } from '@/routerV2/router';

export {
  routes,
  publicRoutes,
  authRoutes,
  b2cRoutes,
  consumerRoutes,
  b2bRoutes,
  specialRoutes,
} from '@/routerV2/routes';
export type {
  PublicRoute,
  AuthRoute,
  B2CRoute,
  ConsumerRoute,
  B2BRoute,
  SpecialRoute,
  RoutesCompat,
} from '@/routerV2/routes';

export {
  ROUTE_ALIASES,
  ROUTE_ALIAS_ENTRIES,
  LegacyRedirect,
  findRedirectFor,
  isDeprecatedPath,
} from '@/routerV2/aliases';
export type { LegacyPath, RouteAlias } from '@/routerV2/aliases';

export { ROUTES_REGISTRY } from '@/routerV2/registry';
export { ROUTER_V2_MANIFEST } from '@/routerV2/manifest';
export { AuthGuard, RoleGuard, ModeGuard, RouteGuard } from '@/routerV2/guards';

export * from './types';
export { ROUTES, ROUTE_NAME_BY_PATH, ROUTES_BY_NAME } from './routes.config';
