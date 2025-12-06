
interface HealthCheck {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  message: string;
  timestamp: number;
}

class SystemHealthMonitor {
  private checks: HealthCheck[] = [];

  async runHealthChecks(): Promise<HealthCheck[]> {
    this.checks = [];

    // Vérification de la connectivité
    await this.checkConnectivity();
    
    // Vérification de la performance
    await this.checkPerformance();
    
    // Vérification du stockage local
    await this.checkLocalStorage();
    
    // Vérification des APIs critiques
    await this.checkCriticalAPIs();

    return this.checks;
  }

  private async checkConnectivity() {
    try {
      const online = navigator.onLine;
      const response = await fetch('/health', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      if (online && response.ok) {
        this.addCheck('connectivity', 'healthy', 'Connexion stable');
      } else {
        this.addCheck('connectivity', 'warning', 'Connexion instable');
      }
    } catch {
      this.addCheck('connectivity', 'critical', 'Aucune connexion');
    }
  }

  private async checkPerformance() {
    const start = performance.now();
    
    // Test de performance basique
    for (let i = 0; i < 10000; i++) {
      Math.random();
    }
    
    const duration = performance.now() - start;
    
    if (duration < 10) {
      this.addCheck('performance', 'healthy', `Performance optimale (${duration.toFixed(2)}ms)`);
    } else if (duration < 50) {
      this.addCheck('performance', 'warning', `Performance acceptable (${duration.toFixed(2)}ms)`);
    } else {
      this.addCheck('performance', 'critical', `Performance dégradée (${duration.toFixed(2)}ms)`);
    }
  }

  private async checkLocalStorage() {
    try {
      const testKey = '__health_check__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      
      const used = new Blob(Object.values(localStorage)).size;
      const quota = 5 * 1024 * 1024; // 5MB approximatif
      
      if (used < quota * 0.7) {
        this.addCheck('storage', 'healthy', `Stockage disponible (${(used/1024).toFixed(1)}KB utilisés)`);
      } else if (used < quota * 0.9) {
        this.addCheck('storage', 'warning', `Stockage limité (${(used/1024).toFixed(1)}KB utilisés)`);
      } else {
        this.addCheck('storage', 'critical', `Stockage plein (${(used/1024).toFixed(1)}KB utilisés)`);
      }
    } catch {
      this.addCheck('storage', 'critical', 'Stockage local inaccessible');
    }
  }

  private async checkCriticalAPIs() {
    const apis = [
      { name: 'Supabase', url: 'https://yaincoxihiqdksxgrsrk.supabase.co/rest/v1/' },
    ];

    for (const api of apis) {
      try {
        const response = await fetch(api.url, {
          method: 'HEAD',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU'
          }
        });
        
        if (response.ok) {
          this.addCheck(`api_${api.name}`, 'healthy', `${api.name} opérationnel`);
        } else {
          this.addCheck(`api_${api.name}`, 'warning', `${api.name} répond avec erreurs`);
        }
      } catch {
        this.addCheck(`api_${api.name}`, 'critical', `${api.name} inaccessible`);
      }
    }
  }

  private addCheck(name: string, status: HealthCheck['status'], message: string) {
    this.checks.push({
      name,
      status,
      message,
      timestamp: Date.now()
    });
  }

  getOverallStatus(): HealthCheck['status'] {
    if (this.checks.some(check => check.status === 'critical')) {
      return 'critical';
    }
    if (this.checks.some(check => check.status === 'warning')) {
      return 'warning';
    }
    return 'healthy';
  }

  getChecks() {
    return [...this.checks];
  }
}

export const systemHealthMonitor = new SystemHealthMonitor();

// Auto-check toutes les 5 minutes en production
if (import.meta.env.PROD) {
  setInterval(() => {
    systemHealthMonitor.runHealthChecks().then(checks => {
      const overallStatus = systemHealthMonitor.getOverallStatus();
      if (overallStatus === 'critical') {
        console.warn('⚠️ Problèmes critiques détectés:', checks);
      }
    }).catch(console.error);
  }, 5 * 60 * 1000);
}
