import { test, expect } from 'vitest';
import { routes } from '@/router';
import ProtectedRoute from '@/components/ProtectedRoute';

function findRoute(path: string) {
  return routes.find(r => r.path === path);
}

test('b2c dashboard routes protected', () => {
  const b2c = findRoute('b2c');
  expect(b2c).toBeTruthy();
  expect(b2c!.element.type).toBe(ProtectedRoute);
  expect(b2c!.element.props.requiredRole).toBe('b2c');
  const expected = ['dashboard', 'journal', 'scan', 'music', 'coach', 'coach-chat', 'vr', 'preferences', 'settings', 'cocon', 'social-cocon', 'gamification'];
  for (const p of expected) {
    expect(b2c!.children?.some(c => c.path === p)).toBeTruthy();
  }
});

test('b2b user dashboard routes protected', () => {
  const user = findRoute('b2b/user');
  expect(user).toBeTruthy();
  expect(user!.element.type).toBe(ProtectedRoute);
  expect(user!.element.props.requiredRole).toBe('b2b_user');
  const expected = ['dashboard', 'journal', 'scan', 'music', 'coach', 'vr', 'preferences', 'settings', 'cocon', 'social-cocon', 'gamification'];
  for (const p of expected) {
    expect(user!.children?.some(c => c.path === p)).toBeTruthy();
  }
});

test('b2b admin dashboard routes protected', () => {
  const admin = findRoute('b2b/admin');
  expect(admin).toBeTruthy();
  expect(admin!.element.type).toBe(ProtectedRoute);
  expect(admin!.element.props.requiredRole).toBe('b2b_admin');
  const expected = ['dashboard', 'journal', 'scan', 'music', 'teams', 'reports', 'events', 'social-cocon', 'optimisation', 'settings'];
  for (const p of expected) {
    expect(admin!.children?.some(c => c.path === p)).toBeTruthy();
  }
});
