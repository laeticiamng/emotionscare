import test from 'node:test';
import assert from 'node:assert/strict';
import { routes } from '@/router';
import ProtectedRoute from '@/components/ProtectedRoute';

// Verify that the B2C dashboard is protected by the auth guard
test('b2c dashboard route is wrapped with ProtectedRoute', () => {
  const b2cRoute = routes.find(r => r.path === 'b2c');
  assert.ok(b2cRoute, 'b2c route should exist');
  assert.equal(b2cRoute!.element.type, ProtectedRoute);
  const child = b2cRoute!.children?.find(c => c.path === 'dashboard');
  assert.ok(child, 'dashboard child route should exist');
});
