// @ts-nocheck
import { expect, test } from 'vitest';
import { ROUTES_REGISTRY } from '@/routerV2/registry';
import { ROUTE_ALIASES, type LegacyPath } from '@/routerV2/aliases';

const findRouteByAlias = (alias: string) =>
  ROUTES_REGISTRY.find(route => route.aliases?.includes(alias));

const expectProtectedDashboard = (
  alias: string,
  {
    path,
    role,
    extraAliases = [],
  }: {
    path: string;
    role: string;
    extraAliases?: string[];
  },
) => {
  const route = findRouteByAlias(alias);
  expect(route, `route for alias ${alias}`).toBeTruthy();
  expect(route?.path).toBe(path);
  expect(route?.guard).toBe(true);
  expect(route?.role).toBe(role);
  expect(route?.aliases).toContain(alias);
  for (const extraAlias of extraAliases) {
    expect(route?.aliases).toContain(extraAlias);
  }

  const aliasTarget = ROUTE_ALIASES[alias as LegacyPath];
  expect(aliasTarget, `alias redirect for ${alias}`).toBeTruthy();
  expect(aliasTarget).toBe(path);

  for (const extraAlias of extraAliases) {
    expect(ROUTE_ALIASES[extraAlias as LegacyPath]).toBe(path);
  }
};

test('b2c dashboard is served by RouterV2 with consumer guard', () => {
  expectProtectedDashboard('/b2c/dashboard', {
    path: '/app/home',
    role: 'consumer',
    extraAliases: ['/dashboard'],
  });
});

test('b2b user dashboard is routed via RouterV2 employee segment', () => {
  expectProtectedDashboard('/b2b/user/dashboard', {
    path: '/app/collab',
    role: 'employee',
  });
});

test('b2b admin dashboard is routed via RouterV2 manager segment', () => {
  expectProtectedDashboard('/b2b/admin/dashboard', {
    path: '/app/rh',
    role: 'manager',
  });
});
