
import test from 'node:test';
import assert from 'node:assert/strict';
import { getLoginRoute, getDashboardRoute, isValidRoute, CURRENT_ROUTES } from '@/utils/routeUtils';

test('getLoginRoute returns correct B2B user login path', () => {
  assert.equal(getLoginRoute('b2b_user'), '/b2b/user/login');
});

test('getLoginRoute returns correct B2B admin login path', () => {
  assert.equal(getLoginRoute('b2b_admin'), '/b2b/admin/login');
});

test('getLoginRoute returns correct B2C login path', () => {
  assert.equal(getLoginRoute('b2c'), '/b2c/login');
});

test('getDashboardRoute returns correct paths', () => {
  assert.equal(getDashboardRoute('b2b_user'), '/b2b/user/dashboard');
  assert.equal(getDashboardRoute('b2b_admin'), '/b2b/admin/dashboard');
  assert.equal(getDashboardRoute('b2c'), '/b2c/dashboard');
});

test('isValidRoute validates current routes only', () => {
  assert.equal(isValidRoute('/b2b/user/login'), true);
  assert.equal(isValidRoute('/choose-mode'), true);
  assert.equal(isValidRoute('/login-collaborateur'), false); // Legacy route should be invalid
  assert.equal(isValidRoute('/login-admin'), false); // Legacy route should be invalid
});

test('CURRENT_ROUTES contains no legacy paths', () => {
  const routes = Object.values(CURRENT_ROUTES);
  assert.equal(routes.includes('/login-collaborateur' as any), false);
  assert.equal(routes.includes('/login-admin' as any), false);
  assert.equal(routes.includes('/login' as any), false);
});
