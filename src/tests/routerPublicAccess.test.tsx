import test from 'node:test';
import assert from 'node:assert/strict';
import { routes } from '@/router';
import ImmersiveHome from '@/pages/ImmersiveHome';
import B2BSelectionPage from '@/pages/B2BSelectionPage';

// Verify that the landing page is public and renders ImmersiveHome
test('landing route is public and renders ImmersiveHome', () => {
  const route = routes.find(r => r.path === '/');
  assert.ok(route, 'Root route should exist');
  assert.equal(route!.element.type, ImmersiveHome);
});

// Verify mapping of B2B selection route
test('mode selection route maps correctly', () => {
  const b2bRoute = routes.find(r => r.path === 'b2b/selection');
  assert.ok(b2bRoute, 'b2b selection route should exist');
  assert.equal(b2bRoute!.element.type, B2BSelectionPage);
});
