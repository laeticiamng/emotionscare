
import test from 'node:test';
import assert from 'node:assert/strict';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';

test('all dashboard routes use unified paths', () => {
  assert.equal(UNIFIED_ROUTES.B2C_DASHBOARD, '/b2c/dashboard');
  assert.equal(UNIFIED_ROUTES.B2B_USER_DASHBOARD, '/b2b/user/dashboard');
  assert.equal(UNIFIED_ROUTES.B2B_ADMIN_DASHBOARD, '/b2b/admin/dashboard');
});

test('all auth routes use unified paths', () => {
  assert.equal(UNIFIED_ROUTES.B2C_LOGIN, '/b2c/login');
  assert.equal(UNIFIED_ROUTES.B2C_REGISTER, '/b2c/register');
  assert.equal(UNIFIED_ROUTES.B2B_USER_LOGIN, '/b2b/user/login');
  assert.equal(UNIFIED_ROUTES.B2B_USER_REGISTER, '/b2b/user/register');
  assert.equal(UNIFIED_ROUTES.B2B_ADMIN_LOGIN, '/b2b/admin/login');
});

test('all feature routes use unified paths', () => {
  assert.equal(UNIFIED_ROUTES.SCAN, '/scan');
  assert.equal(UNIFIED_ROUTES.MUSIC, '/music');
  assert.equal(UNIFIED_ROUTES.COACH, '/coach');
  assert.equal(UNIFIED_ROUTES.JOURNAL, '/journal');
  assert.equal(UNIFIED_ROUTES.VR, '/vr');
  assert.equal(UNIFIED_ROUTES.PREFERENCES, '/preferences');
  assert.equal(UNIFIED_ROUTES.GAMIFICATION, '/gamification');
  assert.equal(UNIFIED_ROUTES.SOCIAL_COCON, '/social-cocon');
});

test('admin-only routes use unified paths', () => {
  assert.equal(UNIFIED_ROUTES.TEAMS, '/teams');
  assert.equal(UNIFIED_ROUTES.REPORTS, '/reports');
  assert.equal(UNIFIED_ROUTES.EVENTS, '/events');
  assert.equal(UNIFIED_ROUTES.OPTIMISATION, '/optimisation');
  assert.equal(UNIFIED_ROUTES.SETTINGS, '/settings');
});
