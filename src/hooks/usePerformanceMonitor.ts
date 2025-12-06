import { useState, useEffect, useRef } from 'react';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  cls: number | null;
  fid: number | null;
  renderTime: number;
  memoryUsage: number;
  fps: number;
  loadTime: number;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    cls: null,
    fid: null,
    renderTime: 0,
    memoryUsage: 0,
    fps: 60,
    loadTime: 0
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const renderStartRef = useRef(performance.now());

  useEffect(() => {
    const startTime = performance.now();
    
    // Mesure du temps de rendu initial
    const measureRenderTime = () => {
      const renderTime = performance.now() - renderStartRef.current;
      setMetrics(prev => ({ ...prev, renderTime }));
    };

    // Observer pour FCP
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['paint'] });
      } catch (e) {
        console.warn('Paint observer not supported');
      }

      // Observer pour LCP
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
      });

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // Observer pour CLS
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        setMetrics(prev => ({ ...prev, cls: clsValue }));
      });

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('CLS observer not supported');
      }
    }

    // Mesure de la mémoire
    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedMB = memory.usedJSHeapSize / 1048576;
        setMetrics(prev => ({ ...prev, memoryUsage: Math.round(usedMB) }));
      }
    };

    // Mesure du FPS
    const measureFPS = () => {
      frameCountRef.current++;
      const now = performance.now();
      const delta = now - lastTimeRef.current;

      if (delta >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / delta);
        setMetrics(prev => ({ ...prev, fps }));
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      requestAnimationFrame(measureFPS);
    };

    // Mesure du temps de chargement
    window.addEventListener('load', () => {
      const loadTime = performance.now() - startTime;
      setMetrics(prev => ({ ...prev, loadTime }));
    });

    // Démarrer les mesures
    setTimeout(measureRenderTime, 0);
    measureMemory();
    measureFPS();

    // Mesures périodiques
    const memoryInterval = setInterval(measureMemory, 5000);

    // Mesure FID approximative
    let fidMeasured = false;
    const measureFID = () => {
      if (!fidMeasured) {
        const start = performance.now();
        setTimeout(() => {
          const fid = performance.now() - start;
          setMetrics(prev => ({ ...prev, fid }));
          fidMeasured = true;
        }, 0);
      }
    };

    document.addEventListener('click', measureFID, { once: true });
    document.addEventListener('keydown', measureFID, { once: true });

    return () => {
      clearInterval(memoryInterval);
    };
  }, []);

  return metrics;
};