import { test, expect } from '@playwright/test';

/**
 * Tests de performance end-to-end
 * Phase 2 - Validation des métriques de performance
 */

test.describe('Performance Tests', () => {
  test('should load homepage within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Le temps de chargement doit être < 3 secondes
    expect(loadTime).toBeLessThan(3000);
    console.log(`Page load time: ${loadTime}ms`);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    // Mesurer les Core Web Vitals
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals: any = {};
          
          entries.forEach((entry: any) => {
            switch (entry.name) {
              case 'first-contentful-paint':
                vitals.fcp = entry.startTime;
                break;
              case 'largest-contentful-paint':
                vitals.lcp = entry.startTime;
                break;
            }
          });
          
          if (vitals.fcp && vitals.lcp) {
            observer.disconnect();
            resolve(vitals);
          }
        });
        
        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
        
        // Timeout après 5 secondes
        setTimeout(() => {
          observer.disconnect();
          resolve({});
        }, 5000);
      });
    });

    console.log('Core Web Vitals:', vitals);
    
    // Vérifications (si les métriques sont disponibles)
    if ((vitals as any).fcp) {
      expect((vitals as any).fcp).toBeLessThan(2500); // FCP < 2.5s
    }
    if ((vitals as any).lcp) {
      expect((vitals as any).lcp).toBeLessThan(4000); // LCP < 4s
    }
  });

  test('should load images efficiently', async ({ page }) => {
    await page.goto('/');
    
    // Attendre que toutes les images soient chargées
    await page.waitForLoadState('networkidle');
    
    // Vérifier que les images sont optimisées
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const src = await img.getAttribute('src');
      const loading = await img.getAttribute('loading');
      
      if (src) {
        // Vérifier le lazy loading
        if (!src.includes('data:') && !src.includes('logo')) {
          expect(loading).toBe('lazy');
        }
        
        // Vérifier les formats modernes si possible
        const isModernFormat = src.includes('.webp') || 
                              src.includes('.avif') || 
                              src.includes('w_auto') || // Cloudinary
                              src.includes('f_auto');  // Cloudinary
        
        if (isModernFormat) {
          console.log('Modern image format detected:', src);
        }
      }
    }
  });

  test('should have minimal bundle size impact', async ({ page }) => {
    // Mesurer les ressources chargées
    const responses: Array<{ url: string; size: number; type: string }> = [];
    
    page.on('response', async (response) => {
      const url = response.url();
      const headers = response.headers();
      const contentType = headers['content-type'] || '';
      
      if (url.includes(new URL(page.url()).origin)) {
        try {
          const size = parseInt(headers['content-length'] || '0');
          responses.push({
            url: url.split('/').pop() || url,
            size,
            type: contentType.split(';')[0]
          });
        } catch (e) {
          // Ignorer les erreurs de parsing
        }
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Analyser les ressources
    const jsFiles = responses.filter(r => r.type.includes('javascript'));
    const cssFiles = responses.filter(r => r.type.includes('css'));
    
    const totalJSSize = jsFiles.reduce((sum, file) => sum + file.size, 0);
    const totalCSSSize = cssFiles.reduce((sum, file) => sum + file.size, 0);
    
    console.log('Resource sizes:');
    console.log('- JS total:', Math.round(totalJSSize / 1024), 'KB');
    console.log('- CSS total:', Math.round(totalCSSSize / 1024), 'KB');
    
    // Vérifications de taille raisonnable
    expect(totalJSSize).toBeLessThan(1000 * 1024); // < 1MB JS
    expect(totalCSSSize).toBeLessThan(200 * 1024);  // < 200KB CSS
  });
});