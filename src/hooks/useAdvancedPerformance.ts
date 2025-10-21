// @ts-nocheck
import { useEffect, useRef, useState, useCallback } from 'react';
import { logger } from '@/lib/logger';

interface PerformanceMetrics {
  renderTime: number;
  mountTime: number;
  updateTime: number;
  memoryUsage: number;
  fps: number;
  networkInfo: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
  deviceInfo: {
    cores: number;
    memory: number;
    isLowEnd: boolean;
  };
}

interface PerformanceThresholds {
  renderTime: { good: number; poor: number };
  memoryUsage: { good: number; poor: number };
  fps: { good: number; poor: number };
}

const defaultThresholds: PerformanceThresholds = {
  renderTime: { good: 16, poor: 100 }, // ms
  memoryUsage: { good: 50, poor: 200 }, // MB
  fps: { good: 55, poor: 30 }
};

export const useAdvancedPerformance = (
  componentName: string,
  thresholds: Partial<PerformanceThresholds> = {}
) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [performanceScore, setPerformanceScore] = useState<number>(100);
  const [warnings, setWarnings] = useState<string[]>([]);
  
  const mountTime = useRef<number>(performance.now());
  const lastUpdateTime = useRef<number>(performance.now());
  const frameCount = useRef<number>(0);
  const fpsStart = useRef<number>(performance.now());
  
  const mergedThresholds = { ...defaultThresholds, ...thresholds };

  // Mesurer les FPS
  const measureFPS = useCallback(() => {
    frameCount.current++;
    
    const now = performance.now();
    const elapsed = now - fpsStart.current;
    
    if (elapsed >= 1000) {
      const fps = (frameCount.current * 1000) / elapsed;
      frameCount.current = 0;
      fpsStart.current = now;
      return Math.round(fps);
    }
    
    return null;
  }, []);

  // Obtenir les informations réseau
  const getNetworkInfo = useCallback(() => {
    const connection = (navigator as any).connection;
    return {
      effectiveType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0
    };
  }, []);

  // Obtenir les informations de l'appareil
  const getDeviceInfo = useCallback(() => {
    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as any).deviceMemory || 4;
    const isLowEnd = cores <= 2 || memory <= 2;
    
    return { cores, memory, isLowEnd };
  }, []);

  // Calculer le score de performance
  const calculatePerformanceScore = useCallback((metrics: PerformanceMetrics) => {
    let score = 100;
    const weights = { renderTime: 0.3, memoryUsage: 0.3, fps: 0.4 };
    
    // Pénalité pour le temps de rendu
    if (metrics.renderTime > mergedThresholds.renderTime.poor) {
      score -= 30 * weights.renderTime;
    } else if (metrics.renderTime > mergedThresholds.renderTime.good) {
      score -= 15 * weights.renderTime;
    }
    
    // Pénalité pour l'utilisation mémoire
    if (metrics.memoryUsage > mergedThresholds.memoryUsage.poor) {
      score -= 30 * weights.memoryUsage;
    } else if (metrics.memoryUsage > mergedThresholds.memoryUsage.good) {
      score -= 15 * weights.memoryUsage;
    }
    
    // Pénalité pour les FPS
    if (metrics.fps < mergedThresholds.fps.poor) {
      score -= 40 * weights.fps;
    } else if (metrics.fps < mergedThresholds.fps.good) {
      score -= 20 * weights.fps;
    }
    
    return Math.max(0, Math.round(score));
  }, [mergedThresholds]);

  // Générer des avertissements
  const generateWarnings = useCallback((metrics: PerformanceMetrics) => {
    const newWarnings: string[] = [];
    
    if (metrics.renderTime > mergedThresholds.renderTime.poor) {
      newWarnings.push(`Temps de rendu élevé: ${metrics.renderTime.toFixed(1)}ms`);
    }
    
    if (metrics.memoryUsage > mergedThresholds.memoryUsage.poor) {
      newWarnings.push(`Utilisation mémoire élevée: ${metrics.memoryUsage.toFixed(1)}MB`);
    }
    
    if (metrics.fps < mergedThresholds.fps.poor) {
      newWarnings.push(`FPS faible: ${metrics.fps}`);
    }
    
    if (metrics.deviceInfo.isLowEnd) {
      newWarnings.push('Appareil à faibles performances détecté');
    }
    
    if (metrics.networkInfo.effectiveType === 'slow-2g' || metrics.networkInfo.effectiveType === '2g') {
      newWarnings.push('Connexion réseau lente détectée');
    }
    
    return newWarnings;
  }, [mergedThresholds]);

  // Hook d'effet principal
  useEffect(() => {
    const startTime = performance.now();
    let rafId: number;
    
    const measure = () => {
      const currentTime = performance.now();
      const renderTime = currentTime - lastUpdateTime.current;
      const totalMountTime = currentTime - mountTime.current;
      
      // Mesurer l'utilisation mémoire
      const memoryInfo = (performance as any).memory;
      const memoryUsage = memoryInfo ? 
        Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024) : 0;
      
      // Mesurer les FPS
      const currentFPS = measureFPS() || 60;
      
      const newMetrics: PerformanceMetrics = {
        renderTime,
        mountTime: totalMountTime,
        updateTime: currentTime - lastUpdateTime.current,
        memoryUsage,
        fps: currentFPS,
        networkInfo: getNetworkInfo(),
        deviceInfo: getDeviceInfo()
      };
      
      setMetrics(newMetrics);
      setPerformanceScore(calculatePerformanceScore(newMetrics));
      setWarnings(generateWarnings(newMetrics));
      
      lastUpdateTime.current = currentTime;
      
      // Continuer la mesure
      rafId = requestAnimationFrame(measure);
    };
    
    // Démarrer la mesure après un court délai
    const timeoutId = setTimeout(() => {
      rafId = requestAnimationFrame(measure);
    }, 100);
    
    return () => {
      clearTimeout(timeoutId);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [measureFPS, getNetworkInfo, getDeviceInfo, calculatePerformanceScore, generateWarnings]);

  // Marquer le début d'un update
  const markUpdateStart = useCallback(() => {
    lastUpdateTime.current = performance.now();
  }, []);

  // Fonction pour obtenir des recommandations
  const getRecommendations = useCallback(() => {
    if (!metrics) return [];
    
    const recommendations: string[] = [];
    
    if (metrics.renderTime > mergedThresholds.renderTime.poor) {
      recommendations.push('Optimiser les re-renders avec React.memo ou useMemo');
      recommendations.push('Réduire la complexité des composants');
    }
    
    if (metrics.memoryUsage > mergedThresholds.memoryUsage.poor) {
      recommendations.push('Vérifier les fuites mémoire');
      recommendations.push('Optimiser les images et assets');
    }
    
    if (metrics.fps < mergedThresholds.fps.poor) {
      recommendations.push('Réduire les animations complexes');
      recommendations.push('Utiliser CSS transforms au lieu de JS');
    }
    
    if (metrics.deviceInfo.isLowEnd) {
      recommendations.push('Implémenter un mode performance réduite');
      recommendations.push('Lazy load les composants non critiques');
    }
    
    return recommendations;
  }, [metrics, mergedThresholds]);

  // Log automatique des performances critiques
  useEffect(() => {
    if (metrics && warnings.length > 0) {
      logger.warn(`Performance issues in ${componentName}`, {
        warnings,
        metrics,
        score: performanceScore
      }, 'SYSTEM');
    }
  }, [componentName, warnings, metrics, performanceScore]);

  return {
    metrics,
    performanceScore,
    warnings,
    markUpdateStart,
    getRecommendations,
    isLowPerformance: performanceScore < 60,
    isCritical: performanceScore < 40
  };
};
