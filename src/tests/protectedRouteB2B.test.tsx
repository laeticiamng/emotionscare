import test from 'node:test';
import assert from 'node:assert/strict';
import { routes } from '@/router';
import ProtectedRoute from '@/components/ProtectedRoute';

// Ensure B2B user dashboard route is protected

test('b2b user dashboard route is wrapped with ProtectedRoute', () => {
  const b2bUserRoute = routes.find(r => r.path === 'b2b/user');
  assert.ok(b2bUserRoute, 'b2b user route should exist');
  assert.equal(b2bUserRoute!.element.type, ProtectedRoute);
  const child = b2bUserRoute!.children?.find(c => c.path === 'dashboard');
  assert.ok(child, 'dashboard child route should exist');
});

// Ensure B2B admin dashboard route is protected

test('b2b admin dashboard route is wrapped with ProtectedRoute', () => {
  const b2bAdminRoute = routes.find(r => r.path === 'b2b/admin');
  assert.ok(b2bAdminRoute, 'b2b admin route should exist');
  assert.equal(b2bAdminRoute!.element.type, ProtectedRoute);
  const child = b2bAdminRoute!.children?.find(c => c.path === 'dashboard');
  assert.ok(child, 'dashboard child route should exist');
});
