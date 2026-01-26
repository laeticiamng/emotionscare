// @ts-nocheck
/**
 * Tests du système de validation des routes
 */

import { describe, it, expect } from 'vitest';
import { RouteValidator, validator, routeValidationRules } from '../validation';
import type { RouteMeta } from '../schema';
import { ROUTES_REGISTRY } from '../registry';

describe('RouterV2 Validation', () => {
  describe('RouteValidator - Instance singleton', () => {
    it('should return the same instance', () => {
      const instance1 = RouteValidator.getInstance();
      const instance2 = RouteValidator.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should export default validator instance', () => {
      expect(validator).toBeDefined();
      expect(validator).toBeInstanceOf(RouteValidator);
    });
  });

  describe('Validation rules', () => {
    it('should have all required validation rules', () => {
      const ruleNames = routeValidationRules.map(r => r.name);
      
      expect(ruleNames).toContain('unique-paths');
      expect(ruleNames).toContain('valid-components');
      expect(ruleNames).toContain('authentication-consistency');
      expect(ruleNames).toContain('path-format');
      expect(ruleNames).toContain('deprecated-routes');
      expect(ruleNames).toContain('security-patterns');
    });

    it('should classify rules by level', () => {
      const errorRules = routeValidationRules.filter(r => r.level === 'error');
      const warningRules = routeValidationRules.filter(r => r.level === 'warning');
      
      expect(errorRules.length).toBeGreaterThan(0);
      expect(warningRules.length).toBeGreaterThan(0);
    });
  });

  describe('validateRoute - Individual route validation', () => {
    it('should validate a correct route', () => {
      const route: RouteMeta = {
        name: 'test',
        path: '/test',
        segment: 'public',
        component: 'TestPage',
        layout: 'marketing',
      };

      const result = validator.validateRoute(route);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing component', () => {
      const route: RouteMeta = {
        name: 'test',
        path: '/test',
        segment: 'public',
        component: '',
        layout: 'marketing',
      };

      const result = validator.validateRoute(route);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Composant manquant'))).toBe(true);
    });

    it('should warn about component naming', () => {
      const route: RouteMeta = {
        name: 'test',
        path: '/test',
        segment: 'public',
        component: 'TestComponent',
        layout: 'marketing',
      };

      const result = validator.validateRoute(route);
      expect(result.errors.some(e => e.includes("se terminer par 'Page'"))).toBe(true);
    });

    it('should detect invalid path format (missing leading slash)', () => {
      const route: RouteMeta = {
        name: 'test',
        path: 'test',
        segment: 'public',
        component: 'TestPage',
        layout: 'marketing',
      };

      const result = validator.validateRoute(route);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('doit commencer par'))).toBe(true);
    });

    it('should detect double slashes', () => {
      const route: RouteMeta = {
        name: 'test',
        path: '/test//page',
        segment: 'public',
        component: 'TestPage',
        layout: 'marketing',
      };

      const result = validator.validateRoute(route);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Double slashes'))).toBe(true);
    });

    it('should warn about underscores in path', () => {
      const route: RouteMeta = {
        name: 'test',
        path: '/test_page',
        segment: 'public',
        component: 'TestPage',
        layout: 'marketing',
      };

      const result = validator.validateRoute(route);
      expect(result.warnings.some(w => w.includes('tirets'))).toBe(true);
    });

    it('should detect authentication inconsistency', () => {
      const route: RouteMeta = {
        name: 'test',
        path: '/test',
        segment: 'consumer',
        component: 'TestPage',
        layout: 'app',
        requireAuth: true,
      };

      const result = validator.validateRoute(route);
      expect(result.errors.some(e => e.includes('aucun rôle défini'))).toBe(true);
    });

    it('should detect conflicting role definitions', () => {
      const route: RouteMeta = {
        name: 'test',
        path: '/test',
        segment: 'consumer',
        component: 'TestPage',
        layout: 'app',
        role: 'consumer',
        allowedRoles: ['consumer', 'employee'],
      };

      const result = validator.validateRoute(route);
      expect(result.errors.some(e => e.includes('inclus dans allowedRoles'))).toBe(true);
    });

    it('should warn about deprecated routes', () => {
      const route: RouteMeta = {
        name: 'test',
        path: '/test',
        segment: 'public',
        component: 'TestPage',
        layout: 'marketing',
        deprecated: true,
      };

      const result = validator.validateRoute(route);
      expect(result.warnings.some(w => w.includes('dépréciée'))).toBe(true);
    });

    it('should warn about admin routes without auth', () => {
      const route: RouteMeta = {
        name: 'admin-test',
        path: '/admin/test',
        segment: 'public',
        component: 'AdminTestPage',
        layout: 'app',
      };

      const result = validator.validateRoute(route);
      expect(result.warnings.some(w => w.includes('admin sans authentification'))).toBe(true);
    });

    it('should warn about sensitive routes without guards', () => {
      const route: RouteMeta = {
        name: 'settings',
        path: '/settings/test',
        segment: 'consumer',
        component: 'SettingsPage',
        layout: 'app',
      };

      const result = validator.validateRoute(route);
      expect(result.warnings.some(w => w.includes('sensible sans guard'))).toBe(true);
    });
  });

  describe('validateRegistry - Full registry validation', () => {
    it('should validate the complete registry', () => {
      const result = validator.validateRegistry(ROUTES_REGISTRY);
      
      // Log results for debugging
      if (!result.isValid) {
        console.log('Registry validation errors:', result.errors);
      }
      if (result.warnings.length > 0) {
        console.log('Registry validation warnings:', result.warnings.slice(0, 5));
      }
      
      // Registry should be valid
      expect(result.isValid).toBe(true);
    });

    it('should detect duplicate paths', () => {
      const routes: RouteMeta[] = [
        {
          name: 'test1',
          path: '/test',
          segment: 'public',
          component: 'Test1Page',
        },
        {
          name: 'test2',
          path: '/test',
          segment: 'public',
          component: 'Test2Page',
        },
      ];

      const result = validator.validateRegistry(routes);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Chemins dupliqués'))).toBe(true);
    });

    it('should detect duplicate names', () => {
      const routes: RouteMeta[] = [
        {
          name: 'test',
          path: '/test1',
          segment: 'public',
          component: 'Test1Page',
        },
        {
          name: 'test',
          path: '/test2',
          segment: 'public',
          component: 'Test2Page',
        },
      ];

      const result = validator.validateRegistry(routes);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Noms de routes dupliqués'))).toBe(true);
    });

    it('should warn about duplicate aliases', () => {
      const routes: RouteMeta[] = [
        {
          name: 'test1',
          path: '/test1',
          segment: 'public',
          component: 'Test1Page',
          aliases: ['/old-test'],
        },
        {
          name: 'test2',
          path: '/test2',
          segment: 'public',
          component: 'Test2Page',
          aliases: ['/old-test'],
        },
      ];

      const result = validator.validateRegistry(routes);
      expect(result.warnings.some(w => w.includes('Alias dupliqués'))).toBe(true);
    });

    it('should detect missing essential routes', () => {
      const routes: RouteMeta[] = [
        {
          name: 'test',
          path: '/test',
          segment: 'public',
          component: 'TestPage',
        },
      ];

      const result = validator.validateRegistry(routes);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Routes essentielles manquantes'))).toBe(true);
    });

    it('should pass with all essential routes', () => {
      const routes: RouteMeta[] = [
        {
          name: 'home',
          path: '/',
          segment: 'public',
          component: 'HomePage',
        },
        {
          name: 'login',
          path: '/login',
          segment: 'public',
          component: 'LoginPage',
        },
        {
          name: 'not-found',
          path: '/404',
          segment: 'public',
          component: 'NotFoundPage',
        },
      ];

      const result = validator.validateRegistry(routes);
      expect(result.isValid).toBe(true);
    });
  });

  describe('generateValidationReport', () => {
    it('should generate a report for valid registry', () => {
      const routes: RouteMeta[] = [
        {
          name: 'home',
          path: '/',
          segment: 'public',
          component: 'HomePage',
        },
        {
          name: 'login',
          path: '/login',
          segment: 'public',
          component: 'LoginPage',
        },
        {
          name: 'not-found',
          path: '/404',
          segment: 'public',
          component: 'NotFoundPage',
        },
      ];

      const report = validator.generateValidationReport(routes);
      
      expect(report).toContain('Rapport de Validation');
      expect(report).toContain('Total routes: 3');
      expect(report).toContain('✅ Valide');
      expect(report).toContain('Configuration parfaite');
    });

    it('should generate a report with errors', () => {
      const routes: RouteMeta[] = [
        {
          name: 'test',
          path: 'invalid',
          segment: 'public',
          component: '',
        },
      ];

      const report = validator.generateValidationReport(routes);
      
      expect(report).toContain('❌ Erreurs');
      expect(report).not.toContain('Configuration parfaite');
    });

    it('should generate a report with warnings', () => {
      const routes: RouteMeta[] = [
        {
          name: 'home',
          path: '/',
          segment: 'public',
          component: 'HomePage',
        },
        {
          name: 'login',
          path: '/login',
          segment: 'public',
          component: 'LoginPage',
        },
        {
          name: 'not-found',
          path: '/404',
          segment: 'public',
          component: 'NotFoundPage',
        },
        {
          name: 'old',
          path: '/old_page',
          segment: 'public',
          component: 'OldPage',
          deprecated: true,
        },
      ];

      const report = validator.generateValidationReport(routes);
      
      expect(report).toContain('⚠️ Avertissements');
    });
  });

  describe('Real registry validation', () => {
    it('should validate actual ROUTES_REGISTRY', () => {
      const result = validator.validateRegistry(ROUTES_REGISTRY);
      const report = validator.generateValidationReport(ROUTES_REGISTRY);
      
      console.log('\n📊 VALIDATION DU REGISTRY RÉEL\n');
      console.log(report);
      
      // Should be valid
      expect(result.isValid).toBe(true);
      
      // Log warnings if any
      if (result.warnings.length > 0) {
        console.log(`⚠️  ${result.warnings.length} avertissements (non bloquants)`);
      }
    });

    it('should have no duplicate paths in registry', () => {
      const paths = ROUTES_REGISTRY.map(r => r.path);
      const uniquePaths = new Set(paths);
      
      expect(paths.length).toBe(uniquePaths.size);
    });

    it('should have no duplicate names in registry', () => {
      const names = ROUTES_REGISTRY.map(r => r.name);
      const uniqueNames = new Set(names);
      
      expect(names.length).toBe(uniqueNames.size);
    });

    it('should have all essential routes', () => {
      const paths = ROUTES_REGISTRY.map(r => r.path);
      
      expect(paths).toContain('/');
      expect(paths).toContain('/login');
      expect(paths).toContain('/404');
    });
  });
});
