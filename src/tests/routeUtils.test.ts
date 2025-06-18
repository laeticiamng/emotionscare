
import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  getLoginRoute, 
  getDashboardRoute, 
  isValidRoute, 
  UNIFIED_ROUTES,
  getContextualRedirect,
  getFeatureRoute,
  validateUniqueRoutes
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

test('isValidRoute validates unified routes only', () => {
  assert.equal(isValidRoute('/b2b/user/login'), true);
  assert.equal(isValidRoute('/choose-mode'), true);
  assert.equal(isValidRoute('/b2c/login'), true);
  assert.equal(isValidRoute('/scan'), true);
  assert.equal(isValidRoute('/music'), true);
  assert.equal(isValidRoute('/coach'), true);
  assert.equal(isValidRoute('/invalid-route'), false);
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

test('All routes in UNIFIED_ROUTES are unique - VALIDATION CRITIQUE', () => {
  const routes = Object.values(UNIFIED_ROUTES);
  const uniqueRoutes = new Set(routes);
  assert.equal(routes.length, uniqueRoutes.size, 'ERREUR CRITIQUE: Des doublons de routes détectés!');
});

test('validateUniqueRoutes function works correctly', () => {
  assert.equal(validateUniqueRoutes(), true, 'La validation d\'unicité des routes doit passer');
});

test('No duplicate functionality paths exist', () => {
  const functionalityRoutes = [
    UNIFIED_ROUTES.SCAN,
    UNIFIED_ROUTES.MUSIC,
    UNIFIED_ROUTES.COACH,
    UNIFIED_ROUTES.JOURNAL,
    UNIFIED_ROUTES.VR,
    UNIFIED_ROUTES.SETTINGS,
    UNIFIED_ROUTES.PREFERENCES,
    UNIFIED_ROUTES.GAMIFICATION,
    UNIFIED_ROUTES.SOCIAL_COCON
  ];
  
  const uniqueFunctionalities = new Set(functionalityRoutes);
  assert.equal(functionalityRoutes.length, uniqueFunctionalities.size, 'Toutes les routes de fonctionnalités doivent être uniques');
});
