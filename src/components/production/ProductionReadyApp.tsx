// @ts-nocheck

import React, { useEffect } from 'react';
import { initProductionSecurity } from '@/lib/security/productionSecurity';
import { initBuildOptimizations } from '@/utils/buildOptimization';
import { useProductionMonitoring } from '@/hooks/useProductionMonitoring';
import ProductionMonitor from './ProductionMonitor';
import { logger } from '@/lib/logger';

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
        logger.info('Production mode activated', {}, 'SYSTEM');
      }).catch((error) => {
        logger.error('Production initialization failed', error as Error, 'SYSTEM');
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
