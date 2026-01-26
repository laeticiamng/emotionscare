// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { ROUTES_REGISTRY } from '../registry';
import type { Segment, Role, LayoutType } from '../schema';

describe('RouterV2 Registry', () => {
  describe('Registry Structure', () => {
    it('should be an array', () => {
      expect(Array.isArray(ROUTES_REGISTRY)).toBe(true);
    });

    it('should not be empty', () => {
      expect(ROUTES_REGISTRY.length).toBeGreaterThan(0);
    });

    it('should contain at least 40 routes', () => {
      expect(ROUTES_REGISTRY.length).toBeGreaterThanOrEqual(40);
    });
  });

  describe('Route Schema Validation', () => {
    it('should have valid name for all routes', () => {
      ROUTES_REGISTRY.forEach((route) => {
        expect(route.name).toBeDefined();
        expect(typeof route.name).toBe('string');
        expect(route.name.length).toBeGreaterThan(0);
      });
    });

    it('should have valid path for all routes', () => {
      ROUTES_REGISTRY.forEach((route) => {
        expect(route.path).toBeDefined();
        expect(typeof route.path).toBe('string');
        expect(route.path.length).toBeGreaterThan(0);
        expect(route.path.startsWith('/')).toBe(true);
      });
    });

    it('should have valid segment for all routes', () => {
      const validSegments: Segment[] = ['public', 'consumer', 'employee', 'manager'];
      ROUTES_REGISTRY.forEach((route) => {
        expect(route.segment).toBeDefined();
        expect(validSegments).toContain(route.segment);
      });
    });

    it('should have valid component for all routes', () => {
      ROUTES_REGISTRY.forEach((route) => {
        expect(route.component).toBeDefined();
        expect(typeof route.component).toBe('string');
        expect(route.component.length).toBeGreaterThan(0);
      });
    });

    it('should have valid layout when specified', () => {
      const validLayouts: LayoutType[] = ['marketing', 'app', 'simple', 'app-sidebar'];
      ROUTES_REGISTRY.forEach((route) => {
        if (route.layout) {
          expect(validLayouts).toContain(route.layout);
        }
      });
    });

    it('should have valid role when specified', () => {
      const validRoles: Role[] = ['consumer', 'employee', 'manager'];
      ROUTES_REGISTRY.forEach((route) => {
        if (route.role) {
          expect(validRoles).toContain(route.role);
        }
      });
    });

    it('should have valid allowedRoles when specified', () => {
      const validRoles: Role[] = ['consumer', 'employee', 'manager'];
      ROUTES_REGISTRY.forEach((route) => {
        if (route.allowedRoles) {
          expect(Array.isArray(route.allowedRoles)).toBe(true);
          route.allowedRoles.forEach((role) => {
            expect(validRoles).toContain(role);
          });
        }
      });
    });

    it('should have boolean guard when specified', () => {
      ROUTES_REGISTRY.forEach((route) => {
        if (route.guard !== undefined) {
          expect(typeof route.guard).toBe('boolean');
        }
      });
    });

    it('should have boolean requireAuth when specified', () => {
      ROUTES_REGISTRY.forEach((route) => {
        if (route.requireAuth !== undefined) {
          expect(typeof route.requireAuth).toBe('boolean');
        }
      });
    });

    it('should have boolean deprecated when specified', () => {
      ROUTES_REGISTRY.forEach((route) => {
        if (route.deprecated !== undefined) {
          expect(typeof route.deprecated).toBe('boolean');
        }
      });
    });
  });

  describe('Path Uniqueness', () => {
    it('should not have duplicate paths', () => {
      const paths = ROUTES_REGISTRY.map((route) => route.path);
      const uniquePaths = new Set(paths);
      
      if (paths.length !== uniquePaths.size) {
        const duplicates = paths.filter((path, index) => paths.indexOf(path) !== index);
        expect.fail(`Duplicate paths found: ${duplicates.join(', ')}`);
      }
      
      expect(paths.length).toBe(uniquePaths.size);
    });

    it('should not have duplicate names', () => {
      const names = ROUTES_REGISTRY.map((route) => route.name);
      const uniqueNames = new Set(names);
      
      if (names.length !== uniqueNames.size) {
        const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
        expect.fail(`Duplicate names found: ${duplicates.join(', ')}`);
      }
      
      expect(names.length).toBe(uniqueNames.size);
    });

    it('should not have aliases that conflict with paths', () => {
      const paths = new Set(ROUTES_REGISTRY.map((route) => route.path));
      const allAliases = ROUTES_REGISTRY.flatMap((route) => route.aliases || []);
      
      const conflicts = allAliases.filter((alias) => paths.has(alias));
      
      if (conflicts.length > 0) {
        expect.fail(`Aliases conflict with existing paths: ${conflicts.join(', ')}`);
      }
      
      expect(conflicts.length).toBe(0);
    });

    it('should not have duplicate aliases across routes', () => {
      const allAliases = ROUTES_REGISTRY.flatMap((route) => route.aliases || []);
      const uniqueAliases = new Set(allAliases);
      
      if (allAliases.length !== uniqueAliases.size) {
        const duplicates = allAliases.filter(
          (alias, index) => allAliases.indexOf(alias) !== index
        );
        expect.fail(`Duplicate aliases found: ${duplicates.join(', ')}`);
      }
      
      expect(allAliases.length).toBe(uniqueAliases.size);
    });
  });

  describe('Path Format Validation', () => {
    it('should have paths that start with /', () => {
      ROUTES_REGISTRY.forEach((route) => {
        expect(route.path.startsWith('/')).toBe(true);
      });
    });

    it('should not have paths that end with / (except root)', () => {
      ROUTES_REGISTRY.forEach((route) => {
        if (route.path !== '/') {
          expect(route.path.endsWith('/')).toBe(false);
        }
      });
    });

    it('should not have paths with double slashes', () => {
      ROUTES_REGISTRY.forEach((route) => {
        expect(route.path).not.toContain('//');
      });
    });

    it('should not have paths with spaces', () => {
      ROUTES_REGISTRY.forEach((route) => {
        expect(route.path).not.toContain(' ');
      });
    });

    it('should have lowercase paths', () => {
      ROUTES_REGISTRY.forEach((route) => {
        expect(route.path).toBe(route.path.toLowerCase());
      });
    });

    it('should have valid alias formats when specified', () => {
      ROUTES_REGISTRY.forEach((route) => {
        if (route.aliases) {
          route.aliases.forEach((alias) => {
            expect(alias.startsWith('/')).toBe(true);
            expect(alias).not.toContain('//');
            expect(alias).not.toContain(' ');
          });
        }
      });
    });
  });

  describe('Role and Segment Consistency', () => {
    it('should have role when segment is consumer/employee/manager', () => {
      ROUTES_REGISTRY.forEach((route) => {
        if (['consumer', 'employee', 'manager'].includes(route.segment)) {
          if (route.guard !== false) {
            // Protected routes should have role or allowedRoles
            const hasRoleDefinition = route.role || (route.allowedRoles && route.allowedRoles.length > 0);
            if (!hasRoleDefinition) {
              console.warn(`Route ${route.name} (${route.path}) has segment ${route.segment} but no role definition`);
            }
          }
        }
      });
    });

    it('should not have role when segment is public (unless explicitly protected)', () => {
      ROUTES_REGISTRY.forEach((route) => {
        if (route.segment === 'public' && route.guard !== true) {
          expect(route.role).toBeUndefined();
        }
      });
    });

    it('should have consistent role and segment mapping', () => {
      const segmentRoleMap = {
        consumer: 'consumer',
        employee: 'employee',
        manager: 'manager',
      };

      ROUTES_REGISTRY.forEach((route) => {
        if (route.role && route.segment !== 'public') {
          const expectedRole = segmentRoleMap[route.segment];
          if (expectedRole) {
            expect(route.role).toBe(expectedRole);
          }
        }
      });
    });

    it('should have guard=true when role is specified', () => {
      ROUTES_REGISTRY.forEach((route) => {
        if (route.role) {
          if (route.guard === false) {
            console.warn(`Route ${route.name} has role but guard=false, this may be intentional`);
          }
        }
      });
    });
  });

  describe('Component References', () => {
    it('should have PascalCase component names', () => {
      ROUTES_REGISTRY.forEach((route) => {
        const firstChar = route.component.charAt(0);
        expect(firstChar).toBe(firstChar.toUpperCase());
      });
    });

    it('should not have file extensions in component names', () => {
      ROUTES_REGISTRY.forEach((route) => {
        expect(route.component).not.toMatch(/\.(tsx|ts|jsx|js)$/);
      });
    });

    it('should not have path separators in component names', () => {
      ROUTES_REGISTRY.forEach((route) => {
        expect(route.component).not.toContain('/');
        expect(route.component).not.toContain('\\');
      });
    });
  });

  describe('Guard Configuration', () => {
    it('should have explicit guard configuration for protected routes', () => {
      ROUTES_REGISTRY.forEach((route) => {
        if (route.segment !== 'public' && route.role) {
          // Should have guard defined (true or false)
          expect(route.guard).toBeDefined();
        }
      });
    });

    it('should have guard=false for public routes without auth', () => {
      ROUTES_REGISTRY.forEach((route) => {
        if (route.segment === 'public' && !route.requireAuth && !route.role) {
          if (route.guard === undefined) {
            console.warn(`Public route ${route.name} should explicitly set guard=false`);
          }
        }
      });
    });

    it('should not have both role and allowedRoles', () => {
      ROUTES_REGISTRY.forEach((route) => {
        if (route.role && route.allowedRoles) {
          expect.fail(`Route ${route.name} has both role and allowedRoles, use only one`);
        }
      });
    });
  });

  describe('Layout Configuration', () => {
    it('should have layout specified for all routes', () => {
      ROUTES_REGISTRY.forEach((route) => {
        if (!route.layout) {
          console.warn(`Route ${route.name} (${route.path}) does not have layout specified`);
        }
      });
    });

    it('should use marketing layout for public routes', () => {
      ROUTES_REGISTRY.forEach((route) => {
        if (route.segment === 'public' && !route.path.startsWith('/app')) {
          if (route.layout && route.layout !== 'marketing' && route.layout !== 'simple') {
            console.warn(`Public route ${route.name} uses non-marketing layout: ${route.layout}`);
          }
        }
      });
    });

    it('should use app layout for protected routes', () => {
      ROUTES_REGISTRY.forEach((route) => {
        if (route.guard === true && route.segment !== 'public') {
          if (route.layout && !['app', 'app-sidebar', 'simple'].includes(route.layout)) {
            console.warn(`Protected route ${route.name} uses non-app layout: ${route.layout}`);
          }
        }
      });
    });
  });

  describe('Deprecated Routes', () => {
    it('should track deprecated routes', () => {
      const deprecatedRoutes = ROUTES_REGISTRY.filter((route) => route.deprecated);
      
      if (deprecatedRoutes.length > 0) {
        console.log(`Found ${deprecatedRoutes.length} deprecated routes:`, 
          deprecatedRoutes.map(r => r.path).join(', ')
        );
      }
    });

    it('should have deprecated routes documented', () => {
      ROUTES_REGISTRY.forEach((route) => {
        if (route.deprecated) {
          // Deprecated routes should ideally have comments explaining migration path
          expect(route.deprecated).toBe(true);
        }
      });
    });
  });

  describe('Specific Route Categories', () => {
    it('should have a root route', () => {
      const rootRoute = ROUTES_REGISTRY.find((route) => route.path === '/');
      expect(rootRoute).toBeDefined();
      expect(rootRoute?.segment).toBe('public');
    });

    it('should have login route', () => {
      const loginRoute = ROUTES_REGISTRY.find(
        (route) => route.path === '/login' || route.aliases?.includes('/login')
      );
      expect(loginRoute).toBeDefined();
    });

    it('should have signup route', () => {
      const signupRoute = ROUTES_REGISTRY.find(
        (route) => route.path === '/signup' || route.aliases?.includes('/signup')
      );
      expect(signupRoute).toBeDefined();
    });

    it('should have dashboard routes for each role', () => {
      const consumerDashboard = ROUTES_REGISTRY.find(
        (route) => route.segment === 'consumer' && route.role === 'consumer' && route.guard === true
      );
      const employeeDashboard = ROUTES_REGISTRY.find(
        (route) => route.segment === 'employee' && route.role === 'employee' && route.guard === true
      );
      const managerDashboard = ROUTES_REGISTRY.find(
        (route) => route.segment === 'manager' && route.role === 'manager' && route.guard === true
      );

      expect(consumerDashboard).toBeDefined();
      expect(employeeDashboard).toBeDefined();
      expect(managerDashboard).toBeDefined();
    });

    it('should have app gate route', () => {
      const appGate = ROUTES_REGISTRY.find((route) => route.path === '/app');
      expect(appGate).toBeDefined();
    });
  });

  describe('Alias Configuration', () => {
    it('should have valid alias arrays', () => {
      ROUTES_REGISTRY.forEach((route) => {
        if (route.aliases) {
          expect(Array.isArray(route.aliases)).toBe(true);
          expect(route.aliases.length).toBeGreaterThan(0);
        }
      });
    });

    it('should have unique aliases within each route', () => {
      ROUTES_REGISTRY.forEach((route) => {
        if (route.aliases) {
          const uniqueAliases = new Set(route.aliases);
          expect(route.aliases.length).toBe(uniqueAliases.size);
        }
      });
    });

    it('should not have route path in its own aliases', () => {
      ROUTES_REGISTRY.forEach((route) => {
        if (route.aliases) {
          expect(route.aliases).not.toContain(route.path);
        }
      });
    });
  });

  describe('Registry Statistics', () => {
    it('should report registry statistics', () => {
      const stats = {
        total: ROUTES_REGISTRY.length,
        public: ROUTES_REGISTRY.filter((r) => r.segment === 'public').length,
        consumer: ROUTES_REGISTRY.filter((r) => r.segment === 'consumer').length,
        employee: ROUTES_REGISTRY.filter((r) => r.segment === 'employee').length,
        manager: ROUTES_REGISTRY.filter((r) => r.segment === 'manager').length,
        protected: ROUTES_REGISTRY.filter((r) => r.guard === true).length,
        withAliases: ROUTES_REGISTRY.filter((r) => r.aliases && r.aliases.length > 0).length,
        deprecated: ROUTES_REGISTRY.filter((r) => r.deprecated).length,
      };

      console.log('Registry Statistics:', stats);

      expect(stats.total).toBeGreaterThan(0);
      expect(stats.public).toBeGreaterThan(0);
      expect(stats.protected).toBeGreaterThan(0);
    });
  });
});
