// @ts-nocheck
import { ROUTES_REGISTRY } from '../../routerV2/registry';
import type { RouteMeta } from '../../routerV2/schema';
import type { Guard, Role, RouteDef, Segment } from './types';

const ROLE_MAP: Record<string, Role> = {
  consumer: 'user',
  employee: 'user',
  user: 'user',
  manager: 'manager',
  admin: 'admin',
  org_admin: 'org',
  org_owner: 'org',
  org: 'org',
};

const segmentFromPath = (path: string): Segment => {
  if (path.startsWith('/app/')) {
    return 'b2c';
  }
  if (path.startsWith('/b2b/')) {
    return 'b2b';
  }
  return 'public';
};

const buildGuards = (route: RouteMeta): Guard[] | undefined => {
  const guards: Guard[] = [];
  const segment = segmentFromPath(route.path);

  if (segment !== 'public' || route.guard || route.requireAuth) {
    guards.push({ type: 'auth', required: true });
  }

  const roleSet = new Set<Role>();
  if (route.role && ROLE_MAP[route.role]) {
    roleSet.add(ROLE_MAP[route.role]);
  }
  if (route.allowedRoles) {
    route.allowedRoles.forEach(role => {
      const mapped = ROLE_MAP[role];
      if (mapped) {
        roleSet.add(mapped);
      }
    });
  }

  if (roleSet.size > 0) {
    guards.push({ type: 'role', roles: Array.from(roleSet) });
  }

  return guards.length > 0 ? guards : undefined;
};

const shouldIncludeInSitemap = (route: RouteMeta): boolean => {
  if (route.deprecated) {
    return false;
  }
  if (route.path === '*' || route.path === '') {
    return false;
  }
  return true;
};

const canonicalRoutes = ROUTES_REGISTRY.filter(route => route.path && route.path !== '*');

export const ROUTES: RouteDef[] = canonicalRoutes.map(route => ({
  name: route.name,
  path: route.path,
  segment: segmentFromPath(route.path),
  guards: buildGuards(route),
  sitemap: shouldIncludeInSitemap(route),
}));

export const ROUTE_NAME_BY_PATH: Map<string, string> = new Map(
  ROUTES.map(route => [route.path, route.name]),
);

export const ROUTES_BY_NAME: Map<string, RouteDef> = new Map(
  ROUTES.map(route => [route.name, route]),
);
