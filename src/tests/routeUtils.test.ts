
import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  getLoginRoute, 
  getDashboardRoute, 
  isValidRoute, 
  CURRENT_ROUTES,
  getContextualRedirect,
  getFeatureRoute 
} from '@/utils/routeUtils';

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
  assert.equal(isValidRoute('/b2c/login'), true);
  assert.equal(isValidRoute('/scan'), true);
  assert.equal(isValidRoute('/music'), true);
  assert.equal(isValidRoute('/coach'), true);
});

test('getFeatureRoute returns unique paths', () => {
  assert.equal(getFeatureRoute('SCAN'), '/scan');
  assert.equal(getFeatureRoute('MUSIC'), '/music');
  assert.equal(getFeatureRoute('COACH'), '/coach');
  assert.equal(getFeatureRoute('JOURNAL'), '/journal');
  assert.equal(getFeatureRoute('VR'), '/vr');
  assert.equal(getFeatureRoute('SETTINGS'), '/settings');
});

test('getContextualRedirect works correctly', () => {
  assert.equal(getContextualRedirect(), '/choose-mode');
  assert.equal(getContextualRedirect('b2c'), '/b2c/dashboard');
  assert.equal(getContextualRedirect('b2b_user'), '/b2b/user/dashboard');
  assert.equal(getContextualRedirect('b2b_admin'), '/b2b/admin/dashboard');
});

test('All routes in CURRENT_ROUTES are unique', () => {
  const routes = Object.values(CURRENT_ROUTES);
  const uniqueRoutes = new Set(routes);
  assert.equal(routes.length, uniqueRoutes.size, 'All routes should be unique');
});

test('No duplicate functionality paths exist', () => {
  const functionalityRoutes = [
    CURRENT_ROUTES.SCAN,
    CURRENT_ROUTES.MUSIC,
    CURRENT_ROUTES.COACH,
    CURRENT_ROUTES.JOURNAL,
    CURRENT_ROUTES.VR,
    CURRENT_ROUTES.SETTINGS,
    CURRENT_ROUTES.PREFERENCES,
    CURRENT_ROUTES.GAMIFICATION,
    CURRENT_ROUTES.SOCIAL_COCON
  ];
  
  const uniqueFunctionalities = new Set(functionalityRoutes);
  assert.equal(functionalityRoutes.length, uniqueFunctionalities.size, 'All functionality routes should be unique');
});
