
import React, { useEffect } from 'react';
import { initProductionSecurity } from '@/lib/security/productionSecurity';
import { initBuildOptimizations } from '@/utils/buildOptimization';
import { useProductionMonitoring } from '@/hooks/useProductionMonitoring';
import ProductionMonitor from './ProductionMonitor';

interface ProductionReadyAppProps {
  children: React.ReactNode;
}

/**
 * Wrapper simplifié pour l'application en mode production
 */
const ProductionReadyApp: React.FC<ProductionReadyAppProps> = ({ children }) => {
  const { isMonitoring } = useProductionMonitoring();

  useEffect(() => {
    if (import.meta.env.PROD) {
      Promise.all([
        initProductionSecurity(),
        initBuildOptimizations()
      ]).then(() => {
        console.log('🚀 Production mode activated');
      }).catch((error) => {
        console.error('❌ Production initialization failed:', error);
      });
    }
  }, []);

  return (
    <>
      {children}
      {isMonitoring && <ProductionMonitor />}
    </>
  );
};

export default ProductionReadyApp;
