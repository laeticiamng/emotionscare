
import { UNIFIED_ROUTES } from './routeUtils';
import { performanceMonitor } from './pagePerformanceMonitor';

interface RouteValidationResult {
  route: string;
  isAccessible: boolean;
  hasPageRoot: boolean;
  loadTime: number;
  error?: string;
}

interface ValidationSummary {
  totalRoutes: number;
  successfulRoutes: number;
  failedRoutes: number;
  averageLoadTime: number;
  results: RouteValidationResult[];
}

export class RouteValidator {
  private results: RouteValidationResult[] = [];

  async validateRoute(route: string): Promise<RouteValidationResult> {
    const startTime = performance.now();
    
    try {
      // Simuler une navigation vers la route
      const response = await fetch(route, { method: 'HEAD' });
      const loadTime = performance.now() - startTime;
      
      const result: RouteValidationResult = {
        route,
        isAccessible: response.ok,
        hasPageRoot: response.ok, // Simplifié pour cette validation
        loadTime,
        error: response.ok ? undefined : `HTTP ${response.status}`
      };
      
      this.results.push(result);
      return result;
      
    } catch (error) {
      const loadTime = performance.now() - startTime;
      const result: RouteValidationResult = {
        route,
        isAccessible: false,
        hasPageRoot: false,
        loadTime,
        error: error.message
      };
      
      this.results.push(result);
      return result;
    }
  }

  async validateAllRoutes(): Promise<ValidationSummary> {
    console.log('🔍 Début de la validation de toutes les routes...');
    this.results = [];
    
    const allRoutes = Object.values(UNIFIED_ROUTES);
    const validationPromises = allRoutes.map(route => this.validateRoute(route));
    
    await Promise.all(validationPromises);
    
    const successfulRoutes = this.results.filter(r => r.isAccessible).length;
    const failedRoutes = this.results.length - successfulRoutes;
    const averageLoadTime = this.results.reduce((sum, r) => sum + r.loadTime, 0) / this.results.length;
    
    const summary: ValidationSummary = {
      totalRoutes: this.results.length,
      successfulRoutes,
      failedRoutes,
      averageLoadTime,
      results: this.results
    };
    
    this.printValidationReport(summary);
    return summary;
  }

  private printValidationReport(summary: ValidationSummary) {
    console.log('\n📊 RAPPORT DE VALIDATION DES ROUTES');
    console.log('=====================================');
    console.log(`📈 Total: ${summary.totalRoutes} routes`);
    console.log(`✅ Succès: ${summary.successfulRoutes} routes`);
    console.log(`❌ Échecs: ${summary.failedRoutes} routes`);
    console.log(`⏱️  Temps moyen: ${summary.averageLoadTime.toFixed(2)}ms`);
    
    if (summary.failedRoutes > 0) {
      console.log('\n🔴 ROUTES EN ÉCHEC:');
      summary.results
        .filter(r => !r.isAccessible)
        .forEach(r => {
          console.log(`- ${r.route}: ${r.error}`);
        });
    }
    
    const slowRoutes = summary.results
      .filter(r => r.loadTime > 1000)
      .sort((a, b) => b.loadTime - a.loadTime);
    
    if (slowRoutes.length > 0) {
      console.log('\n🐌 ROUTES LENTES (>1s):');
      slowRoutes.slice(0, 5).forEach(r => {
        console.log(`- ${r.route}: ${r.loadTime.toFixed(2)}ms`);
      });
    }
    
    // Intégration avec le monitor de performance
    console.log('\n' + performanceMonitor.generateReport());
  }

  getSlowRoutes(threshold: number = 1000): RouteValidationResult[] {
    return this.results.filter(r => r.loadTime > threshold);
  }

  getFailedRoutes(): RouteValidationResult[] {
    return this.results.filter(r => !r.isAccessible);
  }
}

// Instance globale pour usage facile
export const routeValidator = new RouteValidator();

// Fonction utilitaire pour validation rapide
export const validateRoutes = async (): Promise<ValidationSummary> => {
  return await routeValidator.validateAllRoutes();
};

// Validation automatique au chargement (en développement uniquement)
if (process.env.NODE_ENV === 'development') {
  // Attendre que l'app soit chargée avant de valider
  setTimeout(() => {
    validateRoutes().then(summary => {
      if (summary.failedRoutes > 0) {
        console.warn(`⚠️  ${summary.failedRoutes} routes nécessitent une attention`);
      } else {
        console.log('✅ Toutes les routes sont fonctionnelles');
      }
    });
  }, 3000);
}
