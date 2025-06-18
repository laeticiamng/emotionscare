
import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  UNIFIED_ROUTES,
  validateUniqueRoutes,
  getLoginRoute,
  getDashboardRoute,
  getFeatureRoute
} from '@/utils/routeUtils';

test('Point 14 - Validation totale de l\'unicité des routes', () => {
  const routes = Object.values(UNIFIED_ROUTES);
  const uniqueRoutes = new Set(routes);
  
  assert.equal(
    routes.length, 
    uniqueRoutes.size, 
    'ERREUR CRITIQUE POINT 14: Des doublons de routes détectés!'
  );
  
  assert.equal(routes.length, 24, 'Le nombre total de routes doit être de 24');
});

test('Point 14 - Fonction de validation automatique', () => {
  assert.equal(validateUniqueRoutes(), true, 'La validation d\'unicité doit réussir');
});

test('Point 14 - Fonctions utilitaires unifiées', () => {
  // Test des fonctions de login
  assert.equal(getLoginRoute('b2c'), '/b2c/login');
  assert.equal(getLoginRoute('b2b_user'), '/b2b/user/login');
  assert.equal(getLoginRoute('b2b_admin'), '/b2b/admin/login');
  
  // Test des fonctions de dashboard
  assert.equal(getDashboardRoute('b2c'), '/b2c/dashboard');
  assert.equal(getDashboardRoute('b2b_user'), '/b2b/user/dashboard');
  assert.equal(getDashboardRoute('b2b_admin'), '/b2b/admin/dashboard');
  
  // Test des fonctions de fonctionnalités
  assert.equal(getFeatureRoute('SCAN'), '/scan');
  assert.equal(getFeatureRoute('MUSIC'), '/music');
  assert.equal(getFeatureRoute('COACH'), '/coach');
});

test('Point 14 - Aucun chemin dupliqué pour les fonctionnalités', () => {
  const featureRoutes = [
    UNIFIED_ROUTES.SCAN,
    UNIFIED_ROUTES.MUSIC,
    UNIFIED_ROUTES.COACH,
    UNIFIED_ROUTES.JOURNAL,
    UNIFIED_ROUTES.VR,
    UNIFIED_ROUTES.PREFERENCES,
    UNIFIED_ROUTES.GAMIFICATION,
    UNIFIED_ROUTES.SOCIAL_COCON,
    UNIFIED_ROUTES.TEAMS,
    UNIFIED_ROUTES.REPORTS,
    UNIFIED_ROUTES.EVENTS,
    UNIFIED_ROUTES.OPTIMISATION,
    UNIFIED_ROUTES.SETTINGS
  ];
  
  const uniqueFeatures = new Set(featureRoutes);
  assert.equal(
    featureRoutes.length, 
    uniqueFeatures.size, 
    'Toutes les routes de fonctionnalités doivent être uniques'
  );
});

test('Point 14 - Validation de l\'architecture unifiée complète', () => {
  // Vérification que chaque route est bien définie et unique
  const requiredRoutes = [
    'HOME', 'CHOOSE_MODE', 'B2B_SELECTION',
    'B2C_LOGIN', 'B2C_REGISTER', 'B2B_USER_LOGIN', 'B2B_USER_REGISTER', 'B2B_ADMIN_LOGIN',
    'B2C_DASHBOARD', 'B2B_USER_DASHBOARD', 'B2B_ADMIN_DASHBOARD',
    'SCAN', 'MUSIC', 'COACH', 'JOURNAL', 'VR', 'PREFERENCES', 'GAMIFICATION', 'SOCIAL_COCON',
    'TEAMS', 'REPORTS', 'EVENTS', 'OPTIMISATION', 'SETTINGS'
  ];
  
  for (const route of requiredRoutes) {
    assert.ok(
      UNIFIED_ROUTES[route as keyof typeof UNIFIED_ROUTES], 
      `La route ${route} doit être définie`
    );
  }
  
  assert.equal(
    Object.keys(UNIFIED_ROUTES).length, 
    requiredRoutes.length, 
    'Le nombre de routes doit correspondre exactement'
  );
});
