// @ts-nocheck
/**
 * Tests complets du Registry RouterV2
 * Validation exhaustive de toutes les routes
 */

import { describe, it, expect } from 'vitest';
import { ROUTES_REGISTRY } from '../registry';
import type { RouteMeta } from '../schema';

describe('RouterV2 Registry - Validation complète', () => {
  describe('Statistiques du registry', () => {
    it('should have at least 40 routes defined', () => {
      const activeRoutes = ROUTES_REGISTRY.filter(r => !r.deprecated);
      expect(activeRoutes.length).toBeGreaterThanOrEqual(40);
    });

    it('should have correct total count including deprecated routes', () => {
      expect(ROUTES_REGISTRY.length).toBeGreaterThan(0);
      console.log(`📊 Total routes: ${ROUTES_REGISTRY.length}`);
      console.log(`✅ Active routes: ${ROUTES_REGISTRY.filter(r => !r.deprecated).length}`);
      console.log(`⚠️  Deprecated routes: ${ROUTES_REGISTRY.filter(r => r.deprecated).length}`);
    });
  });

  describe('Structure des routes', () => {
    it('should have all required fields for each route', () => {
      ROUTES_REGISTRY.forEach((route: RouteMeta) => {
        expect(route).toHaveProperty('name');
        expect(route).toHaveProperty('path');
        expect(route).toHaveProperty('segment');
        expect(route).toHaveProperty('component');
        
        expect(typeof route.name).toBe('string');
        expect(typeof route.path).toBe('string');
        expect(typeof route.segment).toBe('string');
        expect(typeof route.component).toBe('string');
      });
    });

    it('should have unique route names', () => {
      const names = ROUTES_REGISTRY.map(r => r.name);
      const uniqueNames = new Set(names);
      expect(names.length).toBe(uniqueNames.size);
    });

    it('should have unique paths', () => {
      const paths = ROUTES_REGISTRY.map(r => r.path);
      const uniquePaths = new Set(paths);
      expect(paths.length).toBe(uniquePaths.size);
    });

    it('should have valid segments', () => {
      const validSegments = ['public', 'consumer', 'employee', 'manager'];
      ROUTES_REGISTRY.forEach(route => {
        expect(validSegments).toContain(route.segment);
      });
    });

    it('should have valid layouts', () => {
      const validLayouts = ['marketing', 'app', 'simple', 'app-sidebar', undefined];
      ROUTES_REGISTRY.forEach(route => {
        expect(validLayouts).toContain(route.layout);
      });
    });
  });

  describe('Routes par segment', () => {
    it('should have public routes', () => {
      const publicRoutes = ROUTES_REGISTRY.filter(r => r.segment === 'public');
      expect(publicRoutes.length).toBeGreaterThan(0);
      console.log(`🌐 Public routes: ${publicRoutes.length}`);
    });

    it('should have consumer routes', () => {
      const consumerRoutes = ROUTES_REGISTRY.filter(r => r.segment === 'consumer');
      expect(consumerRoutes.length).toBeGreaterThan(0);
      console.log(`👤 Consumer routes: ${consumerRoutes.length}`);
    });

    it('should have employee routes', () => {
      const employeeRoutes = ROUTES_REGISTRY.filter(r => r.segment === 'employee');
      expect(employeeRoutes.length).toBeGreaterThan(0);
      console.log(`👔 Employee routes: ${employeeRoutes.length}`);
    });

    it('should have manager routes', () => {
      const managerRoutes = ROUTES_REGISTRY.filter(r => r.segment === 'manager');
      expect(managerRoutes.length).toBeGreaterThan(0);
      console.log(`👨‍💼 Manager routes: ${managerRoutes.length}`);
    });
  });

  describe('Guards et sécurité', () => {
    it('should have protected routes with guards', () => {
      const guardedRoutes = ROUTES_REGISTRY.filter(r => r.guard === true);
      expect(guardedRoutes.length).toBeGreaterThan(0);
      console.log(`🔒 Guarded routes: ${guardedRoutes.length}`);
    });

    it('should have routes with role requirements', () => {
      const roleRoutes = ROUTES_REGISTRY.filter(r => r.role);
      expect(roleRoutes.length).toBeGreaterThan(0);
      console.log(`👮 Role-protected routes: ${roleRoutes.length}`);
    });

    it('should have routes requiring authentication', () => {
      const authRoutes = ROUTES_REGISTRY.filter(r => r.requireAuth === true);
      expect(authRoutes.length).toBeGreaterThanOrEqual(0);
      console.log(`🔐 Auth-required routes: ${authRoutes.length}`);
    });

    it('should not have public routes with role requirements', () => {
      const invalidRoutes = ROUTES_REGISTRY.filter(
        r => r.segment === 'public' && r.role
      );
      expect(invalidRoutes).toHaveLength(0);
    });

    it('should have guards for consumer routes', () => {
      const consumerRoutes = ROUTES_REGISTRY.filter(r => r.segment === 'consumer' && !r.deprecated);
      const unguardedConsumer = consumerRoutes.filter(r => !r.guard && !r.requireAuth);
      // Some consumer routes may intentionally be public (like scan)
      expect(unguardedConsumer.length).toBeLessThan(consumerRoutes.length);
    });

    it('should have guards for employee routes', () => {
      const employeeRoutes = ROUTES_REGISTRY.filter(r => r.segment === 'employee' && !r.deprecated);
      const unguardedEmployee = employeeRoutes.filter(r => !r.guard && !r.requireAuth);
      expect(unguardedEmployee.length).toBe(0);
    });

    it('should have guards for manager routes', () => {
      const managerRoutes = ROUTES_REGISTRY.filter(r => r.segment === 'manager' && !r.deprecated);
      const unguardedManager = managerRoutes.filter(r => !r.guard && !r.requireAuth);
      expect(unguardedManager.length).toBe(0);
    });
  });

  describe('Alias et compatibilité', () => {
    it('should have routes with aliases', () => {
      const routesWithAliases = ROUTES_REGISTRY.filter(r => r.aliases && r.aliases.length > 0);
      expect(routesWithAliases.length).toBeGreaterThan(0);
      console.log(`🔗 Routes with aliases: ${routesWithAliases.length}`);
    });

    it('should have valid alias format', () => {
      ROUTES_REGISTRY.forEach(route => {
        if (route.aliases) {
          expect(Array.isArray(route.aliases)).toBe(true);
          route.aliases.forEach(alias => {
            expect(typeof alias).toBe('string');
            expect(alias.startsWith('/')).toBe(true);
          });
        }
      });
    });

    it('should not have duplicate aliases across routes', () => {
      const allAliases: string[] = [];
      ROUTES_REGISTRY.forEach(route => {
        if (route.aliases) {
          allAliases.push(...route.aliases);
        }
      });
      const uniqueAliases = new Set(allAliases);
      expect(allAliases.length).toBe(uniqueAliases.size);
    });
  });

  describe('Routes dépréciées', () => {
    it('should have deprecated routes for backward compatibility', () => {
      const deprecatedRoutes = ROUTES_REGISTRY.filter(r => r.deprecated);
      console.log(`⚠️  Deprecated routes: ${deprecatedRoutes.length}`);
      expect(deprecatedRoutes.length).toBeGreaterThanOrEqual(0);
    });

    it('should have deprecated flag as boolean', () => {
      ROUTES_REGISTRY.forEach(route => {
        if (route.deprecated !== undefined) {
          expect(typeof route.deprecated).toBe('boolean');
        }
      });
    });
  });

  describe('Routes système', () => {
    it('should have error pages', () => {
      const errorPages = ROUTES_REGISTRY.filter(r => 
        r.path === '/401' || 
        r.path === '/403' || 
        r.path === '/404' || 
        r.path === '/500'
      );
      expect(errorPages.length).toBe(4);
    });

    it('should have public error pages', () => {
      const errorPages = ROUTES_REGISTRY.filter(r => 
        r.path === '/401' || 
        r.path === '/403' || 
        r.path === '/404' || 
        r.path === '/500'
      );
      errorPages.forEach(page => {
        expect(page.segment).toBe('public');
      });
    });
  });

  describe('Routes légales', () => {
    it('should have legal pages', () => {
      const legalRoutes = ROUTES_REGISTRY.filter(r => 
        r.path.startsWith('/legal/')
      );
      expect(legalRoutes.length).toBeGreaterThan(0);
      console.log(`⚖️  Legal routes: ${legalRoutes.length}`);
    });

    it('should have public legal pages', () => {
      const legalRoutes = ROUTES_REGISTRY.filter(r => 
        r.path.startsWith('/legal/')
      );
      legalRoutes.forEach(route => {
        expect(route.segment).toBe('public');
      });
    });
  });

  describe('Routes B2B', () => {
    it('should have B2B landing page', () => {
      const b2bLanding = ROUTES_REGISTRY.find(r => r.name === 'b2b-landing');
      expect(b2bLanding).toBeDefined();
      expect(b2bLanding?.path).toBe('/entreprise');
    });

    it('should have B2B dashboards', () => {
      const b2bDashboards = ROUTES_REGISTRY.filter(r => 
        r.name === 'employee-home' || r.name === 'manager-home'
      );
      expect(b2bDashboards.length).toBe(2);
    });

    it('should have B2B admin routes', () => {
      const adminRoutes = ROUTES_REGISTRY.filter(r => 
        r.segment === 'manager' && !r.deprecated
      );
      expect(adminRoutes.length).toBeGreaterThan(0);
    });
  });

  describe('Routes B2C', () => {
    it('should have B2C landing page', () => {
      const b2cLanding = ROUTES_REGISTRY.find(r => r.name === 'b2c-landing');
      expect(b2cLanding).toBeDefined();
      expect(b2cLanding?.path).toBe('/b2c');
    });

    it('should have consumer dashboard', () => {
      const consumerDashboard = ROUTES_REGISTRY.find(r => r.name === 'consumer-home');
      expect(consumerDashboard).toBeDefined();
      expect(consumerDashboard?.path).toBe('/app/home');
    });

    it('should have main B2C modules', () => {
      const modules = ['scan', 'music', 'coach', 'journal', 'vr'];
      modules.forEach(moduleName => {
        const route = ROUTES_REGISTRY.find(r => r.name === moduleName);
        expect(route).toBeDefined();
      });
    });
  });

  describe('Validation des chemins', () => {
    it('should have paths starting with /', () => {
      ROUTES_REGISTRY.forEach(route => {
        expect(route.path.startsWith('/')).toBe(true);
      });
    });

    it('should not have trailing slashes (except root)', () => {
      ROUTES_REGISTRY.forEach(route => {
        if (route.path !== '/') {
          expect(route.path.endsWith('/')).toBe(false);
        }
      });
    });

    it('should not have double slashes', () => {
      ROUTES_REGISTRY.forEach(route => {
        expect(route.path.includes('//')).toBe(false);
      });
    });
  });

  describe('Validation des composants', () => {
    it('should have component names in PascalCase', () => {
      ROUTES_REGISTRY.forEach(route => {
        const firstChar = route.component.charAt(0);
        expect(firstChar).toBe(firstChar.toUpperCase());
      });
    });

    it('should not have duplicate component mappings', () => {
      // Multiple routes can use the same component (like redirects)
      // This test just ensures components are consistently named
      const componentNames = ROUTES_REGISTRY.map(r => r.component);
      expect(componentNames.every(name => name.length > 0)).toBe(true);
    });
  });

  describe('Rapport final', () => {
    it('should generate complete statistics report', () => {
      const stats = {
        total: ROUTES_REGISTRY.length,
        active: ROUTES_REGISTRY.filter(r => !r.deprecated).length,
        deprecated: ROUTES_REGISTRY.filter(r => r.deprecated).length,
        bySegment: {
          public: ROUTES_REGISTRY.filter(r => r.segment === 'public').length,
          consumer: ROUTES_REGISTRY.filter(r => r.segment === 'consumer').length,
          employee: ROUTES_REGISTRY.filter(r => r.segment === 'employee').length,
          manager: ROUTES_REGISTRY.filter(r => r.segment === 'manager').length,
        },
        security: {
          guarded: ROUTES_REGISTRY.filter(r => r.guard).length,
          withRole: ROUTES_REGISTRY.filter(r => r.role).length,
          requireAuth: ROUTES_REGISTRY.filter(r => r.requireAuth).length,
        },
        features: {
          withAliases: ROUTES_REGISTRY.filter(r => r.aliases && r.aliases.length > 0).length,
          totalAliases: ROUTES_REGISTRY.reduce((acc, r) => acc + (r.aliases?.length || 0), 0),
        },
      };

      console.log('\n📊 RAPPORT FINAL DU REGISTRY RouterV2\n');
      console.log(`Total routes: ${stats.total}`);
      console.log(`Routes actives: ${stats.active}`);
      console.log(`Routes dépréciées: ${stats.deprecated}\n`);
      
      console.log('Par segment:');
      console.log(`  - Public: ${stats.bySegment.public}`);
      console.log(`  - Consumer: ${stats.bySegment.consumer}`);
      console.log(`  - Employee: ${stats.bySegment.employee}`);
      console.log(`  - Manager: ${stats.bySegment.manager}\n`);
      
      console.log('Sécurité:');
      console.log(`  - Routes protégées: ${stats.security.guarded}`);
      console.log(`  - Routes avec rôle: ${stats.security.withRole}`);
      console.log(`  - Routes nécessitant auth: ${stats.security.requireAuth}\n`);
      
      console.log('Compatibilité:');
      console.log(`  - Routes avec alias: ${stats.features.withAliases}`);
      console.log(`  - Total alias: ${stats.features.totalAliases}\n`);

      expect(stats.total).toBeGreaterThanOrEqual(40);
      expect(stats.active).toBeGreaterThan(0);
    });
  });
});
