// @ts-nocheck
/**
 * SystemHealth - Vérifications de santé réelles de la DB et des services
 */

import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

interface HealthCheck {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  message: string;
  timestamp: number;
  latency?: number;
  details?: Record<string, unknown>;
}

interface SystemMetrics {
  memoryUsage?: number;
  connectionLatency: number;
  dbLatency?: number;
  storageUsed?: number;
  storageQuota?: number;
  activeConnections?: number;
}

class SystemHealthMonitor {
  private checks: HealthCheck[] = [];
  private metrics: SystemMetrics = { connectionLatency: 0 };
  private lastCheckTime: number = 0;
  private checkInterval: ReturnType<typeof setInterval> | null = null;

  async runHealthChecks(): Promise<HealthCheck[]> {
    this.checks = [];
    this.lastCheckTime = Date.now();

    // Exécuter toutes les vérifications en parallèle
    await Promise.all([
      this.checkConnectivity(),
      this.checkSupabaseConnection(),
      this.checkSupabaseAuth(),
      this.checkSupabaseDatabase(),
      this.checkLocalStorage(),
      this.checkPerformance(),
      this.checkMemory(),
      this.checkServiceWorker(),
    ]);

    return this.checks;
  }

  private async checkConnectivity() {
    const start = performance.now();
    try {
      const online = navigator.onLine;
      
      if (!online) {
        this.addCheck('connectivity', 'critical', 'Mode hors ligne détecté');
        return;
      }

      // Test de connectivité réel
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('https://www.google.com/generate_204', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const latency = Math.round(performance.now() - start);
      this.metrics.connectionLatency = latency;

      if (latency < 200) {
        this.addCheck('connectivity', 'healthy', `Connexion stable (${latency}ms)`, { latency });
      } else if (latency < 1000) {
        this.addCheck('connectivity', 'warning', `Connexion lente (${latency}ms)`, { latency });
      } else {
        this.addCheck('connectivity', 'warning', `Connexion très lente (${latency}ms)`, { latency });
      }
    } catch (error) {
      if (navigator.onLine) {
        this.addCheck('connectivity', 'warning', 'Connectivité limitée');
      } else {
        this.addCheck('connectivity', 'critical', 'Aucune connexion internet');
      }
    }
  }

  private async checkSupabaseConnection() {
    const start = performance.now();
    try {
      // Test de connexion Supabase
      const { data, error } = await supabase.from('user_settings').select('count').limit(1);
      const latency = Math.round(performance.now() - start);
      this.metrics.dbLatency = latency;

      if (error) {
        // Vérifier si c'est juste un problème d'auth (acceptable)
        if (error.code === 'PGRST301' || error.message.includes('JWT')) {
          this.addCheck('supabase_connection', 'healthy', `Supabase accessible (${latency}ms, auth requise)`, { latency });
        } else {
          this.addCheck('supabase_connection', 'warning', `Supabase: ${error.message}`, { latency, error: error.code });
        }
      } else {
        if (latency < 300) {
          this.addCheck('supabase_connection', 'healthy', `Supabase optimal (${latency}ms)`, { latency });
        } else if (latency < 1000) {
          this.addCheck('supabase_connection', 'warning', `Supabase lent (${latency}ms)`, { latency });
        } else {
          this.addCheck('supabase_connection', 'warning', `Supabase très lent (${latency}ms)`, { latency });
        }
      }
    } catch (error) {
      this.addCheck('supabase_connection', 'critical', 'Supabase inaccessible');
    }
  }

  private async checkSupabaseAuth() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        this.addCheck('supabase_auth', 'warning', `Auth: ${error.message}`);
      } else if (session) {
        const expiresAt = session.expires_at ? new Date(session.expires_at * 1000) : null;
        const minutesLeft = expiresAt ? Math.round((expiresAt.getTime() - Date.now()) / 60000) : null;

        if (minutesLeft && minutesLeft < 5) {
          this.addCheck('supabase_auth', 'warning', `Session expire dans ${minutesLeft}min`);
        } else {
          this.addCheck('supabase_auth', 'healthy', 'Session active et valide');
        }
      } else {
        this.addCheck('supabase_auth', 'healthy', 'Non authentifié (normal)');
      }
    } catch {
      this.addCheck('supabase_auth', 'warning', 'Vérification auth échouée');
    }
  }

  private async checkSupabaseDatabase() {
    const start = performance.now();
    try {
      // Vérifier plusieurs tables critiques
      const tables = ['profiles', 'journal_notes', 'user_settings'];
      const results = await Promise.allSettled(
        tables.map(table => supabase.from(table).select('count').limit(1))
      );

      const healthy = results.filter(r => r.status === 'fulfilled').length;
      const latency = Math.round(performance.now() - start);

      if (healthy === tables.length) {
        this.addCheck('database_tables', 'healthy', `${healthy}/${tables.length} tables OK (${latency}ms)`);
      } else if (healthy > 0) {
        this.addCheck('database_tables', 'warning', `${healthy}/${tables.length} tables accessibles`);
      } else {
        this.addCheck('database_tables', 'critical', 'Aucune table accessible');
      }
    } catch {
      this.addCheck('database_tables', 'critical', 'Erreur accès DB');
    }
  }

  private async checkLocalStorage() {
    try {
      const testKey = '__health_check__';
      const testValue = 'test_' + Date.now();
      
      localStorage.setItem(testKey, testValue);
      const read = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      if (read !== testValue) {
        this.addCheck('local_storage', 'warning', 'Lecture/écriture incohérente');
        return;
      }

      // Calculer l'usage
      let totalSize = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length * 2; // Approximation UTF-16
        }
      }

      const usedKB = Math.round(totalSize / 1024);
      const quotaKB = 5 * 1024; // 5MB approximatif
      const usagePercent = Math.round((totalSize / (quotaKB * 1024)) * 100);

      this.metrics.storageUsed = totalSize;
      this.metrics.storageQuota = quotaKB * 1024;

      if (usagePercent < 70) {
        this.addCheck('local_storage', 'healthy', `${usedKB}KB utilisés (${usagePercent}%)`);
      } else if (usagePercent < 90) {
        this.addCheck('local_storage', 'warning', `${usedKB}KB utilisés (${usagePercent}%)`);
      } else {
        this.addCheck('local_storage', 'critical', `Stockage presque plein (${usagePercent}%)`);
      }
    } catch {
      this.addCheck('local_storage', 'critical', 'LocalStorage inaccessible');
    }
  }

  private async checkPerformance() {
    const start = performance.now();
    
    // Test CPU basique
    let sum = 0;
    for (let i = 0; i < 100000; i++) {
      sum += Math.sqrt(i);
    }
    
    const duration = performance.now() - start;

    if (duration < 20) {
      this.addCheck('cpu_performance', 'healthy', `CPU rapide (${duration.toFixed(1)}ms)`);
    } else if (duration < 100) {
      this.addCheck('cpu_performance', 'warning', `CPU acceptable (${duration.toFixed(1)}ms)`);
    } else {
      this.addCheck('cpu_performance', 'critical', `CPU lent (${duration.toFixed(1)}ms)`);
    }
  }

  private async checkMemory() {
    try {
      // @ts-ignore - API expérimentale
      if (performance.memory) {
        const memory = (performance as any).memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        const totalMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
        const usagePercent = Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100);

        this.metrics.memoryUsage = usagePercent;

        if (usagePercent < 70) {
          this.addCheck('memory', 'healthy', `${usedMB}MB / ${totalMB}MB (${usagePercent}%)`);
        } else if (usagePercent < 90) {
          this.addCheck('memory', 'warning', `Mémoire élevée: ${usedMB}MB (${usagePercent}%)`);
        } else {
          this.addCheck('memory', 'critical', `Mémoire critique: ${usedMB}MB (${usagePercent}%)`);
        }
      } else {
        this.addCheck('memory', 'healthy', 'API mémoire non disponible (normal)');
      }
    } catch {
      this.addCheck('memory', 'healthy', 'Mémoire: vérification non supportée');
    }
  }

  private async checkServiceWorker() {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        
        if (registration) {
          if (registration.active) {
            this.addCheck('service_worker', 'healthy', 'Service Worker actif (PWA ready)');
          } else if (registration.installing || registration.waiting) {
            this.addCheck('service_worker', 'warning', 'Service Worker en cours d\'installation');
          } else {
            this.addCheck('service_worker', 'warning', 'Service Worker enregistré mais inactif');
          }
        } else {
          this.addCheck('service_worker', 'healthy', 'Pas de Service Worker (normal en dev)');
        }
      } else {
        this.addCheck('service_worker', 'healthy', 'Service Workers non supportés');
      }
    } catch {
      this.addCheck('service_worker', 'warning', 'Erreur vérification SW');
    }
  }

  private addCheck(
    name: string, 
    status: HealthCheck['status'], 
    message: string,
    details?: Record<string, unknown>
  ) {
    this.checks.push({
      name,
      status,
      message,
      timestamp: Date.now(),
      details,
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

  getMetrics(): SystemMetrics {
    return { ...this.metrics };
  }

  getLastCheckTime(): number {
    return this.lastCheckTime;
  }

  // Démarrer les vérifications périodiques
  startPeriodicChecks(intervalMs: number = 5 * 60 * 1000) {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(async () => {
      try {
        await this.runHealthChecks();
        const status = this.getOverallStatus();
        
        if (status === 'critical') {
          logger.warn('⚠️ Problèmes critiques détectés', this.checks, 'SYSTEM');
        }
      } catch (error) {
        logger.error('Health check failed', error as Error, 'SYSTEM');
      }
    }, intervalMs);

    // Exécuter immédiatement
    this.runHealthChecks();
  }

  stopPeriodicChecks() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

export const systemHealthMonitor = new SystemHealthMonitor();

// Auto-check en production
if (import.meta.env.PROD) {
  systemHealthMonitor.startPeriodicChecks();
}
